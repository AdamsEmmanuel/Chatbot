# ⚡ Quick Start - 5 Minutes to Production

Get your chatbot running in production with minimal setup.

## 🚀 Fastest Deployment (2 Commands)

### 1. Deploy Backend (Railway - Free Tier)
\`\`\`bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway deploy --service backend
\`\`\`

### 2. Deploy Frontend (Vercel - Free Tier)
\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
\`\`\`

## 🔧 Environment Setup (1 Minute)

### Backend Environment (Railway Dashboard)
\`\`\`
DATABASE_URL=mysql://user:pass@host:port/db  # Railway provides this
JWT_SECRET_KEY=your-secret-key-here
CORS_ORIGINS=https://your-vercel-app.vercel.app
\`\`\`

### Frontend Environment (Vercel Dashboard)
\`\`\`
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
\`\`\`

## ✅ Verification

1. **Backend Health:** Visit `https://your-railway-app.railway.app/health`
2. **Frontend:** Visit `https://your-vercel-app.vercel.app`
3. **Full Flow:** Register → Login → Chat

## 🎯 Production URLs

- **Frontend:** `https://your-app.vercel.app`
- **Backend API:** `https://your-app.railway.app`
- **API Docs:** `https://your-app.railway.app/docs`

## 🔄 Updates

\`\`\`bash
# Any code changes auto-deploy on git push
git add .
git commit -m "Update"
git push origin main
\`\`\`

**That's it!** Your chatbot is live and ready for users.

---

For detailed setup options, see [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md)
