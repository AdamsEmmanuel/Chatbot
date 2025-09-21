# 🚀 Production Setup Guide - Complete Chatbot System

This guide provides step-by-step instructions to deploy your complete chatbot system (frontend + backend) to production with just API keys and server links.

## 📋 Prerequisites

- Node.js 18+ and Python 3.11+
- Docker and Docker Compose (optional but recommended)
- Domain name (optional)
- Cloud hosting account (Vercel, Render, Railway, etc.)

## 🎯 Quick Production Deployment

### Option 1: One-Click Deployment (Recommended)

#### Frontend (Vercel)
1. **Deploy Frontend to Vercel:**
   \`\`\`bash
   # Push your code to GitHub
   git add .
   git commit -m "Production ready chatbot"
   git push origin main
   
   # Deploy to Vercel (automatic if connected to GitHub)
   # Or use Vercel CLI:
   npx vercel --prod
   \`\`\`

2. **Set Environment Variables in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.com`

#### Backend (Render/Railway)

**For Render:**
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `cd backend && pip install -r requirements.txt`
4. Set start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (see Backend Environment Variables section)

**For Railway:**
1. Connect GitHub repository
2. Select `backend` folder as root
3. Railway auto-detects Python and sets up deployment
4. Add environment variables in Railway dashboard

### Option 2: Docker Deployment

#### Quick Docker Setup
\`\`\`bash
# Clone and setup
git clone <your-repo>
cd <your-repo>

# Copy environment files
cp backend/.env.prod.example backend/.env.prod
cp .env.local.example .env.local

# Edit environment files with your values
nano backend/.env.prod  # Add your database URL, JWT secret, etc.
nano .env.local         # Add your backend API URL

# Deploy with Docker
docker-compose -f backend/docker-compose.prod.yml up -d
\`\`\`

## 🔧 Environment Configuration

### Frontend Environment Variables (.env.local)
\`\`\`env
# Required: Backend API URL
NEXT_PUBLIC_API_URL=https://your-backend-api.com

# Optional: Feature flags
NEXT_PUBLIC_ENABLE_VOICE=true
NEXT_PUBLIC_ENABLE_PREMIUM=true
\`\`\`

### Backend Environment Variables (.env.prod)
\`\`\`env
# Database (Required)
DATABASE_URL=mysql://user:password@host:port/database

# JWT Security (Required)
JWT_SECRET_KEY=your-super-secret-jwt-key-here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS (Required)
CORS_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com

# Application
ENVIRONMENT=production
DEBUG=false
HOST=0.0.0.0
PORT=8000

# Optional: AI Integration
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
\`\`\`

## 🗄️ Database Setup

### Option 1: Managed Database (Recommended)

**PlanetScale (MySQL):**
1. Create account at planetscale.com
2. Create database
3. Get connection string
4. Add to `DATABASE_URL` in backend environment

**Supabase (PostgreSQL):**
1. Create project at supabase.com
2. Get database URL from Settings → Database
3. Update backend to use PostgreSQL (change SQLAlchemy dialect)

**Railway MySQL:**
1. Add MySQL plugin to your Railway project
2. Copy connection string to `DATABASE_URL`

### Option 2: Self-Hosted Database
\`\`\`bash
# Using Docker
docker run -d \
  --name chatbot-mysql \
  -e MYSQL_ROOT_PASSWORD=your-root-password \
  -e MYSQL_DATABASE=chatbot \
  -e MYSQL_USER=chatbot_user \
  -e MYSQL_PASSWORD=your-password \
  -p 3306:3306 \
  mysql:8.0

# Connection string
DATABASE_URL=mysql://chatbot_user:your-password@localhost:3306/chatbot
\`\`\`

## 🚀 Deployment Steps

### Step 1: Prepare Your Code
\`\`\`bash
# Ensure all dependencies are installed
cd backend && pip install -r requirements.txt
cd .. && npm install

# Test locally
npm run dev  # Frontend on :3000
cd backend && uvicorn main:app --reload  # Backend on :8000
\`\`\`

### Step 2: Deploy Backend
Choose one deployment method:

**Render:**
1. Connect GitHub repo
2. Create Web Service
3. Set environment variables
4. Deploy automatically

**Railway:**
1. Connect GitHub repo
2. Add environment variables
3. Deploy with one click

**DigitalOcean App Platform:**
1. Create new app from GitHub
2. Configure build/run commands
3. Set environment variables
4. Deploy

### Step 3: Deploy Frontend
\`\`\`bash
# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
npm run build
# Upload dist folder to Netlify
\`\`\`

### Step 4: Configure Domain (Optional)
1. **Backend:** Add custom domain in your hosting platform
2. **Frontend:** Add custom domain in Vercel/Netlify
3. **Update CORS:** Add your custom domains to `CORS_ORIGINS`

## 🔒 Security Checklist

- [ ] Strong JWT secret key (32+ characters)
- [ ] HTTPS enabled on both frontend and backend
- [ ] CORS properly configured with your domains
- [ ] Database credentials secured
- [ ] Environment variables not committed to git
- [ ] Rate limiting enabled (built into FastAPI)
- [ ] Input validation active (Pydantic models)

## 📊 Monitoring & Maintenance

### Health Checks
- Backend health: `https://your-api.com/health`
- Database status: `https://your-api.com/health/db`

### Logs
- **Render:** View logs in dashboard
- **Railway:** Built-in log viewer
- **Vercel:** Function logs in dashboard

### Updates
\`\`\`bash
# Update backend
git pull origin main
# Hosting platforms auto-deploy on git push

# Update frontend
git pull origin main
vercel --prod  # Or auto-deploy via GitHub integration
\`\`\`

## 🆘 Troubleshooting

### Common Issues

**CORS Errors:**
- Add your frontend domain to `CORS_ORIGINS`
- Include both `https://domain.com` and `https://www.domain.com`

**Database Connection:**
- Verify `DATABASE_URL` format
- Check database server is running
- Ensure network access (whitelist IPs if needed)

**Authentication Issues:**
- Verify `JWT_SECRET_KEY` is set
- Check token expiration settings
- Ensure HTTPS for production

**API Not Responding:**
- Check backend deployment logs
- Verify environment variables are set
- Test health endpoint: `/health`

### Support
- Check deployment logs in your hosting platform
- Test API endpoints with curl or Postman
- Verify environment variables are properly set

## 🎉 Success!

Your chatbot is now production-ready! Users can:
- ✅ Register and login securely
- ✅ Chat with AI in real-time
- ✅ Use voice interactions
- ✅ Manage settings and preferences
- ✅ Access chat history
- ✅ Enjoy responsive design on all devices

**Next Steps:**
- Set up monitoring and analytics
- Configure backup strategies
- Plan scaling for increased traffic
- Add premium features
- Implement user feedback systems

---

**Need Help?** Check the full [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed platform-specific instructions.
