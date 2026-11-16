import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, trim: true, unique: true },
  type: { type: String, default: "Single", trim: true },
  capacity: { type: Number, required: true, min: 1, default: 1 },
  monthlyRate: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["Available", "Occupied", "Maintenance"], default: "Available" }
}, { timestamps: true });

export default mongoose.model("Room", roomSchema);
