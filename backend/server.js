// backend/server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import admin from "./firebaseAdmin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Connect to MongoDB
if (!process.env.MONGODB_URI) {
  console.error("❌ ERROR: MONGODB_URI is not set in .env file");
} else {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("✅ Connected to MongoDB");
    })
    .catch((error) => {
      console.error("❌ MongoDB connection error:", error);
      console.error("Please check your MONGODB_URI in .env file");
    });
}

// Status route
app.get("/", (req, res) => {
  res.json({
    message: "NEDAAS backend is running",
    firebaseAdmin: admin.apps.length > 0 ? "Initialized" : "Not initialized",
    mongodb:
      mongoose.connection.readyState === 1 ? "Connected" : "Not connected",
    mongodbState: mongoose.connection.readyState,
  });
});

// API routes
app.use("/api/auth", authRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(500).json({
    message: "Unexpected server error",
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
