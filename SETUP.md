# Product Time Tracking Application - Setup Guide

## Overview
A full-stack application for managing and tracking product information with time-based features, built with React, Node.js, Express, and PostgreSQL.

## Features

### User Management
- User registration with strict password validation (uppercase, lowercase, numbers, special characters)
- User login/logout with JWT authentication
- Profile management (edit user information, change password)

### Product Management
- Add products manually or via image scanning (OCR)
- Track product information:
  - Product name, brand, price
  - Purchase date, production date, expiration date
  - Capacity with multiple units (ml, L, g, kg, oz, lb, unit)
  - Country of origin (all countries available)
  - Product benefits
  - Quantity purchased
- Image upload with automatic scanning to extract product information
- Search and filter products by name and brand
- Visual indicators for expired and expiring soon products

### Brand Management
- Create and manage brands/categories
- Associate products with brands
- Brand information includes name, category, and description

### Export & Reporting
- Export products in multiple formats: Excel, PDF, CSV
- Customizable field selection for exports
- Save export templates for reuse
- Manage saved templates

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Installation

### 1. Database Setup

Create a PostgreSQL database:

```bash
psql -U postgres
CREATE DATABASE product_tracking;
\q
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file with your database credentials
# Update the following variables:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=product_tracking
# DB_USER=your_postgres_username
# DB_PASSWORD=your_postgres_password
# JWT_SECRET=your_secure_random_string

# The database tables will be created automatically when you start the server
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

## Running the Application

### Start Backend Server

```bash
cd backend
npm start
# Server will run on http://localhost:5000
```

For development with auto-reload:
```bash
npm run dev
```

### Start Frontend Development Server

```bash
cd frontend
npm run dev
# Application will run on http://localhost:3000
```

### Build Frontend for Production

```bash
cd frontend
npm run build
```

## Default Configuration

- **Backend Port**: 5000
- **Frontend Port**: 3000
- **Database**: PostgreSQL on localhost:5432
- **JWT Token Expiry**: 7 days
- **Max File Upload Size**: 5MB

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/scan` - Scan product image

### Brands
- `GET /api/brands` - Get all brands
- `GET /api/brands/:id` - Get brand by ID
- `POST /api/brands` - Create new brand
- `PUT /api/brands/:id` - Update brand
- `DELETE /api/brands/:id` - Delete brand

### Export
- `POST /api/export` - Export products
- `GET /api/templates` - Get export templates
- `POST /api/templates` - Save export template
- `DELETE /api/templates/:id` - Delete export template

### Utilities
- `GET /api/countries` - Get list of all countries
- `GET /api/health` - Health check endpoint

## Password Requirements

When registering or changing password, the following requirements must be met:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*()_+-=[]{}; ':"\\|,.<>/?)

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify database credentials in `.env` file
- Check if the database exists

### Port Already in Use
- Change the PORT in backend `.env` file
- Change the port in frontend `vite.config.js`

### Image Upload Issues
- Ensure the `uploads` directory exists in the backend folder
- Check file size limits (default 5MB)
- Verify supported image formats: jpeg, jpg, png, gif, webp

## Technology Stack

### Backend
- Node.js & Express.js
- PostgreSQL with Sequelize ORM
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Tesseract.js for OCR
- ExcelJS, jsPDF, csv-writer for exports

### Frontend
- React 18
- Vite
- React Router v6
- Axios for API calls
- Tailwind CSS for styling
- date-fns for date formatting

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Input validation
- SQL injection prevention (Sequelize ORM)
- File upload validation
- CORS configuration

## Future Enhancements

- Email verification
- Password reset functionality
- Product notifications for expiring items
- Barcode scanning
- Mobile app
- Multi-language support
- Advanced analytics and charts
- Batch product import
- Product categories and tags
