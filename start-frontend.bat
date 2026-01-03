@echo off
title GlobeTrotter Frontend Server
cd /d "%~dp0"
echo.
echo ======================================
echo   Starting GlobeTrotter Frontend
echo ======================================
echo.
echo Checking dependencies...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)
echo.
echo Starting Vite dev server...
echo.
call npm run dev
pause
