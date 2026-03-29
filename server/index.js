import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import complaintRoutes from "./routes/complaints.js";
import waterConnectionsRoutes from "./routes/waterConnections.js";
import electricityComplaintsRoutes from "./routes/electricityComplaints.js";
import electricityConnectionsRoutes from "./routes/electricityConnections.js";
import analyticsRoutes from "./routes/analytics.js";
import insightsRoutes from "./routes/insights.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: true }));
app.use(express.json());

app.use("/api/water/complaints", complaintRoutes);
app.use("/api/water/connections", waterConnectionsRoutes);
app.use("/api/electricity/complaints", electricityComplaintsRoutes);
app.use("/api/electricity/connections", electricityConnectionsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/insights", insightsRoutes);

app.get("/", (req, res) => {
  res.json({ status: "TN Wise API - Dummy Data (No MongoDB) running" });
});

app.listen(port, () => {
  console.log(`TN Wise API Server on http://localhost:${port}`);
  console.log('Ready endpoints:');
  console.log('- POST /api/water/complaints');
  console.log('- GET /api/water/complaints?phone=...');
  console.log('- PATCH /api/water/complaints/:id/status');
  console.log('- Same for /electricity/, /water/connections, /electricity/connections');
});
