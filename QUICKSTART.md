# Quick Start Guide - RoopSnap

Get your photography website with database up and running in 5 minutes!

## 🚀 Quick Setup (Local)

### Step 1: Install Node.js
Download and install from [nodejs.org](https://nodejs.org/) if you haven't already.

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Server
```bash
npm start
```

### Step 4: Open Your Browser
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin.html

That's it! Your website is running locally. 🎉

---

## 📸 Using Your Website

### Upload Photos
1. Go to http://localhost:3000/admin.html
2. Click "Click to select a photo"
3. Choose an image file
4. Add description (optional)
5. Add category (optional)
6. Click "Upload Photo"
7. Photo appears in your gallery!

### View Client Messages
1. Go to Admin Panel
2. Scroll to "Client Inquiries" section
3. See all contact form submissions
4. Messages are saved in database

### Test Contact Form
1. Go to main website
2. Scroll to Contact section
3. Fill out the form
4. Submit
5. Check Admin Panel to see the message!

---

## 🌐 Deploy to Internet

### Easiest Option: Railway

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Done! Your site is live!

See `DEPLOYMENT_FULLSTACK.md` for detailed deployment instructions.

---

## 📁 Project Structure

```
RoopSnap/
├── index.html              # Main website
├── admin.html              # Admin panel (upload photos, view contacts)
├── styles.css              # Website styles
├── script.js               # Frontend JavaScript
├── server.js               # Backend server & API
├── package.json            # Dependencies
├── Procfile                # Deployment config
├── database.sqlite         # Database (auto-created)
└── uploads/                # Photo storage (auto-created)
```

---

## 🔑 Key Features

✅ **Photo Gallery** - Upload and display photos  
✅ **Contact Form** - Collect client inquiries  
✅ **Database Storage** - All data saved in SQLite  
✅ **Admin Panel** - Easy photo and contact management  
✅ **Responsive Design** - Works on all devices  
✅ **Instagram Integration** - Link to your Instagram  

---

## 🛠️ Troubleshooting

### "npm: command not found"
- Install Node.js from [nodejs.org](https://nodejs.org/)

### "Port 3000 already in use"
- Change port in `server.js`: `const PORT = 3001;`

### Photos not showing
- Check that server is running
- Verify photos are in `uploads/` folder
- Check browser console for errors (F12)

### Database errors
- Delete `database.sqlite` and restart server
- It will recreate automatically

---

## 📚 More Information

- **Setup Details**: See `SETUP.md`
- **Deployment Guide**: See `DEPLOYMENT_FULLSTACK.md`
- **API Documentation**: See code comments in `server.js`

---

## 🎯 Next Steps

1. ✅ Test locally
2. ✅ Upload some photos
3. ✅ Test contact form
4. ✅ Deploy to production
5. ✅ Share your website!

---

**Need help?** Check the other documentation files or review the code comments.

**Happy photographing! 📸**

