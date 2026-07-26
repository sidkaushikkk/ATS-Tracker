import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, sparse: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Boolean, default: false },
  authProviders: { type: [String], default: [] },
  profilePicture: { type: String },
  collegeName: { type: String },
  degree: { type: String },
  major: { type: String },
  currentStatus: { 
    type: String, 
    enum: ['Student', 'Job Seeker', 'Working Professional', 'Other'] 
  },
  currentRole: { type: String },
  targetRole: { type: String },
  graduationYear: { type: String },
  location: { type: String },
  bio: { type: String },
  linkedin: { type: String },
  github: { type: String },
  portfolio: { type: String },
  profileCompleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
