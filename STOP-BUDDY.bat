@echo off
title Stop Buddy
echo.
echo  ============================================
echo     STOPPING BUDDY - closing everything...
echo  ============================================
echo.

echo  [1/4] Closing Buddy server windows...
taskkill /F /T /FI "WINDOWTITLE eq Kids Korner - Buddy*" >nul 2>&1
taskkill /F /T /FI "WINDOWTITLE eq The Lounge - Adults Only*" >nul 2>&1

echo  [2/4] Freeing Buddy's ports (8081 and 8082)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8081" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8082" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

echo  [3/4] Closing the ngrok tunnel (if one is running)...
taskkill /F /IM ngrok.exe >nul 2>&1

echo  [4/4] Double-checking the shutdown...
timeout /t 1 /nobreak >nul
netstat -ano | findstr ":8081" | findstr "LISTENING" >nul 2>&1
if errorlevel 1 (echo      Kids Korner port 8081 ... CLEAR) else (echo      Port 8081 still busy - close its black window by hand)
netstat -ano | findstr ":8082" | findstr "LISTENING" >nul 2>&1
if errorlevel 1 (echo      Lounge port 8082 ....... CLEAR) else (echo      Port 8082 still busy - close its black window by hand)

echo.
echo  Buddy is fully stopped. Bye for now!
if "%1"=="quiet" goto :eof
timeout /t 4
