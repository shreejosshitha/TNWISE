import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";

import { 
  LogOut, 
  BarChart3, 
  AlertCircle, 
  FileText, 
  Settings, 
  Users, 
  Truck,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { ComplaintTable } from "../../components/admin/ComplaintTable";
import { MapView } from "../../components/admin/MapView";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getMunicipalDashboardCounts, getMunicipalAdminComplaints,  updateAdminComplaintStatus , assignComplaint } from "../../../backend/municipalAdminService";
import type { AdminComplaint, ComplaintFilters } from "../../../backend/adminApi";
import type { ComplaintStatus } from "../../../backend/adminApi";

export function MunicipalAdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, newComplaints: 0, pendingComplaints: 0, resolved: 0 });
  const [complaints, setComplaints] = useState<AdminComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ComplaintFilters>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeWorkers] = useState<string[]>(['Field Team A', 'Field Team B', 'Road Maintenance', 'Garbage Collection', 'Higher Authority']);

  useEffect(() => {
    loadDashboard();
    const handleUpdate = () => loadDashboard();
    window.addEventListener("municipalComplaintUpdated", handleUpdate);
    return () => window.removeEventListener("municipalComplaintUpdated", handleUpdate);
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const counts = getMunicipalDashboardCounts();
      setStats(counts);
      
      const data = getMunicipalAdminComplaints();
      setComplaints(data);
    } catch (error) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: ComplaintFilters) => {
    setFilters(newFilters);
    // Simple client-side filter for demo
    const filtered = getMunicipalAdminComplaints().filter((complaint) => {
      if (newFilters.status && complaint.status !== newFilters.status) return false;
      if (newFilters.priority && complaint.priority !== newFilters.priority) return false;
      if (newFilters.search && !complaint.complaintId.toLowerCase().includes(newFilters.search.toLowerCase())) return false;
      return true;
    });
    setComplaints(filtered);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(complaints.map(c => c._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleAssign = (complaintId: string, assignedTo: string) => {
    try {
      assignComplaint(complaintId, assignedTo);
      toast.success(`Complaint assigned to ${assignedTo}`);
      loadDashboard();
    } catch (error) {
      toast.error("Failed to assign complaint");
    }
  };

  const handleStatusUpdate = (complaintId: string, status: string) => {
    try {
updateAdminComplaintStatus(complaintId, status as ComplaintStatus);      toast.success(`Status updated to ${status}`);
      loadDashboard();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleRowClick = (complaintId: string) => {
    navigate(`/admin/municipal-complaint/${complaintId}`);
  };

  const handleBulkAssign = (assignedTo: string) => {
    selectedIds.forEach(id => handleAssign(id, assignedTo));
    setSelectedIds([]);
  };

  const handleBulkResolve = () => {
    selectedIds.forEach(id => handleStatusUpdate(id, 'RESOLVED'));
    setSelectedIds([]);
  };

  const statusData = useMemo(() => [
    { status: 'NEW', count: complaints.filter(c => c.status === 'NEW').length },
    { status: 'ASSIGNED', count: complaints.filter(c => c.status === 'ASSIGNED').length },
    { status: 'IN_PROGRESS', count: complaints.filter(c => c.status === 'IN_PROGRESS').length },
    { status: 'RESOLVED', count: complaints.filter(c => c.status === 'RESOLVED').length }
  ], [complaints]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
<div className="min-h-screen bg-gray-50">

      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold">Municipal Department Admin</h1>
            <p className="text-lg font-semibold mt-1">Welcome back, <span className="text-blue-200">{user?.citizenProfile?.name || user?.name || 'Admin'}</span>!</p>
              <p className="mt-2 text-sm text-blue-100">Manage applications, complaints, payments, and department analytics.</p>
            <p className="text-sm text-slate-500 mt-1">Last sync: {new Date().toLocaleTimeString()}</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleLogout}
              className="px-8 py-4 bg-gradient-to-r from-slate-500 to-slate-700 hover:from-slate-600 hover:to-slate-800 text-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all font-bold flex items-center gap-3 text-lg"
            >
              <LogOut className="w-6 h-6" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Live KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="group bg-gradient-to-br from-blue-500/10 to-blue-600/20 backdrop-blur-sm rounded-3xl p-8 border border-blue-200/50 shadow-2xl hover:shadow-3xl transition-all cursor-pointer hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-blue-500/20 rounded-2xl backdrop-blur-sm">
                <AlertCircle className="w-10 h-10 text-blue-400" />
              </div>
            </div>
            <h3 className="text-4xl font-black text-blue-900 mb-2">{stats.total}</h3>
            <p className="text-xl font-bold text-slate-700">Total Complaints</p>
            <p className="text-sm text-blue-600 mt-2 font-semibold">Live count • Auto sync</p>
          </div>
          
          <div className="group bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 backdrop-blur-sm rounded-3xl p-8 border border-emerald-200/50 shadow-2xl hover:shadow-3xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-emerald-500/20 rounded-2xl backdrop-blur-sm">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
            </div>
            <h3 className="text-4xl font-black text-emerald-900 mb-2">{stats.resolved}</h3>
            <p className="text-xl font-bold text-slate-700">Resolved Today</p>
            <p className="text-sm text-emerald-600 mt-2 font-semibold">Real-time updates</p>
          </div>
          
          <div className="group bg-gradient-to-br from-orange-500/10 to-orange-600/20 backdrop-blur-sm rounded-3xl p-8 border border-orange-200/50 shadow-2xl hover:shadow-3xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-orange-500/20 rounded-2xl backdrop-blur-sm">
                <Truck className="w-10 h-10 text-orange-400" />
              </div>
            </div>
            <h3 className="text-4xl font-black text-orange-900 mb-2">{stats.pendingComplaints}</h3>
            <p className="text-xl font-bold text-slate-700">In Progress</p>
            <p className="text-sm text-orange-600 mt-2 font-semibold">{stats.newComplaints} new today</p>
          </div>
          
          <div className="group bg-gradient-to-br from-slate-500/10 to-slate-600/20 backdrop-blur-sm rounded-3xl p-8 border border-slate-200/50 shadow-2xl hover:shadow-3xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-slate-500/20 rounded-2xl backdrop-blur-sm">
                <Users className="w-10 h-10 text-slate-400" />
              </div>
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-2">5 Teams</h3>
            <p className="text-xl font-bold text-slate-700">Active Field Teams</p>
            <p className="text-sm text-slate-600 mt-2">Real-time tracking</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-slate-200 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-orange-500" />
              Complaint Management ({complaints.length})
            </h2>
          </div>
          {/* Filter bar would go here */}
        </div>

        {/* Status Analytics */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Complaint Status Analytics</h3>
              <p className="text-sm text-slate-500">Track complaint lifecycle counts, including how many cases have been resolved.</p>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4 h-[320px]">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Status Distribution</h4>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mb-8">
          <MapView complaints={complaints} />
        </div>

        {/* Main Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 p-8">
        <ComplaintTable
          complaints={complaints}
          selectedIds={selectedIds}
          filters={filters}
          workers={activeWorkers}
          loading={loading}
          onFilterChange={handleFilterChange}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onRowClick={handleRowClick}
          onAssign={handleAssign}
          onStatusUpdate={handleStatusUpdate}
          onBulkAssign={handleBulkAssign}
          onBulkResolve={handleBulkResolve}
        />

        </div>
      </div>
    </div>
  );
}

