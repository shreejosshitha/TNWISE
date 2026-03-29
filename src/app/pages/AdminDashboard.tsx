import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, AlertCircle, Users, CheckCircle2, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"applications" | "complaints" | "users">("applications");

  const applications = [
    {
      id: "EB1710752400000",
      type: "Electricity - New Connection",
      applicant: "Rajesh Kumar",
      date: "2026-03-20",
      status: "Pending",
    },
    {
      id: "WTR1710752400000",
      type: "Water - New Connection",
      applicant: "Priya Sharma",
      date: "2026-03-15",
      status: "Pending",
    },
  ];

  const complaints = [
    {
      id: "COMP1710838800000",
      type: "Power Outage",
      reporter: "Rajesh Kumar",
      date: "2026-03-22",
      status: "In Progress",
    },
    {
      id: "MUN1710752400000",
      type: "Streetlight Issue",
      reporter: "Anita Desai",
      date: "2026-03-21",
      status: "Pending",
    },
  ];

  const handleApprove = (id: string) => {
    toast.success(`Application ${id} approved successfully!`);
  };

  const handleReject = (id: string) => {
    toast.error(`Application ${id} rejected`);
  };

  const handleUpdateStatus = (id: string) => {
    toast.success(`Complaint ${id} status updated!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl">
              🏢
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-green-100">Department Administrator Panel</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
            <p className="text-sm text-blue-600">↑ 12% from last month</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Complaints</p>
                <p className="text-2xl font-bold text-gray-900">18</p>
              </div>
            </div>
            <p className="text-sm text-red-600">↓ 5% from last month</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
            <p className="text-sm text-green-600">This month</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Users</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
            </div>
            <p className="text-sm text-purple-600">Active users</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("applications")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "applications"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setActiveTab("complaints")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "complaints"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Complaints
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "users"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Users
            </button>
          </div>

          <div className="p-6">
            {activeTab === "applications" && (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-6 bg-gradient-to-r from-blue-50 to-white border-2 border-blue-100 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{app.type}</h3>
                        <p className="text-sm text-gray-600">Applicant: {app.applicant}</p>
                        <p className="text-sm text-gray-600">ID: {app.id}</p>
                        <p className="text-sm text-gray-600">Date: {app.date}</p>
                      </div>
                      <div className="px-4 py-2 rounded-full font-semibold text-sm bg-yellow-100 text-yellow-700 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {app.status}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(app.id)}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(app.id)}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                      <Link
                        to={`/electricity/tracker/${app.id}`}
                        className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "complaints" && (
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="p-6 bg-gradient-to-r from-red-50 to-white border-2 border-red-100 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{complaint.type}</h3>
                        <p className="text-sm text-gray-600">Reporter: {complaint.reporter}</p>
                        <p className="text-sm text-gray-600">ID: {complaint.id}</p>
                        <p className="text-sm text-gray-600">Date: {complaint.date}</p>
                      </div>
                      <div className="px-4 py-2 rounded-full font-semibold text-sm bg-blue-100 text-blue-700">
                        {complaint.status}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleUpdateStatus(complaint.id)}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Update Status
                      </button>
                      <button
                        onClick={() => handleApprove(complaint.id)}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "users" && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
                <p className="text-gray-600">Total registered users: 1,234</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
