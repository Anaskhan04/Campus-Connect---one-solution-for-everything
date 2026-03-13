const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables.');
  process.exit(1);
}

// Connect to database
connectDB();

const app = express();
const modernRoot = path.resolve(__dirname, '..', '..', 'frontend-modern', 'dist');

// Middleware
app.use(helmet({ contentSecurityPolicy: false })); // Secure HTTP headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize()); // Prevent NoSQL injection attacks

// Rate limiter — auth routes only (5 attempts per 15 minutes)
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method !== 'POST', // only limit POST (login/signup), not GET
});

// API Routes
app.use('/api/auth', authRateLimiter, require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/faculty', require('./routes/faculty'));
app.use('/api/alumni', require('./routes/alumni'));
app.use('/api/events', require('./routes/events'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/todos', require('./routes/todos'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/search', require('./routes/search'));
app.use('/api/subjects', require('./routes/subjects'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Campus Connect API is running' });
});

// Serve modern frontend static files
app.use(express.static(modernRoot));

// Handle React routing, return all requests to React app
app.get('*', (req, res, next) => {
  // If request is for API, skip to next handlers
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(modernRoot, 'index.html'));
});

// Centralized Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Frontend available at http://localhost:${PORT}`);
});

// Initialize Socket.io
const io = require('./utils/socket').init(server);
const jwt = require('jsonwebtoken');

// Socket.io Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: Token missing'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // Attach user payload to socket
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
});

io.on('connection', socket => {
  console.log('Client connected authenticated as:', socket.user.username);
  
  // Use verified username from token instead of client-provided userId
  socket.on('join', () => {
    socket.join(socket.user.username);
    console.log(`User ${socket.user.username} joined their personal room`);
  });
});
