# Instagram Feed Integration Setup Guide

This guide will help you set up Instagram feed integration for your RoopSnap website.

## Prerequisites

1. **Instagram Business or Creator Account**
   - Your Instagram account must be a Business or Creator account (not a personal account)
   - Go to Instagram Settings → Account → Switch to Professional Account

2. **Facebook Page**
   - You need a Facebook Page connected to your Instagram account
   - Create one at [facebook.com/pages/create](https://www.facebook.com/pages/create)

3. **Facebook Developer Account**
   - Sign up at [developers.facebook.com](https://developers.facebook.com)

---

## Step-by-Step Setup

### Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/apps/)
2. Click **"Create App"**
3. Select **"Business"** as the app type
4. Fill in:
   - **App Name**: `RoopSnap` (or any name)
   - **App Contact Email**: Your email
   - **Business Account**: Select or create one
5. Click **"Create App"**

### Step 2: Add Instagram Basic Display Product

1. In your app dashboard, go to **"Add Products"**
2. Find **"Instagram Basic Display"** and click **"Set Up"**
3. You'll be redirected to the Instagram Basic Display settings

### Step 3: Configure Instagram Basic Display

1. Go to **Settings → Basic** in your app
2. Add **"Instagram Basic Display"** in the Products section
3. Add **Valid OAuth Redirect URIs**:
   - For local testing: `http://localhost:3000`
   - For production: `https://your-domain.com`
   - You can add multiple URIs

### Step 4: Create Instagram App

1. In your app dashboard, go to **"Instagram Basic Display"** → **"Basic Display"**
2. Click **"Create New App"**
3. Fill in:
   - **App Name**: `RoopSnap Instagram`
   - **Valid OAuth Redirect URIs**: Same as above
   - **Deauthorize Callback URL**: `https://your-domain.com/deauthorize`
   - **Data Deletion Request URL**: `https://your-domain.com/delete`
4. Click **"Create App"**

### Step 5: Get Access Token

#### Option A: Using Facebook Graph API Explorer (Easiest)

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from the dropdown
3. Click **"Generate Access Token"**
4. Select permissions:
   - `instagram_basic`
   - `pages_show_list` (if needed)
5. Copy the **short-lived access token** (expires in 1 hour)

#### Option B: Using OAuth Flow (For Production)

1. Create an authorization URL:
   ```
   https://api.instagram.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=user_profile,user_media&response_type=code
   ```
2. Replace:
   - `YOUR_CLIENT_ID` with your Instagram App ID
   - `YOUR_REDIRECT_URI` with your redirect URI
3. Visit the URL and authorize
4. Exchange the code for an access token

### Step 6: Exchange for Long-Lived Token

Short-lived tokens expire in 1 hour. Exchange for a long-lived token (60 days):

1. Make a GET request to:
   ```
   https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=YOUR_CLIENT_SECRET&access_token=SHORT_LIVED_TOKEN
   ```
2. Replace:
   - `YOUR_CLIENT_SECRET` with your Instagram App Secret
   - `SHORT_LIVED_TOKEN` with your short-lived token
3. You'll receive a long-lived token (valid for 60 days)

### Step 7: Refresh Token (Optional)

To extend beyond 60 days, refresh the token before it expires:

```
https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=LONG_LIVED_TOKEN
```

### Step 8: Add Token to Your Server

#### For Local Development:

Create a `.env` file in your project root:

```env
INSTAGRAM_ACCESS_TOKEN=your_long_lived_access_token_here
```

Then install dotenv:
```bash
npm install dotenv
```

And add to the top of `server.js`:
```javascript
require('dotenv').config();
```

#### For Production (Railway/Render):

1. Go to your project settings
2. Navigate to **"Variables"** or **"Environment Variables"**
3. Add a new variable:
   - **Name**: `INSTAGRAM_ACCESS_TOKEN`
   - **Value**: Your long-lived access token
4. Save and redeploy

---

## Testing

1. Start your server: `npm start`
2. Visit `http://localhost:3000`
3. Scroll to the Instagram section
4. You should see your Instagram posts displayed!

---

## Troubleshooting

### "Instagram access token not configured"
- Make sure you set the `INSTAGRAM_ACCESS_TOKEN` environment variable
- Restart your server after adding the variable

### "Failed to fetch Instagram posts"
- Check if your access token is valid
- Verify your Instagram account is Business/Creator
- Check if the token has expired (refresh if needed)

### "Invalid OAuth redirect URI"
- Make sure the redirect URI in your app matches exactly
- Check for trailing slashes

### "Token expired"
- Exchange for a new long-lived token
- Set up automatic token refresh

---

## Token Refresh Automation

To automatically refresh tokens before expiration, you can:

1. Set up a cron job or scheduled task
2. Call the refresh endpoint before token expires
3. Update the environment variable

Example refresh script:
```javascript
// refresh-token.js
const https = require('https');
const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;

https.get(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const newToken = JSON.parse(data).access_token;
        console.log('New token:', newToken);
        // Update your environment variable
    });
});
```

---

## Alternative: Using Instagram Graph API

If you have a Business account, you can use Instagram Graph API instead:

1. Add **"Instagram Graph API"** product to your app
2. Connect your Instagram Business account
3. Use the same access token process

---

## Security Notes

⚠️ **Important:**
- Never commit your access token to Git
- Always use environment variables
- Keep your App Secret secure
- Use HTTPS in production
- Regularly refresh your tokens

---

## Need Help?

- [Instagram Basic Display API Docs](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Facebook Developers Support](https://developers.facebook.com/support)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)

---

**Your Instagram feed is now ready to display on your website! 🎉**

