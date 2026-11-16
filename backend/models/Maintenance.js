import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  status: { type: String, enum: ["Open", "In Progress", "Completed"], default: "Open" }
}, { timestamps: true });

export default mongoose.model("Maintenance", maintenanceSchema);
