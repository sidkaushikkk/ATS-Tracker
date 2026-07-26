import 'dotenv/config';
import connectDB from './config/db.js';
import User from './models/User.js';

async function test() {
  try {
    await connectDB();
    console.log('Connected to DB');

    // Test creating an email-only user
    const user1 = await User.create({
      email: 'test1@example.com',
      name: 'Test 1',
      emailVerified: true,
      authProviders: ['emailOtp']
    });
    console.log('Created user1:', user1._id);

    // Test creating another email-only user
    const user2 = await User.create({
      email: 'test2@example.com',
      name: 'Test 2',
      emailVerified: true,
      authProviders: ['emailOtp']
    });
    console.log('Created user2:', user2._id);

    // Clean up
    await User.deleteMany({ email: { $in: ['test1@example.com', 'test2@example.com'] } });
    console.log('Cleaned up');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
test();
