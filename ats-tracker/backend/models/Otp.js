import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  codeHash: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  consumed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// TTL index to automatically delete expired OTP records after 600 seconds (10 minutes)
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;
