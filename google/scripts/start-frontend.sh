#!/bin/bash

echo "===================================="
echo "  Campus Connect Frontend"
echo "===================================="
echo ""
echo "Starting web server on port 3000..."
echo ""
echo "Open your browser and go to:"
echo "  http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Try Python first
if command -v python3 &> /dev/null; then
    echo "Using Python server..."
    python3 -m http.server 3000
elif command -v python &> /dev/null; then
    echo "Using Python server..."
    python -m http.server 3000
else
    echo "Using Node.js serve..."
    npx serve -p 3000
fi



