// backend/routes/adminRoutes.js
import express from "express";
import User from "../models/User.js";
import Publication from "../models/Publication.js";
import {
  verifyFirebaseToken,
  requireAdmin,
} from "../middleware/authMiddleware.js";
import Conference from "../models/Conference.js";


const router = express.Router();

// --------- CONFIG: ROOT ADMIN -----------
const ROOT_ADMIN_EMAIL = "mahdiasif78@gmail.com";

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

  // Find user first, so we can check email
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // ❌ Do not allow changing root admin's role
  if (user.email === ROOT_ADMIN_EMAIL && role !== "admin") {
    return res.status(403).json({
      message: "This user is locked as default admin and cannot be changed.",
    });
  }

  user.role = role; // safe to change
  await user.save();

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

  // If this is the root admin email, FORCE role = "admin"
  const finalRole =
    email === ROOT_ADMIN_EMAIL ? "admin" : role;

  let user = await User.findOne({ email });

  if (user) {
    // Existing user → update role (respecting root admin lock)
    if (email === ROOT_ADMIN_EMAIL && user.role !== "admin") {
      user.role = "admin"; // enforce admin
    } else {
      user.role = finalRole;
    }

    if (displayName) user.displayName = displayName;
    await user.save();
  } else {
    // New user → create with enforced role
    user = await User.create({
      email,
      displayName: displayName || null,
      role: finalRole,
      uid:
        email === ROOT_ADMIN_EMAIL
          ? `root-admin-${Date.now()}`
          : `manual-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    });
  }

  res.status(201).json(user);
});

// GET /api/admin/publications - Get all publications for admin review
router.get("/publications", async (req, res) => {
  try {
    const publications = await Publication.find()
      .populate("createdBy", "email displayName")
      .sort({ createdAt: -1 });
    res.json(publications);
  } catch (err) {
    console.error("Get publications error:", err);
    res.status(500).json({
      message: "Failed to fetch publications",
      error: err.message,
    });
  }
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
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
});

// PATCH /api/admin/publications/:id/status - Update publication status
router.patch("/publications/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "approved", "rejected"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const pub = await Publication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("createdBy", "email displayName");

    if (!pub) {
      return res.status(404).json({ message: "Publication not found" });
    }

    res.json(pub);
  } catch (err) {
    console.error("Update publication status error:", err);
    res.status(500).json({
      message: "Failed to update status",
      error: err.message,
    });
  }
});

// PUT /api/admin/publications/:id - Edit publication
router.put("/publications/:id", async (req, res) => {
  try {
    const { meta, title, authors, description, tag, link, linkLabel } =
      req.body;

    const pub = await Publication.findByIdAndUpdate(
      req.params.id,
      {
        meta,
        title,
        authors,
        description,
        tag,
        link,
        linkLabel,
      },
      { new: true, runValidators: true }
    ).populate("createdBy", "email displayName");

    if (!pub) {
      return res.status(404).json({ message: "Publication not found" });
    }

    res.json(pub);
  } catch (err) {
    console.error("Update publication error:", err);
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
});

export default router;

// ========== TEAM ROUTES (ADMIN) ==========

// GET /api/admin/teams
router.get("/teams", async (req, res) => {
  const leads = await User.find({ role: "lead" });
  const leadIds = leads.map((l) => l._id);

  const members = await User.find({ lead: { $in: leadIds } });

  const grouped = leads.map((lead) => ({
    lead,
    members: members.filter(
      (m) => m.lead && m.lead.toString() === lead._id.toString()
    ),
  }));

  res.json(grouped);
});

// POST /api/admin/teams/assign-member
router.post("/teams/assign-member", async (req, res) => {
  const { memberId, leadId } = req.body;
  if (!memberId || !leadId) {
    return res
      .status(400)
      .json({ message: "memberId and leadId are required" });
  }

  const member = await User.findById(memberId);
  const lead = await User.findById(leadId);

  if (!member || !lead) {
    return res.status(404).json({ message: "Member or Lead not found" });
  }

  member.lead = lead._id;
  await member.save();

  res.json(member);
});

// PUT /api/admin/teams/members/:memberId
router.put("/teams/members/:memberId", async (req, res) => {
  const { memberId } = req.params;
  const { displayName, mobile, studentId, studentEmail } = req.body;

  const member = await User.findByIdAndUpdate(
    memberId,
    { displayName, mobile, studentId, studentEmail },
    { new: true, runValidators: true }
  );

  if (!member) {
    return res.status(404).json({ message: "Member not found" });
  }

  res.json(member);
});

// ========== ADMIN CONFERENCES VIEW ==========

// GET /api/admin/conferences
router.get("/conferences", async (req, res) => {
  const confs = await Conference.find()
    .populate("lead", "email displayName")
    .populate("authors", "email displayName");
  res.json(confs);
});
