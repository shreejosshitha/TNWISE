export interface StoredProofFile {
  name: string;
  type: string;
  preview: string;
}

export interface MunicipalComplaint {
  id: string;
  title?: string;
  category: string;
  subcategory?: string;
  description: string;
  location: string;
  lat?: number | null;
  lng?: number | null;
  status: 'submitted' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  date: string;
  image?: boolean;
  mode: 'general' | 'road' | 'garbage';
}

const USER_STORAGE_KEY = "municipalComplaints";
const STATUS_KEY = "municipalComplaintStatuses";

export function getMunicipalComplaints(): MunicipalComplaint[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMunicipalComplaint(complaint: MunicipalComplaint) {
  if (typeof window === "undefined") return;

  try {
    const current = getMunicipalComplaints();
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify([complaint, ...current]));
    window.dispatchEvent(new Event("municipalComplaintUpdated"));
  } catch {
    // ignore
  }
}

export function updateComplaintStatus(id: string, status: MunicipalComplaint['status']) {
  if (typeof window === "undefined") return;

  try {
    const statusesRaw = window.localStorage.getItem(STATUS_KEY);
    const statuses: Record<string, MunicipalComplaint['status']> = statusesRaw ? JSON.parse(statusesRaw) : {};
    statuses[id] = status;
    window.localStorage.setItem(STATUS_KEY, JSON.stringify(statuses));
    window.dispatchEvent(new Event("municipalComplaintUpdated"));
  } catch {
    // ignore
  }
}

export function getComplaintStatus(id: string): MunicipalComplaint['status'] | 'submitted' {
  if (typeof window === "undefined") return 'submitted';

  try {
    const statusesRaw = window.localStorage.getItem(STATUS_KEY);
    const statuses: Record<string, MunicipalComplaint['status']> = statusesRaw ? JSON.parse(statusesRaw) : {};
    return statuses[id] || 'submitted';
  } catch {
    return 'submitted';
  }
}

export function getMunicipalComplaintById(id: string): MunicipalComplaint | undefined {
  return getMunicipalComplaints().find((c) => c.id === id);
}
