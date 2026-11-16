import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
  amount: { type: Number, required: true, min: 0 },
  paymentDate: { type: Date, default: Date.now },
  method: { type: String, default: "Cash" },
  status: { type: String, enum: ["Paid", "Pending"], default: "Paid" },
  reference: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
