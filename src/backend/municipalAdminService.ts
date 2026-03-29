import { getMunicipalComplaints, getMunicipalComplaintById, updateComplaintStatus as updateUserComplaintStatus } from "./municipalComplaintService";
import type { AdminComplaint } from "./adminApi";
import type { MunicipalComplaint } from "./municipalComplaintService";

const ADMIN_STORAGE_KEY = "municipalAdminComplaints";
const ADMIN_REWARDS_KEY = "municipalAdminRewards";

function getAdminComplaints(): AdminComplaint[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(ADMIN_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAdminComplaints(complaints: AdminComplaint[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(complaints));
  }
}

function readAdminRewardPoints(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(ADMIN_REWARDS_KEY);
  return raw ? Number(raw) || 0 : 0;
}

function addAdminRewardPoints(amount: number): number {
  if (typeof window === "undefined") return 0;
  const current = readAdminRewardPoints();
  const next = current + amount;
  window.localStorage.setItem(ADMIN_REWARDS_KEY, String(next));
  return next;
}

function mapAdminToUserStatus(status: AdminComplaint['status']): MunicipalComplaint['status'] {
  switch (status) {
    case 'NEW': return 'submitted';
    case 'ASSIGNED': return 'assigned';
    case 'IN_PROGRESS': return 'in_progress';
    case 'RESOLVED': return 'resolved';
    default: return 'submitted';
  }
}

function mapUserToAdminStatus(status: MunicipalComplaint['status']): AdminComplaint['status'] {
  switch (status) {
    case 'submitted': return 'NEW';
    case 'assigned': return 'ASSIGNED';
    case 'in_progress': return 'IN_PROGRESS';
    case 'resolved': 
    case 'closed': return 'RESOLVED';
    default: return 'NEW';
  }
}

function syncUserComplaintsToAdmin() {
// Sync mechanism - copy user complaints to admin view
  const userComplaints = getMunicipalComplaints();
  const adminComplaints = getAdminComplaints();
  
  // Add new user complaints to admin if not exists
  userComplaints.forEach((userComplaint: MunicipalComplaint) => {
    const exists = adminComplaints.some(ac => ac.complaintId === userComplaint.id);
    if (!exists) {
      const adminComplaint: AdminComplaint = {
        _id: userComplaint.id,
        complaintId: userComplaint.id,
        type: userComplaint.mode === 'general' ? 'Civic Issue' : userComplaint.mode.charAt(0).toUpperCase() + userComplaint.mode.slice(1),
        category: userComplaint.category,
        subcategory: userComplaint.subcategory || '',
        description: userComplaint.description,
        location: userComplaint.location,
        ward: 'Chennai Central', // Default
        area: userComplaint.location.split(',')[0] || 'Central',
        priority: 'MEDIUM' as const,
        status: mapUserToAdminStatus(userComplaint.status || 'submitted'),
        assignedTo: null,
        assignedAt: null,
        resolvedAt: null,
        resolutionNotes: '',
        createdAt: userComplaint.date,
        updatedAt: userComplaint.date,
        coordinates: {
          lat: userComplaint.lat || 13.0827,
          lng: userComplaint.lng || 80.2707
        }
      };
      adminComplaints.unshift(adminComplaint);
    }
  });

  saveAdminComplaints(adminComplaints);
  
  window.dispatchEvent(new Event("municipalComplaintUpdated"));
}

export function getMunicipalAdminComplaints(): AdminComplaint[] {
  syncUserComplaintsToAdmin();
  return getAdminComplaints();
}

export function updateAdminComplaintStatus(
  complaintId: string, 
  status: AdminComplaint['status'], 
  notes?: string
): AdminComplaint {
  const complaints = getAdminComplaints();
  const complaintIndex = complaints.findIndex(c => c.complaintId === complaintId);
  
  if (complaintIndex === -1) {
    throw new Error("Complaint not found");
  }

  const complaint = complaints[complaintIndex];

  if (status === 'RESOLVED' && complaint.status !== 'RESOLVED') {
    addAdminRewardPoints(300);
  }

  complaints[complaintIndex] = {
    ...complaint,
    status,
    resolutionNotes: notes || complaint.resolutionNotes,
    updatedAt: new Date().toISOString()
  };

  if (status === 'ASSIGNED') {
    complaints[complaintIndex].assignedTo = 'Field Team';
    complaints[complaintIndex].assignedAt = new Date().toISOString();
  } else if (status === 'RESOLVED') {
    complaints[complaintIndex].resolvedAt = new Date().toISOString();
  }

  saveAdminComplaints(complaints);
  
  // Sync to user tracking
  try {
    const userComplaint = getMunicipalComplaintById(complaintId);
    if (userComplaint) {
      const userStatus = mapAdminToUserStatus(status);
updateUserComplaintStatus(complaintId, userStatus);    }
  } catch (syncError) {
    console.warn('User status sync failed:', syncError);
  }
  window.dispatchEvent(new Event("municipalComplaintUpdated"));
  
  return complaints[complaintIndex];
}

export function assignComplaint(complaintId: string, assignedTo: string): AdminComplaint {
  const complaints = getAdminComplaints();
  const complaintIndex = complaints.findIndex(c => c.complaintId === complaintId);
  
  if (complaintIndex === -1) {
    throw new Error("Complaint not found");
  }

  const complaint = complaints[complaintIndex];
  complaints[complaintIndex] = {
    ...complaint,
    status: 'ASSIGNED',
    assignedTo,
    assignedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  saveAdminComplaints(complaints);
  
  // Sync to user tracking
  try {
    const userComplaint = getMunicipalComplaintById(complaintId);
    if (userComplaint) {
updateUserComplaintStatus(complaintId, 'assigned');    }
  } catch (syncError) {
    console.warn('User status sync failed:', syncError);
  }
  window.dispatchEvent(new Event("municipalComplaintUpdated"));
  
  return complaints[complaintIndex];
}

export function getMunicipalDashboardCounts() {
  const complaints = getMunicipalAdminComplaints();
  return {
    total: complaints.length,
    newComplaints: complaints.filter(c => c.status === 'NEW').length,
    pendingComplaints: complaints.filter(c => c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS').length,
    resolved: complaints.filter(c => c.status === 'RESOLVED').length
  };
}