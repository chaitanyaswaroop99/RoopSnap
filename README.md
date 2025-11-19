# RoopSnap - Photography Portfolio Website

A modern, full-stack photography portfolio website with database backend, photo uploads, and client contact management.

## Features

- ✨ Modern, elegant design
- 📱 Fully responsive (mobile, tablet, desktop)
- 🖼️ Dynamic image gallery with database storage
- 📤 Photo upload system via admin panel
- 💾 SQLite database for photos and contacts
- 📧 Contact form with database storage
- 🔐 Admin panel for managing content
- 📸 Instagram integration and linking
- 🎨 Smooth animations and transitions
- ♿ Accessible navigation

## Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   - Main Website: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin.html (default access key: `chaya-admin`)

See `QUICKSTART.md` for detailed setup instructions.

### Deployment

See `DEPLOYMENT_FULLSTACK.md` for deployment options (Railway, Render, Heroku, etc.)

## Customization

### Uploading Photos

1. Start your server: `npm start`
2. Go to Admin Panel: http://localhost:3000/admin.html
3. Click "Click to select a photo"
4. Choose an image file
5. Add description and category (optional)
6. Click "Upload Photo"
7. Photo automatically appears in your gallery!

### Managing Photos

- View all photos in Admin Panel
- Delete photos you no longer want
- Photos are stored in database and `uploads/` folder

### Admin Access Key

- Default admin key: `chaya-admin`
- Change it by setting the `ADMIN_API_KEY` environment variable before running the server:
  ```bash
  setx ADMIN_API_KEY "your-secure-key"      # Windows (new shell required)
  export ADMIN_API_KEY="your-secure-key"    # macOS/Linux
  ```
- Keep this key private; anyone with it can upload or delete photos and read contact submissions.

### Instagram Integration

The website includes Instagram linking and integration. There are several ways to display Instagram content:

#### Option 1: Instagram Basic Display API (Recommended for Production)

1. **Create a Facebook App:**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app
   - Add "Instagram Basic Display" product

2. **Get Access Token:**
   - Follow Instagram's authentication flow
   - Obtain a long-lived access token

3. **Add Token to Website:**
   - Open `script.js`
   - Find the `DOMContentLoaded` event listener at the bottom
   - Uncomment and add your access token:
   ```javascript
   const INSTAGRAM_ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN_HERE';
   loadInstagramPosts(INSTAGRAM_ACCESS_TOKEN);
   ```

#### Option 2: Manual Instagram Embeds

1. Go to any Instagram post
2. Click the three dots (⋯) → "Embed"
3. Copy the embed code
4. Use the `addInstagramEmbed()` function in `script.js`:
   ```javascript
   addInstagramEmbed('PASTE_EMBED_CODE_HERE');
   ```

#### Option 3: Third-Party Services

You can use services like:
- [Instagram Feed](https://elfsight.com/instagram-feed/)
- [SnapWidget](https://snapwidget.com/)
- [Juicer](https://www.juicer.io/)

These services provide embed codes you can add to the Instagram section.

### Updating Instagram Link

The Instagram link is already set to: `https://www.instagram.com/roop_snap`

If you need to change it, search for `roop_snap` in the HTML files and replace with your username.

### Customizing Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #2c2c2c;      /* Main dark color */
    --secondary-color: #f5f5f5;    /* Light background */
    --accent-color: #d4af37;        /* Gold accent */
    --text-dark: #1a1a1a;          /* Dark text */
    --text-light: #666;             /* Light text */
}
```

### Contact Form

The contact form currently shows an alert on submission. To make it functional:

1. Set up a backend server (Node.js, PHP, etc.)
2. Create an API endpoint to handle form submissions
3. Update the form submission handler in `script.js` to send data to your API

Example backend integration:
```javascript
const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
});
```

## File Structure

```
.
├── index.html              # Main website
├── admin.html              # Admin panel
├── styles.css              # Website styles
├── script.js               # Frontend JavaScript
├── server.js               # Backend server & API
├── package.json            # Dependencies
├── Procfile                # Deployment config
├── database.sqlite         # Database (auto-created)
├── uploads/                # Photo storage (auto-created)
├── QUICKSTART.md           # Quick start guide
├── SETUP.md                # Detailed setup instructions
├── DEPLOYMENT_FULLSTACK.md # Deployment guide
└── README.md               # This file
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### GitHub Pages

1. Push your code to a GitHub repository
2. Go to Settings → Pages
3. Select your branch and folder
4. Your site will be live at `https://yourusername.github.io/repository-name`

### Netlify

1. Drag and drop your project folder to [Netlify](https://www.netlify.com/)
2. Your site will be live instantly

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts

## Instagram API Setup Guide

For detailed Instagram API setup instructions, visit:
- [Instagram Basic Display API Documentation](https://developers.facebook.com/docs/instagram-basic-display-api)

**Important Notes:**
- Instagram API requires app review for production use
- Access tokens expire and need to be refreshed
- Consider using a backend service to handle API calls (avoids CORS issues)

## Support

For questions or issues, please refer to the code comments or contact the developer.

## License

This project is open source and available for personal and commercial use.

---

**RoopSnap** - Capturing Life's Beautiful Moments 📸

