# Product Time Tracking Application

A comprehensive full-stack application for managing and tracking product information with time-based features. Built with React, Node.js, Express, and PostgreSQL.

## 🚀 Features

### 👤 User Management
- **Secure Registration**: Strict password validation with uppercase, lowercase, numbers, and special characters
- **Authentication**: JWT-based login/logout system
- **Profile Management**: Edit user information and change password

### 📦 Product Management
- **Manual Entry**: Add products with detailed information
- **Image Scanning**: Upload product images and automatically extract information using OCR
- **Comprehensive Tracking**:
  - Product name, brand, and price
  - Purchase, production, and expiration dates
  - Flexible capacity units (ml, L, g, kg, oz, lb, unit)
  - Country of origin (195+ countries)
  - Product benefits and notes
  - Quantity tracking
- **Smart Search**: Filter products by name and brand
- **Visual Alerts**: Color-coded indicators for expired and expiring products

### 🏷️ Brand Management
- Create and organize brands/categories
- Link products to brands
- Store brand information (name, category, description)

### 📊 Export & Reporting
- **Multiple Formats**: Export to Excel, PDF, or CSV
- **Custom Fields**: Select specific fields to export
- **Template System**: Save and reuse export configurations
- **Template Management**: Create, use, and delete export templates

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Handling**: Multer for uploads
- **OCR**: Tesseract.js for image text extraction
- **Export Libraries**: ExcelJS, jsPDF, csv-writer

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js v16 or higher
- PostgreSQL v12 or higher
- npm or yarn

## 🔧 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd product-tracking-time
```

### 2. Setup Database
```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE product_tracking;
\q
```

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 📖 Documentation

For detailed setup instructions, API documentation, and troubleshooting, see [SETUP.md](./SETUP.md)

## 🔐 Security Features

- Bcrypt password hashing
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- SQL injection prevention
- File upload validation
- CORS configuration

## 📱 Application Structure

```
product-tracking-time/
├── backend/
│   ├── config/          # Database and app configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth and upload middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context (Auth)
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── App.jsx      # Main app component
│   └── public/          # Static assets
└── README.md
```

## 🎯 Key Features Explained

### Password Validation
All passwords must contain:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Image Scanning (OCR)
Upload product images to automatically extract:
- Dates (purchase, production, expiration)
- Prices
- Capacity information
- Other text data

### Export Templates
Create reusable export configurations:
1. Select fields to export
2. Choose format (Excel/PDF/CSV)
3. Save as template
4. Reuse for future exports

## 🌐 API Endpoints

- **Auth**: `/api/auth/*` - Registration, login, profile
- **Products**: `/api/products/*` - CRUD operations, image scan
- **Brands**: `/api/brands/*` - Brand management
- **Export**: `/api/export`, `/api/templates/*` - Export and templates
- **Utilities**: `/api/countries`, `/api/health`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Product Time Tracking Application

## 🐛 Issues

If you encounter any issues, please file them in the issue tracker.

## 🔮 Future Enhancements

- Email verification
- Password reset via email
- Push notifications for expiring products
- Barcode scanning
- Mobile application
- Multi-language support
- Analytics dashboard
- Batch import functionality
- Advanced filtering and sorting
