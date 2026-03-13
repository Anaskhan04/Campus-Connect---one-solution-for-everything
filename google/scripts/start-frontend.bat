@echo off
echo ====================================
echo   Campus Connect Frontend
echo ====================================
echo.
echo Starting web server on port 3000...
echo.
echo Open your browser and go to:
echo   http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Try Python first
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python server...
    python -m http.server 3000
) else (
    echo Python not found, using Node.js serve...
    npx serve -p 3000
)

pause



