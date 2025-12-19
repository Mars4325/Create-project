const { db } = require('../database/init');
const { v4: uuidv4 } = require('uuid');

class TestCase {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.title = data.title;
    this.description = data.description;
    this.project_id = data.project_id;
    this.priority = data.priority || 'medium';
    this.status = data.status || 'draft';
    this.steps = data.steps; // JSON string or array
    this.expected_result = data.expected_result;
    this.created_by = data.created_by;
    this.created_by_username = data.created_by_username;
    this.assigned_to = data.assigned_to;
    this.assigned_to_username = data.assigned_to_username;
    this.project_name = data.project_name;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create new test case
  static async create(testCaseData) {
    return new Promise((resolve, reject) => {
      const {
        title,
        description,
        project_id,
        priority,
        status,
        steps,
        expected_result,
        created_by,
        assigned_to
      } = testCaseData;

      const testCase = new TestCase({
        title,
        description,
        project_id,
        priority,
        status,
        steps: JSON.stringify(steps || []),
        expected_result,
        created_by,
        assigned_to
      });

      const sql = `
        INSERT INTO test_cases (id, title, description, project_id, priority, status, steps, expected_result, created_by, assigned_to)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.run(sql, [
        testCase.id,
        testCase.title,
        testCase.description,
        testCase.project_id,
        testCase.priority,
        testCase.status,
        testCase.steps,
        testCase.expected_result,
        testCase.created_by,
        testCase.assigned_to
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(testCase);
        }
      });
    });
  }

  // Find test case by ID
  static async findById(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT tc.*, u1.username as created_by_username, u2.username as assigned_to_username, p.name as project_name
        FROM test_cases tc
        LEFT JOIN users u1 ON tc.created_by = u1.id
        LEFT JOIN users u2 ON tc.assigned_to = u2.id
        LEFT JOIN projects p ON tc.project_id = p.id
        WHERE tc.id = ?
      `;
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          // Parse steps JSON
          if (row.steps) {
            row.steps = JSON.parse(row.steps);
          }
          resolve(new TestCase(row));
        } else {
          resolve(null);
        }
      });
    });
  }

  // Find test cases by project
  static async findByProject(projectId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT tc.*, u1.username as created_by_username, u2.username as assigned_to_username, p.name as project_name
        FROM test_cases tc
        LEFT JOIN users u1 ON tc.created_by = u1.id
        LEFT JOIN users u2 ON tc.assigned_to = u2.id
        LEFT JOIN projects p ON tc.project_id = p.id
        WHERE tc.project_id = ?
        ORDER BY tc.created_at DESC
      `;
      db.all(sql, [projectId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Parse steps JSON for each row
          rows.forEach(row => {
            if (row.steps) {
              row.steps = JSON.parse(row.steps);
            }
          });
          resolve(rows.map(row => new TestCase(row)));
        }
      });
    });
  }

  // Find test cases by assigned user
  static async findByAssignedUser(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT tc.*, u1.username as created_by_username, u2.username as assigned_to_username, p.name as project_name
        FROM test_cases tc
        LEFT JOIN users u1 ON tc.created_by = u1.id
        LEFT JOIN users u2 ON tc.assigned_to = u2.id
        LEFT JOIN projects p ON tc.project_id = p.id
        WHERE tc.assigned_to = ?
        ORDER BY tc.priority DESC, tc.created_at DESC
      `;
      db.all(sql, [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Parse steps JSON for each row
          rows.forEach(row => {
            if (row.steps) {
              row.steps = JSON.parse(row.steps);
            }
          });
          resolve(rows.map(row => new TestCase(row)));
        }
      });
    });
  }

  // Get all test cases with optional filters
  static async findAll(filters = {}) {
    return new Promise((resolve, reject) => {
      let sql = `
        SELECT tc.*, u1.username as created_by_username, u2.username as assigned_to_username, p.name as project_name
        FROM test_cases tc
        LEFT JOIN users u1 ON tc.created_by = u1.id
        LEFT JOIN users u2 ON tc.assigned_to = u2.id
        LEFT JOIN projects p ON tc.project_id = p.id
        WHERE 1=1
      `;
      const params = [];

      if (filters.project_id) {
        sql += ' AND tc.project_id = ?';
        params.push(filters.project_id);
      }

      if (filters.status) {
        sql += ' AND tc.status = ?';
        params.push(filters.status);
      }

      if (filters.priority) {
        sql += ' AND tc.priority = ?';
        params.push(filters.priority);
      }

      if (filters.assigned_to) {
        sql += ' AND tc.assigned_to = ?';
        params.push(filters.assigned_to);
      }

      sql += ' ORDER BY tc.created_at DESC';

      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Parse steps JSON for each row
          rows.forEach(row => {
            if (row.steps) {
              row.steps = JSON.parse(row.steps);
            }
          });
          resolve(rows.map(row => new TestCase(row)));
        }
      });
    });
  }

  // Update test case
  async update(updateData) {
    return new Promise((resolve, reject) => {
      const {
        title,
        description,
        priority,
        status,
        steps,
        expected_result,
        assigned_to
      } = updateData;

      const sql = `
        UPDATE test_cases
        SET title = ?, description = ?, priority = ?, status = ?, steps = ?, expected_result = ?, assigned_to = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const stepsJson = steps ? JSON.stringify(steps) : this.steps;

      db.run(sql, [
        title || this.title,
        description !== undefined ? description : this.description,
        priority || this.priority,
        status || this.status,
        stepsJson,
        expected_result !== undefined ? expected_result : this.expected_result,
        assigned_to !== undefined ? assigned_to : this.assigned_to,
        this.id
      ], (err) => {
        if (err) {
          reject(err);
        } else {
          this.title = title || this.title;
          this.description = description !== undefined ? description : this.description;
          this.priority = priority || this.priority;
          this.status = status || this.status;
          this.steps = steps ? steps : this.steps;
          this.expected_result = expected_result !== undefined ? expected_result : this.expected_result;
          this.assigned_to = assigned_to !== undefined ? assigned_to : this.assigned_to;
          resolve(this);
        }
      });
    });
  }

  // Delete test case
  async delete() {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM test_cases WHERE id = ?';
      db.run(sql, [this.id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      project_id: this.project_id,
      project_name: this.project_name,
      priority: this.priority,
      status: this.status,
      steps: this.steps,
      expected_result: this.expected_result,
      created_by: this.created_by,
      created_by_username: this.created_by_username,
      assigned_to: this.assigned_to,
      assigned_to_username: this.assigned_to_username,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = TestCase;
