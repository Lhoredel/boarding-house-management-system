import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  moveInDate: { type: Date },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
}, { timestamps: true });

export default mongoose.model("Tenant", tenantSchema);
