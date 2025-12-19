const sqlite3 = require('./backend/node_modules/sqlite3').verbose();
const path = require('path');

// Прямой путь к базе данных
const DB_PATH = path.join(__dirname, 'backend', 'database', 'taskhub.db');

console.log('🔧 Создание таблиц в базе данных...');
console.log('📍 Путь к БД:', DB_PATH);

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Ошибка подключения к БД:', err.message);
    process.exit(1);
  }
  console.log('✅ Подключено к SQLite базе данных');
});

// Включаем foreign keys
db.run('PRAGMA foreign_keys = ON');

// Создаем таблицы
const tables = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    owner_id TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS test_cases (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    project_id TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'draft',
    steps TEXT,
    expected_result TEXT,
    created_by TEXT NOT NULL,
    assigned_to TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users (id) ON DELETE SET NULL
  )`,

  `CREATE TABLE IF NOT EXISTS test_runs (
    id TEXT PRIMARY KEY,
    test_case_id TEXT NOT NULL,
    executed_by TEXT NOT NULL,
    status TEXT NOT NULL,
    notes TEXT,
    execution_time INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_case_id) REFERENCES test_cases (id) ON DELETE CASCADE,
    FOREIGN KEY (executed_by) REFERENCES users (id) ON DELETE CASCADE
  )`
];

// Создаем индексы для производительности
const indexes = [
  'CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id)',
  'CREATE INDEX IF NOT EXISTS idx_test_cases_project ON test_cases(project_id)',
  'CREATE INDEX IF NOT EXISTS idx_test_cases_assigned ON test_cases(assigned_to)',
  'CREATE INDEX IF NOT EXISTS idx_test_runs_case ON test_runs(test_case_id)'
];

let completed = 0;
const total = tables.length + indexes.length;

function createTable(sql, callback) {
  db.run(sql, (err) => {
    if (err) {
      console.error('❌ Ошибка создания:', err.message);
      console.error('SQL:', sql);
      process.exit(1);
    }
    completed++;
    console.log(`✅ Создано: ${completed}/${total}`);
    callback();
  });
}

function createIndex(sql, callback) {
  db.run(sql, (err) => {
    if (err) {
      console.error('❌ Ошибка создания индекса:', err.message);
      process.exit(1);
    }
    completed++;
    console.log(`✅ Создано: ${completed}/${total}`);
    callback();
  });
}

// Создаем таблицы последовательно
function createNextTable(index = 0) {
  if (index < tables.length) {
    createTable(tables[index], () => createNextTable(index + 1));
  } else {
    createNextIndex(0);
  }
}

function createNextIndex(index = 0) {
  if (index < indexes.length) {
    createIndex(indexes[index], () => createNextIndex(index + 1));
  } else {
    finish();
  }
}

function finish() {
  console.log('\n🎉 Все таблицы и индексы созданы успешно!');
  console.log('📊 База данных готова к работе.');

  // Проверяем, что таблицы созданы
  db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
    if (err) {
      console.error('❌ Ошибка проверки:', err.message);
    } else {
      console.log('📋 Созданные таблицы:', rows.map(r => r.name).join(', '));
    }

    db.close((err) => {
      if (err) {
        console.error('❌ Ошибка закрытия БД:', err.message);
      } else {
        console.log('🔒 База данных закрыта.');
      }
      process.exit(0);
    });
  });
}

// Начинаем создание
createNextTable(0);
