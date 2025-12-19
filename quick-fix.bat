@echo off
echo ===============================================
echo    Быстрое исправление TaskHub QA Sandbox
echo ===============================================
echo.

cd /d "d:\для курсора\taskhub-qa-sandbox\backend"

echo [1/1] Инициализация базы данных...
call npm run init-db

echo.
echo ✅ Готово! База данных инициализирована.
echo.
echo Теперь перезапустите сервер: npm run dev
echo.

pause
