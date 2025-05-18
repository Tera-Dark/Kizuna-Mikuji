@echo off
echo Starting Kizuna-Mikuji application...
echo.
echo This will launch the development server on port 8080
echo and automatically open it in your default browser.
echo.
echo Please wait...
echo.

:: Start the development server with basic configuration
npx vite --config vite.config.basic.js --port 8080 --open

echo.
echo If browser didn't open automatically, please visit:
echo http://localhost:8080
echo.
echo Press any key to exit...
pause > nul 