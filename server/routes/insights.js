import { Router } from "express";
import { waterComplaints } from "../data/dummyData.js";

const router = Router();

router.get("/", (req, res) => {
  const complaints = [...waterComplaints];

  const wardCounts = complaints.reduce((acc, complaint) => {
    acc[complaint.ward] = (acc[complaint.ward] || 0) + 1;
    return acc;
  }, {});

  const typeCounts = complaints.reduce((acc, complaint) => {
    acc[complaint.type] = (acc[complaint.type] || 0) + 1;
    return acc;
  }, {});

  const complaintsThisWeek = complaints.filter((complaint) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return complaint.createdAt >= sevenDaysAgo;
  });

  const trendByType = complaintsThisWeek.reduce((acc, complaint) => {
    acc[complaint.type] = (acc[complaint.type] || 0) + 1;
    return acc;
  }, {});

  const resolved = complaints.filter((complaint) => complaint.status === "RESOLVED");
  const avgResolution = resolved.length
    ? Math.round(
        resolved.reduce((sum, complaint) => sum + (complaint.resolvedAt.getTime() - complaint.createdAt.getTime()), 0) /
          resolved.length /
          (1000 * 60 * 60)
      )
    : 0;

  const insightCards = [
    {
      id: "insight-1",
      title: "Hotspot Area",
      value: Object.keys(wardCounts).length ? Object.entries(wardCounts).sort((a, b) => b[1] - a[1])[0][0] : "N/A",
      description: "Ward with the highest complaint volume this week.",
    },
    {
      id: "insight-2",
      title: "Top complaint type",
      value: Object.keys(typeCounts).length ? Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0] : "N/A",
      description: "Most frequent issue reported across the network.",
    },
    {
      id: "insight-3",
      title: "Week-over-week trend",
      value: Object.keys(trendByType).length ? `${Object.entries(trendByType).sort((a, b) => b[1] - a[1])[0][0]} up` : "Stable",
      description: "Most active complaint category in the last 7 days.",
    },
    {
      id: "insight-4",
      title: "Average resolution time",
      value: `${avgResolution} hrs`,
      description: "Typical time spent resolving closed complaints.",
    },
  ];

  res.json({ insights: insightCards });
});

export default router;
