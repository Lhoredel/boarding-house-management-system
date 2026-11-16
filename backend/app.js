
import express from "express";
import cors from "cors";
import Room from "./models/Room.js";
import Tenant from "./models/Tenant.js";
import Payment from "./models/Payment.js";
import Maintenance from "./models/Maintenance.js";
import { createResourceRouter } from "./routes/resourceRoutes.js";

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://boarding-house-management-system.netlify.app"
];

// CORS configuration for local development and production
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // and requests from approved frontend URLs.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Parse JSON request bodies
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "boarding-house-api"
  });
});

// API routes
app.use(
  "/api/rooms",
  createResourceRouter(Room, ["roomNumber", "type", "status"])
);

app.use(
  "/api/tenants",
  createResourceRouter(Tenant, ["fullName", "email", "phone", "status"])
);

app.use(
  "/api/payments",
  createResourceRouter(Payment, ["method", "status", "reference"])
);

app.use(
  "/api/maintenance",
  createResourceRouter(Maintenance, [
    "title",
    "description",
    "status",
    "priority"
  ])
);

// Handle unknown API routes
app.use((_req, res) => {
  res.status(404).json({
    message: "API endpoint not found."
  });
});

// Global error handler
app.use((error, _req, res, _next) => {
  console.error(error);

  if (
    error.name === "ValidationError" ||
    error.name === "CastError" ||
    error.code === 11000
  ) {
    return res.status(400).json({
      message: error.message
    });
  }

  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "Origin not allowed by CORS."
    });
  }

  res.status(500).json({
    message: "Internal server error."
  });
});

export default app;
