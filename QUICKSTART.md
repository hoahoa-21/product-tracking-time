# Quick Start Guide

Get your Product Time Tracking application running in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js v16+ installed (`node --version`)
- ✅ PostgreSQL v12+ installed and running
- ✅ npm or yarn package manager

## Step-by-Step Setup

### 1. Create Database (2 minutes)

```bash
# Open PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE product_tracking;

# Exit PostgreSQL
\q
```

### 2. Setup Backend (1 minute)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your database credentials
# Required changes:
# - DB_PASSWORD=your_postgres_password
# - JWT_SECRET=any_random_string_here
```

**Example .env configuration:**
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=product_tracking
DB_USER=postgres
DB_PASSWORD=your_password_here

JWT_SECRET=my_super_secret_key_12345
JWT_EXPIRE=7d

UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### 3. Setup Frontend (1 minute)

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install
```

### 4. Start the Application (1 minute)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
```

You should see:
```
Database connection established successfully.
Database synchronized.
Server is running on port 5000
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

### 5. Access the Application

Open your browser and go to: **http://localhost:3000**

## First Steps in the Application

### 1. Register Your Account
- Click "Register here" on the login page
- Fill in your details
- **Password must have:**
  - At least 8 characters
  - One uppercase letter (A-Z)
  - One lowercase letter (a-z)
  - One number (0-9)
  - One special character (!@#$%^&*)

Example valid password: `MyPass123!`

### 2. Add Your First Brand
- After login, click "Brands" in the navigation
- Click "Add Brand"
- Enter brand name (e.g., "Nike", "Apple", "Samsung")
- Optionally add category and description
- Click "Add Brand"

### 3. Add Your First Product
- Click "Products" in the navigation
- Click "Add Product"
- Fill in product details:
  - **Required:** Product name
  - **Optional:** Brand, price, dates, capacity, etc.
- Upload an image (optional)
- Click "Scan Image for Info" to auto-extract data (optional)
- Click "Add Product"

### 4. Export Your Data
- Click "Export" in the navigation
- Select fields you want to export (checkboxes)
- Choose format (Excel, PDF, or CSV)
- Click "Export Products"
- File will download automatically

### 5. Save Export Template
- After selecting fields and format
- Enter a template name (e.g., "Monthly Report")
- Click "Save Template"
- Next time, just select the template from the sidebar!

## Troubleshooting

### Database Connection Failed
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Start PostgreSQL if not running
sudo service postgresql start

# Verify database exists
psql -U postgres -l | grep product_tracking
```

### Port Already in Use
```bash
# Backend (port 5000)
# Edit backend/.env and change PORT=5000 to PORT=5001

# Frontend (port 3000)
# Edit frontend/vite.config.js and change port: 3000 to port: 3001
```

### Cannot Upload Images
```bash
# Create uploads directory in backend
cd backend
mkdir uploads
```

### Build Errors
```bash
# Clear node_modules and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

## Common Commands

### Backend
```bash
# Start server
npm start

# Start with auto-reload (development)
npm run dev
```

### Frontend
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Default Credentials

There are no default credentials. You must register a new account on first use.

## API Health Check

Test if backend is running:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"OK","message":"Server is running"}
```

## Next Steps

1. ✅ Explore all features
2. ✅ Add multiple products
3. ✅ Try image scanning
4. ✅ Create export templates
5. ✅ Update your profile
6. ✅ Test different export formats

## Need Help?

- 📖 Read [SETUP.md](./SETUP.md) for detailed documentation
- 📋 Check [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for feature list
- 📝 Review [README.md](./README.md) for overview

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in backend .env
2. Use a strong JWT_SECRET
3. Configure proper database credentials
4. Build frontend: `npm run build`
5. Serve frontend build from a web server
6. Use process manager (PM2) for backend
7. Set up SSL/HTTPS
8. Configure firewall rules

---

**Congratulations! Your Product Time Tracking application is now running! 🎉**
