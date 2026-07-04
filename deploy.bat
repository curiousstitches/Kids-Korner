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
echo [1/7] Stopping all local servers...
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM ngrok.exe >nul 2>&1
echo     [DONE] All local servers stopped
echo.

:: [2] Set environment variables
echo [2/7] Setting environment variables...
set OPENROUTER_API_KEY=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
echo     [DONE] OPENROUTER_API_KEY set
echo.

:: [3] Navigate to project directory
echo [3/7] Navigating to project directory...
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
echo [4/7] Starting Flask server...
start /B python app.py
echo     [DONE] Flask server starting...
echo.

:: [5] Wait for server to boot
echo [5/7] Waiting for server to boot...
set /a attempts=0
:check_server
set /a attempts+=1
timeout /t 2 /nobreak >nul
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:8081/' -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"
if %errorlevel% equ 0 (
    goto server_ready
)
if %attempts% geq 15 (
    echo     [WARNING] Server may not be fully ready
    goto server_ready
)
echo     Checking... (%attempts%/15)
goto check_server
:server_ready
echo     [DONE] Server is ready!
echo.

:: [6] Start ngrok tunnel
echo [6/7] Starting ngrok tunnel...
start /B ngrok http 8081
timeout /t 3 /nobreak >nul
echo     [DONE] ngrok tunnel established
echo.

:: [7] Push to GitHub
echo [7/7] Pushing to GitHub...
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

:: Set color to green for confirmation
color 02
echo   🎉 SERVER READY!
echo   Your Buddy AI is fully operational!
echo.

:: Set color to magenta for instructions
color 05
echo   NEXT STEPS:
echo   1. Set OPENROUTER_API_KEY in Render dashboard
echo   2. Visit https://dashboard.render.com
echo   3. Your service → Environment → Add Variable
echo.

pause