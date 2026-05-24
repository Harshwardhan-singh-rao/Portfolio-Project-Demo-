import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    college: String,
    year: String,
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    goals: { type: String, default: '' },
    embedding: { type: [Number], default: [] },
    compatibilityScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
