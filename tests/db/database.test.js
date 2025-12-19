const { initDatabase, db } = require('../../backend/src/database/init');
const User = require('../../backend/src/models/User');
const Project = require('../../backend/src/models/Project');
const TestCase = require('../../backend/src/models/TestCase');

describe('Database Tests', () => {
  beforeAll(async () => {
    // Initialize database for tests
    await initDatabase();
  });

  afterAll(async () => {
    // Close database connection
    db.close();
  });

  describe('Database Initialization', () => {
    test('should initialize database tables', async () => {
      // Check if tables exist by trying to query them
      const tables = ['users', 'projects', 'test_cases', 'test_runs'];

      for (const table of tables) {
        await new Promise((resolve, reject) => {
          db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${table}'`, (err, row) => {
            if (err) reject(err);
            expect(row).toBeTruthy();
            expect(row.name).toBe(table);
            resolve();
          });
        });
      }
    });

    test('should have foreign key constraints enabled', async () => {
      await new Promise((resolve, reject) => {
        db.get('PRAGMA foreign_keys', (err, row) => {
          if (err) reject(err);
          expect(row.foreign_keys).toBe(1);
          resolve();
        });
      });
    });
  });

  describe('User Model', () => {
    let testUser;

    test('should create a new user', async () => {
      const userData = {
        username: 'dbtestuser',
        email: 'dbtest@example.com',
        password: 'testpass123'
      };

      const user = await User.create(userData);
      testUser = user;

      expect(user).toBeTruthy();
      expect(user.id).toBeTruthy();
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
      expect(user.password_hash).not.toBe(userData.password); // Should be hashed
    });

    test('should find user by ID', async () => {
      const foundUser = await User.findById(testUser.id);
      expect(foundUser).toBeTruthy();
      expect(foundUser.id).toBe(testUser.id);
      expect(foundUser.username).toBe(testUser.username);
    });

    test('should find user by username', async () => {
      const foundUser = await User.findByUsername(testUser.username);
      expect(foundUser).toBeTruthy();
      expect(foundUser.username).toBe(testUser.username);
    });

    test('should find user by email', async () => {
      const foundUser = await User.findByEmail(testUser.email);
      expect(foundUser).toBeTruthy();
      expect(foundUser.email).toBe(testUser.email);
    });

    test('should verify password', async () => {
      const isValid = await testUser.verifyPassword('testpass123');
      expect(isValid).toBe(true);

      const isInvalid = await testUser.verifyPassword('wrongpass');
      expect(isInvalid).toBe(false);
    });

    test('should get all users', async () => {
      const users = await User.findAll();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);

      const userExists = users.some(user => user.id === testUser.id);
      expect(userExists).toBe(true);
    });

    test('should update user', async () => {
      const updateData = { role: 'admin' };
      const updatedUser = await testUser.update(updateData);

      expect(updatedUser.role).toBe('admin');
    });

    test('should delete user', async () => {
      await testUser.delete();

      const foundUser = await User.findById(testUser.id);
      expect(foundUser).toBeNull();
    });
  });

  describe('Project Model', () => {
    let testProject;
    let testUser;

    beforeAll(async () => {
      // Create a test user for project ownership
      testUser = await User.create({
        username: 'projectowner',
        email: 'projectowner@example.com',
        password: 'testpass123'
      });
    });

    afterAll(async () => {
      // Clean up test user
      if (testUser) {
        await testUser.delete();
      }
    });

    test('should create a new project', async () => {
      const projectData = {
        name: 'Database Test Project',
        description: 'A project for database testing',
        owner_id: testUser.id
      };

      const project = await Project.create(projectData);
      testProject = project;

      expect(project).toBeTruthy();
      expect(project.id).toBeTruthy();
      expect(project.name).toBe(projectData.name);
      expect(project.owner_id).toBe(projectData.owner_id);
    });

    test('should find project by ID', async () => {
      const foundProject = await Project.findById(testProject.id);
      expect(foundProject).toBeTruthy();
      expect(foundProject.id).toBe(testProject.id);
      expect(foundProject.name).toBe(testProject.name);
    });

    test('should find projects by owner', async () => {
      const projects = await Project.findByOwner(testUser.id);
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);

      const projectExists = projects.some(project => project.id === testProject.id);
      expect(projectExists).toBe(true);
    });

    test('should get all projects', async () => {
      const projects = await Project.findAll();
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
    });

    test('should get test cases count for project', async () => {
      const count = await testProject.getTestCasesCount();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should update project', async () => {
      const updateData = { status: 'completed' };
      const updatedProject = await testProject.update(updateData);

      expect(updatedProject.status).toBe('completed');
    });

    test('should delete project', async () => {
      await testProject.delete();

      const foundProject = await Project.findById(testProject.id);
      expect(foundProject).toBeNull();
    });
  });

  describe('TestCase Model', () => {
    let testTestCase;
    let testProject;
    let testUser;

    beforeAll(async () => {
      // Create test user and project
      testUser = await User.create({
        username: 'testcaseuser',
        email: 'testcaseuser@example.com',
        password: 'testpass123'
      });

      testProject = await Project.create({
        name: 'Test Case Project',
        description: 'Project for test case testing',
        owner_id: testUser.id
      });
    });

    afterAll(async () => {
      // Clean up
      if (testProject) await testProject.delete();
      if (testUser) await testUser.delete();
    });

    test('should create a new test case', async () => {
      const testCaseData = {
        title: 'Database test case',
        description: 'Testing database operations',
        project_id: testProject.id,
        priority: 'high',
        status: 'draft',
        steps: [
          { step: 'Step 1', expected: 'Expected result 1' },
          { step: 'Step 2', expected: 'Expected result 2' }
        ],
        expected_result: 'Test should pass',
        created_by: testUser.id
      };

      const testCase = await TestCase.create(testCaseData);
      testTestCase = testCase;

      expect(testCase).toBeTruthy();
      expect(testCase.id).toBeTruthy();
      expect(testCase.title).toBe(testCaseData.title);
      expect(testCase.project_id).toBe(testCaseData.project_id);
      expect(Array.isArray(testCase.steps)).toBe(true);
    });

    test('should find test case by ID', async () => {
      const foundTestCase = await TestCase.findById(testTestCase.id);
      expect(foundTestCase).toBeTruthy();
      expect(foundTestCase.id).toBe(testTestCase.id);
      expect(foundTestCase.title).toBe(testTestCase.title);
    });

    test('should find test cases by project', async () => {
      const testCases = await TestCase.findByProject(testProject.id);
      expect(Array.isArray(testCases)).toBe(true);
      expect(testCases.length).toBeGreaterThan(0);

      const testCaseExists = testCases.some(tc => tc.id === testTestCase.id);
      expect(testCaseExists).toBe(true);
    });

    test('should get all test cases', async () => {
      const testCases = await TestCase.findAll();
      expect(Array.isArray(testCases)).toBe(true);
      expect(testCases.length).toBeGreaterThan(0);
    });

    test('should update test case', async () => {
      const updateData = { status: 'approved' };
      const updatedTestCase = await testTestCase.update(updateData);

      expect(updatedTestCase.status).toBe('approved');
    });

    test('should delete test case', async () => {
      await testTestCase.delete();

      const foundTestCase = await TestCase.findById(testTestCase.id);
      expect(foundTestCase).toBeNull();
    });
  });

  describe('Data Relationships', () => {
    test('should maintain referential integrity', async () => {
      // Create user, project, and test case
      const user = await User.create({
        username: 'relationuser',
        email: 'relation@example.com',
        password: 'testpass123'
      });

      const project = await Project.create({
        name: 'Relation Test Project',
        description: 'Testing relationships',
        owner_id: user.id
      });

      const testCase = await TestCase.create({
        title: 'Relation test case',
        project_id: project.id,
        created_by: user.id
      });

      // Test that relationships work in queries
      const foundProject = await Project.findById(project.id);
      expect(foundProject.owner_username).toBe(user.username);

      const foundTestCase = await TestCase.findById(testCase.id);
      expect(foundTestCase.project_name).toBe(project.name);
      expect(foundTestCase.created_by_username).toBe(user.username);

      // Clean up
      await testCase.delete();
      await project.delete();
      await user.delete();
    });
  });
});
