@echo off
echo 🚀 Запуск TaskHub QA Sandbox...

cd backend

echo 📦 Установка зависимостей...
call npm install

echo 📊 Инициализация базы данных...
call node -e "const { initDatabase } = require('./src/database/init'); initDatabase().then(() => console.log('✅ База данных готова')).catch(console.error)"

echo 🎯 Запуск сервера...
call npm run dev

pause
