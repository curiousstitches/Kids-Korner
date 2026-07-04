@echo off
echo ========================================
echo Kids Korner - Auto Deploy Script
echo ========================================
echo.

echo [1/4] Checking git status...
git status

echo.
echo [2/4] Adding all changes...
git add .

echo.
echo [3/4] Committing changes...
set /p commit_msg=Enter commit message (or press Enter for default): 
if "%commit_msg%"=="" set commit_msg=Update Buddy AI
git commit -m "%commit_msg%"

echo.
echo [4/4] Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo DEPLOYMENT INITIATED!
echo ========================================
echo.
echo Render will automatically build and deploy your app.
echo Visit: https://kids-korner.onrender.com
echo.
echo Build typically completes in 1-2 minutes.
echo Check build logs at: https://dashboard.render.com
echo.
echo ========================================
echo DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your app is now live at:
echo https://kids-korner.onrender.com
echo.
echo NOTE: Set OPENROUTER_API_KEY in Render dashboard!
echo ========================================
pause