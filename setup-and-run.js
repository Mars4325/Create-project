const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Настройка и запуск TaskHub QA Sandbox...\n');

const backendPath = path.join(__dirname, 'backend');

// Шаг 1: Установка зависимостей
console.log('📦 Шаг 1: Установка зависимостей backend...');
exec('npm install', { cwd: backendPath }, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Ошибка установки зависимостей:', error);
    return;
  }

  console.log('✅ Зависимости установлены\n');

  // Шаг 2: Инициализация базы данных
  console.log('📊 Шаг 2: Инициализация базы данных...');
  exec('node -e "const { initDatabase } = require(\'./src/database/init\'); initDatabase().then(() => console.log(\'✅ База данных готова\')).catch(console.error)"', { cwd: backendPath }, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Ошибка инициализации БД:', error);
      return;
    }

    console.log(stdout);

    // Шаг 3: Запуск сервера
    console.log('🎯 Шаг 3: Запуск сервера...\n');
    const serverProcess = exec('node server.js', { cwd: backendPath });

    serverProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    serverProcess.stderr.on('data', (data) => {
      console.error('Server error:', data.toString());
    });

    serverProcess.on('close', (code) => {
      console.log(`\n🛑 Сервер остановлен с кодом ${code}`);
    });

    // Обработка завершения процесса
    process.on('SIGINT', () => {
      console.log('\n\n🛑 Остановка сервера...');
      serverProcess.kill();
      process.exit(0);
    });
  });
});
