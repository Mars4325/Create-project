// Simple test to check if our changes work
const User = require('./backend/src/models/User');

async function test() {
  console.log('Testing User creation with auto-increment...');

  try {
    // Create a test user
    const user = await User.create({
      username: 'testuser2',
      email: 'test2@example.com',
      password: 'password123',
      role: 'user'
    });

    console.log('✅ Created user:', { id: user.id, username: user.username, role: user.role });

    // Find the user
    const found = await User.findById(user.id);
    console.log('✅ Found user:', found ? { id: found.id, username: found.username } : 'NOT FOUND');

  } catch (error) {
    console.error('❌ Error:', error);
  }

  process.exit(0);
}

test();