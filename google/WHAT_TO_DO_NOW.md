# 🎯 WHAT TO DO RIGHT NOW - Super Simple!

## You Need to Do These 3 Things:

### 1️⃣ Get a FREE Database (5 minutes)
- Go to: **https://www.mongodb.com/cloud/atlas/register**
- Sign up (it's FREE, no credit card needed)
- Follow the steps in `QUICK_START.txt` to get your connection string
- **You'll get a string that looks like:** `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/campusconnect`

### 2️⃣ Set Up Backend (2 minutes)
1. Open Command Prompt or Terminal
2. Type these commands one by one:
   ```
   cd backend
   npm install
   ```
3. Create a file named `.env` in the `backend` folder
4. Copy this into the `.env` file (replace YOUR_CONNECTION_STRING with the string from step 1):
   ```
   PORT=5000
   MONGODB_URI=YOUR_CONNECTION_STRING
   JWT_SECRET=my-secret-key-12345
   FRONTEND_URL=http://localhost:3000
   ```
5. Type: `npm start`
6. **Keep this window open!** You should see: "🚀 Server running on port 5000"

### 3️⃣ Start Frontend (1 minute)
1. Open a **NEW** Command Prompt/Terminal window
2. Go to your project folder (NOT the backend folder)
3. Type: `python -m http.server 3000`
   - OR if that doesn't work: `npx serve -p 3000`
4. Open your browser
5. Go to: `http://localhost:3000`
6. **Done!** 🎉

---

## 📝 Example .env File

Your `backend/.env` file should look like this:

```
PORT=5000
MONGODB_URI=mongodb+srv://campusconnect:MyPassword123@cluster0.abc123.mongodb.net/campusconnect
JWT_SECRET=my-secret-key-12345
FRONTEND_URL=http://localhost:3000
```

---

## ❓ What If Something Goes Wrong?

**Problem:** "npm is not recognized"
- **Solution:** Install Node.js from https://nodejs.org/

**Problem:** "Cannot connect to MongoDB"
- **Solution:** Check your connection string in `.env` file. Make sure password is correct.

**Problem:** "Port 5000 already in use"
- **Solution:** Change `PORT=5000` to `PORT=5001` in `.env` file

**Problem:** Frontend shows errors
- **Solution:** Make sure backend is running (Step 2)

---

## 🆘 Still Confused?

Read `START_HERE.md` - it has detailed step-by-step instructions with pictures!

---

## ✅ Checklist

Do this checklist in order:

- [ ] Signed up for MongoDB Atlas (FREE)
- [ ] Got connection string from MongoDB
- [ ] Created `.env` file in `backend` folder
- [ ] Put connection string in `.env` file
- [ ] Ran `npm install` in backend folder
- [ ] Ran `npm start` in backend folder (and it's running!)
- [ ] Started frontend server (port 3000)
- [ ] Opened http://localhost:3000 in browser
- [ ] Can see the login page!

If all checked ✅, you're done! 🎉



