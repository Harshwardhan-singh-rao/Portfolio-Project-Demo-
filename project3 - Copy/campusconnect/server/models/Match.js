import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    matchedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Match', matchSchema);
