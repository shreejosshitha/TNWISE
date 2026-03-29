import { Router } from "express";
import { electricityConnections, generateElecConnectionId } from "../data/dummyData.js";

const router = Router();

router.post("/", (req, res) => {
  const { phone, applicantName, email, address, connectionType } = req.body;
  if (!phone || !applicantName || !address || !connectionType) {
    return res.status(400).json({ message: "Required fields missing" });
  }
  const id = generateElecConnectionId();
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
  electricityConnections.unshift(connection);
  res.json({ success: true, data: connection });
});

router.get("/", (req, res) => {
  let list = [...electricityConnections];
  const { status, phone, search, sort, limit = '200' } = req.query;
  const numLimit = parseInt(limit);
  
  if (status) list = list.filter(c => c.status === status);
  if (phone) list = list.filter(c => c.phone === phone);
  if (search) {
    const s = search;
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
  const { status, rejectionReason } = req.body;
  const index = electricityConnections.findIndex(c => c.connectionId === id);
  if (index === -1) return res.status(404).json({ message: "Connection not found" });
  
  electricityConnections[index].status = status;
  electricityConnections[index].updatedAt = new Date().toISOString();
  if (status === 'REJECTED' && rejectionReason) electricityConnections[index].rejectionReason = rejectionReason;
  if (status === 'VERIFIED') electricityConnections[index].verifiedAt = new Date().toISOString();
  if (status === 'APPROVED') electricityConnections[index].approvedAt = new Date().toISOString();
  if (status === 'INSTALLED') electricityConnections[index].installedAt = new Date().toISOString();
  
  res.json({ connection: electricityConnections[index] });
});

export default router;

