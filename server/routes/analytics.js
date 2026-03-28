import { Router } from "express";
import Complaint from "../models/Complaint.js";

const router = Router();

function calculateAverageHours(items) {
  if (!items.length) return 0;
  const totalMs = items.reduce((sum, item) => sum + (item.resolvedAt?.getTime() - item.createdAt.getTime()), 0);
  return Math.round(totalMs / items.length / (1000 * 60 * 60));
}

function buildTrend(complaints) {
  const today = new Date();
  const labels = ["Week -3", "Week -2", "Week -1", "This Week"];
  const weeks = [0, 1, 2, 3].map((offset) => {
    const start = new Date(today);
    start.setDate(today.getDate() - (21 - offset * 7));
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    return { start, end };
  });

  return weeks.map((range, index) => ({
    name: labels[index],
    count: complaints.filter((item) => item.createdAt >= range.start && item.createdAt < range.end).length,
  }));
}

router.get("/", async (req, res) => {
  const complaints = await Complaint.find().lean();
  const total = complaints.length;
  const resolved = complaints.filter((complaint) => complaint.status === "RESOLVED").length;
  const highPriority = complaints.filter((complaint) => complaint.priority === "HIGH").length;
  const unassigned = complaints.filter((complaint) => !complaint.assignedTo || complaint.status === "NEW").length;
  const overdue = complaints.filter((complaint) => {
    const ageHours = (Date.now() - complaint.createdAt.getTime()) / (1000 * 60 * 60);
    return ageHours > 48 && complaint.status !== "RESOLVED";
  }).length;

  const complaintsByType = [];
  const typeMap = new Map();
  complaints.forEach((complaint) => {
    typeMap.set(complaint.type, (typeMap.get(complaint.type) || 0) + 1);
  });
  typeMap.forEach((count, name) => complaintsByType.push({ name, count }));

  const statusBreakdown = ["NEW", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "REOPENED"].map((status) => ({
    name: status,
    value: complaints.filter((complaint) => complaint.status === status).length,
  }));

  const resolvedComplaints = complaints.filter((complaint) => complaint.status === "RESOLVED");
  const averageResolutionHours = calculateAverageHours(resolvedComplaints);

  res.json({
    complaintsByType,
    trendOverTime: buildTrend(complaints),
    resolutionRate: total ? Math.round((resolved / total) * 100) : 0,
    averageResolutionHours,
    statusBreakdown,
    widgets: {
      totalComplaints: total,
      highPriorityCount: highPriority,
      unassignedCount: unassigned,
      overdueCount: overdue,
      resolvedCount: resolved,
      averageResolutionTime: averageResolutionHours,
    },
  });
});

export default router;
