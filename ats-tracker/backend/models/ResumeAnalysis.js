import mongoose from 'mongoose';

const resumeAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  overallScore: {
    type: Number,
    required: true
  },
  matchedKeywords: [{
    name: String,
    value: Number
  }],
  recommendedRoles: [{
    role: String,
    match: Number,
    level: String
  }],
  problems: [String],
  suggestions: [String],
  keyObservations: [String]
});

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
export default ResumeAnalysis;
