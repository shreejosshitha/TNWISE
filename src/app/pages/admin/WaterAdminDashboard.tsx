import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import {
  LogOut, BarChart3, AlertCircle, FileText, Settings, Search, RefreshCw, 
  CheckCircle, XCircle, Loader2, Download, Users, Droplet, TrendingUp, 
  Clock, Shield, Eye, Activity, Bell, Calendar, MapPin, Phone, 
  Mail, UserCheck, AlertTriangle, CheckSquare, XSquare, Timer,
  Building2, FileCheck, Wrench, Home, Globe, Cpu, Brain, 
  TrendingDown, Target, Award,
  AlertTriangle as AlertIcon, Wifi, WifiOff, Bot, Sparkles,
  Map, Layers, Thermometer, Battery, Lightbulb, Gauge,
  Users as UsersIcon, DollarSign, Percent, Calendar as CalendarIcon,
  ChevronRight, ChevronLeft, Maximize2, Minimize2, Star,
  Crown, ShieldCheck, Lock, Unlock, Eye as EyeIcon, Mic, MicOff
} from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ComplaintTable } from "../../components/admin/ComplaintTable";
import { MapView } from "../../components/admin/MapView";
import type {
  WaterDashboardCategory,
  WaterDashboardStat,
  WaterDashboardDetailItem,
  WaterChartData,
  WaterActionItem,
  WaterNotification,
  AdminComplaint,
  ComplaintFilters,
} from "../../backend/waterAdminDashboardService";
import { 
  LineChart, Line, AreaChart, Area, BarChart as RechartsBarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';

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
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<ComplaintFilters>({});
const [workers, setWorkers] = useState<string[]>(["Field Team A", "Field Team B", "Maintenance Crew", "Emergency Response"]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "month">("month");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Additional state for Electricity-style dashboard
  const [wsConnected, setWsConnected] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [emergencyMode, setEmergencyMode] = useState(false);

  const selectedStat = overviewStats.find((stat) => stat.category === selectedCategory);
  const serviceMetrics = overviewStats.filter((stat) => stat.category === "applications");
  const complaintMetrics = overviewStats.filter((stat) =>
    ["pendingComplaints", "newComplaints", "resolvedCases", "overdueAlerts"].includes(stat.category)
  );
  const financialMetrics = overviewStats.filter((stat) =>
    ["totalRevenue", "pendingPayments"].includes(stat.category)
  );

  const [activeTab, setActiveTab] = useState<"service" | "complaints" | "financial" | "map">("service");
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

  const loadApplications = async () => {
    setLoadingApplications(true);
    try {
      const data = await fetchWaterApplications();
      setApplications(data);
    } catch {
      toast.error("Unable to load applications");
    } finally {
      setLoadingApplications(false);
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
    loadApplications();
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



  const handleAssignComplaint = async (complaintId: string, assignedTo: string) => {
    try {
      await assignWaterComplaint(complaintId);
      toast.success(`Complaint assigned to ${assignedTo || "operations"}`);
      loadOverview();
      loadActions();
      loadNotifications();
      loadDetails(selectedCategory);
    } catch (error) {
      toast.error("Failed to assign complaint");
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(complaints.map(complaint => complaint._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleStatusUpdate = async (complaintId: string, status: string) => {
    try {
      await updateWaterComplaintStatus(complaintId, status);
      toast.success(`Complaint status updated to ${status}`);
      loadComplaints();
    } catch (error) {
      toast.error("Failed to update complaint status");
    }
  };

  const handleBulkAssign = async (assignedTo: string) => {
    if (selectedIds.length === 0) {
      toast.error("No complaints selected");
      return;
    }
    // Bulk assign logic here
    toast.success(`${selectedIds.length} complaints assigned to ${assignedTo}`);
    setSelectedIds([]);
    loadComplaints();
  };

  const handleBulkResolve = async () => {
    if (selectedIds.length === 0) {
      toast.error("No complaints selected");
      return;
    }
    // Bulk resolve logic here
    toast.success(`${selectedIds.length} complaints resolved`);
    setSelectedIds([]);
    loadComplaints();
  };

  const handleApproveApplication = async (applicationId: string) => {
    try {
      await updateWaterApplicationStatus(applicationId, "approved");
      toast.success("Application approved");
      loadApplications();
      loadOverview();
    } catch (error) {
      toast.error("Failed to approve application");
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      await updateWaterApplicationStatus(applicationId, "rejected");
      toast.success("Application rejected");
      loadApplications();
      loadOverview();
    } catch (error) {
      toast.error("Failed to reject application");
    }
  };

  const handleResolvePayment = async (id: string) => {
    await resolveWaterPayment(id);
    toast.success("Payment resolved.");
    loadOverview();
    loadActions();
    loadNotifications();
    loadDetails(selectedCategory);
  };

  // Voice Command Functions
  const startVoiceCommand = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Voice commands not supported in this browser");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening for voice commands...");
    };

    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      processVoiceCommand(command);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Voice recognition failed");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processVoiceCommand = (command: string) => {
    const commands = [
      { keywords: ['show stats', 'statistics', 'dashboard'], action: () => setActiveTab('service'), response: 'Showing service dashboard' },
      { keywords: ['show complaints', 'complaints'], action: () => setActiveTab('complaints'), response: 'Showing complaints management' },
      { keywords: ['show applications', 'applications'], action: () => setActiveTab('service'), response: 'Showing service management' },
      { keywords: ['refresh', 'reload', 'update'], action: () => loadOverview(), response: 'Refreshing dashboard data' },
      { keywords: ['emergency mode', 'emergency'], action: () => setEmergencyMode(!emergencyMode), response: `Emergency mode ${!emergencyMode ? 'activated' : 'deactivated'}` }
    ];

    for (const cmd of commands) {
      if (cmd.keywords.some(keyword => command.includes(keyword))) {
        cmd.action();
        toast.success(cmd.response);
        return;
      }
    }

    toast.error(`Command not recognized: "${command}"`);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }
    toast.info(`Searching for: ${searchQuery}`);
    // Implement search logic here
  };

  const getStatusBadge = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: "yellow",
      "in-progress": "blue",
      resolved: "green",
      approved: "green",
      rejected: "red",
      paid: "green",
      "overdue": "red",
    };
    const color = colorMap[status] || "gray";
    return (
      <Badge variant={color as any}>{status.toUpperCase()}</Badge>
    );
  };

  const hasError = Boolean(errorMessage);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Official Government Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-lg">
        <Header />
        <div className="px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* Government Seal */}
                <div className="bg-white/10 p-4 rounded-lg border-2 border-white/20">
                  <div className="text-center">
                    <Crown className="w-10 h-10 mx-auto mb-1" />
                    <div className="text-xs font-bold">GOVERNMENT OF</div>
                    <div className="text-sm font-bold">TAMIL NADU</div>
                  </div>
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold mb-1">Chennai Metropolitan Water Supply</h1>
                  <p className="text-blue-100 text-sm">Department of Water Resources & Infrastructure</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs">
                    <span className="bg-white/20 px-2 py-1 rounded">ISO 9001:2015 Certified</span>
                    <span className="bg-white/20 px-2 py-1 rounded">24/7 Service Available</span>
                    <span className="bg-white/20 px-2 py-1 rounded">Emergency: 108</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm opacity-90">Administrator Portal</div>
                  <div className="font-semibold">{adminUser?.citizenProfile?.name || adminUser?.name || "Admin User"}</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Real-time Status Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <Alert className={`border-${wsConnected ? 'green' : 'yellow'}-200 bg-${wsConnected ? 'green' : 'yellow'}-50 flex-1 mr-4`}>
              <Activity className={`h-4 w-4 text-${wsConnected ? 'green' : 'yellow'}-600`} />
              <AlertDescription className={`text-${wsConnected ? 'green' : 'yellow'}-800`}>
                <strong>System Status:</strong> All services operational • Last updated: {new Date().toLocaleTimeString()} • 
                <span className="inline-flex items-center ml-2">
                  <div className={`w-2 h-2 rounded-full mr-1 ${wsConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                  {wsConnected ? 'Real-time updates active' : 'Connecting to real-time updates...'}
                </span>
              </AlertDescription>
            </Alert>
            
            {/* Voice Command Button */}
            <Button 
              onClick={startVoiceCommand}
              variant={isListening ? "destructive" : "outline"}
              className={`ml-4 ${isListening ? 'animate-pulse' : ''}`}
            >
              {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
              {isListening ? 'Listening...' : 'Voice Command'}
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Actions</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {complaints.filter(c => c.status === 'pending').length + actionItems.filter(a => a.status === 'pending').length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Resolved Today</p>
                  <p className="text-2xl font-bold text-green-600">
                    {complaints.filter(c => c.status === 'resolved').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">New Connections</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {actionItems.filter(a => a.status === 'approved').length}
                  </p>
                </div>
                <Droplet className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-purple-600">
                    2.8d
                  </p>
                </div>
                <Timer className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Controls */}
        <Card className="mb-8 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by ID, phone, consumer number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleSearch} disabled={!searchQuery.trim()}>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" onClick={loadOverview} disabled={refreshing}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh Data
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "service" | "complaints" | "financial" | "map")} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="service">Service Management</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>
          
          <TabsContent value="service" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Service Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingApplications ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="ml-2">Loading applications...</span>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell>{app.id}</TableCell>
                          <TableCell>{app.formData?.name || 'N/A'}</TableCell>
                          <TableCell>{app.type}</TableCell>
                          <TableCell>{getStatusBadge(app.status || 'submitted')}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {app.status === 'submitted' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="default"
                                    onClick={() => handleApproveApplication(app.id)}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => handleRejectApplication(app.id)}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              <Button size="sm" variant="outline">View Details</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {applications.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No applications found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="complaints" className="space-y-4">
            <ComplaintTable 
              complaints={complaints} 
              selectedIds={selectedIds}
              filters={filters}
              workers={workers}
              loading={loadingComplaints} 
              onFilterChange={setFilters}
              onToggleSelect={handleToggleSelect}
              onToggleSelectAll={handleToggleSelectAll}
              onAssign={handleAssignComplaint}
              onStatusUpdate={handleStatusUpdate}
              onBulkAssign={handleBulkAssign}
              onBulkResolve={handleBulkResolve}
            />
          </TabsContent>
          
          <TabsContent value="map" className="space-y-4">
            <MapView complaints={complaints} />
          </TabsContent>
          
          <TabsContent value="financial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">₹{overviewStats.find(s => s.category === 'totalRevenue')?.value || 0}</p>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">₹{overviewStats.find(s => s.category === 'pendingPayments')?.value || 0}</p>
                    <p className="text-sm text-gray-600">Pending Payments</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{overviewStats.find(s => s.category === 'applications')?.value || 0}</p>
                    <p className="text-sm text-gray-600">Active Applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-red-600">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return null; // This should never be reached
}
