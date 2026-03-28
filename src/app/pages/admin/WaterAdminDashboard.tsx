import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { Header } from "../../components/Header";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CheckCircle2,
  DollarSign,
  LogOut,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  approveWaterApplication,
  assignWaterComplaint,
  fetchWaterActionItems,
  fetchWaterChartData,
  fetchWaterDashboardStats,
  fetchWaterDetailItems,
  fetchWaterNotifications,
  fetchWaterComplaints,
  rejectWaterApplication,
  resolveWaterPayment,
  type WaterActionItem,
  type WaterChartData,
  type WaterDashboardCategory,
  type WaterDashboardDetailItem,
  type WaterDashboardStat,
  type WaterNotification,
  type AdminComplaint,
} from "../../../backend/waterAdminDashboardService";
import { MapView } from "../../components/admin/MapView";
import { ComplaintTable, type ComplaintFilters } from "../../components/admin/ComplaintTable";
// imports fixed

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const statColorMap: Record<WaterDashboardCategory, { bg: string; text: string }> = {
  applications: { bg: "bg-slate-50", text: "text-slate-900" },
  pendingComplaints: { bg: "bg-red-50", text: "text-red-600" },
  newComplaints: { bg: "bg-yellow-50", text: "text-yellow-600" },
  resolvedCases: { bg: "bg-indigo-50", text: "text-indigo-600" },
  totalRevenue: { bg: "bg-emerald-50", text: "text-emerald-600" },
  pendingPayments: { bg: "bg-orange-50", text: "text-orange-600" },
  overdueAlerts: { bg: "bg-rose-50", text: "text-rose-600" },
};

const chartColors = ["#0ea5e9", "#14b8a6", "#f97316", "#e11d48"];

type ServiceSubTab = "newRequests" | "maintenance" | "inspections";

const serviceSubCategoryLabels: Record<ServiceSubTab, string> = {
  newRequests: "New Requests",
  maintenance: "Maintenance",
  inspections: "Inspections",
};

const serviceSubTabAnalyticsData: Record<ServiceSubTab, { name: string; value: number }[]> = {
  newRequests: [
    { name: "Week 1", value: 18 },
    { name: "Week 2", value: 24 },
    { name: "Week 3", value: 21 },
    { name: "Week 4", value: 27 },
  ],
  maintenance: [
    { name: "Week 1", value: 12 },
    { name: "Week 2", value: 16 },
    { name: "Week 3", value: 14 },
    { name: "Week 4", value: 19 },
  ],
  inspections: [
    { name: "Week 1", value: 8 },
    { name: "Week 2", value: 11 },
    { name: "Week 3", value: 15 },
    { name: "Week 4", value: 13 },
  ],
};

const serviceSubTabDummyActivity: Record<ServiceSubTab, WaterActionItem[]> = {
  newRequests: [
    {
      id: "SRV1001",
      title: "New connection approval pending",
      subtitle: "North Sector · Residential",
      type: "application",
      status: "Pending approval",
      actionLabel: "Review",
      modulePath: "/admin/water",
      date: "2026-03-27",
      details: "8 new connection requests are waiting in the queue.",
    },
    {
      id: "SRV1002",
      title: "Service request verification",
      subtitle: "East Zone · Commercial",
      type: "application",
      status: "Awaiting documents",
      actionLabel: "Verify",
      modulePath: "/admin/water",
      date: "2026-03-25",
      details: "Customer documents need verification before approval.",
    },
  ],
  maintenance: [
    {
      id: "SRV2001",
      title: "Scheduled pump maintenance",
      subtitle: "West Plant · Priority",
      type: "application",
      status: "In progress",
      actionLabel: "Track",
      modulePath: "/admin/water",
      date: "2026-03-26",
      details: "Pump maintenance scheduled to finish by tomorrow.",
    },
    {
      id: "SRV2002",
      title: "Valve replacement request",
      subtitle: "South District · Urgent",
      type: "application",
      status: "Assigned",
      actionLabel: "Coordinate",
      modulePath: "/admin/water",
      date: "2026-03-24",
      details: "Valve replacement crews dispatched to site.",
    },
  ],
  inspections: [
    {
      id: "SRV3001",
      title: "Quality audit completed",
      subtitle: "Central Zone · Inspector team A",
      type: "application",
      status: "Completed",
      actionLabel: "Review",
      modulePath: "/admin/water",
      date: "2026-03-23",
      details: "Water quality audit passed for three locations.",
    },
    {
      id: "SRV3002",
      title: "Routine pipeline inspection",
      subtitle: "North-East · Team B",
      type: "application",
      status: "Scheduled",
      actionLabel: "Prepare",
      modulePath: "/admin/water",
      date: "2026-03-22",
      details: "Pipeline inspection scheduled for next Wednesday.",
    },
  ],
};

export function WaterAdminDashboard() {
  const auth = useAuth();
  const { logout } = auth;
  const navigate = useNavigate();

  // Dummy admin data for demo
  const adminUser = {
    name: "Ravi Kumar",
    phone: "+91 98765 43210",
    department: "Water Department",
    citizenProfile: {
      name: "Ravi Kumar"
    }
  };
  const [overviewStats, setOverviewStats] = useState<WaterDashboardStat[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<WaterDashboardCategory>("applications");
  const [detailItems, setDetailItems] = useState<WaterDashboardDetailItem[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [chartData, setChartData] = useState<WaterChartData>({
    complaintsTrend: [],
    applicationsTrend: [],
    revenueTrend: [],
    paymentStatus: [],
  });
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [actionsLoading, setActionsLoading] = useState(true);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [actionItems, setActionItems] = useState<WaterActionItem[]>([]);
  const [notifications, setNotifications] = useState<WaterNotification[]>([]);
  const [complaints, setComplaints] = useState<AdminComplaint[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<ComplaintFilters>({});
const [workers, setWorkers] = useState<string[]>(["Field Team A", "Field Team B", "Maintenance Crew", "Emergency Response"]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "month">("month");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedStat = overviewStats.find((stat) => stat.category === selectedCategory);
  const serviceMetrics = overviewStats.filter((stat) => stat.category === "applications");
  const complaintMetrics = overviewStats.filter((stat) =>
    ["pendingComplaints", "newComplaints", "resolvedCases", "overdueAlerts"].includes(stat.category)
  );
  const financialMetrics = overviewStats.filter((stat) =>
    ["totalRevenue", "pendingPayments"].includes(stat.category)
  );

  const [activeTab, setActiveTab] = useState<"service" | "complaints" | "financial">("service");
  const [serviceSubTab, setServiceSubTab] = useState<ServiceSubTab>("newRequests");

  const selectedMetrics = useMemo(() => {
    if (activeTab === "service") return serviceMetrics;
    if (activeTab === "complaints") return complaintMetrics;
    return financialMetrics;
  }, [activeTab, serviceMetrics, complaintMetrics, financialMetrics]);

  const serviceSubActivity = useMemo(() => serviceSubTabDummyActivity[serviceSubTab], [serviceSubTab]);

  const recentActivity = useMemo(() => {
    if (activeTab === "service") return serviceSubActivity;
    if (activeTab === "complaints") return actionItems.filter((item) => item.type === "complaint");
    return actionItems.filter((item) => item.type === "payment" || item.type === "application");
  }, [activeTab, actionItems, serviceSubActivity]);

  const statusBadgeClass = (status?: string) => {
    if (!status) return "bg-slate-100 text-slate-700";
    const lower = status.toLowerCase();
    if (lower.includes("overdue") || lower.includes("urgent")) return "bg-rose-100 text-rose-700";
    if (lower.includes("pending") || lower.includes("review")) return "bg-amber-100 text-amber-700";
    if (lower.includes("resolved") || lower.includes("completed")) return "bg-emerald-100 text-emerald-700";
    return "bg-slate-100 text-slate-700";
  };

  const unreadNotificationCount = useMemo(
    () => notifications.filter((notification) => notification.isNew).length,
    [notifications]
  );

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const loadOverview = async () => {
    setOverviewLoading(true);
    try {
      const stats = await fetchWaterDashboardStats();
      setOverviewStats(stats);
    } catch {
      setErrorMessage("Unable to load dashboard metrics. Please refresh.");
    } finally {
      setOverviewLoading(false);
    }
  };

  const loadCharts = async () => {
    setChartsLoading(true);
    try {
      const result = await fetchWaterChartData(timeFilter);
      setChartData(result);
    } catch {
      setErrorMessage("Unable to load chart data. Please refresh.");
    } finally {
      setChartsLoading(false);
    }
  };

  const loadActions = async () => {
    setActionsLoading(true);
    try {
      const items = await fetchWaterActionItems(timeFilter, sortOrder);
      setActionItems(items);
    } catch {
      setErrorMessage("Unable to load action items. Please refresh.");
    } finally {
      setActionsLoading(false);
    }
  };

  const loadNotifications = async () => {
    setNotificationsLoading(true);
    try {
      const items = await fetchWaterNotifications();
      setNotifications(items);
    } catch {
      setErrorMessage("Unable to load notifications. Please refresh.");
    } finally {
      setNotificationsLoading(false);
    }
  };

  const loadComplaints = async () => {
    setLoadingComplaints(true);
    try {
      const data = await fetchWaterComplaints();
      setComplaints(data);
      setWorkers(["Field Team A", "Field Team B", "Maintenance Crew", "Emergency Response"]);
    } catch {
      toast.error("Unable to load complaints");
    } finally {
      setLoadingComplaints(false);
    }
  };

  const loadDetails = async (category: WaterDashboardCategory) => {
    setLoadingDetails(true);
    try {
      const details = await fetchWaterDetailItems(category);
      setDetailItems(details);
    } catch {
      setErrorMessage("Unable to load category details. Please try again.");
    } finally {
      setLoadingDetails(false);
    }
  };


useEffect(() => {
    loadOverview();
    loadCharts();
    loadActions();
    loadNotifications();
    loadComplaints();
  }, []);

  useEffect(() => {
    loadDetails(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    loadCharts();
    loadActions();
  }, [timeFilter, sortOrder]);

useEffect(() => {
    const handleStorageChange = () => {
      loadOverview();
      loadCharts();
      loadActions();
      loadNotifications();
      loadDetails(selectedCategory);
      loadComplaints();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("waterComplaintUpdated", handleStorageChange);
    window.addEventListener("waterDashboardUpdated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("waterComplaintUpdated", handleStorageChange);
      window.removeEventListener("waterDashboardUpdated", handleStorageChange);
    };
  }, [selectedCategory]);

  const formatMetricValue = (stat: WaterDashboardStat) => {
    if (stat.category === "totalRevenue") {
      return `₹${stat.value.toLocaleString()}`;
    }
    return stat.value;
  };

  const handleNavigation = (path?: string) => {
    if (!path) return;
    navigate(path);
  };

  const handleNotificationClick = (notification: WaterNotification) => {
    setShowNotifications(false);
    setNotifications((current) =>
      current.map((item) => (item.id === notification.id ? { ...item, isNew: false } : item))
    );
    navigate(notification.modulePath);
  };

  const handleApproveApplication = async (id: string) => {
    await approveWaterApplication(id);
    toast.success("Application approved.");
    loadOverview();
    loadActions();
    loadNotifications();
    loadDetails(selectedCategory);
  };

  const handleRejectApplication = async (id: string) => {
    await rejectWaterApplication(id);
    toast.error("Application rejected.");
    loadOverview();
    loadActions();
    loadNotifications();
    loadDetails(selectedCategory);
  };

  const handleAssignComplaint = async (id: string) => {
    await assignWaterComplaint(id);
    toast.success("Complaint assigned to operations.");
    loadOverview();
    loadActions();
    loadNotifications();
    loadDetails(selectedCategory);
  };

  const handleResolvePayment = async (id: string) => {
    await resolveWaterPayment(id);
    toast.success("Payment resolved.");
    loadOverview();
    loadActions();
    loadNotifications();
    loadDetails(selectedCategory);
  };

  const hasError = Boolean(errorMessage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl p-6 text-white mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold">Water Department Admin</h1>
              <p className="text-lg font-semibold mt-1">Welcome back, <span className="text-blue-200">{adminUser.citizenProfile.name || adminUser.name || 'Admin'}</span>!</p>
              <p className="mt-2 text-sm text-blue-100">Manage applications, complaints, payments, and department analytics.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-blue-200">{adminUser.phone}</p>
                <p className="text-xs text-blue-100">{adminUser.department}</p>
              </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-semibold text-blue-900">
                    {adminUser.citizenProfile?.name?.charAt(0).toUpperCase() || 'R'}
                  </div>
                </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <section className="rounded-3xl bg-white p-6 shadow-md mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Dashboard Categories</h2>
              <p className="text-sm text-slate-500">Select a category to view its metrics and recent activity.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {(["service", "complaints", "financial"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeTab === tab ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {tab === "service" ? "Service" : tab === "complaints" ? "Complaints" : "Financial"}
                </button>
              ))}
            </div>
          </div>
        </section>

        {activeTab === "service" && (
          <section className="rounded-3xl bg-white p-6 shadow-md mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Service Subcategories</h3>
                <p className="text-sm text-slate-500">Choose a service stream to view analytics and activity.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {(Object.keys(serviceSubCategoryLabels) as ServiceSubTab[]).map((subTab) => (
                  <button
                    key={subTab}
                    type="button"
                    onClick={() => setServiceSubTab(subTab)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      serviceSubTab === subTab ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {serviceSubCategoryLabels[subTab]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_0.75fr]">
                <div className="rounded-3xl border border-slate-200/50 bg-gradient-to-br from-slate-50 to-blue-50 p-6 shadow-lg ring-1 ring-slate-200/50 backdrop-blur-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-blue-600 font-semibold">{serviceSubCategoryLabels[serviceSubTab]}</p>
                    <h4 className="mt-2 text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Activity Trend</h4>
                    <p className="mt-2 max-w-xl text-sm text-slate-600">
                      Analytics over the current month for the selected service category.
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800">
                    {serviceSubActivity.length} recent updates
                  </div>
                </div>

                <div className="mt-6 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={serviceSubTabAnalyticsData[serviceSubTab]} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                      <CartesianGrid stroke="rgba(148,163,184,0.08)" strokeDasharray="3 3" />
                      <XAxis dataKey="name" stroke="rgba(148,163,184,0.5)" />
                      <YAxis stroke="rgba(148,163,184,0.5)" />
                      <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid rgba(148,163,184,0.2)', color: 'black', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0,0, 0.1), 0 10px 10px -5px rgba(0, 0,0, 0.04)' }} />
                      <Line type="monotone" dataKey="value" stroke={chartColors[0]} strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: chartColors[0] }} activeDot={{ r: 8, strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-slate-900">Quick Summary</h4>
                <p className="mt-2 text-sm text-slate-600">Service category insights for the selected stream.</p>
                <div className="mt-6 space-y-4">
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Expected throughput</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{serviceSubTab === "newRequests" ? "24 requests" : serviceSubTab === "maintenance" ? "18 tasks" : "14 inspections"}</p>
                  </div>
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Average completion</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{serviceSubTab === "newRequests" ? "72%" : serviceSubTab === "maintenance" ? "84%" : "91%"}</p>
                  </div>
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Priority items</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{serviceSubTab === "newRequests" ? "6" : serviceSubTab === "maintenance" ? "4" : "2"}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "complaints" && (
          <>
            {/* 3 Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { title: "Pending Complaints", stat: overviewStats.find(s => s.category === "pendingComplaints"), color: "bg-red-50 text-red-600" },
                { title: "New Complaints", stat: overviewStats.find(s => s.category === "newComplaints"), color: "bg-yellow-50 text-yellow-600" },
                { title: "Resolved Cases", stat: overviewStats.find(s => s.category === "resolvedCases"), color: "bg-emerald-50 text-emerald-600" }
              ].map(({ title, stat, color }, index) => (
                <div key={index} className={`rounded-3xl p-8 shadow-lg border ${color}`}>
                  <h4 className="text-3xl font-bold text-slate-900">{stat?.value || 0}</h4>
                  <p className="mt-2 text-lg font-semibold text-slate-700">{title}</p>
                </div>
              ))}
            </section>

            {/* AI Insights */}
            <section className="mb-8">
              <div className="rounded-3xl bg-gradient-to-r from-purple-50 to-indigo-50 p-8 border shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">AI Insights</h3>
                    <p className="text-sm text-slate-500">Auto-generated analysis from complaint data</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <p className="text-slate-600">High Priority %</p>
                    <p className="text-2xl font-bold text-red-600">
                      {complaints.filter(c => c.priority === "HIGH").length / Math.max(complaints.length, 1) * 100 | 0}%
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <p className="text-slate-600">Avg Age</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {complaints.reduce((sum, c) => sum + (new Date().getTime() - new Date(c.createdAt).getTime()), 0) / complaints.length / (1000*60*60) | 0} hrs
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <p className="text-slate-600">Top Area</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {complaints.reduce((top, c) => {
                        const count = top.count || 0;
                        return complaints.filter(cc => cc.area === c.area).length > count ? { area: c.area, count: complaints.filter(cc => cc.area === c.area).length } : top;
                      }, {area: 'N/A', count: 0}).area}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Two Horizontal Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Status Chart */}
              <div className="rounded-3xl bg-white p-6 shadow-lg border">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Complaints by Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'Submitted', value: complaints.filter(c => c.status === "NEW").length },
                    { name: 'Assigned', value: complaints.filter(c => c.status === "ASSIGNED").length },
                    { name: 'In Progress', value: complaints.filter(c => c.status === "IN_PROGRESS").length },
                    { name: 'Resolved', value: complaints.filter(c => c.status === "RESOLVED").length },
                    { name: 'Closed', value: complaints.filter(c => c.status === "REOPENED").length }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Category Chart */}
              <div className="rounded-3xl bg-white p-6 shadow-lg border">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Complaints by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'Water Supply', value: complaints.filter(c => c.category === "Water Supply").length },
                    { name: 'Water Quality', value: complaints.filter(c => c.category === "Water Quality").length },
                    { name: 'Infrastructure', value: complaints.filter(c => c.category === "Infrastructure").length },
                    { name: 'Billing', value: complaints.filter(c => c.category === "Billing").length },
                    { name: 'Other', value: complaints.filter(c => c.category === "Other").length }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Map full width */}
            <div className="mb-8">
              <MapView complaints={complaints} />
            </div>
            
            {/* Complaint Table below map */}
            <div className="mb-8">
              <ComplaintTable 
                complaints={complaints}
                selectedIds={selectedIds}
                filters={filters}
                workers={workers}
                loading={loadingComplaints}
                onFilterChange={setFilters}
                onToggleSelect={(id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])}
                onToggleSelectAll={() => setSelectedIds([])}
                onAssign={handleAssignComplaint}
              />
            </div>
          </>
        )}

        <section className="rounded-3xl bg-white p-6 shadow-md mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {activeTab === "service"
                  ? "Service Metrics"
                  : activeTab === "complaints"
                  ? "Complaint Metrics"
                  : "Financial Metrics"}
              </h3>
              <p className="text-sm text-slate-500">
                {activeTab === "service"
                  ? "Key service-related indicators."
                  : activeTab === "complaints"
                  ? "Complaint volume and resolution details."
                  : "Financial health indicators."}
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              {overviewLoading ? "Loading metrics..." : `${selectedMetrics.length} metrics`}
            </span>
          </div>

          {actionsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-24 animate-pulse rounded-3xl bg-slate-100" />
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
              No recent activity for this category.
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="rounded-3xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.type}</p>
                      <h4 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(item.status)}`}>{item.status}</span>
                      <p className="mt-2 text-xs text-slate-500">{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">{item.details}</p>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
