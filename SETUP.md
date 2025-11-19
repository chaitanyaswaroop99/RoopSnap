# Setup Guide - RoopSnap with Database

This guide will help you set up and run your photography website with database functionality.

## Prerequisites

- Node.js (version 14 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js)

## Installation Steps

### 1. Install Dependencies

Open your terminal/command prompt in the project folder and run:

```bash
npm install
```

This will install all required packages:
- Express (web server)
- SQLite3 (database)
- Multer (file uploads)
- CORS (cross-origin requests)
- Body-parser (form data parsing)

### 2. Create Required Folders

The server will automatically create the `uploads` folder when you first run it, but you can create it manually:

```bash
mkdir uploads
```

### 3. Start the Server

Run the server:

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 4. Access Your Website

- **Main Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin.html (default access key: `chaya-admin`)
- **API Endpoints**: http://localhost:3000/api

## Database

The SQLite database (`database.sqlite`) will be created automatically when you first run the server. It contains two tables:

1. **photos** - Stores uploaded photos with metadata
2. **contacts** - Stores client contact form submissions

## Admin Panel Features

Access the admin panel at `/admin.html` to:

- **Upload Photos**: Add new photos to your gallery
- **Manage Photos**: View and delete uploaded photos
- **View Contacts**: See all client inquiries and messages

## API Endpoints

### Photos
- `GET /api/photos` - Get all photos
- `GET /api/photos/:id` - Get single photo
- `POST /api/photos/upload` - Upload a photo
- `DELETE /api/photos/:id` - Delete a photo

### Contacts
- `GET /api/contacts` - Get all contact submissions
- `GET /api/contacts/:id` - Get single contact
- `POST /api/contact` - Submit contact form
- `PATCH /api/contacts/:id` - Update contact status

## File Structure

```
RoopSnap/
├── index.html          # Main website
├── admin.html          # Admin panel
├── styles.css          # Styles
├── script.js           # Frontend JavaScript
├── server.js           # Backend server
├── package.json        # Dependencies
├── database.sqlite     # SQLite database (auto-created)
├── uploads/            # Uploaded photos folder (auto-created)
└── README.md           # Documentation
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, change it in `server.js`:

```javascript
const PORT = process.env.PORT || 3001; // Change to 3001 or any available port
```

### Database Errors

If you encounter database errors:
1. Delete `database.sqlite` file
2. Restart the server (it will recreate the database)

### Upload Errors

- Make sure the `uploads` folder exists and is writable
- Check file size (max 10MB)
- Ensure file is an image (jpg, png, gif, webp)

### CORS Errors

CORS is enabled by default. If you need to restrict it, edit `server.js`:

```javascript
app.use(cors({
    origin: 'https://yourdomain.com' // Replace with your domain
}));
```

## Production Deployment

### Option 1: Heroku

1. Create a `Procfile`:
```
web: node server.js
```

2. Set environment variable:
```bash
heroku config:set PORT=3000
```

3. Deploy:
```bash
git push heroku main
```

### Option 2: Railway

1. Connect your GitHub repository
2. Railway will auto-detect Node.js
3. Set PORT environment variable
4. Deploy!

### Option 3: Render

1. Create new Web Service
2. Connect GitHub repository
3. Build command: `npm install`
4. Start command: `npm start`
5. Set PORT environment variable

### Option 4: DigitalOcean App Platform

1. Create new app
2. Connect repository
3. Auto-detect Node.js
4. Deploy!

## Environment Variables

For production, you may want to set:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Set to "production"
- `ADMIN_API_KEY` - Secret key required for the admin panel and protected API endpoints (default: `chaya-admin`)

Example:

```bash
setx ADMIN_API_KEY "super-secret-key"   # Windows (new shell required)
export ADMIN_API_KEY="super-secret-key" # macOS/Linux
```

## Security Notes

⚠️ **Important for Production:**

1. **Add Authentication**: The admin panel is currently open. Add authentication before deploying:
   - Use environment variables for admin credentials
   - Implement login system
   - Use JWT tokens or sessions

2. **File Upload Limits**: Currently set to 10MB. Adjust in `server.js`:
   ```javascript
   limits: { fileSize: 10 * 1024 * 1024 }
   ```

3. **Database Backup**: Regularly backup `database.sqlite`

4. **HTTPS**: Always use HTTPS in production

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Start server: `npm start`
3. ✅ Visit http://localhost:3000
4. ✅ Upload photos via admin panel
5. ✅ Test contact form
6. ✅ Deploy to production

## Support

For issues or questions, check:
- Server logs in terminal
- Browser console (F12)
- Database file integrity

---

**Your photography website with database is ready! 🎉**

