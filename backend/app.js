import express from "express";
import cors from "cors";
import Room from "./models/Room.js";
import Tenant from "./models/Tenant.js";
import Payment from "./models/Payment.js";
import Maintenance from "./models/Maintenance.js";
import { createResourceRouter } from "./routes/resourceRoutes.js";

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "boarding-house-api" });
});

app.use("/api/rooms", createResourceRouter(Room, ["roomNumber", "type", "status"]));
app.use("/api/tenants", createResourceRouter(Tenant, ["fullName", "email", "phone", "status"]));
app.use("/api/payments", createResourceRouter(Payment, ["method", "status", "reference"]));
app.use("/api/maintenance", createResourceRouter(Maintenance, ["title", "description", "status", "priority"]));

app.use((_req, res) => res.status(404).json({ message: "API endpoint not found." }));

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.name === "ValidationError" || error.name === "CastError" || error.code === 11000) {
    return res.status(400).json({ message: error.message });
  }
  res.status(500).json({ message: "Internal server error." });
});

export default app;
