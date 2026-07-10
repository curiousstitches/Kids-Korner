@echo off
echo ========================================
echo Kids Korner - Deploy Script
echo ========================================
echo.

echo [1/4] Stopping existing servers...
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM ngrok.exe >nul 2>&1
echo     [DONE] Servers stopped

echo [2/4] Starting Flask server...
cd /d "%~dp0.."
if not exist app.py cd /d "%~dp0"
:: Keys live in keys.local.bat (NOT in git - see .gitignore). Copy keys.local.bat.example to get started.
if exist keys.local.bat (
    call keys.local.bat
    echo     [OK] Keys loaded from keys.local.bat
) else (
    echo     [WARN] keys.local.bat not found - running in no-key mode ^(Buddy Mode fallback^)
)
start /B python app.py
timeout /t 3 /nobreak >nul
echo     [DONE] Flask server running

echo [3/4] Starting ngrok tunnel...
start /B ngrok http 8081
timeout /t 3 /nobreak >nul
echo     [DONE] ngrok tunnel active

echo [4/4] Pushing to GitHub...
git add .
git commit -m "Update Buddy AI" 2>nul
git push origin main
echo     [DONE] Changes pushed

echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo   Local:  http://localhost:8081
echo   Online: https://kids-korner.onrender.com
echo.
echo   Set OPENROUTER_API_KEY in Render dashboard!
echo.
pause