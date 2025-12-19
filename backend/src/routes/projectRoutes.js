const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const {
  validateProjectCreation,
  validateProjectUpdate
} = require('../middleware/validation');

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный ID проекта
 *         name:
 *           type: string
 *           description: Название проекта
 *         description:
 *           type: string
 *           description: Описание проекта
 *         owner_id:
 *           type: string
 *           description: ID владельца проекта
 *         owner_username:
 *           type: string
 *           description: Имя пользователя владельца проекта
 *         status:
 *           type: string
 *           enum: [active, archived, completed]
 *           description: Статус проекта
 *         test_cases_count:
 *           type: integer
 *           description: Количество тест-кейсов в проекте
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         name: "E-commerce Platform"
 *         description: "Testing the main e-commerce functionality"
 *         owner_id: "123e4567-e89b-12d3-a456-426614174001"
 *         owner_username: "johndoe"
 *         status: "active"
 *         test_cases_count: 15
 *         created_at: "2023-01-01T00:00:00.000Z"
 *         updated_at: "2023-01-01T00:00:00.000Z"
 */

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Получить список всех проектов
 *     tags: [Проекты]
 *     responses:
 *       200:
 *         description: Список проектов
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
 *                     $ref: '#/components/schemas/Project'
 */
router.get('/', projectController.getProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Получить проект по ID
 *     tags: [Проекты]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID проекта
 *     responses:
 *       200:
 *         description: Информация о проекте
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       404:
 *         description: Проект не найден
 */
router.get('/:id', projectController.getProjectById);

/**
 * @swagger
 * /api/projects/owner/{ownerId}:
 *   get:
 *     summary: Получить проекты по ID владельца
 *     tags: [Проекты]
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID владельца
 *     responses:
 *       200:
 *         description: Список проектов пользователя
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
 *                     $ref: '#/components/schemas/Project'
 */
router.get('/owner/:ownerId', projectController.getProjectsByOwner);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Создать новый проект
 *     tags: [Проекты]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название проекта
 *               description:
 *                 type: string
 *                 description: Описание проекта
 *               owner_id:
 *                 type: string
 *                 description: ID владельца (будет взят от аутентифицированного пользователя в продакшене)
 *             example:
 *               name: "E-commerce Platform"
 *               description: "Testing the main e-commerce functionality"
 *               owner_id: "123e4567-e89b-12d3-a456-426614174001"
 *     responses:
 *       201:
 *         description: Проект успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *                 message:
 *                   type: string
 *                   example: "Проект создан успешно"
 *       400:
 *         description: Некорректные входные данные
 */
router.post('/', validateProjectCreation, projectController.createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Обновить проект по ID
 *     tags: [Проекты]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID проекта
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название проекта
 *               description:
 *                 type: string
 *                 description: Описание проекта
 *               status:
 *                 type: string
 *                 enum: [active, archived, completed]
 *                 description: Статус проекта
 *             example:
 *               name: "E-commerce Platform Updated"
 *               description: "Updated description"
 *               status: "completed"
 *     responses:
 *       200:
 *         description: Проект обновлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *                 message:
 *                   type: string
 *                   example: "Проект обновлен успешно"
 *       404:
 *         description: Проект не найден
 *       400:
 *         description: Некорректные входные данные
 */
router.put('/:id', validateProjectUpdate, projectController.updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Удалить проект по ID
 *     tags: [Проекты]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID проекта
 *     responses:
 *       200:
 *         description: Проект удален
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
 *                   example: "Проект удален успешно"
 *       404:
 *         description: Проект не найден
 */
router.delete('/:id', projectController.deleteProject);

module.exports = router;
