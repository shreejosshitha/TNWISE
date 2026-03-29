import { Router } from "express";
import { waterConnections, generateWaterConnectionId } from "../data/dummyData.js";

const router = Router();

router.post("/", (req, res) => {
  const { phone, applicantName, email, address, connectionType } = req.body;
  if (!phone || !applicantName || !address || !connectionType) {
    return res.status(400).json({ message: "Required fields missing" });
  }
  const id = generateWaterConnectionId();
  const now = new Date().toISOString();
  const connection = {
    connectionId: id,
    phone,
    applicantName,
    email,
    address,
    connectionType,
    status: 'PENDING',
    submittedAt: now,
    updatedAt: now
  };
  waterConnections.unshift(connection);
  res.json({ success: true, data: connection });
});

router.get("/", (req, res) => {
  let list = [...waterConnections];
  const { status, phone, search, sort, limit = '200' } = req.query;
  const numLimit = parseInt(limit);
  
  if (status) list = list.filter(c => c.status === status);
  if (phone) list = list.filter(c => c.phone === phone);
  if (search) {
    const s = String(search);
    list = list.filter(c => 
      c.connectionId.includes(s) || 
      c.applicantName.toLowerCase().includes(s.toLowerCase()) || 
      c.address.toLowerCase().includes(s.toLowerCase())
    );
  }
  if (sort === 'oldest') list.reverse();
  list = list.slice(0, numLimit);
  res.json({ connections: list });
});

router.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, rejectionReason, notes } = req.body;
  const index = waterConnections.findIndex(c => c.connectionId === id);
  if (index === -1) return res.status(404).json({ message: "Connection not found" });
  
  waterConnections[index].status = status;
  waterConnections[index].updatedAt = new Date().toISOString();
  if (status === 'REJECTED' && rejectionReason) waterConnections[index].rejectionReason = rejectionReason;
  if (status === 'VERIFIED') waterConnections[index].verifiedAt = new Date().toISOString();
  if (status === 'APPROVED') waterConnections[index].approvedAt = new Date().toISOString();
  if (status === 'INSTALLED') waterConnections[index].installedAt = new Date().toISOString();
  
  res.json({ connection: waterConnections[index] });
});

export default router;

