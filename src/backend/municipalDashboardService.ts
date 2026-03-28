export type MunicipalCardCategory =
  | "applications"
  | "pendingComplaints"
  | "newComplaints"
  | "resolvedCases";

export interface MunicipalDashboardStat {
  label: string;
  value: number;
  category: MunicipalCardCategory;
}

export interface MunicipalDetailItem {
  id: string;
  title: string;
  status: string;
  location: string;
  submittedDate: string;
  details: string;
}

export interface MunicipalGraphPoint {
  name: string;
  value: number;
}

const MUNICIPAL_STORAGE_KEY = "municipalDashboardData";

const defaultData = {
  applications: [
    {
      id: "APP-1001",
      title: "Construction Permit",
      status: "Awaiting Review",
      location: "Adyar",
      submittedDate: "2026-03-18",
      details: "Application for residential building permit, 3 floor approval.",
    },
    {
      id: "APP-1002",
      title: "Property Tax Exemption",
      status: "Under Assessment",
      location: "Nungambakkam",
      submittedDate: "2026-03-21",
      details: "Request for exemption verification on old property.",
    },
    {
      id: "APP-1003",
      title: "Trade License Renewal",
      status: "Approved",
      location: "T. Nagar",
      submittedDate: "2026-03-23",
      details: "Renewal request for shop trade license, valid until 2027.",
    },
  ] as MunicipalDetailItem[],
  complaints: [
    {
      id: "CMP-2001",
      title: "Waterlogging Complaint",
      status: "submitted",
      location: "Perambur",
      submittedDate: "2026-03-27",
      details: "Street flooding caused by blocked drains after heavy rain.",
    },
    {
      id: "CMP-2002",
      title: "Noise Pollution",
      status: "resolved",
      location: "Velachery",
      submittedDate: "2026-03-20",
      details: "Excessive construction noise from site after permitted hours.",
    },
    {
      id: "CMP-2003",
      title: "Garbage Collection Delay",
      status: "assigned",
      location: "Anna Nagar",
      submittedDate: "2026-03-25",
      details: "Household waste not collected for two consecutive days.",
    },
    {
      id: "CMP-2004",
      title: "Street Light Fault",
      status: "resolved",
      location: "Guindy",
      submittedDate: "2026-03-22",
      details: "Several street lights along main road are not working.",
    },
    {
      id: "CMP-2005",
      title: "Property Tax Query",
      status: "submitted",
      location: "Mylapore",
      submittedDate: "2026-03-26",
      details: "Clarification requested for current property tax slab.",
    },
  ] as MunicipalDetailItem[],
};

function getStoredMunicipalData() {
  if (typeof window === "undefined") {
    return defaultData;
  }

  try {
    const raw = window.localStorage.getItem(MUNICIPAL_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(MUNICIPAL_STORAGE_KEY, JSON.stringify(defaultData));
      return defaultData;
    }

    return JSON.parse(raw) as typeof defaultData;
  } catch {
    return defaultData;
  }
}

function simulateBackendDelay<T>(result: T): Promise<T> {
  return new Promise((resolve) => window.setTimeout(() => resolve(result), 300));
}

export async function fetchMunicipalDashboardStats(): Promise<MunicipalDashboardStat[]> {
  const data = getStoredMunicipalData();
  const totalApplications = data.applications.length;
  const pendingComplaints = data.complaints.filter((item) => item.status === "submitted" || item.status === "assigned").length;
  const newComplaints = data.complaints.filter((item) => item.status === "submitted").length;
  const resolvedCases = data.complaints.filter((item) => item.status === "resolved").length;

  return simulateBackendDelay([
    { label: "Total Applications", value: totalApplications, category: "applications" },
    { label: "Pending Complaints", value: pendingComplaints, category: "pendingComplaints" },
    { label: "New Complaints", value: newComplaints, category: "newComplaints" },
    { label: "Resolved Cases", value: resolvedCases, category: "resolvedCases" },
  ]);
}

export async function fetchMunicipalDetailItems(category: MunicipalCardCategory): Promise<MunicipalDetailItem[]> {
  const data = getStoredMunicipalData();

  if (category === "applications") {
    return simulateBackendDelay(data.applications);
  }

  if (category === "pendingComplaints") {
    return simulateBackendDelay(data.complaints.filter((item) => item.status === "submitted" || item.status === "assigned"));
  }

  if (category === "newComplaints") {
    return simulateBackendDelay(data.complaints.filter((item) => item.status === "submitted"));
  }

  if (category === "resolvedCases") {
    return simulateBackendDelay(data.complaints.filter((item) => item.status === "resolved"));
  }

  return simulateBackendDelay([]);
}

export async function fetchMunicipalGraphData(): Promise<{ barData: MunicipalGraphPoint[]; pieData: MunicipalGraphPoint[] }> {
  const stats = await fetchMunicipalDashboardStats();
  const barData = stats.map((item) => ({ name: item.label, value: item.value }));
  const pieData = stats.map((item) => ({ name: item.label, value: item.value }));

  return simulateBackendDelay({ barData, pieData });
}
