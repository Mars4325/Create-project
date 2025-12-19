const express = require('express');
const router = express.Router();
const testCaseController = require('../controllers/testCaseController');
const {
  validateTestCaseCreation,
  validateTestCaseUpdate
} = require('../middleware/validation');

/**
 * @swagger
 * components:
 *   schemas:
 *     TestCase:
 *       type: object
 *       required:
 *         - title
 *         - project_id
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный ID тест-кейса
 *         title:
 *           type: string
 *           description: Заголовок тест-кейса
 *         description:
 *           type: string
 *           description: Описание тест-кейса
 *         project_id:
 *           type: string
 *           description: ID проекта, которому принадлежит тест-кейс
 *         project_name:
 *           type: string
 *           description: Название проекта
 *         priority:
 *           type: string
 *           enum: [low, medium, high, critical]
 *           description: Приоритет тест-кейса
 *         status:
 *           type: string
 *           enum: [draft, review, approved, in_progress, passed, failed, blocked]
 *           description: Статус тест-кейса
 *         steps:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               step:
 *                 type: string
 *                 description: Описание шага тестирования
 *               expected:
 *                 type: string
 *                 description: Ожидаемый результат для этого шага
 *           description: Шаги выполнения тестирования
 *         expected_result:
 *           type: string
 *           description: Общий ожидаемый результат
 *         created_by:
 *           type: string
 *           description: ID пользователя, создавшего тест-кейс
 *         created_by_username:
 *           type: string
 *           description: Имя пользователя создателя
 *         assigned_to:
 *           type: string
 *           description: ID назначенного пользователя
 *         assigned_to_username:
 *           type: string
 *           description: Имя назначенного пользователя
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         title: "User login with valid credentials"
 *         description: "Test user authentication flow"
 *         project_id: "123e4567-e89b-12d3-a456-426614174001"
 *         project_name: "E-commerce Platform"
 *         priority: "high"
 *         status: "approved"
 *         steps: [
 *           { "step": "Navigate to login page", "expected": "Login form is displayed" },
 *           { "step": "Enter valid credentials", "expected": "Credentials are accepted" },
 *           { "step": "Click login button", "expected": "User is redirected to dashboard" }
 *         ]
 *         expected_result: "User successfully logs in and sees dashboard"
 *         created_by: "123e4567-e89b-12d3-a456-426614174002"
 *         created_by_username: "johndoe"
 *         assigned_to: "123e4567-e89b-12d3-a456-426614174003"
 *         assigned_to_username: "janedoe"
 *         created_at: "2023-01-01T00:00:00.000Z"
 *         updated_at: "2023-01-01T00:00:00.000Z"
 */

/**
 * @swagger
 * /api/test-cases:
 *   get:
 *     summary: Получить список тест-кейсов с опциональными фильтрами
 *     tags: [Тест-кейсы]
 *     parameters:
 *       - in: query
 *         name: project_id
 *         schema:
 *           type: string
 *         description: Фильтр по ID проекта
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, review, approved, in_progress, passed, failed, blocked]
 *         description: Фильтр по статусу
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, critical]
 *         description: Фильтр по приоритету
 *       - in: query
 *         name: assigned_to
 *         schema:
 *           type: string
 *         description: Фильтр по ID назначенного пользователя
 *     responses:
 *       200:
 *         description: Список тест-кейсов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TestCase'
 */
router.get('/', testCaseController.getTestCases);

/**
 * @swagger
 * /api/test-cases/{id}:
 *   get:
 *     summary: Получить тест-кейс по ID
 *     tags: [Тест-кейсы]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID тест-кейса
 *     responses:
 *       200:
 *         description: Информация о тест-кейсе
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/TestCase'
 *       404:
 *         description: Тест-кейс не найден
 */
router.get('/:id', testCaseController.getTestCaseById);

/**
 * @swagger
 * /api/test-cases/project/{projectId}:
 *   get:
 *     summary: Получить тест-кейсы по ID проекта
 *     tags: [Тест-кейсы]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID проекта
 *     responses:
 *       200:
 *         description: Список тест-кейсов проекта
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TestCase'
 */
router.get('/project/:projectId', testCaseController.getTestCasesByProject);

/**
 * @swagger
 * /api/test-cases/assigned/{userId}:
 *   get:
 *     summary: Получить тест-кейсы, назначенные пользователю
 *     tags: [Тест-кейсы]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Список тест-кейсов, назначенных пользователю
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TestCase'
 */
router.get('/assigned/:userId', testCaseController.getTestCasesByAssignedUser);

/**
 * @swagger
 * /api/test-cases/project/{projectId}/stats:
 *   get:
 *     summary: Получить статистику тест-кейсов для проекта
 *     tags: [Тест-кейсы]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID проекта
 *     responses:
 *       200:
 *         description: Статистика тест-кейсов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Общее количество тест-кейсов
 *                       example: 25
 *                     by_status:
 *                       type: object
 *                       description: Количество по статусам
 *                       example: {"draft": 5, "approved": 10, "passed": 8, "failed": 2}
 *                     by_priority:
 *                       type: object
 *                       description: Количество по приоритетам
 *                       example: {"low": 5, "medium": 10, "high": 8, "critical": 2}
 */
router.get('/project/:projectId/stats', testCaseController.getTestCaseStats);

/**
 * @swagger
 * /api/test-cases:
 *   post:
 *     summary: Создать новый тест-кейс
 *     tags: [Тест-кейсы]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - project_id
 *             properties:
 *               title:
 *                 type: string
 *                 description: Заголовок тест-кейса
 *               description:
 *                 type: string
 *                 description: Описание тест-кейса
 *               project_id:
 *                 type: string
 *                 description: ID проекта
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, critical]
 *                 description: Приоритет тест-кейса
 *               status:
 *                 type: string
 *                 enum: [draft, review, approved, in_progress, passed, failed, blocked]
 *                 description: Статус тест-кейса
 *               steps:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     step:
 *                       type: string
 *                       description: Шаг тестирования
 *                     expected:
 *                       type: string
 *                       description: Ожидаемый результат для шага
 *                 description: Шаги выполнения тестирования
 *               expected_result:
 *                 type: string
 *                 description: Общий ожидаемый результат
 *               assigned_to:
 *                 type: string
 *                 description: ID назначенного пользователя
 *             example:
 *               title: "User login with valid credentials"
 *               description: "Test user authentication flow"
 *               project_id: "123e4567-e89b-12d3-a456-426614174001"
 *               priority: "high"
 *               status: "draft"
 *               steps: [
 *                 { "step": "Navigate to login page", "expected": "Login form is displayed" },
 *                 { "step": "Enter valid credentials", "expected": "Credentials are accepted" },
 *                 { "step": "Click login button", "expected": "User is redirected to dashboard" }
 *               ]
 *               expected_result: "User successfully logs in and sees dashboard"
 *               assigned_to: "123e4567-e89b-12d3-a456-426614174003"
 *     responses:
 *       201:
 *         description: Тест-кейс успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/TestCase'
 *                 message:
 *                   type: string
 *                   example: "Тест-кейс создан успешно"
 *       400:
 *         description: Некорректные входные данные
 *       404:
 *         description: Проект не найден
 */
router.post('/', validateTestCaseCreation, testCaseController.createTestCase);

/**
 * @swagger
 * /api/test-cases/{id}:
 *   put:
 *     summary: Обновить тест-кейс по ID
 *     tags: [Тест-кейсы]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID тест-кейса
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Заголовок тест-кейса
 *               description:
 *                 type: string
 *                 description: Описание тест-кейса
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, critical]
 *                 description: Приоритет тест-кейса
 *               status:
 *                 type: string
 *                 enum: [draft, review, approved, in_progress, passed, failed, blocked]
 *                 description: Статус тест-кейса
 *               steps:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     step:
 *                       type: string
 *                       description: Шаг тестирования
 *                     expected:
 *                       type: string
 *                       description: Ожидаемый результат для шага
 *                 description: Шаги выполнения тестирования
 *               expected_result:
 *                 type: string
 *                 description: Общий ожидаемый результат
 *               assigned_to:
 *                 type: string
 *                 description: ID назначенного пользователя (null для снятия назначения)
 *             example:
 *               title: "User login with valid credentials - Updated"
 *               description: "Updated test description"
 *               priority: "critical"
 *               status: "approved"
 *               steps: [
 *                 { "step": "Navigate to login page", "expected": "Login form is displayed" },
 *                 { "step": "Enter valid credentials", "expected": "Credentials are accepted" },
 *                 { "step": "Click login button", "expected": "User is redirected to dashboard" },
 *                 { "step": "Verify dashboard elements", "expected": "All dashboard elements are visible" }
 *               ]
 *               expected_result: "User successfully logs in and sees complete dashboard"
 *               assigned_to: "123e4567-e89b-12d3-a456-426614174004"
 *     responses:
 *       200:
 *         description: Тест-кейс обновлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/TestCase'
 *                 message:
 *                   type: string
 *                   example: "Тест-кейс обновлен успешно"
 *       404:
 *         description: Тест-кейс не найден
 *       400:
 *         description: Некорректные входные данные
 */
router.put('/:id', validateTestCaseUpdate, testCaseController.updateTestCase);

/**
 * @swagger
 * /api/test-cases/{id}:
 *   delete:
 *     summary: Удалить тест-кейс по ID
 *     tags: [Тест-кейсы]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID тест-кейса
 *     responses:
 *       200:
 *         description: Тест-кейс удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Тест-кейс удален успешно"
 *       404:
 *         description: Тест-кейс не найден
 */
router.delete('/:id', testCaseController.deleteTestCase);

module.exports = router;
