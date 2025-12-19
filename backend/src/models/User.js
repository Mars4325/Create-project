const { db } = require('../database/init');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class User {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.username = data.username;
    this.email = data.email;
    this.password_hash = data.password_hash;
    this.role = data.role || 'user';
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create new user
  static async create(userData) {
    return new Promise((resolve, reject) => {
      const { username, email, password, role } = userData;

      // Hash password
      bcrypt.hash(password, 12, (err, hash) => {
        if (err) return reject(err);

        const sql = `
          INSERT INTO users (id, username, email, password_hash, role)
          VALUES (?, ?, ?, ?, ?)
        `;

        db.run(sql, [user.id, user.username, user.email, user.password_hash, user.role], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(user);
          }
        });
      });
    });
  }

  // Find user by ID
  static async findById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(new User(row));
        } else {
          resolve(null);
        }
      });
    });
  }

  // Find user by username
  static async findByUsername(username) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE username = ?';
      db.get(sql, [username], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(new User(row));
        } else {
          resolve(null);
        }
      });
    });
  }

  // Find user by email
  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ?';
      db.get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(new User(row));
        } else {
          resolve(null);
        }
      });
    });
  }

  // Get all users
  static async findAll() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(row => new User(row)));
        }
      });
    });
  }

  // Verify password
  async verifyPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  // Update user
  async update(updateData) {
    return new Promise((resolve, reject) => {
      const { username, email, role } = updateData;
      const sql = `
        UPDATE users
        SET username = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      db.run(sql, [username || this.username, email || this.email, role || this.role, this.id], (err) => {
        if (err) {
          reject(err);
        } else {
          this.username = username || this.username;
          this.email = email || this.email;
          this.role = role || this.role;
          resolve(this);
        }
      });
    });
  }

  // Delete user
  async delete() {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM users WHERE id = ?';
      db.run(sql, [this.id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Convert to JSON (without password hash)
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      role: this.role,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = User;
