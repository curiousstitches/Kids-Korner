@echo off
title The Lounge - Adults Only
cd /d "%~dp0"
echo Starting The Lounge...
if exist ..\keys.local.bat (
    call ..\keys.local.bat
    echo [OK] Keys loaded from the main folder - full AI mode
) else if exist keys.local.bat (
    call keys.local.bat
    echo [OK] Keys loaded - full AI mode
) else (
    echo [INFO] No keys file found - offline replies only. Drawing and voices still work!
)
start "" http://localhost:8082
python app.py
pause
