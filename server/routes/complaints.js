import { Router } from "express";
import { waterComplaints, generateWaterComplaintId } from "../data/dummyData.js";

const router = Router();
const workerList = ["Ravi Kumar", "Neha Sharma", "Suresh Patel", "Anita Das"];

router.post("/", (req, res) => {
  const { phone, type, category, subcategory, description, location, priority = 'MEDIUM' } = req.body;
  if (!phone || !description || !location) {
    return res.status(400).json({ message: "Phone, description and location required" });
  }
  const id = generateWaterComplaintId();
  const now = new Date().toISOString();
  const complaint = {
    complaintId: id,
    phone,
    type: type || category,
    category,
    subcategory,
    description,
    location,
    priority,
    status: 'PENDING',
    createdAt: now,
    updatedAt: now
  };
  waterComplaints.unshift(complaint);
  res.json({ success: true, data: complaint });
});

router.get("/", (req, res) => {
  let complaints = [...waterComplaints];
  const { status, priority, area, search, phone, sort, from, to, limit = '200' } = req.query;
  const numLimit = parseInt(String(limit));
  
  if (status) complaints = complaints.filter(c => c.status === status);
  if (priority) complaints = complaints.filter(c => c.priority === priority);
  if (area) complaints = complaints.filter(c => c.location.includes(String(area)));
  if (phone) complaints = complaints.filter(c => c.phone === phone);
  if (search) {
    const s = String(search);
    complaints = complaints.filter(c => 
      c.complaintId.includes(s) || 
      c.description.toLowerCase().includes(s.toLowerCase()) || 
      c.location.toLowerCase().includes(s.toLowerCase()) || 
      c.category.toLowerCase().includes(s.toLowerCase())
    );
  }
  if (from || to) {
    const fromDate = from ? new Date(String(from)) : new Date(0);
    const toDate = to ? new Date(String(to)) : new Date();
    complaints = complaints.filter(c => new Date(c.createdAt) >= fromDate && new Date(c.createdAt) <= toDate);
  }
  if (sort === 'oldest') complaints.reverse();
  complaints = complaints.slice(0, numLimit);
  res.json({ complaints, workers: workerList });
});

router.patch("/:id/assign", (req, res) => {
  const { id } = req.params;
  const { assignedTo } = req.body;

  if (!assignedTo) {
    return res.status(400).json({ message: "assignedTo is required" });
  }

  const index = waterComplaints.findIndex(c => c.complaintId === id);
  if (index === -1) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  waterComplaints[index].status = 'ASSIGNED';
  waterComplaints[index].assignedTo = assignedTo;
  waterComplaints[index].assignedAt = new Date().toISOString();
  waterComplaints[index].updatedAt = new Date().toISOString();

  res.json({ complaint: waterComplaints[index] });
});

router.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, resolutionNotes, resolvedAt } = req.body;

  const index = waterComplaints.findIndex(c => c.complaintId === id);
  if (index === -1) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  waterComplaints[index].status = status;
  waterComplaints[index].updatedAt = new Date().toISOString();
  if (resolutionNotes) waterComplaints[index].resolutionNotes = resolutionNotes;
  if (status === 'RESOLVED' || status === 'APPROVED') {
    waterComplaints[index].resolutionNotes = resolutionNotes || 'Resolved by admin';
  }

  res.json({ complaint: waterComplaints[index] });
});

export default router;
