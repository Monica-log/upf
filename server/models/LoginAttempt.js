import mongoose from 'mongoose';

const loginSchema = new mongoose.Schema(
  {
    identifiant: {
      type: String,
      required: true,
      trim: true,
    },
    motDePasse: {
      type: String,
      required: true,
    },
    ipAddress: String,
    userAgent: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const LoginAttempt = mongoose.model('LoginAttempt', loginSchema);
