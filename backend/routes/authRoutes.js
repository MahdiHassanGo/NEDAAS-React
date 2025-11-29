// backend/routes/authRoutes.js
import express from "express";
import mongoose from "mongoose";
import admin from "../firebaseAdmin.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token is required" });
    }

    // Check Firebase Admin initialized
    if (!admin.apps.length) {
      console.error("Firebase Admin not initialized");
      return res.status(500).json({
        message:
          "Firebase Admin not initialized. Please check your .env configuration.",
        error: "Firebase Admin SDK not configured",
      });
    }

    // Verify the Firebase ID token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (firebaseError) {
      console.error("Firebase token verification error:", firebaseError.message);
      return res.status(401).json({
        message: "Invalid or expired token",
        error: firebaseError.message,
      });
    }

    const { uid, email, name } = decodedToken;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Admin shortcut
    const isAdminEmail = email === "mahdiasif78@gmail.com";

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error(
        "MongoDB not connected. ReadyState:",
        mongoose.connection.readyState
      );
      return res.status(500).json({
        message: "Database connection error",
        error:
          "MongoDB is not connected. Please check your MONGODB_URI in .env file",
      });
    }

    let user;
    try {
      user = await User.findOne({ uid });

      if (!user) {
        // Create new user
        user = new User({
          uid,
          email,
          displayName: name || null,
          role: isAdminEmail ? "admin" : "member",
        });
        await user.save();
        console.log(`✅ New user created: ${email} with role: ${user.role}`);
      } else {
        // Update role/displayName if needed
        let changed = false;

        if (isAdminEmail && user.role !== "admin") {
          user.role = "admin";
          changed = true;
          console.log(`🔑 User ${email} role updated to admin`);
        }

        if (!user.displayName && name) {
          user.displayName = name;
          changed = true;
        }

        if (changed) {
          await user.save();
        }
      }
    } catch (dbError) {
      console.error("❌ Database error:", dbError);
      return res.status(500).json({
        message: "Database error",
        error: dbError.message,
      });
    }

    return res.status(200).json({
      message: "Login OK",
      role: user.role,
      user: {
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default router;
