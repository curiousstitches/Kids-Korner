@echo off
:: ========================================
:: Kids Korner - Full Deploy Script
:: ========================================
:: Color codes: 0=Black, 1=Blue, 2=Green, 3=Aqua, 4=Red, 5=Magenta, 6=Yellow, 7=White
:: ========================================

:: Set color to cyan for header
color 03
echo.
echo ========================================
echo   KIDS KORNER - FULL DEPLOY SCRIPT
echo ========================================
echo.

:: Set color to yellow for status messages
color 06

:: [1] Kill all Python/Flask processes
echo.
echo [1/6] Stopping all local servers...
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM ngrok.exe >nul 2>&1
echo     [DONE] All local servers stopped
echo.

:: [2] Set environment variables
echo [2/6] Setting environment variables...
set OPENROUTER_API_KEY=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
echo     [DONE] OPENROUTER_API_KEY set
echo.

:: [3] Navigate to project directory
echo [3/6] Navigating to project directory...
cd /d "C:\Users\thego\Desktop\kids-Korner"
if exist "app.py" (
    echo     [DONE] In correct directory
) else (
    echo     [ERROR] app.py not found!
    pause
    exit /b 1
)
echo.

:: [4] Start Flask server
echo [4/6] Starting Flask server...
start /B python app.py
timeout /t 3 /nobreak >nul
echo     [DONE] Flask server started on port 8081
echo.

:: [5] Start ngrok tunnel
echo [5/6] Starting ngrok tunnel...
start /B ngrok http 8081
timeout /t 5 /nobreak >nul
echo     [DONE] ngrok tunnel established
echo.

:: [6] Push to GitHub
echo [6/6] Pushing to GitHub...
git status
git add .
set /p commit_msg=Enter commit message (or press Enter for default): 
if "%commit_msg%"=="" set commit_msg=Update Buddy AI
git commit -m "%commit_msg%"
git push origin main
echo     [DONE] Changes pushed to GitHub
echo.

:: Set color to green for success
color 02
echo.
echo ========================================
echo   ✅ DEPLOYMENT COMPLETE!
echo ========================================
echo.

:: Set color to cyan for URLs
color 03
echo   Local Access:  http://localhost:8081
echo   Online Access: https://kids-korner.onrender.com
echo.

:: Set color to magenta for instructions
color 05
echo   NEXT STEPS:
echo   1. Set OPENROUTER_API_KEY in Render dashboard
echo   2. Visit https://dashboard.render.com
echo   3. Your service → Environment → Add Variable
echo.

:: Set color to green for final message
color 02
echo   🎉 Your Buddy AI is ready to chat!
echo.

pause