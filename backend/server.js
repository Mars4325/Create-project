const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Import routes
const userRoutes = require('./src/routes/userRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const testCaseRoutes = require('./src/routes/testCaseRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskHub QA Sandbox API',
      version: '1.0.0',
      description: 'REST API для управления тест-кейсами и проектами в учебном стенде автоматизатора тестирования',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      scriptSrcAttr: ["'unsafe-inline'"], // Allow inline event handlers
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"]
    }
  }
}));
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/test-cases', testCaseRoutes);

// Serve main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Database status endpoint
/**
 * @swagger
 * /api/db-status:
 *   get:
 *     summary: Проверка состояния базы данных
 *     tags: [Система]
 *     responses:
 *       200:
 *         description: Информация о состоянии базы данных
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 *                 message:
 *                   type: string
 *                   example: "Database is working"
 *                 tables:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["users", "projects", "test_cases", "test_runs"]
 *                 systemUser:
 *                   type: string
 *                   example: "exists"
 *                 tableCount:
 *                   type: integer
 *                   example: 4
 */
app.get('/api/db-status', (req, res) => {
  const sqlite3 = require('sqlite3').verbose();
  const path = require('path');
  const DB_PATH = path.join(__dirname, 'database/taskhub.db');

  const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      return res.json({
        status: 'error',
        message: 'База данных недоступна',
        error: err.message
      });
    }

    // Check tables
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
      if (err) {
        return res.json({
          status: 'error',
          message: 'Не удается запросить таблицы',
          error: err.message
        });
      }

      const tables = rows.map(row => row.name);

      // Check system user
      db.get("SELECT * FROM users WHERE username = 'system'", [], (err, row) => {
        db.close();

        if (err) {
          return res.json({
            status: 'error',
            message: 'Не удается проверить системного пользователя',
            error: err.message,
            tables: tables
          });
        }

        res.json({
          status: 'ok',
          message: 'База данных работает',
          tables: tables,
          systemUser: row ? 'существует' : 'отсутствует',
          tableCount: tables.length
        });
      });
    });
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TaskHub QA Sandbox сервер запущен на порту ${PORT}`);
  console.log(`📚 Документация Swagger доступна по адресу: http://localhost:${PORT}/api-docs`);
});

module.exports = app;
