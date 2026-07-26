import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  profilePicture: {
    type: String
  },
  // New profile fields
  college: { type: String },
  degree: { type: String },
  currentStatus: { 
    type: String, 
    enum: ['Student', 'Job Seeker', 'Working Professional', 'Other'] 
  },
  currentRole: { type: String },
  graduationYear: { type: String },
  location: { type: String },
  bio: { type: String },
  linkedinUrl: { type: String },
  githubUrl: { type: String },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
export default User;
