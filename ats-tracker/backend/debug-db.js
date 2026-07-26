import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';

async function debugDB() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    // Get all indexes
    const indexes = await User.collection.indexes();
    console.log('Current User Indexes:', JSON.stringify(indexes, null, 2));

    // Try creating a test user without googleId
    console.log('Trying to create test user 1...');
    await User.deleteMany({ email: 'debugtest1@example.com' });
    await User.create({
      email: 'debugtest1@example.com',
      name: 'Debug Test 1',
      authProviders: ['emailOtp']
    });
    console.log('Test user 1 created successfully.');

    // Try creating a second test user without googleId
    console.log('Trying to create test user 2...');
    await User.deleteMany({ email: 'debugtest2@example.com' });
    await User.create({
      email: 'debugtest2@example.com',
      name: 'Debug Test 2',
      authProviders: ['emailOtp']
    });
    console.log('Test user 2 created successfully.');

    // Clean up
    await User.deleteMany({ email: { $in: ['debugtest1@example.com', 'debugtest2@example.com'] } });
    console.log('Cleanup done. No duplicate key errors!');

  } catch (err) {
    console.error('DEBUG ERROR:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

debugDB();
