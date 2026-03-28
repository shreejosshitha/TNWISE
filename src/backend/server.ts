import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { verifySession } from './authService';
import {
  getBillsByConsumerNumber,
  fetchBillByConsumer,
  getBillHistory,
  payBill,
  createComplaint,
  getComplaintsByPhone,
  getTrackingsByPhone,
  createApplication,
  getApplicationById,
  getAdminStats,
  getAdminApplications,
  getAdminComplaints,
  updateComplaintStatus,
  approveApplication,
  getAdminBills,
  searchAdminData,
  getDetailedAdminStats,
  updateApplicationStage,
} from './electricityService';

import { AuthResponse } from './authService';

import { sendOTP, verifyOTP, logout as authLogout } from './authService';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    credentials: true
  }
});

const PORT = 3001;

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'], credentials: true })); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join admin room for real-time updates
  socket.on('join-admin', () => {
    socket.join('admin-room');
    console.log('Client joined admin room:', socket.id);
  });

  // Join citizen room for tracking updates
  socket.on('join-citizen', (phone: string) => {
    socket.join(`citizen-${phone}`);
    console.log('Client joined citizen room:', socket.id, phone);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Auth middleware (optional for some, required for personal data)
const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.sessionToken;
  if (!token) return res.status(401).json({ success: false, message: "No token" });
  const result = await verifySession(token as string);
  if (!result.success) return res.status(401).json(result);
  (req as any).user = result.data;
  next();
};

// Auth API Routes (NEW)
app.post('/api/auth/send-otp', async (req, res) => {
  const { phone } = req.body;
  const result = await sendOTP(phone);
  res.json(result);
});

app.post('/api/auth/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  const result = await verifyOTP(phone, otp);
  res.json(result);
});

app.post('/api/auth/logout', authMiddleware, async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.sessionToken;
  const result = await authLogout(token);
  res.json(result);
});

// Electricity API Routes
app.get('/api/electricity/bills/:consumerNumber', async (req, res) => {
  const { consumerNumber } = req.params;
  const result = await getBillsByConsumerNumber(consumerNumber);
  res.json(result);
});

app.get('/api/electricity/bill/:consumerNumber', async (req, res) => {
  const { consumerNumber } = req.params;
  const result = await fetchBillByConsumer(consumerNumber);
  res.json(result);
});

app.get('/api/electricity/history/:consumerNumber', async (req, res) => {
  const { consumerNumber } = req.params;
  const result = await getBillHistory(consumerNumber);
  res.json(result);
});

app.post('/api/electricity/pay', authMiddleware, async (req, res) => {
  const { billId, method, amount } = req.body;
  const result = await payBill(billId, { method, amount: parseFloat(amount) });
  res.json(result);
});

app.post('/api/electricity/complaints', authMiddleware, async (req, res) => {
  const data = req.body;
  data.phone = (req as any).user.phone;
  const result = await createComplaint(data);
  res.json(result);
});

app.get('/api/electricity/complaints', authMiddleware, async (req, res) => {
  const phone = (req as any).user.phone;
  const result = await getComplaintsByPhone(phone);
  res.json(result);
});

app.post('/api/electricity/applications', authMiddleware, async (req, res) => {
  const data = req.body;
  data.phone = (req as any).user.phone;
  data.name = (req as any).user.name;
  data.address = (req as any).user.address;
  const result = await createApplication(data);
  res.json(result);
});

app.get('/api/electricity/tracking', authMiddleware, async (req, res) => {
  const phone = (req as any).user.phone;
  const result = await getTrackingsByPhone(phone);
  res.json(result);
});

app.get('/api/electricity/tracker/:id', async (req, res) => {
  const { id } = req.params;
  const result = await getApplicationById(id);
  res.json(result);
});

// Admin Stage Update
app.post('/api/admin/electricity/applications/:id/stage', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { stage, notes } = req.body;
  const result = await updateApplicationStage(id, stage, notes);
  res.json(result);
});

// Admin routes (assume admin check in production)
app.get('/api/admin/electricity/stats', async (req, res) => {
  const result = await getAdminStats();
  res.json(result);
});

app.get('/api/admin/electricity/applications', async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await getAdminApplications(limit);
  res.json(result);
});

app.get('/api/admin/electricity/complaints', async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await getAdminComplaints(limit);
  res.json(result);
});

// New admin mutation endpoints
app.put('/api/admin/electricity/complaints/:id/status', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status, assignedTo, notes } = req.body;
  const result = await updateComplaintStatus(id, status, assignedTo, notes);
  
  if (result.success) {
    // Real-time update to admin dashboard
    io.to('admin-room').emit('complaint-updated', {
      id,
      status,
      assignedTo,
      updatedAt: new Date().toISOString()
    });
    
    // Real-time update to citizen tracking
    const complaint = result.data;
    if (complaint && complaint.phone) {
      io.to(`citizen-${complaint.phone}`).emit('tracking-updated', {
        type: 'complaint',
        id,
        status,
        message: `Complaint status updated to ${status}`
      });
    }
  }
  
  res.json(result);
});

app.put('/api/admin/electricity/applications/:id/approve', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const decision = req.body;
  const result = await approveApplication(id, decision);
  
  if (result.success) {
    // Real-time update to admin dashboard
    io.to('admin-room').emit('application-updated', {
      id,
      status: decision.approved ? 'approved' : 'rejected',
      updatedAt: new Date().toISOString()
    });
    
    // Real-time update to citizen tracking
    const application = result.data;
    if (application && application.phone) {
      io.to(`citizen-${application.phone}`).emit('tracking-updated', {
        type: 'application',
        id,
        status: decision.approved ? 'approved' : 'rejected',
        message: `Application ${decision.approved ? 'approved' : 'rejected'}`
      });
    }
  }
  
  res.json(result);
});

app.get('/api/admin/electricity/bills', async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const status = (Array.isArray(req.query.status) ? req.query.status[0] : req.query.status) || undefined;
  const result = await getAdminBills(limit, status || undefined);
  res.json(result);
});

app.get('/api/admin/electricity/search', async (req, res) => {
  const { q } = req.query;
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ success: false, message: 'Query parameter "q" required' });
  }
  const result = await searchAdminData(q);
  res.json(result);
});

app.get('/api/admin/electricity/stats-detailed', async (req, res) => {
  const from = Array.isArray(req.query.from) ? req.query.from[0] : req.query.from as string || undefined;
  const to = Array.isArray(req.query.to) ? req.query.to[0] : req.query.to as string || undefined;
  const result = await getDetailedAdminStats(from as string, to as string);
  res.json(result);
});


server.listen(PORT, () => {
  console.log(`🚀 Electricity Backend running on http://localhost:${PORT}`);
  console.log(`📚 Services ready for bill payments, complaints, applications, tracking!`);
  console.log(`🔴 WebSocket server ready for real-time updates!`);
});

