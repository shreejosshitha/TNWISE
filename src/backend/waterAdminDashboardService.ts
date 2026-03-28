export type WaterDashboardCategory =
  | "applications"
  | "pendingComplaints"
  | "newComplaints"
  | "resolvedCases"
  | "totalRevenue"
  | "pendingPayments"
  | "overdueAlerts";

export interface WaterDashboardStat {
  label: string;
  value: number;
  category: WaterDashboardCategory;
  trend?: number;
  trendDirection?: "up" | "down";
  path?: string;
}

export interface WaterDashboardDetailItem {
  id: string;
  title: string;
  type: string;
  status: string;
  location: string;
  date: string;
  details: string;
}

export interface WaterGraphPoint {
  name: string;
  value: number;
}

export type WaterActionType = "application" | "complaint" | "payment";

export interface WaterActionItem {
  id: string;
  title: string;
  subtitle: string;
  type: WaterActionType;
  status: string;
  actionLabel: string;
  secondaryActionLabel?: string;
  modulePath: string;
  date: string;
  details: string;
  amount?: number;
}

export interface WaterNotification {
  id: string;
  title: string;
  category: string;
  time: string;
  isNew: boolean;
  modulePath: string;
}

export interface WaterChartData {
  complaintsTrend: WaterGraphPoint[];
  applicationsTrend: WaterGraphPoint[];
  revenueTrend: WaterGraphPoint[];
  paymentStatus: WaterGraphPoint[];
}

const APPLICATION_STORAGE_KEY = "waterApplications";
const COMPLAINT_STORAGE_KEY = "waterComplaints";
const PAYMENT_STORAGE_KEY = "waterPayments";

const defaultApplications = [
  {
    id: "WTR10001",
    type: "New Connection",
    status: "submitted",
    date: "2026-03-24",
    formData: {
      name: "Anita",
      phone: "9876543210",
      email: "anita@example.com",
      address: "45, T. Nagar, Chennai",
      connectionType: "domestic",
      dateOfBirth: "1990-06-05",
      gender: "female",
      aadhar: "1234-5678-9012",
    },
    documents: {},
  },
  {
    id: "WTR10002",
    type: "Tap Repair",
    status: "approved",
    date: "2026-03-20",
    formData: {
      name: "Ramesh",
      phone: "9123456789",
      email: "ramesh@example.com",
      address: "11, Anna Nagar, Chennai",
      connectionType: "commercial",
      dateOfBirth: "1985-02-14",
      gender: "male",
      aadhar: "2345-6789-0123",
    },
    documents: {},
  },
];

const defaultComplaints = [
  {
    id: "CMP1001",
    title: "Low Water Pressure",
    category: "Water Supply",
    subcategory: "Pressure Issue",
    description: "Very low water pressure on the second floor of the building.",
    location: "Adyar",
    status: "submitted",
    date: "2026-03-27",
    proof: [],
  },
  {
    id: "CMP1002",
    title: "Pipeline Leakage",
    category: "Leakage",
    subcategory: "Main Line",
    description: "Water is leaking from the main pipeline near the street.",
    location: "Velachery",
    status: "assigned",
    date: "2026-03-22",
    proof: [],
  },
  {
    id: "CMP1003",
    title: "No Water Supply",
    category: "Supply Disruption",
    subcategory: "Borewell",
    description: "No water supply reported in the neighbourhood since yesterday.",
    location: "T. Nagar",
    status: "resolved",
    date: "2026-03-18",
    proof: [],
  },
];

const defaultPayments = [
  {
    id: "PAY1001",
    title: "Water bill for Property 12345678",
    propertyId: "12345678",
    status: "overdue",
    dueDate: "2026-03-16",
    amount: 1250,
    details: "March 2026 bill overdue.",
  },
  {
    id: "PAY1002",
    title: "Water bill for Property 87654321",
    propertyId: "87654321",
    status: "pending",
    dueDate: "2026-04-10",
    amount: 980,
    details: "April 2026 installment pending.",
  },
  {
    id: "PAY1003",
    title: "Water bill for Property 11223344",
    propertyId: "11223344",
    status: "paid",
    dueDate: "2026-03-05",
    amount: 760,
    details: "March 2026 bill paid successfully.",
  },
];

function readStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      window.localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function saveStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage write issues
  }
}

function simulateBackendDelay<T>(result: T): Promise<T> {
  return new Promise((resolve) => window.setTimeout(() => resolve(result), 400));
}

function formatMonth(date: Date): string {
  return date.toLocaleString("default", { month: "short", year: "2-digit" });
}

function isInTimeRange(dateString: string, period: "today" | "week" | "month"): boolean {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (period === "today") {
    return diff < 1000 * 60 * 60 * 24;
  }

  if (period === "week") {
    return diff < 1000 * 60 * 60 * 24 * 7;
  }

  return diff < 1000 * 60 * 60 * 24 * 30;
}

function buildSeries(items: Array<{ date?: string; dueDate?: string }>, period: "today" | "week" | "month", labelFormatter: (date: Date) => string) {
  const now = new Date();
  const segments = period === "month" ? 6 : 7;
  const result: Record<string, number> = {};
  const labels: string[] = [];

  for (let index = segments - 1; index >= 0; index -= 1) {
    const date = new Date(now);
    if (period === "month") {
      date.setMonth(now.getMonth() - index);
      date.setDate(1);
    } else {
      date.setDate(now.getDate() - index);
    }
    const label = labelFormatter(date);
    labels.push(label);
    result[label] = 0;
  }

  items.forEach((item) => {
    const itemDate = new Date(item.date ?? item.dueDate ?? "");
    const label = labelFormatter(itemDate);
    if (label in result) {
      result[label] += 1;
    }
  });

  return labels.map((name) => ({ name, value: result[name] }));
}

function buildRevenueSeries(payments: Array<{ dueDate: string; amount: number }>, period: "today" | "week" | "month", labelFormatter: (date: Date) => string) {
  const now = new Date();
  const segments = period === "month" ? 6 : 7;
  const result: Record<string, number> = {};
  const labels: string[] = [];

  for (let index = segments - 1; index >= 0; index -= 1) {
    const date = new Date(now);
    if (period === "month") {
      date.setMonth(now.getMonth() - index);
      date.setDate(1);
    } else {
      date.setDate(now.getDate() - index);
    }
    const label = labelFormatter(date);
    labels.push(label);
    result[label] = 0;
  }

  payments.forEach((payment) => {
    const paymentDate = new Date(payment.dueDate);
    const label = labelFormatter(paymentDate);
    if (label in result) {
      result[label] += payment.amount;
    }
  });

  return labels.map((name) => ({ name, value: result[name] }));
}

function buildDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function fetchWaterDashboardStats(): Promise<WaterDashboardStat[]> {
  const applications = readStorage(APPLICATION_STORAGE_KEY, defaultApplications);
  const complaints = readStorage(COMPLAINT_STORAGE_KEY, defaultComplaints);
  const payments = readStorage(PAYMENT_STORAGE_KEY, defaultPayments);

  const totalApplications = applications.length;
  const pendingComplaints = complaints.filter((item) => item.status === "submitted").length;
  const newComplaints = complaints.filter((item) => item.status === "submitted").length;
  const resolvedCases = complaints.filter((item) => item.status === "resolved" || item.status === "closed").length;
  const pendingPayments = payments.filter((payment) => payment.status === "pending").length;
  const overduePayments = payments.filter((payment) => payment.status === "overdue").length;
  const overdueAlerts = overduePayments + complaints.filter((item) => item.status === "submitted").length;
  const totalRevenue = payments.reduce((sum, payment) => sum + (payment.status === "paid" ? payment.amount : 0), 0);

  const stats: WaterDashboardStat[] = [
    {
      label: "Applications",
      value: totalApplications,
      category: "applications",
      trend: totalApplications > 10 ? 18 : 6,
      trendDirection: "up",
      path: "/admin/water",
    },
    {
      label: "Pending Complaints",
      value: pendingComplaints,
      category: "pendingComplaints",
      trend: pendingComplaints > 2 ? 6 : 2,
      trendDirection: pendingComplaints > 2 ? "up" : "down",
      path: "/admin/water",
    },
    {
      label: "New Complaints",
      value: newComplaints,
      category: "newComplaints",
      trend: newComplaints > 1 ? 10 : 4,
      trendDirection: newComplaints > 1 ? "up" : "down",
      path: "/admin/water",
    },
    {
      label: "Resolved Cases",
      value: resolvedCases,
      category: "resolvedCases",
      trend: resolvedCases > 2 ? 14 : 8,
      trendDirection: "up",
      path: "/admin/water",
    },
    {
      label: "Total Revenue",
      value: totalRevenue,
      category: "totalRevenue",
      trend: totalRevenue > 2000 ? 12 : 5,
      trendDirection: "up",
      path: "/admin/water",
    },
    {
      label: "Pending Payments",
      value: pendingPayments,
      category: "pendingPayments",
      trend: pendingPayments > 0 ? 9 : 3,
      trendDirection: pendingPayments > 0 ? "up" : "down",
      path: "/admin/water",
    },
    {
      label: "Overdue Alerts",
      value: overdueAlerts,
      category: "overdueAlerts",
      trend: overdueAlerts > 1 ? 16 : 7,
      trendDirection: overdueAlerts > 1 ? "up" : "down",
      path: "/admin/water",
    },
  ];

  return simulateBackendDelay(stats);
}

export async function fetchWaterDetailItems(category: WaterDashboardCategory): Promise<WaterDashboardDetailItem[]> {
  const applications = readStorage(APPLICATION_STORAGE_KEY, defaultApplications);
  const complaints = readStorage(COMPLAINT_STORAGE_KEY, defaultComplaints);
  const payments = readStorage(PAYMENT_STORAGE_KEY, defaultPayments);

  const details: WaterDashboardDetailItem[] = (
    category === "applications"
      ? applications.map((app) => ({
          id: app.id,
          title: `${app.type} Application`,
          type: "Application",
          status: app.status,
          location: app.formData.address,
          date: app.date,
          details: `${app.formData.name} · ${app.formData.connectionType}`,
        }))
      : category === "pendingComplaints"
      ? complaints
          .filter((complaint) => complaint.status === "submitted")
          .map((complaint) => ({
            id: complaint.id,
            title: complaint.title,
            type: "Complaint",
            status: complaint.status,
            location: complaint.location,
            date: complaint.date,
            details: complaint.description,
          }))
      : category === "newComplaints"
      ? complaints
          .filter((complaint) => complaint.status === "submitted")
          .map((complaint) => ({
            id: complaint.id,
            title: complaint.title,
            type: "Complaint",
            status: complaint.status,
            location: complaint.location,
            date: complaint.date,
            details: complaint.description,
          }))
      : category === "resolvedCases"
      ? complaints
          .filter((complaint) => complaint.status === "resolved" || complaint.status === "closed")
          .map((complaint) => ({
            id: complaint.id,
            title: complaint.title,
            type: "Complaint",
            status: complaint.status,
            location: complaint.location,
            date: complaint.date,
            details: complaint.description,
          }))
      : []
  );

  return simulateBackendDelay(details);
}

export async function fetchWaterChartData(period: "today" | "week" | "month"): Promise<WaterChartData> {
  const applications = readStorage(APPLICATION_STORAGE_KEY, defaultApplications);
  const complaints = readStorage(COMPLAINT_STORAGE_KEY, defaultComplaints);
  const payments = readStorage(PAYMENT_STORAGE_KEY, defaultPayments);

  const complaintItems = complaints.filter((item) => isInTimeRange(item.date, period));
  const applicationItems = applications.filter((item) => isInTimeRange(item.date, period));
  const paymentItems = payments.filter((payment) => isInTimeRange(payment.dueDate, period));

  const complaintsTrend = buildSeries(
    complaintItems,
    period,
    (date) => (period === "month" ? formatMonth(date) : date.toLocaleDateString("default", { month: "short", day: "numeric" }))
  );

  const applicationsTrend = buildSeries(
    applicationItems,
    period,
    (date) => (period === "month" ? formatMonth(date) : date.toLocaleDateString("default", { month: "short", day: "numeric" }))
  );

  const revenueTrend = buildRevenueSeries(
    paymentItems,
    period,
    (date) => (period === "month" ? formatMonth(date) : date.toLocaleDateString("default", { month: "short", day: "numeric" }))
  );

  const paymentStatus = [
    { name: "Paid", value: payments.filter((payment) => payment.status === "paid").length },
    { name: "Pending", value: payments.filter((payment) => payment.status === "pending").length },
    { name: "Overdue", value: payments.filter((payment) => payment.status === "overdue").length },
  ];

  return simulateBackendDelay({ complaintsTrend, applicationsTrend, revenueTrend, paymentStatus });
}

export async function fetchWaterActionItems(
  period: "today" | "week" | "month",
  sortOrder: "latest" | "oldest"
): Promise<WaterActionItem[]> {
  const applications = readStorage(APPLICATION_STORAGE_KEY, defaultApplications);
  const complaints = readStorage(COMPLAINT_STORAGE_KEY, defaultComplaints);
  const payments = readStorage(PAYMENT_STORAGE_KEY, defaultPayments);

  const applicationItems = applications
    .filter((item) => item.status === "submitted" && isInTimeRange(item.date, period))
    .map((item) => ({
      id: item.id,
      title: `${item.type} Approval`,
      subtitle: `${item.formData.name} · ${item.formData.connectionType}`,
      type: "application" as const,
      status: "Pending approval",
      actionLabel: "Approve",
      secondaryActionLabel: "Reject",
      modulePath: "/admin/water",
      date: item.date,
      details: item.formData.address,
    }));

  const complaintItems = complaints
    .filter((item) => item.status === "submitted" && isInTimeRange(item.date, period))
    .map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.location,
      type: "complaint" as const,
      status: "Unassigned",
      actionLabel: "Assign",
      modulePath: "/admin/water",
      date: item.date,
      details: item.description,
    }));

  const overdueItems = payments
    .filter((payment) => payment.status === "overdue" && isInTimeRange(payment.dueDate, period))
    .map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: `Due ${new Date(item.dueDate).toLocaleDateString()}`,
      type: "payment" as const,
      status: "Overdue",
      actionLabel: "Resolve",
      secondaryActionLabel: "View",
      modulePath: "/admin/water",
      date: item.dueDate,
      details: item.details,
      amount: item.amount,
    }));

  const sorted = [...applicationItems, ...complaintItems, ...overdueItems].sort((a, b) => {
    const aDate = new Date(a.date).getTime();
    const bDate = new Date(b.date).getTime();
    return sortOrder === "latest" ? bDate - aDate : aDate - bDate;
  });

  return simulateBackendDelay(sorted);
}

export async function fetchWaterNotifications(): Promise<WaterNotification[]> {
  const applications = readStorage(APPLICATION_STORAGE_KEY, defaultApplications);
  const complaints = readStorage(COMPLAINT_STORAGE_KEY, defaultComplaints);
  const payments = readStorage(PAYMENT_STORAGE_KEY, defaultPayments);

  const notifications: WaterNotification[] = [
    {
      id: "notif-apps",
      title: `${applications.filter((item) => item.status === "submitted").length} new application(s) pending approval`,
      category: "Applications",
      time: "Just now",
      isNew: applications.some((item) => item.status === "submitted"),
      modulePath: "/admin/water",
    },
    {
      id: "notif-complaints",
      title: `${complaints.filter((item) => item.status === "submitted").length} complaint(s) need review`,
      category: "Complaints",
      time: "15 min ago",
      isNew: complaints.some((item) => item.status === "submitted"),
      modulePath: "/admin/water",
    },
    {
      id: "notif-payments",
      title: `${payments.filter((item) => item.status === "overdue").length} overdue payment alert(s)`,
      category: "Payments",
      time: "30 min ago",
      isNew: payments.some((item) => item.status === "overdue"),
      modulePath: "/admin/water",
    },
  ];

  return simulateBackendDelay(notifications);
}

function dispatchDashboardUpdate() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("waterDashboardUpdated"));
}

export async function approveWaterApplication(id: string): Promise<boolean> {
  const applications = readStorage(APPLICATION_STORAGE_KEY, defaultApplications);
  const updated = applications.map((item) => (item.id === id ? { ...item, status: "approved" } : item));
  saveStorage(APPLICATION_STORAGE_KEY, updated);
  dispatchDashboardUpdate();
  return simulateBackendDelay(true);
}

export async function rejectWaterApplication(id: string): Promise<boolean> {
  const applications = readStorage(APPLICATION_STORAGE_KEY, defaultApplications);
  const updated = applications.map((item) => (item.id === id ? { ...item, status: "rejected" } : item));
  saveStorage(APPLICATION_STORAGE_KEY, updated);
  dispatchDashboardUpdate();
  return simulateBackendDelay(true);
}

export async function assignWaterComplaint(id: string): Promise<boolean> {
  const complaints = readStorage(COMPLAINT_STORAGE_KEY, defaultComplaints);
  const updated = complaints.map((item) => (item.id === id ? { ...item, status: "assigned" } : item));
  saveStorage(COMPLAINT_STORAGE_KEY, updated);
  dispatchDashboardUpdate();
  return simulateBackendDelay(true);
}

export async function resolveWaterPayment(id: string): Promise<boolean> {
  const payments = readStorage(PAYMENT_STORAGE_KEY, defaultPayments);
  const updated = payments.map((item) => (item.id === id ? { ...item, status: "paid" } : item));
  saveStorage(PAYMENT_STORAGE_KEY, updated);
  dispatchDashboardUpdate();
  return simulateBackendDelay(true);
}

import type { AdminComplaint, ComplaintFilters } from "./adminApi";
import { getAdminWaterComplaints } from "./waterComplaintService";

export type { AdminComplaint, ComplaintFilters };

export async function fetchWaterComplaints(): Promise<AdminComplaint[]> {
  return getAdminWaterComplaints();
}


