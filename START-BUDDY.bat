@echo off
title Kids Korner - Buddy
cd /d "%~dp0"
echo Starting Buddy...
if exist keys.local.bat (
    call keys.local.bat
    echo [OK] Keys loaded - full AI mode
) else (
    echo [INFO] No keys.local.bat found - Buddy Mode ^(no AI key^). Drawing and voices still work!
)
start "" http://localhost:8081
python app.py
pause
