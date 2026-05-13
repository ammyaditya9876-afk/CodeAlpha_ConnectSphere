import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true },
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Meeting = mongoose.model('Meeting', meetingSchema);
export default Meeting;
