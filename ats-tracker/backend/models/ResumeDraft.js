import mongoose from 'mongoose';

const resumeDraftSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeData: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    default: 'Untitled Draft'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient querying by user and sorting by recency
resumeDraftSchema.index({ userId: 1, updatedAt: -1 });

const ResumeDraft = mongoose.model('ResumeDraft', resumeDraftSchema);
export default ResumeDraft;
