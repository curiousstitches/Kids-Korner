@echo off
title Restart Buddy
echo.
echo  ============================================
echo     RESTARTING BUDDY...
echo  ============================================
echo.
echo  Step 1: stopping everything cleanly...
call "%~dp0STOP-BUDDY.bat" quiet

echo  Step 2: letting everything settle...
timeout /t 2 /nobreak >nul

echo  Step 3: starting Buddy fresh (new window incoming!)...
start "" "%~dp0START-BUDDY.bat"

echo.
echo  Done! Buddy is starting up with all your latest changes.
echo  This little window will close itself.
timeout /t 3 /nobreak >nul
