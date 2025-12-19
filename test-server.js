console.log('Testing server startup...');

try {
  const app = require('./backend/server');
  console.log('✅ Server module loaded successfully!');

  // Test database initialization
  const { initDatabase } = require('./backend/src/database/init');
  initDatabase().then(() => {
    console.log('✅ Database initialized successfully!');

    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 TaskHub QA Sandbox server running on port ${PORT}`);
      console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  }).catch(error => {
    console.error('❌ Database initialization failed:', error);
  });

} catch (error) {
  console.error('❌ Server startup failed:', error);
}
