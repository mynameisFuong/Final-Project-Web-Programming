@echo off
echo Killing Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul
echo Node processes killed.
echo.
echo Starting backend...
cd /d "c:\Users\ADMIN\Desktop\Đồ án Web-TTCS - Copy\backend"
npm start
