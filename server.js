const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
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

// Initialize SQLite database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Photos table
    db.run(`CREATE TABLE IF NOT EXISTS photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        original_name TEXT,
        file_path TEXT NOT NULL,
        description TEXT,
        category TEXT,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating photos table:', err.message);
        } else {
            console.log('Photos table ready.');
        }
    });

    // Contacts table
    db.run(`CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        phone TEXT,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'new'
    )`, (err) => {
        if (err) {
            console.error('Error creating contacts table:', err.message);
        } else {
            console.log('Contacts table ready.');
        }
    });
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
app.get('/api/photos', (req, res) => {
    const query = req.query.category 
        ? 'SELECT * FROM photos WHERE category = ? ORDER BY uploaded_at DESC'
        : 'SELECT * FROM photos ORDER BY uploaded_at DESC';
    
    const params = req.query.category ? [req.query.category] : [];
    
    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get single photo
app.get('/api/photos/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM photos WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Photo not found' });
            return;
        }
        res.json(row);
    });
});

// Upload photo
app.post('/api/photos/upload', authenticateAdmin, upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const { description, category } = req.body;
    const filename = req.file.filename;
    const filePath = `/uploads/${filename}`;
    const originalName = req.file.originalname;

    db.run(
        'INSERT INTO photos (filename, original_name, file_path, description, category) VALUES (?, ?, ?, ?, ?)',
        [filename, originalName, filePath, description || null, category || null],
        function(err) {
            if (err) {
                // Delete uploaded file if database insert fails
                fs.unlinkSync(req.file.path);
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                id: this.lastID,
                filename: filename,
                file_path: filePath,
                description: description,
                category: category,
                message: 'Photo uploaded successfully'
            });
        }
    );
});

// Delete photo
app.delete('/api/photos/:id', authenticateAdmin, (req, res) => {
    const id = req.params.id;
    
    // First get the file path
    db.get('SELECT file_path FROM photos WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Photo not found' });
            return;
        }

        // Delete from database
        db.run('DELETE FROM photos WHERE id = ?', [id], (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            // Delete file from filesystem
            const filePath = path.join(__dirname, row.file_path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            res.json({ message: 'Photo deleted successfully' });
        });
    });
});

// Submit contact form
app.post('/api/contact', (req, res) => {
    const { name, email, message, phone } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    db.run(
        'INSERT INTO contacts (name, email, message, phone) VALUES (?, ?, ?, ?)',
        [name, email, message, phone || null],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                id: this.lastID,
                message: 'Contact form submitted successfully'
            });
        }
    );
});

// Get all contacts (admin endpoint)
app.get('/api/contacts', authenticateAdmin, (req, res) => {
    db.all('SELECT * FROM contacts ORDER BY submitted_at DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get single contact
app.get('/api/contacts/:id', authenticateAdmin, (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM contacts WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Contact not found' });
            return;
        }
        res.json(row);
    });
});

// Update contact status (mark as read, etc.)
app.patch('/api/contacts/:id', authenticateAdmin, (req, res) => {
    const id = req.params.id;
    const { status } = req.body;

    db.run(
        'UPDATE contacts SET status = ? WHERE id = ?',
        [status || 'read', id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Contact status updated successfully' });
        }
    );
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
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});

