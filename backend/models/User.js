// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      index: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: String,

    // role for dashboard routing
    role: {
      type: String,
      enum: ["member", "lead", "advisor", "director", "admin"],
      default: "member",
    },

    // extra fields used in team / lead features
    mobile: { type: String },
    studentId: { type: String },
    studentEmail: { type: String },

    // reference to lead (for members)
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User; // 👈 VERY IMPORTANT
