const { body } = require('express-validator');

// User validation rules
const validateUserCreation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('role')
    .optional()
    .isIn(['user', 'admin', 'qa'])
    .withMessage('Role must be user, admin, or qa')
];

const validateUserUpdate = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  body('role')
    .optional()
    .isIn(['user', 'admin', 'qa'])
    .withMessage('Role must be user, admin, or qa')
];

// Project validation rules
const validateProjectCreation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Project name is required and must be less than 100 characters'),

  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters')
];

const validateProjectUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Project name must be less than 100 characters'),

  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),

  body('status')
    .optional()
    .isIn(['active', 'archived', 'completed'])
    .withMessage('Status must be active, archived, or completed')
];

// Test Case validation rules
const validateTestCaseCreation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Test case title is required and must be less than 200 characters'),

  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),

  body('project_id')
    .isUUID()
    .withMessage('Valid project ID is required'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Priority must be low, medium, high, or critical'),

  body('status')
    .optional()
    .isIn(['draft', 'review', 'approved', 'in_progress', 'passed', 'failed', 'blocked'])
    .withMessage('Invalid status value'),

  body('steps')
    .optional()
    .isArray()
    .withMessage('Steps must be an array'),

  body('steps.*.step')
    .optional()
    .isLength({ min: 1, max: 500 })
    .withMessage('Each step must be between 1 and 500 characters'),

  body('expected_result')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Expected result must be less than 1000 characters'),

  body('assigned_to')
    .optional()
    .isUUID()
    .withMessage('Assigned user ID must be a valid UUID')
];

const validateTestCaseUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Test case title must be less than 200 characters'),

  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Priority must be low, medium, high, or critical'),

  body('status')
    .optional()
    .isIn(['draft', 'review', 'approved', 'in_progress', 'passed', 'failed', 'blocked'])
    .withMessage('Invalid status value'),

  body('steps')
    .optional()
    .isArray()
    .withMessage('Steps must be an array'),

  body('steps.*.step')
    .optional()
    .isLength({ min: 1, max: 500 })
    .withMessage('Each step must be between 1 and 500 characters'),

  body('expected_result')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Expected result must be less than 1000 characters'),

  body('assigned_to')
    .optional()
    .custom((value) => {
      if (value === null || value === '') return true; // Allow null/empty to unassign
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
    })
    .withMessage('Assigned user ID must be a valid UUID or null')
];

module.exports = {
  validateUserCreation,
  validateUserUpdate,
  validateProjectCreation,
  validateProjectUpdate,
  validateTestCaseCreation,
  validateTestCaseUpdate
};
