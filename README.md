# Campus Connect - Full Stack University Portal

A modern campus management system built with a **React/Vite** frontend and a **Node.js/Express** backend.

## 🚀 Unified Architecture

The project is split into two main components:
- **Frontend**: Located in `/frontend-modern` (React + TypeScript + Tailwind)
- **Backend**: Located in `/google/backend` (Node.js + MongoDB + Socket.io)

## ✨ Core Features

- **Personalized Dashboards**: Role-based views for Students and Faculty.
- **Smart Directory**: Searchable directory for Students and Faculty with server-side filtering.
- **Academic Resources**: Centralized hub for lecture notes, research, and documents.
- **Attendance & Subjects**: Integrated tracking with real-time stats.
- **Notice Board**: Instant campus-wide announcements.
- **Complaints System**: Transparent student feedback and resolution tracking.
- **Global Search**: Search everything (students, events, notices) from anywhere (`Ctrl + K`).
- **Real-time Notifications**: Instant updates via WebSockets.

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 2. Backend Setup (`/google/backend`)
```bash
cd google/backend
npm install
# Ensure .env is configured (see .env.example)
npm start
```
*Backend runs on `http://localhost:5001`*

### 3. Frontend Setup (`/frontend-modern`)
```bash
cd frontend-modern
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

## 📁 Project Structure

```
├── frontend-modern/      # React + Vite + Tailwind (Modern UI)
│   ├── src/
│   │   ├── components/  # UI & Layout components
│   │   ├── pages/      # Route pages
│   │   └── lib/        # API client & utilities
├── google/
│   └── backend/        # Node.js + Express + Mongoose
│       ├── routes/     # API Endpoints
│       ├── models/     # Database Schemas
│       └── services/   # Business logic
```

## 📡 API Endpoints

- `POST /api/auth/login` - Secure login
- `GET /api/search` - Global unified search
- `GET /api/students` - Student directory
- `GET /api/faculty` - Faculty directory
- `POST /api/attendance` - Log attendance

## 🤝 Contributing

This project is a modern migration of the legacy Campus Connect platform. Documentation and codebase are audited for performance and security.

## 📄 License

Open source project for educational and campus management purposes.
sues and enhancement requests!

## 📄 License

This project is open source and available for educational purposes.
