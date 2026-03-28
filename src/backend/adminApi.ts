const API_BASE = ((import.meta as any).env?.VITE_ADMIN_API_URL as string) ?? "http://localhost:4000/api";

export type ComplaintPriority = "HIGH" | "MEDIUM" | "LOW";
export type ComplaintStatus = "NEW" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "REOPENED";

export interface AdminComplaint {
  _id: string;
  complaintId: string;
  type: string;
  category: string;
  subcategory: string;
  description: string;
  location: string;
  ward: string;
  area: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  assignedTo?: string | null;
  assignedAt?: string | null;
  resolvedAt?: string | null;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
  coordinates: { lat: number; lng: number };
}

export interface AnalyticsWidgetData {
  totalComplaints: number;
  highPriorityCount: number;
  unassignedCount: number;
  overdueCount: number;
  resolvedCount: number;
  averageResolutionTime: number;
}

export interface AnalyticsResult {
  complaintsByType: Array<{ name: string; count: number }>;
  trendOverTime: Array<{ name: string; count: number }>;
  resolutionRate: number;
  averageResolutionHours: number;
  statusBreakdown: Array<{ name: string; value: number }>;
  widgets: AnalyticsWidgetData;
}

export interface InsightCard {
  id: string;
  title: string;
  value: string;
  description: string;
}

export interface ComplaintFilters {
  status?: string;
  priority?: string;
  area?: string;
  search?: string;
  from?: string;
  to?: string;
  sort?: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Admin API error ${response.status}: ${text}`);
  }
  return response.json();
}

export async function fetchAdminComplaints(filters: ComplaintFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const response = await fetch(`${API_BASE}/complaints?${params.toString()}`);
  return handleResponse<{ complaints: AdminComplaint[]; workers: string[] }>(response);
}

export async function assignComplaint(complaintId: string, assignedTo: string) {
  const response = await fetch(`${API_BASE}/complaints/${complaintId}/assign`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assignedTo }),
  });
  return handleResponse<{ complaint: AdminComplaint }>(response);
}

export async function updateComplaintStatus(
  complaintId: string,
  status: ComplaintStatus,
  payload: { resolutionNotes?: string; resolvedAt?: string } = {}
) {
  const response = await fetch(`${API_BASE}/complaints/${complaintId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, ...payload }),
  });
  return handleResponse<{ complaint: AdminComplaint }>(response);
}

export async function fetchAdminAnalytics() {
  const response = await fetch(`${API_BASE}/analytics`);
  return handleResponse<AnalyticsResult>(response);
}

export async function fetchAdminInsights() {
  const response = await fetch(`${API_BASE}/insights`);
  return handleResponse<{ insights: InsightCard[] }>(response).then((result) => result.insights);
}
