# TaskHub QA Sandbox

Учебный стенд для автоматизатора тестирования с полным стеком технологий: Frontend (HTML/JS) + Backend (Node.js/Express) + БД (SQLite) + REST API + Swagger.

## 🚀 Быстрый старт

### Предварительные требования
- Node.js (версия 16 или выше)
- npm или yarn

### Установка и запуск

1. **Клонируйте репозиторий:**
   ```bash
   git clone <repository-url>
   cd taskhub-qa-sandbox
   ```

2. **Установите зависимости backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Инициализируйте базу данных:**
   ```bash
   npm run init-db
   ```

4. **Запустите сервер:**
   ```bash
   npm run dev  # для разработки с nodemon
   # или
   npm start    # для production
   ```

5. **Откройте браузер:**
   - **Полное приложение:** http://localhost:3000
   - **Swagger API документация:** http://localhost:3000/api-docs
   - **Health check:** http://localhost:3000/health

## 📋 API Endpoints

### Пользователи (/api/users)
- `GET /api/users` - Получить всех пользователей
- `GET /api/users/:id` - Получить пользователя по ID
- `POST /api/users` - Создать нового пользователя
- `PUT /api/users/:id` - Обновить пользователя
- `DELETE /api/users/:id` - Удалить пользователя

### Проекты (/api/projects)
- `GET /api/projects` - Получить все проекты
- `GET /api/projects/:id` - Получить проект по ID
- `GET /api/projects/owner/:ownerId` - Получить проекты пользователя
- `POST /api/projects` - Создать новый проект
- `PUT /api/projects/:id` - Обновить проект
- `DELETE /api/projects/:id` - Удалить проект

### Тест-кейсы (/api/test-cases)
- `GET /api/test-cases` - Получить все тест-кейсы (с фильтрами)
- `GET /api/test-cases/:id` - Получить тест-кейс по ID
- `GET /api/test-cases/project/:projectId` - Получить тест-кейсы проекта
- `GET /api/test-cases/assigned/:userId` - Получить назначенные тест-кейсы
- `GET /api/test-cases/project/:projectId/stats` - Статистика тест-кейсов
- `POST /api/test-cases` - Создать новый тест-кейс
- `PUT /api/test-cases/:id` - Обновить тест-кейс
- `DELETE /api/test-cases/:id` - Удалить тест-кейс

## 🗄️ Модель данных

### Пользователь (User)
```json
{
  "id": "uuid",
  "username": "string",
  "email": "string",
  "role": "user|admin|qa",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Проект (Project)
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "owner_id": "uuid",
  "status": "active|archived|completed",
  "test_cases_count": "number"
}
```

### Тест-кейс (TestCase)
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "project_id": "uuid",
  "priority": "low|medium|high|critical",
  "status": "draft|review|approved|in_progress|passed|failed|blocked",
  "steps": [
    {
      "step": "string",
      "expected": "string"
    }
  ],
  "expected_result": "string",
  "assigned_to": "uuid|null"
}
```

## 🧪 Структура тестирования

```
tests/
├── api/           # API тесты (Jest + Supertest)
├── ui/            # UI тесты (Playwright)
└── db/            # Тесты базы данных
```

### Запуск тестов
```bash
# API тесты
npm run test:api

# База данных тесты
npm run test:db

# UI тесты
npm run test:ui

# UI тесты в браузере (headed mode)
npm run test:ui:headed

# Все тесты
npm run test:all

# Линтинг кода
npm run lint
```

## 🔧 Конфигурация

### Переменные окружения
Создайте файл `.env` в директории backend:

```env
PORT=3000
NODE_ENV=development
DATABASE_PATH=./database/taskhub.db
```

## 🏗️ Архитектура

```
taskhub-qa-sandbox/
├── backend/              # Node.js/Express сервер
│   ├── src/
│   │   ├── controllers/  # Обработчики запросов
│   │   ├── models/       # Модели данных
│   │   ├── routes/       # Маршруты API
│   │   ├── middleware/   # Промежуточное ПО
│   │   └── database/     # Работа с БД
│   └── package.json
├── frontend/             # HTML/JS клиент
├── tests/               # Автотесты
└── README.md
```

## 🚀 CI/CD

Проект настроен для интеграции с GitHub Actions:

- Автоматические тесты при пуше
- Проверка кода (ESLint)
- Деплой в staging/production

## 📚 Документация

- [Swagger API Docs](http://localhost:3000/api-docs) - интерактивная документация API
- [Postman коллекция](./docs/postman_collection.json) - коллекция запросов для тестирования

## 🤝 Вклад в проект

1. Fork проект
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 👥 Авторы

- **Ваше имя** - *AQA Engineer* - [GitHub](https://github.com/yourusername)

## 🙏 Благодарности

- Express.js за отличный веб-фреймворк
- SQLite за легкую встроенную БД
- Swagger за документацию API
- Playwright за UI тестирование
