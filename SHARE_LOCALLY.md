# Quick Local Sharing Guide

Want to share your website quickly without deploying? Use ngrok!

## Step 1: Install ngrok

1. Go to [ngrok.com](https://ngrok.com) and sign up (free)
2. Download ngrok for Windows
3. Extract the `ngrok.exe` file to a folder (e.g., `C:\ngrok\`)

## Step 2: Get Your Auth Token

1. After signing up, go to [dashboard.ngrok.com/get-started/your-authtoken](https://dashboard.ngrok.com/get-started/your-authtoken)
2. Copy your authtoken
3. Run this command in PowerShell:
   ```powershell
   cd C:\ngrok
   .\ngrok.exe authtoken YOUR_AUTH_TOKEN_HERE
   ```

## Step 3: Start Your Server

Make sure your server is running:
```powershell
cd "C:\Users\chait\OneDrive\Desktop\RoopSnap"
npm start
```

## Step 4: Start ngrok

In a NEW PowerShell window:
```powershell
cd C:\ngrok
.\ngrok.exe http 3000
```

## Step 5: Share the URL

ngrok will give you a URL like:
```
https://abc123.ngrok-free.app
```

**Share this URL with anyone!** They can access your website.

## Important Notes

⚠️ **Limitations:**
- URL changes every time you restart ngrok (unless you have a paid plan)
- Only works while your computer and ngrok are running
- Free version has some limitations

✅ **For permanent sharing, deploy to Railway/Render instead!**

---

## Alternative: Use Your IP Address (Same Network Only)

If the person is on the same WiFi network:

1. Find your IP address:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., `192.168.1.100`)

2. Share: `http://192.168.1.100:3000`

**Note:** This only works on the same local network!

