import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { Header } from "../../components/Header";
import { LogOut, BarChart3, AlertCircle, FileText, Settings } from "lucide-react";
import { toast } from "sonner";

export function MunicipalAdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const stats = [
    { label: "Total Applications", value: "756", color: "bg-purple-50", textColor: "text-purple-600" },
    { label: "Pending Complaints", value: "34", color: "bg-red-50", textColor: "text-red-600" },
    { label: "Property Tax Cases", value: "92", color: "bg-green-50", textColor: "text-green-600" },
    { label: "Resolved Cases", value: "1,445", color: "bg-indigo-50", textColor: "text-indigo-600" },
  ];

  const menuItems = [
    { icon: FileText, label: "Applications", count: "19" },
    { icon: AlertCircle, label: "Complaints", count: "5" },
    { icon: BarChart3, label: "Analytics", count: "" },
    { icon: Settings, label: "Settings", count: "" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg p-6 text-white mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Municipal Department Admin</h1>
              <p className="text-purple-50">Welcome, {user?.name || "Admin"}</p>
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
                      <item.icon className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                      <span className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                        {item.label}
                      </span>
                    </div>
                    {item.count && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-semibold">{item.count}</span>}
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
                  { id: "M001", name: "Property Tax - Ref#PT123", status: "Completed", time: "30 minutes ago" },
                  { id: "M002", name: "Complaint - Ref#MC456", status: "Pending", time: "2 hours ago" },
                  { id: "M003", name: "Municipal Service - Ref#MS789", status: "In Progress", time: "6 hours ago" },
                  { id: "M004", name: "Tax Assessment", status: "Completed", time: "3 days ago" },
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
