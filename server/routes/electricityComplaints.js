import { Router } from "express"; 
import multer from 'multer';
import { electricityComplaints, generateElecComplaintId } from "../data/dummyData.js";

const router = Router();
const workerList = ["Ravi Kumar", "Neha Sharma", "Suresh Patel", "Anita Das"];

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single('photo'), (req, res) => {
  let phone, consumerNumber, type, category, description, location, priority = 'MEDIUM', photo;
  
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    // Handle FormData (photo upload)
    const formData = req.body; // Note: need multer middleware for proper FormData
    phone = req.body.phone;
    consumerNumber = req.body.consumerNumber;
    type = req.body.type;
    description = req.body.description;
    location = req.body.location;
    photo = req.file ? req.file.originalname : null;
    category = req.body.category || type; // fallback
  } else {
    // Handle JSON
    ({ phone, consumerNumber, type, category, description, location, priority } = req.body);
  }
  
  if (!phone || !description || !location) {
    return res.status(400).json({ message: "Phone, description and location required" });
  }
  const id = generateElecComplaintId();
  const now = new Date().toISOString();
  const complaint = {
    complaintId: id,
    phone,
    consumerNumber,
    type,
    category,
    description,
    location,
    priority,
    photo: photo ? photo.filename : null,
    status: 'PENDING',
    createdAt: now,
    updatedAt: now
  };
  electricityComplaints.unshift(complaint);
  res.json({ success: true, data: complaint });
});

router.get("/", (req, res) => {
  let complaints = [...electricityComplaints];
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
  if (!assignedTo) return res.status(400).json({ message: "assignedTo required" });
  const index = electricityComplaints.findIndex(c => c.complaintId === id);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  electricityComplaints[index].status = 'ASSIGNED';
  electricityComplaints[index].assignedTo = assignedTo;
  electricityComplaints[index].assignedAt = new Date().toISOString();
  electricityComplaints[index].updatedAt = new Date().toISOString();
  res.json({ complaint: electricityComplaints[index] });
});

router.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, resolutionNotes } = req.body;
  const index = electricityComplaints.findIndex(c => c.complaintId === id);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  electricityComplaints[index].status = status;
  electricityComplaints[index].updatedAt = new Date().toISOString();
  if (resolutionNotes) electricityComplaints[index].resolutionNotes = resolutionNotes;
  res.json({ complaint: electricityComplaints[index] });
});

export default router;

