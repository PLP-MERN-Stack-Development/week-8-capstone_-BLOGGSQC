# 🚀 EduTech Pro - Complete Setup Instructions

## 📋 Prerequisites

Before setting up the School Management System, ensure you have the following installed:

- **Node.js** (version 18.0 or higher) - [Download here](https://nodejs.org/)
- **MongoDB Atlas Account** - [Sign up here](https://www.mongodb.com/atlas)
- **Cloudinary Account** (for file uploads) - [Sign up here](https://cloudinary.com/)
- **Git** - [Download here](https://git-scm.com/)

### VS Code Settings
Add these settings to your VS Code `settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

## 📁 Project Structure Overview

```
EduTech-Pro/
├── Client/                 # Frontend React Application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── Server/                 # Backend Node.js Application
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── package.json
│   └── ...
├── SETUP_INSTRUCTIONS.md
└── README.md
```

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the free tier)
4. Wait for cluster creation (5-10 minutes)

### 2. Configure Database Access
1. Go to **Database Access** in the left sidebar
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Create username and password (save these!)
5. Set **Database User Privileges** to **Read and write to any database**
6. Click **Add User**

### 3. Configure Network Access
1. Go to **Network Access** in the left sidebar
2. Click **Add IP Address**
3. Choose **Allow Access from Anywhere** (for development)
4. Click **Confirm**

### 4. Get Connection String
1. Go to **Clusters** and click **Connect**
2. Choose **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your database user password

## ☁️ Cloudinary Setup (File Storage)

### 1. Create Cloudinary Account
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Get API Credentials
1. Go to your **Dashboard**
2. Copy the following values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## 🔧 Backend Setup (Server)

### 1. Navigate to Server Directory
```bash
cd Server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the Server directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit the `.env` file with your actual values:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edutech-pro?retryWrites=true&w=majority
DB_NAME=edutech-pro

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration (optional for development)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=EduTech Pro <noreply@edutech-pro.com>

# Security Configuration
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,ppt,pptx,jpg,jpeg,png,gif,mp4,avi,mov
```

### 4. Seed the Database (Optional but Recommended)
```bash
npm run seed
```

This will create sample data including:
- Admin, teacher, student, and parent accounts
- Sample classes and subjects
- Mock attendance and grade data

### 5. Start the Backend Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 🎨 Frontend Setup (Client)

### 1. Open New Terminal
Keep the backend server running and open a new terminal

### 2. Navigate to Client Directory
```bash
cd Client
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Configuration
Create a `.env` file in the Client directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=EduTech Pro
VITE_ENVIRONMENT=development
```

### 5. Start the Frontend Development Server
```bash
npm run dev
```

The application will start on `http://localhost:3000`

## 🔑 Demo Credentials

After seeding the database, use these credentials to test different user roles:

### Admin Account
- **Email**: admin@edutech-pro.com
- **Password**: Admin123!
- **Access**: Full system administration

### Teacher Account
- **Email**: sarah.johnson@edutech-pro.com
- **Password**: Teacher123!
- **Access**: Class management, grading, attendance

### Student Account
- **Email**: john.smith@student.edutech-pro.com
- **Password**: Student123!
- **Access**: View grades, assignments, attendance

### Parent Account
- **Email**: robert.smith@parent.edutech-pro.com
- **Password**: Parent123!
- **Access**: Monitor child's progress

## 🧪 Testing the Application

### 1. Access the Application
Open your browser and go to `http://localhost:3000`

### 2. Test Login
1. Click on the **Login** button
2. Use any of the demo credentials above
3. Verify you're redirected to the appropriate dashboard

### 3. Test Navigation
1. Use the sidebar to navigate between different sections
2. Test responsive design by resizing the browser
3. Verify all buttons and interactions work

### 4. Test API Endpoints
Use Thunder Client or Postman to test API endpoints:

```bash
# Health check
GET http://localhost:5000/health

# Login
POST http://localhost:5000/api/auth/login
{
  "email": "admin@edutech-pro.com",
  "password": "Admin123!"
}

# Get students (requires auth token)
GET http://localhost:5000/api/students
Authorization: Bearer <your-token>
```

## 🚀 Production Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Build the Frontend**
   ```bash
   cd Client
   npm run build
   ```

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   In Vercel dashboard, add:
   ```env
   VITE_API_URL=https://your-backend-domain.com/api
   VITE_APP_NAME=EduTech Pro
   VITE_ENVIRONMENT=production
   ```

### Backend Deployment (Render/Railway)

#### Option 1: Render
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from your `.env` file

#### Option 2: Railway
1. Connect your GitHub repository to Railway
2. Deploy the Server directory
3. Add environment variables
4. Railway will automatically detect and deploy

### Environment Variables for Production

**Backend (.env)**:
```env
NODE_ENV=production
MONGODB_URI=<your-production-mongodb-uri>
JWT_SECRET=<strong-production-secret>
FRONTEND_URL=<your-frontend-domain>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
```

**Frontend (.env)**:
```env
VITE_API_URL=<your-backend-domain>/api
VITE_APP_NAME=EduTech Pro
VITE_ENVIRONMENT=production
```

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```bash
Error: MongoNetworkError: failed to connect to server
```
**Solution**: 
- Check your MongoDB Atlas connection string
- Ensure your IP is whitelisted in Network Access
- Verify username and password are correct

#### 2. CORS Error
```bash
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**:
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check CORS configuration in `server.js`

#### 3. JWT Token Error
```bash
JsonWebTokenError: invalid token
```
**Solution**:
- Clear localStorage in browser
- Check `JWT_SECRET` in backend `.env`
- Ensure token is being sent in Authorization header

#### 4. File Upload Error
```bash
MulterError: File too large
```
**Solution**:
- Check `MAX_FILE_SIZE` in backend `.env`
- Verify Cloudinary configuration
- Ensure file types are allowed

### Development Tips

1. **Hot Reload Issues**: Restart both servers if hot reload stops working
2. **Database Changes**: Re-run seed script after schema changes
3. **Cache Issues**: Clear browser cache and localStorage
4. **Port Conflicts**: Change ports in package.json if 3000/5000 are occupied

## 📊 Performance Monitoring

### Frontend Performance
```bash
# Analyze bundle size
npm run build
npm run preview
```

### Backend Performance
```bash
# Monitor server logs
npm run dev

# Check database performance in MongoDB Atlas dashboard
```

## 🔒 Security Checklist

### Development
- [ ] Use HTTPS in production
- [ ] Secure JWT secrets
- [ ] Validate all inputs
- [ ] Implement rate limiting
- [ ] Use environment variables for secrets

### Production
- [ ] Change default passwords
- [ ] Enable MongoDB authentication
- [ ] Configure proper CORS origins
- [ ] Set up SSL certificates
- [ ] Monitor for security vulnerabilities

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Cloudinary Docs](https://cloudinary.com/documentation)

### Learning Resources
- [React Query Tutorial](https://react-query.tanstack.com/)
- [Framer Motion Guide](https://www.framer.com/motion/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 🆘 Getting Help

If you encounter issues:

1. **Check the Console**: Look for error messages in browser/terminal
2. **Review Logs**: Check server logs for detailed error information
3. **Database Issues**: Use MongoDB Atlas monitoring tools
4. **API Testing**: Use Thunder Client or Postman to test endpoints
5. **Community Support**: Search for solutions on Stack Overflow

## 🎉 Success Indicators

Your setup is successful when:

- [ ] Both frontend and backend servers start without errors
- [ ] You can login with demo credentials
- [ ] Navigation between pages works smoothly
- [ ] API calls return data successfully
- [ ] Database operations (CRUD) work correctly
- [ ] File uploads function properly
- [ ] Responsive design works on different screen sizes

---

**Congratulations!** 🎉 You now have a fully functional School Management System running locally. The system is production-ready and can be deployed to handle real educational institution needs.

For any questions or support, refer to the documentation or reach out to the development team.