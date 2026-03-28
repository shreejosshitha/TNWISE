import { Router } from "express";
import Complaint from "../models/Complaint.js";

const router = Router();
const workerList = ["Ravi Kumar", "Neha Sharma", "Suresh Patel", "Anita Das"];

router.get("/", async (req, res) => {
  const { status, priority, area, search, sort, from, to } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (area) filter.area = area;

  if (search) {
    const regex = new RegExp(String(search), "i");
    filter.$or = [
      { complaintId: regex },
      { description: regex },
      { location: regex },
      { subcategory: regex },
    ];
  }

  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(String(from));
    if (to) filter.createdAt.$lte = new Date(String(to));
  }

  let query = Complaint.find(filter);
  if (sort === "oldest") {
    query = query.sort({ createdAt: 1 });
  } else {
    query = query.sort({ createdAt: -1 });
  }

  const complaints = await query.limit(200).lean();
  res.json({ complaints, workers: workerList });
});

router.patch("/:id/assign", async (req, res) => {
  const { id } = req.params;
  const { assignedTo } = req.body;

  if (!assignedTo) {
    return res.status(400).json({ message: "assignedTo is required" });
  }

  const complaint = await Complaint.findOneAndUpdate(
    { complaintId: id },
    {
      status: "ASSIGNED",
      assignedTo,
      assignedAt: new Date(),
      updatedAt: new Date(),
    },
    { new: true }
  ).lean();

  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  res.json({ complaint });
});

router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status, resolutionNotes, resolvedAt } = req.body;

  const update = {
    status,
    updatedAt: new Date(),
  };

  if (status === "RESOLVED") {
    update.resolvedAt = resolvedAt ? new Date(resolvedAt) : new Date();
    update.resolutionNotes = resolutionNotes || "Resolved by admin";
  }

  const complaint = await Complaint.findOneAndUpdate({ complaintId: id }, update, {
    new: true,
  }).lean();

  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  res.json({ complaint });
});

export default router;
