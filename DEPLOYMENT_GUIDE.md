# 🚀 WASALNI Deployment Guide

## Phase 2: Deploy to Production (Render + Vercel)

This guide will deploy WASALNI to the internet for everyone to access.

---

## ✨ Overview

| Component | Platform | Cost | Time |
|-----------|----------|------|------|
| **Backend API** | Render | Free tier (500 hours/month) | 5 min |
| **Frontend** | Vercel | Free tier (100 GB/month) | 3 min |
| **Database** | MongoDB Atlas | Free tier (512 MB) | Already done |
| **Total Setup** | - | **FREE** | ~10 min |

---

## 📋 Prerequisites

You need:
1. ✅ GitHub Account (to host code)
2. ✅ Render Account (for backend)
3. ✅ Vercel Account (for frontend)
4. ✅ MongoDB Atlas Account (already have)

---

## 🔧 Step 1: Push Code to GitHub

### 1.1 Create GitHub Repository

1. Go to: https://github.com/new
2. Create repository: **wasalni**
3. Don't initialize with README (we have one)
4. Click **"Create Repository"**

### 1.2 Push Your Code

```bash
cd c:\Users\Lenovo\Desktop\WASALNI

# Initialize Git (if not already done)
git init
git add .
git commit -m "Initial commit: WASALNI ride-sharing app"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/wasalni.git
git branch -M main
git push -u origin main
```

---

## 🚀 Step 2: Deploy Backend to Render

### 2.1 Sign Up / Login to Render

1. Go to: https://render.com
2. Sign up with GitHub (easiest)
3. Authorize Render

### 2.2 Create New Web Service

1. Dashboard → **New +** → **Web Service**
2. **Connect Repository:**
   - Search for **"wasalni"**
   - Click **Connect**

3. **Configure Service:**
   - **Name:** `wasalni-backend`
   - **Root Directory:** `backend`
   - **Runtime:** Node.js
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

4. **Set Environment Variables:**
   - **Add Manual Environment Variables:**

   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://taiebmohamed_db_user:6hYCiCBVByjoQFTf@cluster0.ycqw9dq.mongodb.net/wasalni?retryWrites=true&w=majority
   JWT_SECRET=wasalni_secret_jwt_key_change_in_production_2024
   JWT_REFRESH_SECRET=wasalni_refresh_secret_key_change_in_production_2024
   JWT_EXPIRY=7d
   JWT_REFRESH_EXPIRY=30d
   FRONTEND_URL=https://your-vercel-url.vercel.app
   ```

5. **Plan:** Select **Free** tier
6. Click **Create Web Service**

### 2.3 Wait for Deployment

- Build will take 2-3 minutes
- Once complete, you'll get a URL like: `https://wasalni-backend.onrender.com`
- **Copy this URL** - you'll need it for frontend

✅ **Backend is now live!**

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Sign Up / Login to Vercel

1. Go to: https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

### 3.2 Import Project

1. Dashboard → **Add New** → **Project**
2. **Import Git Repository:**
   - Search for **"wasalni"**
   - Click **Import**

3. **Configure Project:**
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install`
   - **Output Directory:** `dist`
   - **Root Directory:** `Cross-platform ride-sharing app`

4. **Set Environment Variables:**
   - Add these variables:

   ```
   VITE_API_BASE_URL=https://wasalni-backend.onrender.com/api
   ```

   (Replace with your actual Render backend URL)

5. Click **Deploy**

### 3.3 Wait for Deployment

- Build will take 1-2 minutes
- Your frontend URL will be: `https://wasalni.vercel.app` (or similar)
- ✅ **Frontend is now live!**

---

## 🌐 Step 4: Update Backend for Frontend URL

Now that you have your Vercel URL, update the backend:

1. Go to **Render Dashboard**
2. Select **wasalni-backend**
3. Settings → **Environment Variables**
4. Update `FRONTEND_URL` with your Vercel URL:
   ```
   FRONTEND_URL=https://your-wasalni.vercel.app
   ```
5. Click **Save** (will trigger redeploy)

---

## 🧪 Step 5: Test Live Application

### 5.1 Test Frontend

1. Open your Vercel URL in browser
2. Check if it loads properly
3. Test registration and login

### 5.2 Test Backend API

1. Open in terminal:
```bash
curl -X GET https://wasalni-backend.onrender.com/api/health
```

2. You should see a response like:
```json
{"status": "ok"}
```

### 5.3 Test Database Connection

1. Go to MongoDB Atlas dashboard
2. Click your cluster → **Collections**
3. Verify you see test data (if seeded)

---

## 📦 Update Frontend to Use Backend API

Edit: `Cross-platform ride-sharing app/src/app/pages/Login.tsx` and other API calls:

**Change from:**
```typescript
const apiUrl = 'http://localhost:5000/api';
```

**To:**
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
```

Then update your API calls to use:
```typescript
const response = await fetch(`${apiUrl}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(credentials)
});
```

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render
- [ ] Backend URL obtained
- [ ] Frontend deployed to Vercel
- [ ] Vercel URL obtained
- [ ] Environment variables set correctly
- [ ] Frontend loads in browser
- [ ] API calls working
- [ ] Database connected
- [ ] Ready for public users!

---

## 🔗 Live URLs After Deployment

Once deployed, share these public URLs:

**Frontend (User Interface):**
```
https://wasalni.vercel.app
```

**Backend API (For mobile apps):**
```
https://wasalni-backend.onrender.com/api
```

---

## 🐛 Troubleshooting

### Backend deployment fails
- Check build logs in Render dashboard
- Verify `npm run build` works locally
- Ensure all environment variables are set

### Frontend shows blank page
- Check browser console for errors
- Verify `VITE_API_BASE_URL` is correct
- Run `npm run build` locally to test

### API calls fail from frontend
- Check CORS settings in backend
- Verify `FRONTEND_URL` in backend matches Vercel URL
- Check API endpoint paths

### Database connection fails on production
- Verify MongoDB Atlas IP whitelist includes:
  - Render IP: 0.0.0.0/0 (allow from anywhere for cloud)
  - Vercel doesn't need IP whitelist (uses frontend only)

---

## 📱 Next Steps

1. ✅ Test live application with friends
2. ✅ Set up custom domain (optional)
3. ✅ Enable email verification
4. ✅ Set up payment processing
5. ✅ Monitor performance

---

## 💡 Production Improvements

Before going fully live, consider:

1. **Security:**
   - Change JWT_SECRET to a random, long string
   - Enable HTTPS (auto on Render/Vercel)
   - Add rate limiting

2. **Performance:**
   - Enable caching
   - Compress responses
   - Optimize database queries

3. **Monitoring:**
   - Set up error tracking (Sentry)
   - Monitor API performance
   - Track user metrics

---

## 🎉 Congratulations!

Your WASALNI app is now live on the internet! 🚀

Share your URLs with users and start accepting ride bookings!

