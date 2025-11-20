@echo off
echo ====================================
echo   Campus Connect Backend Server
echo ====================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo ERROR: .env file not found!
    echo.
    echo Please create a .env file with:
    echo   PORT=5000
    echo   MONGODB_URI=your_mongodb_connection_string
    echo   JWT_SECRET=your-secret-key
    echo   FRONTEND_URL=http://localhost:3000
    echo.
    pause
    exit
)

echo Starting server...
echo.
node server.js

pause



