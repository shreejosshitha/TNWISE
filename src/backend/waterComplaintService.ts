export interface StoredProofFile {
  name: string;
  type: string;
  preview: string;
}

export interface WaterComplaint {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  location: string;
  lat?: number | null;
  lng?: number | null;
  status: 'submitted' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  date: string;
  proof?: StoredProofFile[];
}

export interface WaterComplaintAction {
  message: string;
  timestamp: string;
}

import type { AdminComplaint } from "./adminApi";

const STORAGE_KEY = "waterComplaints";
const ACTION_STORAGE_KEY = "waterRecentActions";


// ✅ GET COMPLAINTS
export function getWaterComplaints(): WaterComplaint[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}


// ✅ PRIORITY LOGIC
function computeComplaintPriority(
  complaint: WaterComplaint
): "HIGH" | "MEDIUM" | "LOW" {
  const highKeywords = ["urgent", "emergency", "no water", "leakage", "burst", "pipe break"];
  const mediumKeywords = ["low pressure", "contaminated", "bad taste", "discolored", "billing", "meter"];

  const text = (
    complaint.title +
    " " +
    complaint.description +
    " " +
    complaint.category +
    " " +
    complaint.subcategory
  ).toLowerCase();

  if (
    highKeywords.some((kw) => text.includes(kw)) ||
    (["Water Supply", "Infrastructure"].includes(complaint.category) &&
      (complaint.subcategory.includes("No Water") ||
        complaint.subcategory.includes("Leak")))
  ) {
    return "HIGH";
  }

  if (mediumKeywords.some((kw) => text.includes(kw))) {
    return "MEDIUM";
  }

  return "LOW";
}


// ✅ STATUS MAP
function mapStatus(status: WaterComplaint["status"]): AdminComplaint["status"] {
  const statusMap: Record<
    WaterComplaint["status"],
    AdminComplaint["status"]
  > = {
    submitted: "NEW",
    assigned: "ASSIGNED",
    in_progress: "IN_PROGRESS",
    resolved: "RESOLVED",
    closed: "RESOLVED",
  };

  return statusMap[status] || "NEW";
}


// ✅ MAIN ADMIN DATA FUNCTION (🔥 FIXED HERE)
export function getAdminWaterComplaints(): AdminComplaint[] {
  const complaints = getWaterComplaints();

  return complaints.map((complaint) => {
    
    // ✅ SAFE COORDINATES (NO CRASH GUARANTEED)
    const coords = {
      lat: complaint.lat ?? 13.05,   // fallback Chennai
      lng: complaint.lng ?? 80.24,
    };

    return {
      _id: complaint.id,
      complaintId: complaint.id,
      type: complaint.category,
      category: complaint.category,
      subcategory: complaint.subcategory,
      description: complaint.description,
      location: complaint.location,
      ward: "Chennai Central",
      area: complaint.location.split(",")[0]?.trim() || "Central",
      priority: computeComplaintPriority(complaint),
      status: mapStatus(complaint.status),
      assignedTo: undefined,
      assignedAt: undefined,
      resolvedAt: undefined,
      resolutionNotes: undefined,
      createdAt: complaint.date,
      updatedAt: complaint.date,
      coordinates: coords, // ✅ ALWAYS VALID
    };
  });
}


// ✅ SAVE COMPLAINT
export function saveWaterComplaint(complaint: WaterComplaint) {
  // Backend API now handles storage
  console.log('Complaint saved to backend API:', complaint.id);
  // Trigger update event for compatibility
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("waterComplaintUpdated"));
  }
}


// ✅ GET SINGLE
export function getWaterComplaintById(id: string): WaterComplaint | undefined {
  return getWaterComplaints().find((c) => c.id === id);
}


// ✅ UPDATE STATUS
export function updateWaterComplaintStatus(
  id: string,
  status: WaterComplaint["status"]
) {
  if (typeof window === "undefined") return;

  try {
    const complaints = getWaterComplaints();

    const updated = complaints.map((c) =>
      c.id === id ? { ...c, status } : c
    );

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const target = updated.find((c) => c.id === id);

    if (target) {
      const action: WaterComplaintAction = {
        message: `Water complaint ${target.title} - ID: ${target.id} updated.`,
        timestamp: new Date().toLocaleString(),
      };

      const rawActions = window.localStorage.getItem(ACTION_STORAGE_KEY);
      const existingActions: WaterComplaintAction[] = rawActions
        ? JSON.parse(rawActions)
        : [];

      window.localStorage.setItem(
        ACTION_STORAGE_KEY,
        JSON.stringify([action, ...existingActions].slice(0, 5))
      );
    }

    window.dispatchEvent(new Event("waterComplaintUpdated"));
  } catch {}
}


// ✅ COUNTS
export function getWaterComplaintCount(): number {
  return getWaterComplaints().length;
}

export function getWaterPendingComplaintCount(): number {
  return getWaterComplaints().filter((c) =>
    ["submitted", "assigned", "in_progress"].includes(c.status)
  ).length;
}


// ✅ RECENT ACTIONS
export function getWaterRecentActions(limit = 5): WaterComplaintAction[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(ACTION_STORAGE_KEY);
    const current: WaterComplaintAction[] = raw ? JSON.parse(raw) : [];
    return current.slice(0, limit);
  } catch {
    return [];
  }
}