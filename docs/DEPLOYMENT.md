# DevNovate Deployment Guide 🚀

This guide covers various deployment options for the DevNovate Blog Platform, from local development to production environments.

---

## 📋 Pre-Deployment Checklist

### ✅ Code Preparation
- [ ] All features tested and working
- [ ] Environment variables properly configured
- [ ] Database schemas finalized
- [ ] Frontend build optimization completed
- [ ] Security configurations reviewed
- [ ] API endpoints documented and tested

### ✅ Infrastructure Requirements
- [ ] Node.js environment (v16+)
- [ ] MongoDB database
- [ ] SSL certificates (for production)
- [ ] Domain name configured
- [ ] CI/CD pipeline setup (optional)

---

## 🏠 Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git
- Code editor (VS Code recommended)

### Quick Start
```bash
# Clone repository
git clone https://github.com/your-team/devnovate-blog-platform.git
cd devnovate-blog-platform

# Setup backend
cd backend
npm install
cp .env.example .env  # Configure environment variables
npm run dev

# Setup frontend (new terminal)
cd ../frontend
npm install
npm start
```

### Environment Configuration
Create `backend/.env`:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/devnovate-blog

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Server
PORT=5001
NODE_ENV=development

# Optional: Email configuration (for future features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## ☁️ Cloud Deployment Options

## 1. 🌐 Heroku Deployment

### Backend Deployment

1. **Prepare for Heroku**
   ```bash
   cd backend
   echo "web: node server.js" > Procfile
   ```

2. **Create Heroku App**
   ```bash
   heroku create devnovate-blog-api
   heroku config:set MONGODB_URI="your-mongodb-atlas-uri"
   heroku config:set JWT_SECRET="your-production-jwt-secret"
   heroku config:set NODE_ENV=production
   ```

3. **Deploy Backend**
   ```bash
   git add .
   git commit -m "Prepare for Heroku deployment"
   git push heroku main
   ```

### Frontend Deployment

1. **Update API Base URL**
   ```javascript
   // In frontend/src/App.js
   const API_BASE = process.env.NODE_ENV === 'production' 
     ? 'https://devnovate-blog-api.herokuapp.com/api'
     : 'http://localhost:5001/api';
   ```

2. **Deploy to Netlify/Vercel**
   ```bash
   cd frontend
   npm run build
   # Upload build folder to Netlify or connect GitHub to Vercel
   ```

## 2. 🔷 DigitalOcean Deployment

### Server Setup
```bash
# Create Ubuntu droplet
# SSH into server
ssh root@your-server-ip

# Install Node.js and MongoDB
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y mongodb

# Install PM2 for process management
npm install -g pm2
```

### Application Deployment
```bash
# Clone repository on server
git clone https://github.com/your-team/devnovate-blog-platform.git
cd devnovate-blog-platform

# Setup backend
cd backend
npm install --production
cp .env.example .env  # Configure production variables

# Start with PM2
pm2 start server.js --name "devnovate-api"
pm2 startup
pm2 save

# Setup frontend
cd ../frontend
npm install
npm run build

# Serve with nginx (configure separately)
```

## 3. 🔀 Vercel + MongoDB Atlas

### MongoDB Atlas Setup
1. Create MongoDB Atlas cluster
2. Whitelist your IP addresses
3. Create database user
4. Get connection string

### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy backend
cd backend
vercel

# Deploy frontend
cd ../frontend
vercel
```

### Environment Variables (Vercel)
```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add NODE_ENV
```

---

## 🐳 Docker Deployment

### Create Dockerfiles

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5001

CMD ["node", "server.js"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: devnovate-db
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123

  backend:
    build: ./backend
    container_name: devnovate-api
    ports:
      - "5001:5001"
    environment:
      MONGODB_URI: mongodb://admin:password123@mongodb:27017/devnovate-blog?authSource=admin
      JWT_SECRET: your-production-jwt-secret
      NODE_ENV: production
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    container_name: devnovate-frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### Deploy with Docker
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

---

## 🔧 Production Configuration

### Environment Variables (Production)
```env
# Backend (.env)
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/devnovate?retryWrites=true&w=majority
JWT_SECRET=your-very-secure-production-jwt-secret-min-32-chars
JWT_EXPIRE=7d

# Security
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Email (Optional)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

### Nginx Configuration
```nginx
# /etc/nginx/sites-available/devnovate
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/devnovate/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL Configuration (Let's Encrypt)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 📊 Monitoring & Logging

### Backend Logging
```javascript
// Add to server.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### PM2 Monitoring
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs devnovate-api

# Restart app
pm2 restart devnovate-api

# Auto-restart on file changes (development)
pm2 start server.js --watch --name "devnovate-api"
```

### Health Check Endpoint
```javascript
// Add to backend/server.js
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});
```

---

## 🔐 Security Hardening

### Production Security Checklist
- [ ] **Environment variables** secured and not in code
- [ ] **JWT secrets** are strong and unique
- [ ] **Database** has authentication enabled
- [ ] **HTTPS** configured with valid SSL certificates
- [ ] **CORS** properly configured for your domain
- [ ] **Rate limiting** enabled for all endpoints
- [ ] **Input validation** on all user inputs
- [ ] **Error messages** don't expose sensitive information
- [ ] **Dependencies** updated to latest secure versions
- [ ] **Firewall** configured to block unnecessary ports

### Security Headers
```javascript
// Add to backend/server.js
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"]
    }
  }
}));
```

---

## 📱 Mobile & Performance Optimization

### Frontend Optimization
```bash
# Analyze bundle size
cd frontend
npm install --save-dev webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

### Performance Improvements
- **Code splitting** with React.lazy()
- **Image optimization** and lazy loading
- **Service worker** for caching
- **CDN** for static assets
- **Database query optimization**

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy DevNovate

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci
      
      - name: Run tests
        run: |
          cd backend && npm test
          cd ../frontend && npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: echo "Deploy to your production server"
```

---

## 📈 Scaling Considerations

### Database Scaling
- **MongoDB sharding** for large datasets
- **Read replicas** for improved performance
- **Connection pooling** optimization
- **Index optimization** for frequent queries

### Application Scaling
- **Load balancer** (nginx, AWS ALB)
- **Multiple server instances** with PM2 cluster mode
- **Microservices architecture** (future consideration)
- **Caching layer** (Redis, Memcached)

### Example PM2 Cluster Mode
```bash
# PM2 cluster mode for multi-core utilization
pm2 start server.js -i max --name "devnovate-cluster"
```

---

## 🛠️ Maintenance

### Regular Maintenance Tasks
- **Database backups** (daily automated)
- **Security updates** (monthly)
- **Performance monitoring** (continuous)
- **Log rotation** and cleanup
- **SSL certificate renewal**

### Backup Strategy
```bash
# MongoDB backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="/backups/devnovate_$DATE"
tar -czf "/backups/devnovate_$DATE.tar.gz" "/backups/devnovate_$DATE"
rm -rf "/backups/devnovate_$DATE"

# Keep only last 7 days of backups
find /backups -name "devnovate_*.tar.gz" -mtime +7 -delete
```

---

## ⚡ Quick Deployment Commands

### Production Deployment
```bash
# Backend deployment
cd backend
npm install --production
pm2 restart devnovate-api

# Frontend deployment
cd ../frontend
npm run build
sudo cp -r build/* /var/www/devnovate/

# Restart nginx
sudo systemctl restart nginx
```

### Emergency Rollback
```bash
# Rollback to previous version
pm2 restart devnovate-api
git checkout HEAD~1
npm install --production
pm2 restart devnovate-api
```

---

## 🔍 Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection string
mongo "your-mongodb-uri"

# Check firewall
sudo ufw status
```

#### Port Already in Use
```bash
# Find process using port
sudo lsof -i :5001

# Kill process
sudo kill -9 PID
```

#### Build Failures
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Log Analysis
```bash
# View application logs
pm2 logs devnovate-api

# View nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# View system logs
sudo journalctl -u nginx
```

---

## 📊 Performance Monitoring

### Application Monitoring
```javascript
// Add to backend/server.js
const responseTime = require('response-time');

app.use(responseTime((req, res, time) => {
  console.log(`${req.method} ${req.url} - ${time}ms`);
}));
```

### Database Monitoring
```bash
# MongoDB performance stats
mongo --eval "db.serverStatus()"

# Check slow queries
mongo --eval "db.setProfilingLevel(2, { slowms: 100 })"
```

---

## 🎯 Deployment Best Practices

### 1. Security First
- Use environment variables for all secrets
- Enable SSL/TLS in production
- Configure proper CORS policies
- Implement rate limiting
- Regular security audits

### 2. Performance Optimization
- Enable gzip compression
- Optimize database queries
- Use CDN for static assets
- Implement caching strategies
- Monitor resource usage

### 3. Reliability
- Implement health checks
- Set up automated backups
- Use process managers (PM2)
- Configure proper logging
- Plan for disaster recovery

### 4. Monitoring
- Application performance monitoring
- Error tracking and alerting
- User analytics
- Server resource monitoring
- Database performance metrics

---

## 📞 Support

### Deployment Issues
If you encounter deployment issues:

1. **Check logs** first (application, nginx, system)
2. **Verify environment variables** are correctly set
3. **Test connectivity** between services
4. **Review firewall and security group** settings
5. **Contact the development team** with detailed error logs

### Development Team Contacts
- **Technical Lead**: [Student 1] - [email]
- **Backend Developer**: [Student 2] - [email]
- **Frontend Developer**: [Student 3] - [email]
- **DevOps Specialist**: [Student 4] - [email]

---

## 🎉 Post-Deployment

### After Successful Deployment
1. **Test all functionality** in production environment
2. **Verify SSL certificates** are working
3. **Check performance metrics**
4. **Update DNS records** if needed
5. **Create monitoring alerts**
6. **Document any environment-specific configurations**

### Go-Live Checklist
- [ ] Application accessible via domain
- [ ] All features working correctly
- [ ] SSL certificate valid
- [ ] Database properly connected
- [ ] Admin panel accessible
- [ ] Monitoring systems active
- [ ] Backup systems configured
- [ ] Team notified of successful deployment

---

<div align="center">

**DevNovate Deployment Guide**

*Comprehensive deployment documentation for VIBE HACK 2025 submission*

*Developed by BIT Durg Students*

[🏠 Home](../README.md) | [📚 API Docs](API.md) | [👥 Contributors](../CONTRIBUTORS.md)

</div>
