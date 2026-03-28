import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import complaintRoutes from "./routes/complaints.js";
import analyticsRoutes from "./routes/analytics.js";
import insightsRoutes from "./routes/insights.js";
import { seedComplaints } from "./data/seedComplaints.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tnwise-admin";

app.use(cors({ origin: true }));
app.use(express.json());

app.use("/api/complaints", complaintRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/insights", insightsRoutes);

app.get("/", (req, res) => {
  res.json({ status: "Water Admin API is running" });
});

mongoose
  .connect(mongoUri)
  .then(async () => {
    console.log("Connected to MongoDB", mongoUri);
    await seedComplaints();
    app.listen(port, () => {
      console.log(`Admin server listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
