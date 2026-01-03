@echo off
title GlobeTrotter Backend Server
cd /d "%~dp0backend"
echo.
echo ======================================
echo   Starting GlobeTrotter Backend
echo ======================================
echo.
echo Checking dependencies...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)
echo.
echo Starting server on http://localhost:5000
echo.
call npm run dev
pause
