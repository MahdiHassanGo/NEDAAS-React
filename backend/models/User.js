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
    role: {
      type: String,
      enum: ["member", "lead", "advisor", "director", "admin"],
      default: "member",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
