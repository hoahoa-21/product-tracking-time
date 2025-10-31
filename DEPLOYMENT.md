# Deployment Guide

This guide covers deploying the Product Time Tracking application to production.

## Pre-Deployment Checklist

- [ ] PostgreSQL database set up and accessible
- [ ] Environment variables configured
- [ ] SSL certificate obtained (for HTTPS)
- [ ] Domain name configured (optional)
- [ ] Firewall rules configured
- [ ] Backup strategy in place

## Environment Configuration

### Backend Environment Variables

Create a production `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration (Production)
DB_HOST=your_production_db_host
DB_PORT=5432
DB_NAME=product_tracking_prod
DB_USER=your_db_user
DB_PASSWORD=your_secure_db_password

# JWT Configuration (Use strong secret!)
JWT_SECRET=your_very_long_and_secure_random_string_here_min_32_chars
JWT_EXPIRE=7d

# Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

**Important Security Notes:**
- Use a strong, random JWT_SECRET (minimum 32 characters)
- Never commit `.env` files to version control
- Use different credentials for production
- Enable SSL/TLS for database connections

## Deployment Options

### Option 1: Traditional VPS/Server Deployment

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx (for reverse proxy)
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### 2. Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create production database
CREATE DATABASE product_tracking_prod;
CREATE USER prod_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE product_tracking_prod TO prod_user;
\q
```

#### 3. Deploy Backend

```bash
# Clone repository
git clone <your-repo-url>
cd product-tracking-time/backend

# Install dependencies
npm install --production

# Create .env file with production settings
nano .env

# Start with PM2
pm2 start server.js --name product-tracking-api
pm2 save
pm2 startup
```

#### 4. Build and Deploy Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Build for production
npm run build

# Copy build to web server directory
sudo cp -r dist/* /var/www/product-tracking/
```

#### 5. Configure Nginx

Create `/etc/nginx/sites-available/product-tracking`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/product-tracking;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Uploads
    location /uploads {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/product-tracking /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
```

### Option 2: Docker Deployment

#### 1. Create Dockerfile for Backend

`backend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

#### 2. Create Dockerfile for Frontend

`frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Create docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: product_tracking
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      NODE_ENV: production
      DB_HOST: db
      DB_PORT: 5432
      DB_NAME: product_tracking
      DB_USER: postgres
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "5000:5000"
    depends_on:
      - db
    volumes:
      - ./backend/uploads:/app/uploads

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

#### 4. Deploy with Docker

```bash
# Create .env file
echo "DB_PASSWORD=your_secure_password" > .env
echo "JWT_SECRET=your_secure_jwt_secret" >> .env

# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Option 3: Cloud Platform Deployment

#### Heroku

**Backend:**
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create product-tracking-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret

# Deploy
git subtree push --prefix backend heroku main
```

**Frontend:**
```bash
# Build frontend
cd frontend
npm run build

# Deploy to Netlify/Vercel
# Or serve from backend as static files
```

#### AWS (EC2 + RDS)

1. Launch EC2 instance (Ubuntu)
2. Create RDS PostgreSQL instance
3. Configure security groups
4. Follow VPS deployment steps above
5. Use RDS endpoint for database

#### DigitalOcean App Platform

1. Connect GitHub repository
2. Configure build settings:
   - Backend: Node.js, `npm start`
   - Frontend: Static site, `npm run build`
3. Add PostgreSQL database
4. Set environment variables
5. Deploy

## Post-Deployment

### 1. Verify Deployment

```bash
# Check backend health
curl https://your-domain.com/api/health

# Check frontend
curl https://your-domain.com

# Test registration
curl -X POST https://your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"Test","lastName":"User"}'
```

### 2. Monitor Application

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs product-tracking-api

# Check status
pm2 status
```

### 3. Setup Backups

```bash
# Database backup script
#!/bin/bash
BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U prod_user product_tracking_prod > $BACKUP_DIR/backup_$DATE.sql

# Add to crontab for daily backups
0 2 * * * /path/to/backup-script.sh
```

### 4. Setup Monitoring

Consider using:
- **Uptime monitoring**: UptimeRobot, Pingdom
- **Error tracking**: Sentry
- **Performance monitoring**: New Relic, DataDog
- **Log management**: Papertrail, Loggly

## Security Hardening

### 1. Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 2. Fail2Ban (Prevent brute force)

```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Regular Updates

```bash
# System updates
sudo apt update && sudo apt upgrade -y

# Node.js updates
npm outdated
npm update

# PM2 updates
pm2 update
```

### 4. Database Security

- Use strong passwords
- Enable SSL/TLS connections
- Restrict network access
- Regular backups
- Monitor for suspicious activity

## Performance Optimization

### 1. Enable Gzip Compression (Nginx)

Add to nginx config:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
```

### 2. Enable Caching

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Database Optimization

```sql
-- Create indexes
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_products_expiration ON products(expiration_date);
```

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs product-tracking-api --lines 100

# Check system logs
sudo journalctl -u nginx -n 50
```

### Database Connection Issues

```bash
# Test database connection
psql -h localhost -U prod_user -d product_tracking_prod

# Check PostgreSQL status
sudo systemctl status postgresql
```

### High Memory Usage

```bash
# Check PM2 memory
pm2 list

# Restart application
pm2 restart product-tracking-api
```

## Rollback Procedure

```bash
# PM2 rollback
pm2 stop product-tracking-api
git checkout previous-version
npm install
pm2 restart product-tracking-api

# Database rollback
psql -U prod_user product_tracking_prod < backup_file.sql
```

## Maintenance Mode

Create a maintenance page and configure Nginx:

```nginx
if (-f /var/www/maintenance.html) {
    return 503;
}

error_page 503 @maintenance;
location @maintenance {
    root /var/www;
    rewrite ^(.*)$ /maintenance.html break;
}
```

## Support and Monitoring

- Set up alerts for downtime
- Monitor error rates
- Track response times
- Review logs regularly
- Keep documentation updated

---

**Your application is now deployed and ready for production use! 🚀**
