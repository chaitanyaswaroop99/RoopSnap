# Deployment Guide for RoopSnap

This guide will help you deploy your photography website to the internet.

## Option 1: Netlify (Easiest - Recommended) ⭐

### Method A: Drag & Drop (No account needed for testing)

1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag your entire project folder (`RoopSnap`) onto the page
3. Your site will be live in seconds!
4. You'll get a URL like: `https://random-name-123.netlify.app`

### Method B: With Netlify Account (Better for permanent hosting)

1. Go to [https://www.netlify.com](https://www.netlify.com) and sign up (free)
2. Click "Add new site" → "Deploy manually"
3. Drag and drop your project folder
4. Your site is live!
5. You can customize the site name in Site settings → General → Change site name

**Benefits:**
- Free SSL certificate (HTTPS)
- Custom domain support
- Automatic deployments
- Fast CDN

---

## Option 2: GitHub Pages (Free)

### Step 1: Create GitHub Repository

1. Go to [https://github.com](https://github.com) and sign in
2. Click the "+" icon → "New repository"
3. Name it: `chaya-captures` (or any name you like)
4. Make it **Public**
5. Click "Create repository"

### Step 2: Upload Files

1. In your new repository, click "uploading an existing file"
2. Drag and drop all your files:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`
3. Scroll down, add commit message: "Initial commit"
4. Click "Commit changes"

### Step 3: Enable GitHub Pages

1. Go to your repository Settings
2. Scroll to "Pages" section (left sidebar)
3. Under "Source", select "Deploy from a branch"
4. Select "main" branch and "/ (root)" folder
5. Click "Save"
6. Your site will be live at: `https://yourusername.github.io/chaya-captures`

**Note:** It may take a few minutes for the site to go live.

---

## Option 3: Vercel (Free)

1. Go to [https://vercel.com](https://vercel.com) and sign up
2. Click "Add New Project"
3. Import your GitHub repository (if connected) or drag and drop your folder
4. Click "Deploy"
5. Your site is live!

---

## Option 4: Cloudflare Pages (Free)

1. Go to [https://pages.cloudflare.com](https://pages.cloudflare.com)
2. Sign up or log in
3. Click "Create a project"
4. Connect your GitHub account or upload directly
5. Deploy!

---

## Quick Comparison

| Platform | Ease | Free | Custom Domain | Best For |
|----------|------|------|---------------|----------|
| **Netlify** | ⭐⭐⭐⭐⭐ | ✅ | ✅ | Quick deployment |
| **GitHub Pages** | ⭐⭐⭐⭐ | ✅ | ✅ | Developers |
| **Vercel** | ⭐⭐⭐⭐⭐ | ✅ | ✅ | Modern apps |
| **Cloudflare** | ⭐⭐⭐⭐ | ✅ | ✅ | Fast CDN |

---

## Recommended: Netlify

**Why Netlify?**
- Easiest to use
- No technical knowledge needed
- Free SSL
- Fast global CDN
- Easy custom domain setup

**Steps:**
1. Visit: https://app.netlify.com/drop
2. Drag your folder
3. Done! 🎉

---

## After Deployment

1. **Test your site** - Make sure all links work
2. **Share your URL** - Your site is now live!
3. **Custom Domain** (Optional):
   - Buy a domain (e.g., `chayacaptures.com`)
   - Add it in your hosting platform's settings
   - Follow their DNS instructions

---

## Troubleshooting

**Images not showing?**
- Make sure image URLs are correct
- Use absolute URLs (https://...) for external images

**Styles not loading?**
- Check that `styles.css` is in the same folder as `index.html`
- Clear browser cache (Ctrl+F5)

**JavaScript not working?**
- Check browser console for errors (F12)
- Ensure `script.js` is in the same folder

---

## Need Help?

- Netlify Docs: https://docs.netlify.com
- GitHub Pages Docs: https://docs.github.com/pages
- Vercel Docs: https://vercel.com/docs

---

**Your website is ready to go live! 🚀**

