// backend/routes/adminRoutes.js
import express from "express";
import User from "../models/User.js";
import Publication from "../models/Publication.js";
import {
  verifyFirebaseToken,
  requireAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes here require admin
router.use(verifyFirebaseToken, requireAdmin);

// GET /api/admin/users
router.get("/users", async (req, res) => {
  const users = await User.find({}, "email displayName role").sort({ email: 1 });
  res.json(users);
});

// PATCH /api/admin/users/:id/role
router.patch("/users/:id/role", async (req, res) => {
  const { role } = req.body;
  const allowed = ["member", "lead", "advisor", "director", "admin"];

  if (!allowed.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

// POST /api/admin/users/manual
router.post("/users/manual", async (req, res) => {
  const { email, displayName, role } = req.body;

  if (!email || !role) {
    return res
      .status(400)
      .json({ message: "Email and role are required" });
  }

  const allowed = ["member", "lead", "advisor", "director", "admin"];
  if (!allowed.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  let user = await User.findOne({ email });

  if (user) {
    user.role = role;
    if (displayName) user.displayName = displayName;
    await user.save();
  } else {
    user = await User.create({
      email,
      displayName: displayName || null,
      role,
      uid: null, // will link later when they login
    });
  }

  res.status(201).json(user);
});

// POST /api/admin/publications
router.post("/publications", async (req, res) => {
  try {
    const { meta, title, authors, description, tag, link, linkLabel } =
      req.body;

    const pub = await Publication.create({
      meta,
      title,
      authors,
      description,
      tag,
      link,
      linkLabel,
      status: "approved", // since admin adds it
      createdBy: req.user._id,
    });

    res.status(201).json(pub);
  } catch (err) {
    console.error("Create publication error:", err);
    res
      .status(400)
      .json({ message: "Invalid data", error: err.message });
  }
});

export default router;
