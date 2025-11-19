# PostgreSQL Setup Guide

Your application has been migrated from SQLite to PostgreSQL! 🎉

## What Changed

- ✅ Database changed from SQLite to PostgreSQL
- ✅ All queries updated to use PostgreSQL syntax
- ✅ Connection pooling enabled for better performance
- ✅ Async/await pattern for all database operations

---

## Setup Instructions

### Option 1: Local PostgreSQL (Development)

#### Step 1: Install PostgreSQL

**Windows:**
1. Download from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Run the installer
3. Remember the password you set for the `postgres` user

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Step 2: Create Database

Open PostgreSQL command line (psql) or pgAdmin:

```sql
CREATE DATABASE roopsnap;
```

Or via command line:
```bash
createdb roopsnap
```

#### Step 3: Set Environment Variable

Create a `.env` file in your project root:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/roopsnap
```

Replace:
- `your_password` with your PostgreSQL password
- `roopsnap` with your database name (if different)

#### Step 4: Install Dependencies

```powershell
npm install
```

#### Step 5: Start Server

```powershell
npm start
```

The tables will be created automatically on first run!

---

### Option 2: Cloud PostgreSQL (Production)

#### Railway (Recommended)

1. **Deploy your app to Railway**
2. **Add PostgreSQL service:**
   - In Railway dashboard, click **"New"** → **"Database"** → **"Add PostgreSQL"**
   - Railway automatically sets `DATABASE_URL` environment variable
   - Your app will connect automatically!

#### Render

1. **Deploy to Render**
2. **Add PostgreSQL:**
   - Go to **"New"** → **"PostgreSQL"**
   - Copy the **Internal Database URL**
   - Add as environment variable: `DATABASE_URL`

#### Other Cloud Providers

- **Supabase**: [supabase.com](https://supabase.com) - Free PostgreSQL
- **Neon**: [neon.tech](https://neon.tech) - Serverless PostgreSQL
- **ElephantSQL**: [elephantsql.com](https://www.elephantsql.com) - Free tier available
- **Heroku Postgres**: [heroku.com/postgres](https://www.heroku.com/postgres)

---

## Environment Variables

Set these in your deployment platform:

### Required:
```env
DATABASE_URL=postgresql://user:password@host:port/database
```

### Optional:
```env
ADMIN_API_KEY=your-secret-key
INSTAGRAM_ACCESS_TOKEN=your-instagram-token
PORT=3000
```

---

## Database Schema

The following tables are created automatically:

### Photos Table
```sql
CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    file_path VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Contacts Table
```sql
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    phone VARCHAR(50),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'new'
);
```

---

## Migrating Data from SQLite (Optional)

If you have existing data in SQLite, you can migrate it:

### Step 1: Export SQLite Data

```powershell
# Install sqlite3 CLI if needed
sqlite3 database.sqlite .dump > data.sql
```

### Step 2: Convert to PostgreSQL Format

You'll need to:
- Change `INTEGER PRIMARY KEY AUTOINCREMENT` to `SERIAL PRIMARY KEY`
- Change `TEXT` to `VARCHAR` or `TEXT`
- Change `DATETIME` to `TIMESTAMP`
- Update INSERT statements

### Step 3: Import to PostgreSQL

```bash
psql -d roopsnap -f data.sql
```

Or use a migration tool like [pgloader](https://pgloader.readthedocs.io/).

---

## Testing Connection

Test your PostgreSQL connection:

```javascript
// test-db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Connection error:', err);
    } else {
        console.log('Connected! Current time:', res.rows[0].now);
    }
    pool.end();
});
```

Run: `node test-db.js`

---

## Troubleshooting

### "Connection refused"
- Check if PostgreSQL is running: `pg_isready`
- Verify connection string in `DATABASE_URL`
- Check firewall settings

### "Database does not exist"
- Create the database: `createdb roopsnap`
- Or update `DATABASE_URL` with correct database name

### "Password authentication failed"
- Check your password in `DATABASE_URL`
- Reset password: `ALTER USER postgres PASSWORD 'newpassword';`

### "SSL required"
- Add SSL to connection: `?sslmode=require`
- Or set `ssl: { rejectUnauthorized: false }` in Pool config (already done)

---

## Benefits of PostgreSQL

✅ **Better Performance**: Faster queries, better indexing  
✅ **Scalability**: Handles more concurrent connections  
✅ **Production Ready**: Used by major applications  
✅ **Advanced Features**: JSON support, full-text search, etc.  
✅ **Cloud Support**: Easy to deploy on Railway, Render, etc.  

---

## Next Steps

1. ✅ Install PostgreSQL locally or use cloud service
2. ✅ Set `DATABASE_URL` environment variable
3. ✅ Run `npm install` to get `pg` package
4. ✅ Start your server: `npm start`
5. ✅ Tables will be created automatically!

---

**Your app is now using PostgreSQL! 🚀**

