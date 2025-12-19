const request = require('supertest');
const app = require('../../backend/server');
const { initDatabase } = require('../../backend/src/database/init');

describe('TaskHub QA Sandbox API', () => {
  beforeAll(async () => {
    // Initialize database for tests
    await initDatabase();
  });

  describe('GET /health', () => {
    it('should return server health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Users API', () => {
    let createdUserId;

    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.username).toBe(userData.username);
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.role).toBe(userData.role);

      createdUserId = response.body.data.id;
    });

    it('should get all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should get user by id', async () => {
      const response = await request(app)
        .get(`/api/users/${createdUserId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(createdUserId);
      expect(response.body.data.username).toBe('testuser');
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .get('/api/users/non-existent-id')
        .expect(404);
    });
  });

  describe('Projects API', () => {
    let createdProjectId;

    it('should create a new project', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'A test project for QA sandbox'
      };

      const response = await request(app)
        .post('/api/projects')
        .send(projectData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(projectData.name);
      expect(response.body.data.description).toBe(projectData.description);

      createdProjectId = response.body.data.id;
    });

    it('should get all projects', async () => {
      const response = await request(app)
        .get('/api/projects')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should get project by id', async () => {
      const response = await request(app)
        .get(`/api/projects/${createdProjectId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(createdProjectId);
      expect(response.body.data.name).toBe('Test Project');
    });
  });

  describe('Test Cases API', () => {
    let createdTestCaseId;

    it('should create a new test case', async () => {
      const testCaseData = {
        title: 'Login functionality test',
        description: 'Test user login with valid credentials',
        project_id: createdProjectId,
        priority: 'high',
        status: 'draft',
        steps: [
          { step: 'Navigate to login page', expected: 'Login form is displayed' },
          { step: 'Enter valid credentials', expected: 'Credentials are accepted' },
          { step: 'Click login button', expected: 'User is redirected to dashboard' }
        ],
        expected_result: 'User successfully logs in and sees dashboard'
      };

      const response = await request(app)
        .post('/api/test-cases')
        .send(testCaseData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe(testCaseData.title);
      expect(response.body.data.project_id).toBe(testCaseData.project_id);
      expect(response.body.data.priority).toBe(testCaseData.priority);

      createdTestCaseId = response.body.data.id;
    });

    it('should get all test cases', async () => {
      const response = await request(app)
        .get('/api/test-cases')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should get test case by id', async () => {
      const response = await request(app)
        .get(`/api/test-cases/${createdTestCaseId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(createdTestCaseId);
      expect(response.body.data.title).toBe('Login functionality test');
    });

    it('should get test cases by project', async () => {
      const response = await request(app)
        .get(`/api/test-cases/project/${createdProjectId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should get test case statistics', async () => {
      const response = await request(app)
        .get(`/api/test-cases/project/${createdProjectId}/stats`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('by_status');
      expect(response.body.data).toHaveProperty('by_priority');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      await request(app)
        .get('/api/unknown-route')
        .expect(404);
    });

    it('should return 400 for invalid user data', async () => {
      const invalidUserData = {
        username: '', // Invalid: empty username
        email: 'invalid-email', // Invalid: not an email
        password: '123' // Invalid: too short
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUserData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('errors');
    });

    it('should return 404 for non-existent resources', async () => {
      await request(app)
        .get('/api/users/non-existent-id')
        .expect(404);

      await request(app)
        .get('/api/projects/non-existent-id')
        .expect(404);

      await request(app)
        .get('/api/test-cases/non-existent-id')
        .expect(404);
    });
  });
});
