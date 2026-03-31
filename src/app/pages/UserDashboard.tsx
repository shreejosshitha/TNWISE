
import { AIChatbot } from "../components/AIChatbot";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Zap,
  Droplet,
  Building2,
  CreditCard,
  FileText,
  Search,
  Plus,
  Bell,
  TrendingUp,
  CheckCircle2,
  Clock,
  Shield,
  User,
  MapPin,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const profile = user?.citizenProfile;
  const address = profile
    ? `${profile.address}, ${profile.city}, ${profile.state} - ${profile.pincode}`
    : "Complete your profile to view full address.";

  const activeServices = useMemo(() => {
    if (!profile?.services) return 0;
    return Object.values(profile.services).filter((service) => service?.status === "active").length;
  }, [profile?.services]);

  const totalServices = useMemo(() => {
    if (!profile?.services) return 0;
    return Object.values(profile.services).filter(Boolean).length;
  }, [profile?.services]);

  return (
<div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="flex justify-end p-4">
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Header Banner */}
        <div className="bg-white border-2 border-blue-200 shadow-lg rounded-xl p-8 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 border-4 border-blue-800 bg-blue-50 rounded-lg flex items-center justify-center p-4 shadow-md">
                <img 
                  src="/images/tn-govt-emblem.png" 
                  alt="Government of Tamil Nadu" 
                  className="w-20 h-20 object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  Citizen Dashboard
                </h1>
                <p className="text-xl text-blue-900 mt-2 font-semibold">Government of Tamil Nadu</p>
                <p className="text-gray-700 mt-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Welcome, <span className="font-bold">{user?.name ?? "Citizen"}</span>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Active Services</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">{activeServices}</p>
              </div>
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-lg">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Services</p>
                <p className="text-3xl font-bold text-emerald-900 mt-1">{totalServices}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3 border-b-2 border-blue-100 pb-4">
            <Shield className="w-8 h-8 text-blue-700" />
            Quick Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/electricity/bill-payment" className="group">
              <div className="bg-white border border-blue-200 hover:border-blue-400 rounded-lg p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-50 border-2 border-blue-200 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                  <CreditCard className="w-10 h-10 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Pay Bill</h3>
                <p className="text-gray-600 mb-6 flex-1">Fast bill payments</p>
                <span className="text-blue-700 font-semibold border border-blue-200 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">Pay Now</span>
              </div>
            </Link>
            <Link to="/electricity/complaint" className="group">
              <div className="bg-white border border-red-200 hover:border-red-400 rounded-lg p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-red-50 border-2 border-red-200 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-100 transition-colors">
                  <FileText className="w-10 h-10 text-red-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Lodge Complaint</h3>
                <p className="text-gray-600 mb-6 flex-1">Report issues</p>
                <span className="text-red-700 font-semibold border border-red-200 px-6 py-2 rounded-lg hover:bg-red-50 transition-colors">Lodge Now</span>
              </div>
            </Link>
            <Link to="/electricity/tracking" className="group">
              <div className="bg-white border border-emerald-200 hover:border-emerald-400 rounded-lg p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-200 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors">
                  <Search className="w-10 h-10 text-emerald-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Track Request</h3>
                <p className="text-gray-600 mb-6 flex-1">Status updates</p>
                <span className="text-emerald-700 font-semibold border border-emerald-200 px-6 py-2 rounded-lg hover:bg-emerald-50 transition-colors">Track Now</span>
              </div>
            </Link>
            <Link to="/electricity/new-connection" className="group">
              <div className="bg-white border border-indigo-200 hover:border-indigo-400 rounded-lg p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-indigo-50 border-2 border-indigo-200 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-100 transition-colors">
                  <Plus className="w-10 h-10 text-indigo-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">New Connection</h3>
                <p className="text-gray-600 mb-6 flex-1">Apply services</p>
                <span className="text-indigo-700 font-semibold border border-indigo-200 px-6 py-2 rounded-lg hover:bg-indigo-50 transition-colors">Apply Now</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Departments */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3 border-b-2 border-blue-100 pb-4">
            <Building2 className="w-8 h-8 text-blue-700" />
            Service Departments
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Link to="/electricity" className="group">
              <div className="bg-white border-4 border-blue-200 hover:border-blue-500 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-blue-50 border-4 border-blue-200 rounded-lg flex items-center justify-center">
                    <Zap className="w-8 h-8 text-blue-700" />
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center opacity-90">
                    <Zap className="w-6 h-6 text-blue-700" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Electricity Board</h3>
                  <p className="text-xl font-semibold text-blue-900 bg-blue-50 px-4 py-2 rounded-lg inline-block mb-6">TANGEDCO</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm font-medium text-gray-600">Pending Bills</p>
                    <p className="text-xl font-bold text-orange-600">₹1,250</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm font-medium text-gray-600">Active Complaints</p>
                    <p className="text-xl font-bold text-emerald-600">1</p>
                  </div>
                </div>
                <span className="text-blue-800 font-bold text-lg bg-blue-100 border-2 border-blue-200 px-8 py-3 rounded-lg inline-flex items-center gap-2 hover:bg-blue-200 transition-all">
                  Service Portal →
                </span>
              </div>
            </Link>

            <Link to="/water" className="group">
              <div className="bg-white border-4 border-emerald-200 hover:border-emerald-500 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-emerald-50 border-4 border-emerald-200 rounded-lg flex items-center justify-center">
                    <Droplet className="w-8 h-8 text-emerald-700" />
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center opacity-90">
                    <Droplet className="w-6 h-6 text-emerald-700" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Water Board</h3>
                  <p className="text-xl font-semibold text-emerald-900 bg-emerald-50 px-4 py-2 rounded-lg inline-block mb-6">CMWSSB</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm font-medium text-gray-600">Pending Bills</p>
                    <p className="text-xl font-bold text-orange-600">₹850</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm font-medium text-gray-600">Active Complaints</p>
                    <p className="text-xl font-bold text-emerald-600">0</p>
                  </div>
                </div>
                <span className="text-emerald-800 font-bold text-lg bg-emerald-100 border-2 border-emerald-200 px-8 py-3 rounded-lg inline-flex items-center gap-2 hover:bg-emerald-200 transition-all">
                  Service Portal →
                </span>
              </div>
            </Link>

            <Link to="/municipal" className="group">
              <div className="bg-white border-4 border-slate-200 hover:border-slate-400 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-slate-50 border-4 border-slate-200 rounded-lg flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-slate-700" />
                  </div>
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center opacity-90">
                    <Building2 className="w-6 h-6 text-slate-700" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Municipal Corporation</h3>
                  <p className="text-xl font-semibold text-slate-900 bg-slate-50 px-4 py-2 rounded-lg inline-block mb-6">GCC</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm font-medium text-gray-600">Property Tax</p>
                    <p className="text-xl font-bold text-emerald-600">Paid</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm font-medium text-gray-600">Active Complaints</p>
                    <p className="text-xl font-bold text-orange-600">2</p>
                  </div>
                </div>
                <span className="text-slate-800 font-bold text-lg bg-slate-100 border-2 border-slate-200 px-8 py-3 rounded-lg inline-flex items-center gap-2 hover:bg-slate-200 transition-all">
                  Service Portal →
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 border-b-2 border-blue-100 pb-4">
              <TrendingUp className="w-8 h-8 text-blue-700" />
              Recent Activity
            </h2>
            <Link to="/notifications" className="text-blue-700 font-semibold text-lg hover:text-blue-900 flex items-center gap-2 border-b-2 border-blue-200 pb-1">
              View All <Bell className="w-5 h-5" />
            </Link>
          </div>
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 border-2 border-emerald-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-gray-900 flex-1">Electricity Bill Payment</h3>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">Success</span>
                  </div>
                  <p className="text-gray-700 mb-3">Amount: ₹1,250 | Receipt ID: EB-2024-00123</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 border-2 border-blue-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <TrendingUp className="w-6 h-6 text-blue-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-gray-900 flex-1">New Water Connection</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">In Progress</span>
                  </div>
                  <p className="text-gray-700 mb-3">Application ID: WB-2024-04567 | Under verification</p>
                  <p className="text-sm text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 border-2 border-orange-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock className="w-6 h-6 text-orange-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-gray-900 flex-1">Streetlight Complaint</h3>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">Pending</span>
                  </div>
                  <p className="text-gray-700 mb-3">Complaint ID: SL-2024-09876 | Assigned to team</p>
                  <p className="text-sm text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <AIChatbot />
    </div>
  );
}
