# Deployment Guide: Campus Connect (Modern)

This guide explains how to deploy the unified Campus Connect architecture (React Frontend + Node.js Backend).

---

## 🏗️ Architecture Overview
- **Backend**: Express API in `/google/backend`
- **Frontend**: Vite/React App in `/frontend-modern`

---

## 🌐 1. Backend Deployment (e.g., [Render.com](https://render.com))

Render is recommended for hosting the Node.js Express server.

1. **Create New Web Service**: Link your GitHub repository.
2. **Root Directory**: Set to `google/backend`.
3. **Build Command**: `npm install`
4. **Start Command**: `node server.js`
5. **Environment Variables**:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A long random string (e.g., 64 characters).
   - `PORT`: Usually auto-set by Render (default 5001 in code).
   - `FRONTEND_URL`: The URL of your deployed frontend (e.g., `https://your-app.vercel.app`).

---

## 🖼️ 2. Frontend Deployment (e.g., [Vercel](https://vercel.com) or [Netlify](https://netlify.com))

These platforms are optimized for static Vite/React apps.

1. **Create New Project**: Link your GitHub repository.
2. **Framework Preset**: Choose **Vite**.
3. **Root Directory**: Set to `frontend-modern`.
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Environment Variables**:
   - `VITE_API_URL`: (Optional) Your deployed backend URL (e.g., `https://your-api.onrender.com`).
   - *Note: The frontend `api.ts` is configured to auto-detect the backend if it's on the same domain or specified here.*

---

## 🗄️ 3. Database (MongoDB Atlas)

1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Network Access** and add `0.0.0.0/0` (Allow access from anywhere) so Render can connect.
3. Copy the **Connection String** and use it as `MONGODB_URI` in your backend settings.

---

## 🔒 4. Post-Deployment Checklist

- [ ] Verify you can log in on the production URL.
- [ ] Check console logs for any CORS errors (fix by updating `FRONTEND_URL` in backend env).
- [ ] Ensure `JWT_SECRET` is rotated to something secure for production.

---
**Happy Deploying!** 🚀🤙
