import mongoose from 'mongoose'

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  link: { type: String }
}, { timestamps: true })

export default mongoose.model('Event', EventSchema)
