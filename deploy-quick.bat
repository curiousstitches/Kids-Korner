@echo off
:: ========================================
:: Kids Korner - Quick Deploy Script
:: ========================================

:: Kill all existing processes
echo [1/4] Stopping existing servers...
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM ngrok.exe >nul 2>&1
echo     [DONE] Servers stopped

:: Set environment and start Flask
:: Keys load from keys.local.bat if it exists (example format: OPENROUTER_API_KEY=sk-or-v1-your-api-key-here)
echo [2/4] Setting environment variables...
if exist keys.local.bat (
    call keys.local.bat
    echo     [DONE] Keys loaded from keys.local.bat
) else (
    set /p OPENROUTER_API_KEY=Enter OPENROUTER_API_KEY ^(example: sk-or-v1-your-api-key-here^):
    if "%OPENROUTER_API_KEY%"=="" (
        echo     [WARN] No key entered - Buddy will run in no-key mode
    ) else (
        echo     [DONE] OPENROUTER_API_KEY set
    )
)

echo [3/4] Starting Flask server...
cd /d "C:\Users\thego\Desktop\kids-Korner"
start /B python app.py
timeout /t 2 /nobreak >nul
echo     [DONE] Flask server running on port 8081

:: Start ngrok
echo [4/4] Starting ngrok tunnel...
start /B ngrok http 8081
timeout /t 3 /nobreak >nul
echo     [DONE] ngrok tunnel active

echo.
echo ========================================
echo   🎉 DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo   Local:  http://localhost:8081
echo   Online: https://kids-korner.onrender.com
echo.
echo   SERVER READY!
echo.
pause