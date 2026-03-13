# Campus Connect - Modern Frontend

The primary user interface for Campus Connect, built with **React**, **TypeScript**, and **Tailwind CSS**.

## 🚀 Features

- **Responsive Design**: Mobile-first UI powered by Tailwind CSS.
- **Dynamic Routing**: Smooth navigation with `react-router-dom`.
- **Global Search**: Unified search interface for all campus data.
- **Real-time UI**: Polished interactions with `framer-motion` and `sonner` notifications.
- **Component Library**: High-quality UI components using Radix UI primitives.

## 🛠️ Development

### Setup
```bash
npm install
```

### Run Locally
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Build for Production
```bash
npm run build
```
Static files will be generated in the `/dist` folder.

## 📡 API Integration
This frontend connects to the backend API via `src/lib/api.ts`. It auto-detects if it's running in development or production to set the correct base URL.

