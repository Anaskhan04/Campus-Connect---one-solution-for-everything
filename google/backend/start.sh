#!/bin/bash

echo "===================================="
echo "  Campus Connect Backend Server"
echo "===================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "ERROR: .env file not found!"
    echo ""
    echo "Please create a .env file with:"
    echo "  PORT=5000"
    echo "  MONGODB_URI=your_mongodb_connection_string"
    echo "  JWT_SECRET=your-secret-key"
    echo "  FRONTEND_URL=http://localhost:3000"
    echo ""
    exit 1
fi

echo "Starting server..."
echo ""
node server.js



