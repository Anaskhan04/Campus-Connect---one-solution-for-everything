# 🚀 START HERE - Simple Step-by-Step Guide

## What You Need to Do (In Order)

### STEP 1: Install Node.js (If you don't have it)
1. Go to: https://nodejs.org/
2. Download and install the LTS version
3. Restart your computer

**Check if installed:** Open terminal/command prompt and type:
```bash
node --version
```
If you see a version number, you're good! ✅

---

### STEP 2: Set Up MongoDB Database (Choose ONE option)

#### Option A: MongoDB Atlas (FREE - Recommended - Easiest)
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. Create a free cluster (click "Build a Database" → "Free" → "Create")
4. Create a database user:
   - Click "Database Access" → "Add New Database User"
   - Username: `campusconnect` (or any name)
   - Password: Create a strong password (SAVE THIS!)
   - Click "Add User"
5. Allow network access:
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for now)
   - Click "Confirm"
6. Get connection string:
   - Click "Database" → "Connect" → "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`)
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `campusconnect`
   - **SAVE THIS STRING** - You'll need it in Step 3!

#### Option B: Install MongoDB Locally (More Complex)
- Download from: https://www.mongodb.com/try/download/community
- Install and start MongoDB service
- Use connection string: `mongodb://localhost:27017/campusconnect`

---

### STEP 3: Set Up Backend

1. **Open terminal/command prompt in your project folder**

2. **Go to backend folder:**
   ```bash
   cd backend
   ```

3. **Install packages:**
   ```bash
   npm install
   ```
   (This will take 1-2 minutes - wait for it to finish)

4. **Create .env file:**
   - In the `backend` folder, create a new file named `.env`
   - Copy this content into it:
   ```
   PORT=5000
   MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING_HERE
   JWT_SECRET=my-super-secret-key-12345-change-this
   FRONTEND_URL=http://localhost:3000
   ```
   - Replace `YOUR_MONGODB_CONNECTION_STRING_HERE` with the string from Step 2
   - Save the file

5. **Start the backend:**
   ```bash
   npm start
   ```
   - You should see: `🚀 Server running on port 5000`
   - **KEEP THIS WINDOW OPEN** - Don't close it!

---

### STEP 4: Set Up Frontend

1. **Open a NEW terminal/command prompt window** (keep backend running!)

2. **Go to your project root folder** (not backend folder)

3. **Start a simple web server:**
   
   **Option A - Using Python (if you have it):**
   ```bash
   python -m http.server 3000
   ```
   
   **Option B - Using Node.js:**
   ```bash
   npx serve -p 3000
   ```
   (First time will ask to install - type `y` and press Enter)

4. **You should see:** Server running on port 3000

---

### STEP 5: Open the Website

1. Open your web browser
2. Go to: `http://localhost:3000`
3. You should see the login page!

---

### STEP 6: Test It!

1. Click "Signup" tab
2. Create an account:
   - Username: `testuser`
   - Password: `test123`
   - Role: `Student`
3. Click "Sign Up"
4. You should see: "Signup successful!"
5. Click "Login" tab
6. Login with your credentials
7. You should see the dashboard! 🎉

---

## ⚠️ Common Problems

### "Cannot find module" error
- Make sure you ran `npm install` in the backend folder
- Make sure you're in the correct folder

### "MongoDB connection error"
- Check your `.env` file has the correct connection string
- Make sure MongoDB Atlas cluster is running (green dot)
- Check your password in the connection string is correct

### "Port 5000 already in use"
- Close other programs using port 5000
- Or change PORT in `.env` to 5001

### Frontend shows errors
- Make sure backend is running (Step 3)
- Check browser console (F12) for errors
- Make sure you're using `http://localhost:3000` not `file://`

---

## 🎯 What's Happening?

- **Backend** = Your server (runs on port 5000)
- **Frontend** = Your website (runs on port 3000)
- **Database** = MongoDB (stores all your data)
- **API** = How frontend talks to backend

The frontend sends requests to the backend, which saves data to MongoDB.

---

## 📞 Need Help?

If something doesn't work:
1. Check which step you're on
2. Read the error message carefully
3. Check the "Common Problems" section above
4. Make sure both backend and frontend are running

---

## ✅ Checklist

- [ ] Node.js installed
- [ ] MongoDB Atlas account created
- [ ] Connection string copied
- [ ] Backend `.env` file created
- [ ] `npm install` completed in backend
- [ ] Backend running (port 5000)
- [ ] Frontend server running (port 3000)
- [ ] Website opens in browser
- [ ] Can create account and login

Once all checked, you're done! 🎉



