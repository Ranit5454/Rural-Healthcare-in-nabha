@echo off
echo ========================================
echo STARTING MEDIMATE BACKEND SERVER
echo ========================================
echo.

echo Checking if Node.js is installed...
node --version
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js not found!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Starting Medimate Healthcare Platform...
echo Server will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

npm start
