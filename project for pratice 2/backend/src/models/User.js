import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  college: { type: String },
  year: { type: String },
  skills: { type: [String], default: [] },
  interests: { type: [String], default: [] },
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true })

export default mongoose.model('User', UserSchema)
