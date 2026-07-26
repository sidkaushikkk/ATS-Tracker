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
  // New fields for AI analysis
  analysisType: { type: String, enum: ['application_match', 'general', 'fallback'], default: 'fallback' },
  summary: { type: String },
  sectionScores: {
    contact: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    skills: { type: Number, default: 0 },
    education: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    writingImpact: { type: Number, default: 0 },
    atsReadability: { type: Number, default: 0 }
  },
  strengths: [{
    title: String,
    evidence: String
  }],
  problems: [{
    title: String,
    severity: String,
    evidence: String,
    recommendation: String
  }],
  matchedKeywords: [{
    name: String,
    evidence: String
  }],
  missingKeywords: [{
    name: String,
    importance: String
  }],
  recommendedRoles: [{
    role: String,
    match: Number,
    reason: String
  }],
  bulletRewrites: [{
    original: String,
    suggested: String,
    reason: String
  }],
  disclaimer: { type: String },

  // Metadata
  analysisSource: { type: String, enum: ['ai', 'fallback', 'failed'], default: 'fallback' },
  aiModel: { type: String },
  analysisVersion: { type: String },

  // Legacy fallback fields for backward compatibility
  overallScore: { type: Number, required: true },
  suggestions: [String],
  keyObservations: [String]
});

// Index for efficient dashboard queries
resumeAnalysisSchema.index({ userId: 1, uploadDate: -1 });

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
export default ResumeAnalysis;
