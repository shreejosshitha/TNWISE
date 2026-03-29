import { useAuth } from "../../context/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { MapView } from "../../components/admin/MapView";
import { electricityApi } from "../../services/electricityApi";
import { wsService } from "../../services/websocket";
import { 
  LogOut, BarChart3, AlertCircle, FileText, Settings, Search, RefreshCw, 
  CheckCircle, XCircle, Loader2, Download, Users, Zap, TrendingUp, 
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
import { 
  LineChart, Line, AreaChart, Area, BarChart as RechartsBarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';

interface Complaint {
  id: string;
  phone: string;
  consumerNumber?: string;
  type: string;
  description: string;
  location: string;
  photo?: string;
  status: "pending" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  assignedTo?: string;
  createdAt: string;
}

interface Application {
  id: string;
  phone: string;
  name: string;
  address: string;
  city: string;
  pincode: string;
  loadType: string;
  loadValue: number;
  purpose: string;
  status: "pending" | "approved" | "rejected" | "installed";
  applicationDate: string;
  documents: {
    identity: boolean;
    address: boolean;
    ownership: boolean;
  };
  fee: number;
}

interface Bill {
  id: string;
  consumerNumber: string;
  phone: string;
  name: string;
  status: string;
  totalAmount: number;
  dueDate: string;
}

export function ElectricityAdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("sessionToken") || "";

  // States
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState<any>({});
  const [detailedStats, setDetailedStats] = useState<any>({});
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Analytics and Enhanced Features States
  const [analyticsData, setAnalyticsData] = useState<any>({});
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [predictiveAlerts, setPredictiveAlerts] = useState<any[]>([]);
  const [geographicData, setGeographicData] = useState<any[]>([]);
  const [energyPatterns, setEnergyPatterns] = useState<any[]>([]);
  const [citizenSentiment, setCitizenSentiment] = useState<any>({});
  const [blockchainTransparency, setBlockchainTransparency] = useState<any[]>([]);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [voiceCommands, setVoiceCommands] = useState<any[]>([]);
  const [isListening, setIsListening] = useState(false);

  // WebSocket connection state
  const [wsConnected, setWsConnected] = useState(false);

  // Approval states
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [complaintStatus, setComplaintStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [appDecision, setAppDecision] = useState({ approved: true });

  // Generate Analytics Data
  const generateAnalyticsData = () => {
    const monthlyData = [
      { month: 'Jan', complaints: 45, applications: 32, revenue: 125000, outages: 12 },
      { month: 'Feb', complaints: 52, applications: 28, revenue: 118000, outages: 8 },
      { month: 'Mar', complaints: 38, applications: 41, revenue: 142000, outages: 15 },
      { month: 'Apr', complaints: 61, applications: 35, revenue: 138000, outages: 9 },
      { month: 'May', complaints: 49, applications: 38, revenue: 149000, outages: 11 },
      { month: 'Jun', complaints: 55, applications: 42, revenue: 156000, outages: 7 }
    ];

    const geographicData = [
      { region: 'North Chennai', connections: 12500, complaints: 45, satisfaction: 4.2 },
      { region: 'South Chennai', connections: 15200, complaints: 38, satisfaction: 4.5 },
      { region: 'Central Chennai', connections: 9800, complaints: 52, satisfaction: 3.8 },
      { region: 'West Chennai', connections: 11100, complaints: 41, satisfaction: 4.1 },
      { region: 'East Chennai', connections: 13200, complaints: 35, satisfaction: 4.3 }
    ];

    const energyPatterns = [
      { hour: '00:00', consumption: 1200, peak: false },
      { hour: '06:00', consumption: 2800, peak: false },
      { hour: '12:00', consumption: 4500, peak: true },
      { hour: '18:00', consumption: 5200, peak: true },
      { hour: '22:00', consumption: 2100, peak: false }
    ];

    const aiInsights = [
      { type: 'predictive', title: 'Power Outage Prediction', description: '85% chance of outage in Sector 7 tomorrow due to transformer overload', severity: 'high', action: 'Schedule maintenance' },
      { type: 'optimization', title: 'Load Balancing Opportunity', description: ' redistribute 15% load from Substation A to B for efficiency', severity: 'medium', action: 'Implement load balancing' },
      { type: 'anomaly', title: 'Unusual Consumption Pattern', description: 'Consumer TN10001234567 shows 300% increase in usage', severity: 'medium', action: 'Investigate meter' }
    ];

    const predictiveAlerts = [
      { id: 'alert_001', type: 'maintenance', title: 'Transformer T-247 Due for Maintenance', location: 'Sector 12, Substation B', priority: 'high', eta: '2 days', impact: 'Affects 500+ consumers' },
      { id: 'alert_002', type: 'capacity', title: 'Peak Load Warning', location: 'Downtown Area', priority: 'medium', eta: '6 hours', impact: 'Potential brownout risk' },
      { id: 'alert_003', type: 'efficiency', title: 'Energy Waste Detected', location: 'Industrial Zone', priority: 'low', eta: '1 week', impact: '15% efficiency loss' }
    ];

    const citizenSentiment = {
      overall: 4.2,
      categories: [
        { name: 'Service Quality', score: 4.1, trend: 'up' },
        { name: 'Response Time', score: 3.8, trend: 'stable' },
        { name: 'Billing Accuracy', score: 4.3, trend: 'up' },
        { name: 'Staff Courtesy', score: 4.4, trend: 'up' }
      ]
    };

    const blockchainTransparency = [
      { hash: 'a1b2c3d4...', timestamp: '2026-03-28 10:30:00', action: 'Complaint Status Updated', block: 15432, verified: true },
      { hash: 'e5f6g7h8...', timestamp: '2026-03-28 09:15:00', action: 'Application Approved', block: 15431, verified: true },
      { hash: 'i9j0k1l2...', timestamp: '2026-03-28 08:45:00', action: 'Payment Processed', block: 15430, verified: true }
    ];

    setAnalyticsData({ monthlyData, geographicData, energyPatterns });
    setAiInsights(aiInsights);
    setPredictiveAlerts(predictiveAlerts);
    setGeographicData(geographicData);
    setEnergyPatterns(energyPatterns);
    setCitizenSentiment(citizenSentiment);
    setBlockchainTransparency(blockchainTransparency);
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
      { keywords: ['show stats', 'statistics', 'dashboard'], action: () => setActiveTab('stats'), response: 'Showing statistics dashboard' },
      { keywords: ['show complaints', 'complaints'], action: () => setActiveTab('complaints'), response: 'Showing complaints management' },
      { keywords: ['show applications', 'applications'], action: () => setActiveTab('applications'), response: 'Showing applications management' },
      { keywords: ['show bills', 'bills'], action: () => setActiveTab('bills'), response: 'Showing bills management' },
      { keywords: ['show analytics', 'analytics'], action: () => setActiveTab('analytics'), response: 'Showing analytics dashboard' },
      { keywords: ['refresh', 'reload', 'update'], action: () => fetchAllData(), response: 'Refreshing all data' },
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

  const fetchAllData = useCallback(async () => {
    setRefreshing(true);
    try {
      const [statsRes, complaintsRes, appsRes, billsRes, detailedRes] = await Promise.all([
        electricityApi.getAdminStats(),
        electricityApi.getAdminComplaints(20),
        electricityApi.getAdminApplications(20),
        electricityApi.getAdminBills(20),
        electricityApi.getDetailedAdminStats()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (complaintsRes.success) setComplaints(complaintsRes.data || []);
      if (appsRes.success) setApplications(appsRes.data || []);
      if (billsRes.success) setBills(billsRes.data || []);
      if (detailedRes.success) setDetailedStats(detailedRes.data);

      // Generate analytics data
      generateAnalyticsData();
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    // Connect to WebSocket
    const socket = wsService.connect();
    wsService.joinAdminRoom();

    // Track connection status
    const checkConnection = () => {
      setWsConnected(wsService.isConnected());
    };

    // Check connection immediately and then periodically
    checkConnection();
    const connectionInterval = setInterval(checkConnection, 5000);

    // Handle real-time complaint updates
    const handleComplaintUpdate = (data: any) => {
      console.log('🔄 Real-time complaint update:', data);
      toast.success(`Complaint ${data.id.slice(0,8)} updated to ${data.status}`, {
        description: `Assigned to: ${data.assignedTo || 'Unassigned'}`
      });
      
      // Update local state
      setComplaints(prev => prev.map(c => 
        c.id === data.id 
          ? { ...c, status: data.status as any, assignedTo: data.assignedTo }
          : c
      ));
    };

    // Handle real-time application updates
    const handleApplicationUpdate = (data: any) => {
      console.log('🔄 Real-time application update:', data);
      toast.success(`Application ${data.id.slice(0,8)} ${data.status}`, {
        description: 'Status updated in real-time'
      });
      
      // Update local state
      setApplications(prev => prev.map(a => 
        a.id === data.id 
          ? { ...a, status: data.status as any }
          : a
      ));
    };

    // Register event listeners
    wsService.onComplaintUpdated(handleComplaintUpdate);
    wsService.onApplicationUpdated(handleApplicationUpdate);

    // Cleanup on unmount
    return () => {
      clearInterval(connectionInterval);
      wsService.disconnect();
    };
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchAllData();
      return;
    }
    const res = await electricityApi.searchAdmin(searchQuery);
    if (res.success) {
      setComplaints(res.data.complaints || []);
      setApplications(res.data.applications || []);
      setBills(res.data.bills || []);
    }
  };

  const handleApproveComplaint = async () => {
    if (!selectedComplaint || !complaintStatus) {
      toast.error("Please select a status");
      return;
    }
    try {
      const res = await electricityApi.updateComplaintStatus(selectedComplaint.id, {
        status: complaintStatus as any,
        assignedTo,
      }, token);
      if (res.success) {
        toast.success("Complaint updated successfully");
        fetchAllData();
        setSelectedComplaint(null);
        setComplaintStatus("");
        setAssignedTo("");
      } else {
        toast.error(res.message || "Update failed");
      }
    } catch (error) {
      toast.error("Update failed - check console");
      console.error("Update error:", error);
    }
  };

  const handleApproveApplication = async () => {
    if (!selectedApplication) return;
    const res = await electricityApi.approveApplication(selectedApplication.id, {
      ...appDecision,
      documentsVerified: selectedApplication.documents
    }, token);
    if (res.success) {
      toast.success(appDecision.approved ? "Application approved" : "Application rejected");
      fetchAllData();
      setSelectedApplication(null);
      setAppDecision({ approved: true });
    }
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

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
                  <h1 className="text-3xl font-bold mb-1">Tamil Nadu Electricity Board</h1>
                  <p className="text-blue-100 text-sm">Department of Energy & Infrastructure</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs">
                    <span className="bg-white/20 px-2 py-1 rounded">ISO 9001:2015 Certified</span>
                    <span className="bg-white/20 px-2 py-1 rounded">24/7 Service Available</span>
                    <span className="bg-white/20 px-2 py-1 rounded">Emergency: 1912</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm opacity-90">Administrator Portal</div>
                  <div className="font-semibold">{user?.name || "Admin User"}</div>
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
                    {complaints.filter(c => c.status === 'pending').length + applications.filter(a => a.status === 'pending').length}
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
                    {applications.filter(a => a.status === 'approved').length}
                  </p>
                </div>
                <Zap className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {detailedStats.avgResolutionDays || 0}d
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
                <Button variant="outline" onClick={fetchAllData} disabled={refreshing}>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="stats">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="bills">Billing</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="space-y-6">
              {/* AI Insights & Predictive Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      AI-Powered Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {aiInsights.map((insight: any, index: number) => (
                        <div key={index} className={`p-4 rounded-lg border-l-4 ${
                          insight.severity === 'high' ? 'border-l-red-500 bg-red-50' :
                          insight.severity === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                          'border-l-blue-500 bg-blue-50'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{insight.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant={insight.severity === 'high' ? 'destructive' : 'secondary'}>
                                  {insight.severity} priority
                                </Badge>
                                <span className="text-xs text-gray-500">Action: {insight.action}</span>
                              </div>
                            </div>
                            <Sparkles className="w-5 h-5 text-purple-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Predictive Maintenance Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {predictiveAlerts.map((alert: any) => (
                        <div key={alert.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{alert.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{alert.location}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant={alert.priority === 'high' ? 'destructive' : 'secondary'}>
                                  {alert.priority}
                                </Badge>
                                <span className="text-xs text-gray-500">ETA: {alert.eta}</span>
                              </div>
                              <p className="text-xs text-red-600 mt-1">{alert.impact}</p>
                            </div>
                            <Wrench className="w-5 h-5 text-orange-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Monthly Performance Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analyticsData.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="complaints" stroke="#ef4444" name="Complaints" />
                        <Line type="monotone" dataKey="applications" stroke="#3b82f6" name="Applications" />
                        <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue (₹)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gauge className="w-5 h-5" />
                      Energy Consumption Patterns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={analyticsData.energyPatterns}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="consumption" stroke="#f59e0b" fill="#fef3c7" name="Consumption (kWh)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Geographic Analysis & Citizen Sentiment */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Map className="w-5 h-5" />
                      Regional Performance Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.geographicData?.map((region: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{region.region}</h4>
                            <p className="text-sm text-gray-600">{region.connections.toLocaleString()} connections</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="font-semibold">{region.satisfaction}</span>
                            </div>
                            <p className="text-sm text-gray-600">{region.complaints} complaints</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Citizen Sentiment Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-blue-600 mb-2">{citizenSentiment.overall}/5.0</div>
                      <p className="text-gray-600">Overall Satisfaction Score</p>
                    </div>
                    <div className="space-y-3">
                      {citizenSentiment.categories?.map((category: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{category.name}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={category.score * 20} className="w-20" />
                            <span className="text-sm font-medium w-8">{category.score}</span>
                            <span className={`text-xs ${category.trend === 'up' ? 'text-green-600' : 'text-gray-600'}`}>
                              {category.trend === 'up' ? '↗' : '→'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Blockchain Transparency & Emergency Mode */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Blockchain Transparency Ledger
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {blockchainTransparency.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{entry.action}</p>
                            <p className="text-xs text-gray-600">Block #{entry.block} • {entry.timestamp}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono bg-white px-2 py-1 rounded border">
                              {entry.hash.substring(0, 8)}...
                            </span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Emergency Response Center
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Emergency Mode</span>
                        <Button 
                          variant={emergencyMode ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => setEmergencyMode(!emergencyMode)}
                        >
                          {emergencyMode ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="text-2xl font-bold text-red-600">3</div>
                          <p className="text-sm text-gray-600">Active Emergencies</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">12</div>
                          <p className="text-sm text-gray-600">Teams Deployed</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Quick Actions</h4>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Phone className="w-4 h-4 mr-1" />
                            Emergency Call
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Map className="w-4 h-4 mr-1" />
                            Deploy Team
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Voice Command Help */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Voice Command Interface
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Navigation Commands</h4>
                    <ul className="text-sm space-y-1">
                      <li>• "Show statistics" or "Dashboard"</li>
                      <li>• "Show complaints"</li>
                      <li>• "Show applications"</li>
                      <li>• "Show bills"</li>
                      <li>• "Show analytics"</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Action Commands</h4>
                    <ul className="text-sm space-y-1">
                      <li>• "Refresh" or "Update data"</li>
                      <li>• "Emergency mode"</li>
                      <li>• "Activate emergency"</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Pro tip:</strong> Click the voice command button above and speak naturally. 
                    The system will automatically recognize and execute your commands.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>₹{detailedStats.totalRevenue || 0}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Total Revenue</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>{detailedStats.avgResolutionDays || 0} days</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Avg Resolution</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Complaints Tab */}
          <TabsContent value="complaints" className="mt-6">
            <Card className="shadow-sm">
              <CardHeader className="bg-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                      Complaints Management
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {complaints.length} total complaints • {complaints.filter(c => c.status === 'pending').length} pending • 
                      {complaints.filter(c => c.status === 'in-progress').length} in progress
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      High: {complaints.filter(c => c.priority === 'high').length}
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Medium: {complaints.filter(c => c.priority === 'medium').length}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Low: {complaints.filter(c => c.priority === 'low').length}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">ID</TableHead>
                        <TableHead className="font-semibold">Contact</TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold">Location</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Priority</TableHead>
                        <TableHead className="font-semibold">Created</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complaints.map((complaint) => (
                      <TableRow key={complaint.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium font-mono text-sm">
                          {complaint.id.slice(0,8)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{complaint.phone}</span>
                            {complaint.consumerNumber && (
                              <span className="text-xs text-gray-500">CN: {complaint.consumerNumber}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {complaint.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm max-w-xs truncate">
                            <div className="font-medium">{complaint.location}</div>
                            {complaint.photo && (
                              <span className="text-xs text-blue-600 hover:underline cursor-pointer">
                                📷 Photo
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={complaint.priority === 'high' ? 'destructive' : complaint.priority === 'medium' ? 'default' : 'secondary'}
                            className={complaint.priority === 'high' ? 'animate-pulse' : ''}
                          >
                            {complaint.priority.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(complaint.createdAt).toLocaleDateString()}</div>
                            <div className="text-gray-500 text-xs">{new Date(complaint.createdAt).toLocaleTimeString()}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0 hover:bg-blue-50"
                                onClick={() => setSelectedComplaint(complaint)}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <AlertCircle className="w-5 h-5 text-orange-500" />
                                  Update Complaint {complaint.id.slice(0,8)}
                                </DialogTitle>
                                <DialogDescription>
                                  Update status and assign technician for real-time tracking.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <h4 className="font-medium mb-2">Complaint Details</h4>
                                  <p className="text-sm text-gray-600">{complaint.description}</p>
                                  <div className="flex gap-2 mt-2">
                                    <Badge variant="outline">{complaint.type}</Badge>
                                    <Badge variant={complaint.priority === 'high' ? 'destructive' : 'secondary'}>
                                      {complaint.priority} priority
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Update Status</label>
                                  <Select value={complaintStatus} onValueChange={setComplaintStatus}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="in-progress">In Progress</SelectItem>
                                      <SelectItem value="resolved">Resolved</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Assign Technician</label>
                                  <Select value={assignedTo} onValueChange={setAssignedTo}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select technician" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Technician Ram">Technician Ram</SelectItem>
                                      <SelectItem value="Technician Priya">Technician Priya</SelectItem>
                                      <SelectItem value="Technician Kumar">Technician Kumar</SelectItem>
                                      <SelectItem value="Technician Sharma">Technician Sharma</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter className="flex gap-2">
                                <Button variant="outline" onClick={() => setSelectedComplaint(null)}>
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={handleApproveComplaint} 
                                  disabled={!complaintStatus}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Update Status
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="mt-6">
            <Card className="shadow-sm">
              <CardHeader className="bg-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      New Connection Applications
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {applications.length} total applications • {applications.filter(a => a.status === 'pending').length} pending review • 
                      {applications.filter(a => a.status === 'approved').length} approved
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Pending: {applications.filter(a => a.status === 'pending').length}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      In Review: {applications.filter(a => a.status === 'docs-verified').length}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Approved: {applications.filter(a => a.status === 'approved').length}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Application ID</TableHead>
                      <TableHead className="font-semibold">Applicant</TableHead>
                      <TableHead className="font-semibold">Contact</TableHead>
                      <TableHead className="font-semibold">Load Details</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Fee</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium font-mono text-sm">
                          {app.id.slice(0,8)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{app.name}</span>
                            <span className="text-xs text-gray-500">{app.address}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{app.phone}</span>
                            <span className="text-xs text-gray-500">{app.city}, {app.pincode}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{app.loadValue} kW</div>
                            <div className="text-gray-500 capitalize">{app.loadType}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell>
                          <span className="font-medium text-green-600">₹{app.fee}</span>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0 hover:bg-blue-50"
                                onClick={() => setSelectedApplication(app)}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <FileCheck className="w-5 h-5 text-blue-500" />
                                  Review Application {app.id.slice(0,8)}
                                </DialogTitle>
                                <DialogDescription>
                                  Review and approve/reject new electricity connection application.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <h4 className="font-medium mb-3">Application Details</h4>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-gray-600">Name:</span>
                                      <span className="ml-2 font-medium">{app.name}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Phone:</span>
                                      <span className="ml-2 font-medium">{app.phone}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Load:</span>
                                      <span className="ml-2 font-medium">{app.loadValue} kW ({app.loadType})</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Fee:</span>
                                      <span className="ml-2 font-medium text-green-600">₹{app.fee}</span>
                                    </div>
                                    <div className="col-span-2">
                                      <span className="text-gray-600">Address:</span>
                                      <span className="ml-2">{app.address}, {app.city} - {app.pincode}</span>
                                    </div>
                                    <div className="col-span-2">
                                      <span className="text-gray-600">Purpose:</span>
                                      <span className="ml-2">{app.purpose}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                  <h4 className="font-medium mb-2">Document Verification</h4>
                                  <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded-full ${app.documents.identity ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                      <span className="text-sm">Identity Proof</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded-full ${app.documents.address ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                      <span className="text-sm">Address Proof</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded-full ${app.documents.ownership ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                      <span className="text-sm">Ownership Proof</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <label className="text-sm font-medium">Decision</label>
                                  <div className="flex gap-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input 
                                        type="radio" 
                                        name="decision"
                                        checked={appDecision.approved}
                                        onChange={() => setAppDecision({ approved: true })}
                                        className="w-4 h-4 text-green-600"
                                      />
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span className="text-sm font-medium">Approve Application</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input 
                                        type="radio" 
                                        name="decision"
                                        checked={!appDecision.approved}
                                        onChange={() => setAppDecision({ approved: false })}
                                        className="w-4 h-4 text-red-600"
                                      />
                                      <XCircle className="w-4 h-4 text-red-600" />
                                      <span className="text-sm font-medium">Reject Application</span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter className="flex gap-2">
                                <Button variant="outline" onClick={() => setSelectedApplication(null)}>
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={handleApproveApplication}
                                  className={appDecision.approved ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                                >
                                  {appDecision.approved ? (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Approve Application
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Reject Application
                                    </>
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bills Tab */}
          <TabsContent value="bills" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Bills ({bills.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Consumer</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bills.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell>{bill.id.slice(0,8)}</TableCell>
                        <TableCell>{bill.consumerNumber}</TableCell>
                        <TableCell>{bill.phone}</TableCell>
                        <TableCell>{getStatusBadge(bill.status)}</TableCell>
                        <TableCell>₹{bill.totalAmount}</TableCell>
                        <TableCell>{bill.dueDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Map View Tab */}
          <TabsContent value="map" className="mt-6">
            <MapView complaints={complaints} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

