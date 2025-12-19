const { db } = require('./backend/src/database/init');
const User = require('./backend/src/models/User');

async function test() {
  console.log('Testing database...');

  // Create a test user
  try {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });
    console.log('Created user:', user.id, user.username);

    // Find the user
    const found = await User.findById(user.id);
    console.log('Found user:', found ? found.username : 'NOT FOUND');

    // List all users
    const all = await User.findAll();
    console.log('All users:', all.map(u => ({ id: u.id, username: u.username })));

  } catch (error) {
    console.error('Error:', error);
  }

  process.exit(0);
}

test();