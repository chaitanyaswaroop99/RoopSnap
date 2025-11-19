const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const https = require('https');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const session = require('express-session');

// Load environment variables from .env file if dotenv is installed (for local development)
try {
    require('dotenv').config();
} catch (e) {
    // dotenv not installed, using system environment variables (production)
}

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'roopsnap';

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'roopsnap-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve static files from root folder
app.use('/uploads', express.static('uploads')); // Serve uploaded images

// Email transporter configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Store reset codes (in production, use Redis or database)
const resetCodes = new Map();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Initialize PostgreSQL database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Test connection and initialize database
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err.message);
    } else {
        console.log('Connected to PostgreSQL database.');
        release();
        initializeDatabase();
    }
});

// Initialize database tables
async function initializeDatabase() {
    try {
        // Users table (for admin authentication)
        await pool.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP
        )`);
        console.log('Users table ready.');

        // Photos table
        await pool.query(`CREATE TABLE IF NOT EXISTS photos (
            id SERIAL PRIMARY KEY,
            filename VARCHAR(255) NOT NULL,
            original_name VARCHAR(255),
            file_path VARCHAR(500) NOT NULL,
            description TEXT,
            category VARCHAR(100),
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        console.log('Photos table ready.');

        // Contacts table
        await pool.query(`CREATE TABLE IF NOT EXISTS contacts (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            phone VARCHAR(50),
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(50) DEFAULT 'new'
        )`);
        console.log('Contacts table ready.');

        // Create default admin user if none exists
        const userCheck = await pool.query('SELECT COUNT(*) FROM users');
        if (parseInt(userCheck.rows[0].count) === 0) {
            const defaultEmail = process.env.ADMIN_EMAIL || 'admin@roopsnap.com';
            const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);
            await pool.query(
                'INSERT INTO users (email, password_hash) VALUES ($1, $2)',
                [defaultEmail, hashedPassword]
            );
            console.log(`Default admin user created: ${defaultEmail} / ${defaultPassword}`);
            console.log('⚠️  Please change the default password after first login!');
        }
    } catch (err) {
        console.error('Error initializing database:', err.message);
    }
}

// Admin authentication middleware (session-based)
function authenticateAdmin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    
    // Fallback to API key for backward compatibility
    const headerKey = req.headers['x-admin-key'];
    if (headerKey && headerKey === ADMIN_API_KEY) {
        return next();
    }
    
    return res.status(401).json({ error: 'Unauthorized - Please login' });
}

// Check if user is authenticated (for frontend)
function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    return res.status(401).json({ error: 'Not authenticated' });
}

// API Routes

// Get all photos
app.get('/api/photos', async (req, res) => {
    try {
        const query = req.query.category 
            ? 'SELECT * FROM photos WHERE category = $1 ORDER BY uploaded_at DESC'
            : 'SELECT * FROM photos ORDER BY uploaded_at DESC';
        
        const params = req.query.category ? [req.query.category] : [];
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single photo
app.get('/api/photos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await pool.query('SELECT * FROM photos WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Photo not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Upload photo
app.post('/api/photos/upload', authenticateAdmin, upload.single('photo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const { description, category } = req.body;
        const filename = req.file.filename;
        const filePath = `/uploads/${filename}`;
        const originalName = req.file.originalname;

        const result = await pool.query(
            'INSERT INTO photos (filename, original_name, file_path, description, category) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [filename, originalName, filePath, description || null, category || null]
        );

        res.json({
            id: result.rows[0].id,
            filename: filename,
            file_path: filePath,
            description: description,
            category: category,
            message: 'Photo uploaded successfully'
        });
    } catch (err) {
        // Delete uploaded file if database insert fails
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: err.message });
    }
});

// Delete photo
app.delete('/api/photos/:id', authenticateAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        
        // First get the file path
        const result = await pool.query('SELECT file_path FROM photos WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Photo not found' });
        }

        const filePath = path.join(__dirname, result.rows[0].file_path);

        // Delete from database
        await pool.query('DELETE FROM photos WHERE id = $1', [id]);

        // Delete file from filesystem
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json({ message: 'Photo deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit contact form
app.post('/api/contact', async (req, res) => {
    const { name, email, message, phone } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO contacts (name, email, message, phone) VALUES ($1, $2, $3, $4) RETURNING id',
            [name, email, message, phone || null]
        );

        res.json({
            id: result.rows[0].id,
            message: 'Contact form submitted successfully'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all contacts (admin endpoint)
app.get('/api/contacts', authenticateAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM contacts ORDER BY submitted_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single contact
app.get('/api/contacts/:id', authenticateAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const result = await pool.query('SELECT * FROM contacts WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update contact status (mark as read, etc.)
app.patch('/api/contacts/:id', authenticateAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        await pool.query(
            'UPDATE contacts SET status = $1 WHERE id = $2',
            [status || 'read', id]
        );

        res.json({ message: 'Contact status updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Authentication Routes

// Register admin user
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if user already exists
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const result = await pool.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );

        res.json({
            message: 'Admin user created successfully',
            user: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const result = await pool.query('SELECT id, email, password_hash FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Update last login
        await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

        // Create session
        req.session.userId = user.id;
        req.session.userEmail = user.email;

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// Check authentication status
app.get('/api/auth/check', isAuthenticated, (req, res) => {
    res.json({
        authenticated: true,
        user: {
            id: req.session.userId,
            email: req.session.userEmail
        }
    });
});

// Forgot password - Send reset code
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Check if user exists
        const result = await pool.query('SELECT id, email FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            // Don't reveal if email exists for security
            return res.json({ message: 'If the email exists, a reset code has been sent' });
        }

        // Generate 6-digit code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store code (expires in 15 minutes)
        resetCodes.set(email, {
            code: resetCode,
            expires: Date.now() + 15 * 60 * 1000
        });

        // Send email
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            try {
                await transporter.sendMail({
                    from: process.env.SMTP_USER,
                    to: email,
                    subject: 'RoopSnap - Password Reset Code',
                    html: `
                        <h2>Password Reset Request</h2>
                        <p>Your password reset code is:</p>
                        <h1 style="color: #d4af37; font-size: 32px; letter-spacing: 5px;">${resetCode}</h1>
                        <p>This code will expire in 15 minutes.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                    `
                });
            } catch (emailError) {
                console.error('Email error:', emailError);
                // Still return success for security
            }
        } else {
            // Development mode - log code to console
            console.log(`\n⚠️  Password reset code for ${email}: ${resetCode}\n`);
        }

        res.json({ message: 'If the email exists, a reset code has been sent' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reset password with code
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({ error: 'Email, code, and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Verify code
        const storedData = resetCodes.get(email);
        if (!storedData) {
            return res.status(400).json({ error: 'Invalid or expired reset code' });
        }

        if (storedData.code !== code) {
            return res.status(400).json({ error: 'Invalid reset code' });
        }

        if (Date.now() > storedData.expires) {
            resetCodes.delete(email);
            return res.status(400).json({ error: 'Reset code has expired' });
        }

        // Update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hashedPassword, email]);

        // Delete used code
        resetCodes.delete(email);

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin key verification (backward compatibility)
app.get('/api/admin/verify', authenticateAdmin, (req, res) => {
    res.json({ status: 'OK' });
});

// Instagram Feed API endpoint
// This endpoint fetches Instagram posts using the access token stored in environment variable
app.get('/api/instagram/posts', (req, res) => {
    const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (!INSTAGRAM_ACCESS_TOKEN) {
        return res.status(503).json({ 
            error: 'Instagram access token not configured',
            message: 'Please set INSTAGRAM_ACCESS_TOKEN environment variable'
        });
    }

    try {
        // Fetch posts from Instagram Graph API
        const limit = parseInt(req.query.limit) || 6;
        const apiUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&limit=${limit}&access_token=${INSTAGRAM_ACCESS_TOKEN}`;
        
        https.get(apiUrl, (apiRes) => {
            let data = '';
            
            apiRes.on('data', (chunk) => {
                data += chunk;
            });
            
            apiRes.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    
                    if (jsonData.error) {
                        return res.status(500).json({ 
                            error: 'Instagram API error',
                            message: jsonData.error.message 
                        });
                    }
                    
                    res.json(jsonData);
                } catch (parseError) {
                    res.status(500).json({ 
                        error: 'Failed to parse Instagram response',
                        message: parseError.message 
                    });
                }
            });
        }).on('error', (error) => {
            console.error('Error fetching Instagram posts:', error);
            res.status(500).json({ 
                error: 'Failed to fetch Instagram posts',
                message: error.message 
            });
        });
    } catch (error) {
        console.error('Error in Instagram endpoint:', error);
        res.status(500).json({ 
            error: 'Failed to fetch Instagram posts',
            message: error.message 
        });
    }
});

// Serve the main HTML file for all other routes (for SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
        }
    }
    res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await pool.end();
        console.log('Database connection closed.');
        process.exit(0);
    } catch (err) {
        console.error('Error closing database connection:', err.message);
        process.exit(1);
    }
});

