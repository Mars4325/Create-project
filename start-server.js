const { initDatabase } = require('./backend/src/database/init');
const app = require('./backend/server');

async function startServer() {
  try {
    console.log('🚀 Запуск TaskHub QA Sandbox...');

    // Инициализация базы данных
    console.log('📊 Инициализация базы данных...');
    await initDatabase();
    console.log('✅ База данных готова');

    // Запуск сервера
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🎯 TaskHub QA Sandbox запущен!`);
      console.log(`🌐 Приложение: http://localhost:${PORT}`);
      console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
      console.log(`💚 Health Check: http://localhost:${PORT}/health`);
      console.log('');
      console.log('📋 Доступные функции:');
      console.log('  • Управление пользователями');
      console.log('  • Создание проектов');
      console.log('  • Управление тест-кейсами');
      console.log('  • Просмотр статистики');
      console.log('  • API документация');
      console.log('');
      console.log('Нажмите Ctrl+C для остановки сервера');
    });

  } catch (error) {
    console.error('❌ Ошибка запуска сервера:', error);
    process.exit(1);
  }
}

startServer();
