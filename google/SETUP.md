# Quick Setup Guide

## Step 1: Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create `.env` file:**
   - Copy `.env.example` to `.env`
   - Update with your MongoDB connection string
   - Set a strong JWT_SECRET

3. **Start MongoDB:**
   - Local: Make sure MongoDB is running
   - Or use MongoDB Atlas (free tier available)

4. **Start backend:**
   ```bash
   npm start
   ```
   Backend runs on `http://localhost:5000`

## Step 2: Frontend Setup

1. **Update API URL (if needed):**
   - Open `js/api.js`
   - Line 4: Update `API_BASE_URL` if backend is not on localhost:5000
   - For production, set to your deployed backend URL

2. **Serve frontend:**
   ```bash
   # Option 1: Python
   python -m http.server 3000
   
   # Option 2: Node.js
   npx serve -p 3000
   
   # Option 3: VS Code Live Server extension
   ```

3. **Open browser:**
   - Navigate to `http://localhost:3000`

## Step 3: Test the Application

1. **Sign up** with a new account (Student or Faculty)
2. **Login** with your credentials
3. **Create a profile** (Student or Faculty profile)
4. **Test features:**
   - Add events
   - Submit complaints
   - Create todos
   - Upload profile image

## Step 4: Deployment

### Backend (Render.com - Free)

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new Web Service
4. Connect GitHub repo
5. Settings:
   - Build: `cd backend && npm install`
   - Start: `cd backend && npm start`
6. Add environment variables:
   - `MONGODB_URI` (from MongoDB Atlas)
   - `JWT_SECRET` (any random string)
   - `FRONTEND_URL` (your frontend URL)

### Frontend (Netlify - Free)

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import from Git
4. Settings:
   - Build command: (leave empty)
   - Publish directory: `/`
5. Add environment variable:
   - `VITE_API_URL` = your backend URL from Render

### Update Frontend API URL

After deploying backend, update `js/api.js`:
```javascript
const API_BASE_URL = 'https://your-backend-url.onrender.com/api';
```

## Troubleshooting

- **Backend won't start:** Check MongoDB connection in `.env`
- **Frontend can't connect:** Verify backend URL in `js/api.js`
- **CORS errors:** Check `FRONTEND_URL` in backend `.env`

## Need Help?

Check the main `README.md` for detailed documentation.

