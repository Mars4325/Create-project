@echo off
echo ===============================================
echo    Сброс базы данных TaskHub QA Sandbox
echo ===============================================
echo.

echo [1/3] Удаление старой базы данных...
if exist "backend\database\taskhub.db" (
    del "backend\database\taskhub.db"
    echo ✅ Старая база данных удалена
) else (
    echo ⚠️ Файл базы данных не найден
)

echo.
echo [2/3] Переход в директорию backend...
cd backend

echo [3/3] Инициализация новой базы данных...
call npm run init-db

echo.
echo ✅ Готово! Теперь перезапустите сервер командой:
echo cd backend
echo npm run dev
echo.

pause
