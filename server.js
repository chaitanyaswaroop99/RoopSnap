const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const https = require('https');

// Load environment variables from .env file if dotenv is installed (for local development)
try {
    require('dotenv').config();
} catch (e) {
    // dotenv not installed, using system environment variables (production)
}

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'roopsnap';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve static files from root folder
app.use('/uploads', express.static('uploads')); // Serve uploaded images

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
    } catch (err) {
        console.error('Error initializing database:', err.message);
    }
}

// Admin authentication middleware
function authenticateAdmin(req, res, next) {
    const headerKey = req.headers['x-admin-key'];
    if (!headerKey || headerKey !== ADMIN_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
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

// Admin key verification
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

