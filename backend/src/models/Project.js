const { db } = require('../database/init');
const { v4: uuidv4 } = require('uuid');

class Project {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.description = data.description;
    this.owner_id = data.owner_id;
    this.owner_username = data.owner_username;
    this.status = data.status || 'active';
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create new project
  static async create(projectData) {
    return new Promise((resolve, reject) => {
      const { name, description, owner_id } = projectData;

      const project = new Project({
        name,
        description,
        owner_id
      });

      const sql = `
        INSERT INTO projects (id, name, description, owner_id, status)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.run(sql, [project.id, project.name, project.description, project.owner_id, project.status], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(project);
        }
      });
    });
  }

  // Find project by ID
  static async findById(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT p.*, u.username as owner_username
        FROM projects p
        LEFT JOIN users u ON p.owner_id = u.id
        WHERE p.id = ?
      `;
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(new Project(row));
        } else {
          resolve(null);
        }
      });
    });
  }

  // Find projects by owner
  static async findByOwner(ownerId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT p.*, u.username as owner_username
        FROM projects p
        LEFT JOIN users u ON p.owner_id = u.id
        WHERE p.owner_id = ?
        ORDER BY p.created_at DESC
      `;
      db.all(sql, [ownerId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(row => new Project(row)));
        }
      });
    });
  }

  // Get all projects
  static async findAll() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT p.*, u.username as owner_username
        FROM projects p
        LEFT JOIN users u ON p.owner_id = u.id
        ORDER BY p.created_at DESC
      `;
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(row => new Project(row)));
        }
      });
    });
  }

  // Update project
  async update(updateData) {
    return new Promise((resolve, reject) => {
      const { name, description, status } = updateData;
      const sql = `
        UPDATE projects
        SET name = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      db.run(sql, [name || this.name, description || this.description, status || this.status, this.id], (err) => {
        if (err) {
          reject(err);
        } else {
          this.name = name || this.name;
          this.description = description || this.description;
          this.status = status || this.status;
          resolve(this);
        }
      });
    });
  }

  // Delete project
  async delete() {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM projects WHERE id = ?';
      db.run(sql, [this.id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Get test cases count for this project
  async getTestCasesCount() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT COUNT(*) as count FROM test_cases WHERE project_id = ?';
      db.get(sql, [this.id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.count);
        }
      });
    });
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      owner_id: this.owner_id,
      owner_username: this.owner_username,
      status: this.status,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Project;
