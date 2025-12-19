# TaskHub QA Sandbox Launcher
Write-Host "🚀 Запуск TaskHub QA Sandbox..." -ForegroundColor Green

# Переход в директорию backend
$backendPath = "d:\для курсора\taskhub-qa-sandbox\backend"
Set-Location $backendPath

# Установка зависимостей
Write-Host "📦 Установка зависимостей..." -ForegroundColor Yellow
npm install

# Инициализация базы данных
Write-Host "📊 Инициализация базы данных..." -ForegroundColor Yellow
npm run init-db

# Запуск сервера
Write-Host "🎯 Запуск сервера..." -ForegroundColor Yellow
Write-Host "🌐 Приложение будет доступно на: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📚 API Docs: http://localhost:3000/api-docs" -ForegroundColor Cyan
Write-Host "Нажмите Ctrl+C для остановки сервера" -ForegroundColor Magenta
Write-Host ""

npm run dev
