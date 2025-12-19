@echo off
echo ===============================================
echo    TaskHub QA Sandbox - Запуск
echo ===============================================
echo.

echo [1/2] Инициализация базы данных...
call npm run init-db
if errorlevel 1 (
    echo Ошибка инициализации базы данных!
    echo Возможно, npm не установлен или отсутствует node_modules
    pause
    exit /b 1
)
echo.

echo [2/2] Запуск сервера...
echo Сервер запустится на http://localhost:3000
echo API Docs: http://localhost:3000/api-docs
echo.
echo Для остановки сервера нажмите Ctrl+C
echo.

call npm run dev
