# Email/Password Authentication Setup

Your admin panel now uses email and password authentication with password reset functionality! 🎉

## Features

✅ **Email/Password Login** - Secure authentication  
✅ **Password Reset** - Reset password via email code  
✅ **Session Management** - Secure session-based authentication  
✅ **Backward Compatible** - Old API key still works  

---

## Default Admin Account

On first run, a default admin account is created:

- **Email**: `admin@roopsnap.com` (or set via `ADMIN_EMAIL`)
- **Password**: `admin123` (or set via `ADMIN_PASSWORD`)

⚠️ **Important**: Change the default password after first login!

---

## Environment Variables

Add these to your `.env` file or deployment platform:

### Required for Email (Password Reset):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Optional:

```env
ADMIN_EMAIL=admin@roopsnap.com
ADMIN_PASSWORD=admin123
SESSION_SECRET=your-secret-key-here
```

---

## Setting Up Gmail SMTP

### Step 1: Enable 2-Factor Authentication

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification

### Step 2: Create App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Other (Custom name)"
3. Enter "RoopSnap"
4. Click "Generate"
5. Copy the 16-character password
6. Use this as `SMTP_PASS` in your `.env`

### Step 3: Update .env

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
```

---

## Other Email Providers

### Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Yahoo

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

### Custom SMTP

```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
```

---

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new admin user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout
- `GET /api/auth/check` - Check authentication status
- `POST /api/auth/forgot-password` - Request password reset code
- `POST /api/auth/reset-password` - Reset password with code

### Example: Register Admin

```javascript
fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'admin@example.com',
        password: 'securepassword123'
    })
});
```

---

## Password Reset Flow

1. User clicks "Forgot Password"
2. Enters email address
3. Receives 6-digit code via email
4. Enters code and new password
5. Password is reset

**Note**: Reset codes expire in 15 minutes.

---

## Development Mode

If SMTP is not configured, reset codes will be logged to console:

```
⚠️  Password reset code for admin@roopsnap.com: 123456
```

This allows testing without email setup.

---

## Security Features

✅ **Password Hashing** - Uses bcrypt (10 rounds)  
✅ **Session Security** - HttpOnly cookies  
✅ **Code Expiration** - Reset codes expire in 15 minutes  
✅ **Password Requirements** - Minimum 6 characters  

---

## Troubleshooting

### "Email not sending"

- Check SMTP credentials
- Verify app password (Gmail)
- Check firewall/network settings
- Check console for errors

### "Invalid email or password"

- Verify email is correct
- Check if user exists in database
- Try resetting password

### "Reset code expired"

- Codes expire in 15 minutes
- Request a new code

### "Session not working"

- Check `SESSION_SECRET` is set
- Verify cookies are enabled
- Check CORS settings

---

## Database Schema

Users table is created automatically:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

---

## Next Steps

1. ✅ Set up SMTP for email (Gmail recommended)
2. ✅ Change default admin password
3. ✅ Create additional admin users if needed
4. ✅ Test password reset functionality

---

**Your authentication system is ready! 🚀**

