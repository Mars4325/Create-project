// Reset database and test
const fs = require('fs');
const path = require('path');
const User = require('./backend/src/models/User');

const dbPath = path.join(__dirname, 'backend', 'database', 'taskhub.db');

// Remove old database
if (fs.existsSync(dbPath)) {
  console.log('Removing old database...');
  fs.unlinkSync(dbPath);
}

console.log('Testing User creation with auto-increment...');

async function test() {
  try {
    // Create a test user
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });

    console.log('✅ Created user:', { id: user.id, username: user.username, role: user.role });

    // Find the user
    const found = await User.findById(user.id);
    console.log('✅ Found user:', found ? { id: found.id, username: found.username } : 'NOT FOUND');

    // Test JWT generation
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = 'your-secret-key-change-in-production';
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
    console.log('✅ Generated token for user id:', user.id);

    // Test JWT verification
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Decoded token userId:', decoded.userId);

    // Find user by decoded ID
    const verifiedUser = await User.findById(decoded.userId);
    console.log('✅ Verified user from token:', verifiedUser ? verifiedUser.username : 'NOT FOUND');

  } catch (error) {
    console.error('❌ Error:', error);
  }

  console.log('Test completed!');
}

test();