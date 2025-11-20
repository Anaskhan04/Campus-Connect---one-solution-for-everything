# Campus Connect - Full Stack Application

A comprehensive campus management system with student, faculty, and event management features.

## 🚀 Features

- **User Authentication**: Login/Signup with role-based access (Student/Faculty)
- **Student Profiles**: Create and manage student profiles
- **Faculty Profiles**: Faculty profile management
- **Events Management**: Create, edit, and delete campus events
- **Complaints System**: Submit and track complaints
- **Notice Board**: Faculty can post notices
- **Attendance Tracking**: Track student attendance
- **To-Do Lists**: Personal task management
- **File Uploads**: Profile image and document uploads

## 📁 Project Structure

```
├── backend/              # Node.js/Express backend
│   ├── config/          # Database configuration
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   └── server.js        # Main server file
├── js/                  # Frontend JavaScript
│   ├── api.js          # API service layer
│   ├── script.js       # Main application logic
│   └── ...             # Other modules
├── pages/              # HTML pages
└── css/                # Stylesheets
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure `.env` file:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/campusconnect
   JWT_SECRET=your-super-secret-jwt-key-change-this
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start MongoDB:**
   - Local: Make sure MongoDB is running
   - Atlas: Use your MongoDB Atlas connection string

6. **Start the server:**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Update API URL (if needed):**
   - Open `js/api.js`
   - Update `API_BASE_URL` if your backend is hosted elsewhere
   - Or set environment variable `VITE_API_URL` if using Vite

2. **Serve the frontend:**
   - Use any static file server
   - Or use a simple HTTP server:
     ```bash
     # Python
     python -m http.server 3000
     
     # Node.js
     npx serve -p 3000
     ```

3. **Open in browser:**
   - Navigate to `http://localhost:3000` (or your server port)

## 🌐 Deployment

### Backend Deployment (Render/Railway/Vercel)

1. **Push to GitHub**

2. **Deploy on Render:**
   - Create new Web Service
   - Connect GitHub repository
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`
   - Add environment variables:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `PORT` (auto-set by Render)
     - `FRONTEND_URL` (your frontend URL)

3. **Update Frontend API URL:**
   - Update `API_BASE_URL` in `js/api.js` to your backend URL

### Frontend Deployment (Netlify/Vercel)

1. **Deploy on Netlify:**
   - Connect GitHub repository
   - Build command: (leave empty for static site)
   - Publish directory: `/` (root)
   - Add environment variable: `VITE_API_URL` = your backend URL

2. **Or deploy on Vercel:**
   - Import GitHub repository
   - Framework preset: Other
   - Build command: (leave empty)
   - Output directory: `/`

### MongoDB Atlas Setup

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env` file

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `PUT /api/auth/profile-image` - Update profile image
- `GET /api/auth/me` - Get current user

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:username` - Get student by username
- `POST /api/students` - Create student profile
- `PUT /api/students/:username` - Update student profile

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Complaints
- `GET /api/complaints` - Get user's complaints
- `POST /api/complaints` - Create complaint
- `DELETE /api/complaints/:id` - Delete complaint

### Notices
- `GET /api/notices` - Get all notices
- `POST /api/notices` - Create notice (faculty only)
- `DELETE /api/notices/:id` - Delete notice (faculty only)

### Attendance
- `GET /api/attendance/:username` - Get attendance
- `GET /api/attendance/:username/stats` - Get attendance stats
- `POST /api/attendance` - Add attendance record

### Todos
- `GET /api/todos` - Get user's todos
- `POST /api/todos` - Create todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection
- Verify `.env` file exists and has correct values
- Check if port 5000 is available

### Frontend can't connect to backend
- Verify backend is running
- Check CORS settings in `backend/server.js`
- Update `API_BASE_URL` in `js/api.js`

### Database connection errors
- Verify MongoDB is running (if local)
- Check MongoDB Atlas connection string
- Ensure network access is configured in Atlas

## 📝 Notes

- Passwords are hashed using bcrypt
- Images are stored as base64 (consider using cloud storage for production)
- JWT tokens expire after 7 days
- All API responses follow RESTful conventions

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available for educational purposes.

