# Campus Connect Backend API

RESTful API for Campus Connect application built with Node.js, Express, and MongoDB.

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret

# Start server
npm start

# Or for development with auto-reload
npm run dev
```

## Environment Variables

Required environment variables in `.env`:

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `FRONTEND_URL` - Frontend URL for CORS (optional)

## API Documentation

All endpoints are prefixed with `/api`

### Authentication

- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (requires auth)
- `PUT /auth/profile-image` - Update profile image (requires auth)

### Students

- `GET /students` - Get all students
- `GET /students/:username` - Get student by username
- `POST /students` - Create student profile (requires auth)
- `PUT /students/:username` - Update student profile (requires auth)

### Events

- `GET /events` - Get all events
- `POST /events` - Create event (requires auth)
- `PUT /events/:id` - Update event (requires auth)
- `DELETE /events/:id` - Delete event (requires auth)

### Complaints

- `GET /complaints` - Get user's complaints (requires auth)
- `POST /complaints` - Create complaint (requires auth)
- `DELETE /complaints/:id` - Delete complaint (requires auth)

### Notices

- `GET /notices` - Get all notices
- `POST /notices` - Create notice (requires auth, faculty only)
- `DELETE /notices/:id` - Delete notice (requires auth, faculty only)

### Attendance

- `GET /attendance/:username` - Get attendance (requires auth)
- `GET /attendance/:username/stats` - Get attendance stats (requires auth)
- `POST /attendance` - Add attendance record (requires auth)

### Todos

- `GET /todos` - Get user's todos (requires auth)
- `POST /todos` - Create todo (requires auth)
- `PUT /todos/:id` - Update todo (requires auth)
- `DELETE /todos/:id` - Delete todo (requires auth)

### Upload

- `POST /upload/image` - Upload image (requires auth, max 2MB)

## Authentication

Include JWT token in Authorization header:

```
Authorization: Bearer <token>
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message"
}
```

Status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error
