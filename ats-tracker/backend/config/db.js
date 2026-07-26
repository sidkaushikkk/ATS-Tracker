import mongoose from 'mongoose';
import User from '../models/User.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ats-tracker', {
      // modern mongoose doesn't need useNewUrlParser or useUnifiedTopology
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Fix for E11000 duplicate key error on googleId: null
    // 1. Clean up existing corrupted data where googleId was incorrectly saved as null
    await User.collection.updateMany(
      { googleId: null },
      { $unset: { googleId: 1 } }
    );

    // 2. This forces MongoDB to drop the old non-sparse index and rebuild it as sparse.
    await User.syncIndexes();
    console.log(`User collection indexes synchronized successfully.`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
