import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";

import { LogOut, BarChart3, AlertCircle, FileText, Settings } from "lucide-react";
import { toast } from "sonner";

export function TransportAdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const stats = [
    { label: "Total Applications", value: "543", color: "bg-orange-50", textColor: "text-orange-600" },
    { label: "Pending Requests", value: "28", color: "bg-red-50", textColor: "text-red-600" },
    { label: "Vehicle Registrations", value: "67", color: "bg-green-50", textColor: "text-green-600" },
    { label: "Resolved Cases", value: "1,123", color: "bg-amber-50", textColor: "text-amber-600" },
  ];

  const menuItems = [
    { icon: FileText, label: "Applications", count: "15" },
    { icon: AlertCircle, label: "Complaints", count: "3" },
    { icon: BarChart3, label: "Analytics", count: "" },
    { icon: Settings, label: "Settings", count: "" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Transport Department Admin</h1>
              <p className="text-orange-50">Welcome, {user?.name || "Admin"}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className={`${stat.color} rounded-lg p-6 border border-gray-200`}>
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Items */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform" />
                      <span className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                        {item.label}
                      </span>
                    </div>
                    {item.count && <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-semibold">{item.count}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {[
                  { id: "T001", name: "License Renewal - Ref#LR789", status: "Completed", time: "45 minutes ago" },
                  { id: "T002", name: "Vehicle Registration - Ref#VR012", status: "Pending", time: "1 hour ago" },
                  { id: "T003", name: "Complaint - Ref#TC345", status: "In Progress", time: "4 hours ago" },
                  { id: "T004", name: "Permit Application", status: "Completed", time: "2 days ago" },
                ].map((item) => (
                  <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{item.time}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        item.status === "Completed" ? "bg-green-100 text-green-800" :
                        item.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
