// backend/routes/leadRoutes.js
import express from "express";
import User from "../models/User.js";
import Conference from "../models/Conference.js";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All lead routes require auth
router.use(verifyFirebaseToken);

// Helper: ensure user is a lead
function requireLead(req, res, next) {
  if (!req.user || req.user.role !== "lead") {
    return res.status(403).json({ message: "Lead role required" });
  }
  next();
}

// GET /api/lead/team
router.get("/team", requireLead, async (req, res) => {
  const lead = await User.findById(req.user._id);

  const members = await User.find({ lead: lead._id }).select(
    "displayName email mobile studentId studentEmail"
  );

  res.json({
    lead: {
      _id: lead._id,
      displayName: lead.displayName,
      email: lead.email,
    },
    members,
  });
});

// GET /api/lead/conferences
router.get("/conferences", requireLead, async (req, res) => {
  const confs = await Conference.find({ lead: req.user._id }).populate(
    "authors",
    "displayName email"
  );
  res.json(confs);
});

// POST /api/lead/conferences
router.post("/conferences", requireLead, async (req, res) => {
  const { title, date, link, authorIds } = req.body;

  const conf = await Conference.create({
    title,
    date,
    link,
    lead: req.user._id,
    authors: authorIds || [],
    status: "submitted",
  });

  res.status(201).json(conf);
});

// PUT /api/lead/conferences/:id
router.put("/conferences/:id", requireLead, async (req, res) => {
  const { id } = req.params;
  const { title, date, link, authorIds, status } = req.body;

  const conf = await Conference.findOneAndUpdate(
    { _id: id, lead: req.user._id }, // ensure lead owns it
    {
      ...(title && { title }),
      ...(date && { date }),
      ...(link && { link }),
      ...(authorIds && { authors: authorIds }),
      ...(status && { status }),
    },
    { new: true }
  ).populate("authors", "displayName email");

  if (!conf) {
    return res.status(404).json({ message: "Conference not found" });
  }

  res.json(conf);
});

export default router;
