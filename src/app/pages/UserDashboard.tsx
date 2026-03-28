import { Header } from "../components/Header";
import { AIChatbot } from "../components/AIChatbot";
import { Link } from "react-router";
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
} from "lucide-react";

export function UserDashboard() {
  const { user } = useAuth();

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header showAuth={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white mb-8">
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name ?? "Citizen"}! 👋
              </h1>
              <p className="text-blue-100">Manage all your public services from one place</p>
              <div className="mt-4 rounded-3xl bg-white/10 border border-white/20 p-4 max-w-xl">
                <p className="text-sm text-blue-100">Logged in as</p>
                <p className="text-lg font-semibold">{user?.role === "admin" ? `${user.name} (Admin)` : user?.name}</p>
                <p className="text-sm text-blue-100 mt-1">{user?.phone ? `+91 ${user.phone}` : "Phone not available"}</p>
                <p className="text-sm text-blue-100">{user?.email || profile?.email || "Email not available"}</p>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-3xl bg-white/20 border border-white/20 p-6">
                <p className="text-sm text-blue-100">Active Services</p>
                <p className="text-3xl font-bold">{activeServices}</p>
              </div>
              <div className="rounded-3xl bg-white/20 border border-white/20 p-6">
                <p className="text-sm text-blue-100">Total Services</p>
                <p className="text-3xl font-bold">{totalServices}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/electricity/bill-payment"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Pay Bill</h3>
              <p className="text-sm text-gray-600 mt-1">Quick payment</p>
            </Link>

            <Link
              to="/electricity/complaint"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Raise Complaint</h3>
              <p className="text-sm text-gray-600 mt-1">Report issues</p>
            </Link>

            <Link
              to="/electricity/tracking"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Track Status</h3>
              <p className="text-sm text-gray-600 mt-1">View progress</p>
            </Link>

            <Link
              to="/electricity/new-connection"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Apply Service</h3>
              <p className="text-sm text-gray-600 mt-1">New connection</p>
            </Link>
          </div>
        </div>

        {/* Department Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Departments</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/electricity"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-7 h-7 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Electricity</h3>
                  <p className="text-sm text-gray-600">TANGEDCO</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Pending Bills</span>
                  <span className="font-semibold text-red-600">₹1,250</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Active Complaints</span>
                  <span className="font-semibold text-gray-900">1</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <span className="text-blue-600 font-medium text-sm">View Details →</span>
              </div>
            </Link>

            <Link
              to="/water"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Droplet className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Water</h3>
                  <p className="text-sm text-gray-600">Chennai Metro Water</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Pending Bills</span>
                  <span className="font-semibold text-red-600">₹850</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Active Complaints</span>
                  <span className="font-semibold text-gray-900">0</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <span className="text-blue-600 font-medium text-sm">View Details →</span>
              </div>
            </Link>

            <Link
              to="/municipal"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Municipal</h3>
                  <p className="text-sm text-gray-600">Greater Chennai Corp</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Property Tax</span>
                  <span className="font-semibold text-green-600">Paid</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Active Complaints</span>
                  <span className="font-semibold text-gray-900">2</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <span className="text-blue-600 font-medium text-sm">View Details →</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <Link to="/notifications" className="text-blue-600 font-medium text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Payment Successful</h3>
                <p className="text-sm text-gray-600">Electricity bill paid - ₹1,250</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Application in Progress</h3>
                <p className="text-sm text-gray-600">New water connection - Under verification</p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Complaint Registered</h3>
                <p className="text-sm text-gray-600">Streetlight issue - Pending inspection</p>
                <p className="text-xs text-gray-500 mt-1">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIChatbot />
    </div>
  );
}
