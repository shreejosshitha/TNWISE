import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

import { AIChatbot } from "../../components/AIChatbot";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  LogOut, 
  Edit2,
  Shield,
  Building2,
  Award,
  Clock
} from "lucide-react";
import { toast } from "sonner";

export function AdminProfilePage() {
  const [editing, setEditing] = useState(false);
  const [language, setLanguage] = useState<"en" | "ta">("en");
  const [department, setDepartment] = useState("Municipal Department");
  const [designation, setDesignation] = useState("Senior Officer");
  const [rewardPoints, setRewardPoints] = useState(0);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("adminProfile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.department) setDepartment(parsed.department);
        if (parsed.designation) setDesignation(parsed.designation);
      } catch {
        // ignore invalid stored profile
      }
    }

    const rewardRaw = window.localStorage.getItem("municipalAdminRewards");
    setRewardPoints(rewardRaw ? Number(rewardRaw) || 0 : 0);
  }, []);

  const adminProfile = {
    name: user?.name || "Municipal Admin",
    email: user?.email || "admin@municipal.gov.in",
    phone: user?.phone || "+91 98400 12345",
    department: department,
    designation: designation,
    ward: "Chennai Central",
    employeeId: "EMP-MUN-001234",
    joinedDate: "15 March 2023",
    totalComplaintsHandled: "1,247",
    resolutionRate: "94.2%",
    avgResolutionTime: "3.2 days"
  };

  const handleSave = async () => {
    // Simulate profile update
    localStorage.setItem('adminProfile', JSON.stringify({ language, department, designation }));
    const rewardRaw = window.localStorage.getItem("municipalAdminRewards");
    setRewardPoints(rewardRaw ? Number(rewardRaw) || 0 : 0);
    setEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">

      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link to="/admin/MunicipalAdminDashboard" className="inline-flex items-center gap-3 mb-8 text-indigo-600 hover:text-indigo-700 font-medium">
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Header */}
          <div className="lg:col-span-1 lg:row-span-2 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent -skew-x-12 transform -translate-x-1/4"></div>
              <div className="relative z-10">
                <div className="w-28 h-28 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-6 border-4 border-white/30 shadow-2xl">
                  <Shield className="w-14 h-14 text-white opacity-90" />
                </div>
                <h2 className="text-3xl font-black mb-2 leading-tight drop-shadow-lg">{adminProfile.name}</h2>
                <p className="text-lg font-semibold opacity-90 mb-1">{adminProfile.designation}</p>
                <p className="text-blue-100">{adminProfile.department}</p>
              </div>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    Employee Details
                  </h4>
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                      <User className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Employee ID</p>
                        <p className="font-mono font-semibold text-slate-900">{adminProfile.employeeId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                      <Phone className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Phone</p>
                        <p className="font-semibold text-slate-900">{adminProfile.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                      <Mail className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Email</p>
                        <p className="font-mono text-slate-900">{adminProfile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                      <MapPin className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Ward</p>
                        <p className="font-semibold text-slate-900">{adminProfile.ward}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    Performance Metrics
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
                      <p className="text-sm text-emerald-700 font-medium mb-1">Total Handled</p>
                      <p className="text-2xl font-black text-emerald-900">{adminProfile.totalComplaintsHandled}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-200">
                      <p className="text-sm text-indigo-700 font-medium mb-1">Resolution Rate</p>
                      <p className="text-2xl font-black text-indigo-900">{adminProfile.resolutionRate}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-200">
                      <p className="text-sm text-orange-700 font-medium mb-1">Avg Resolution</p>
                      <p className="text-2xl font-black text-orange-900">{adminProfile.avgResolutionTime}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                      <p className="text-sm text-amber-700 font-medium mb-1">Reward Balance</p>
                      <p className="text-2xl font-black text-amber-900">{rewardPoints}</p>
                      <p className="text-xs text-slate-500">Earned for resolved complaints</p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl border border-slate-200">
                      <p className="text-sm text-slate-700 font-medium mb-1">Joined</p>
                      <p className="text-2xl font-black text-slate-900">{adminProfile.joinedDate}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 text-lg"
                  >
                    <Edit2 className="w-6 h-6" />
                    Edit Profile Details
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-8 py-4 px-6 bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white rounded-3xl font-bold shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-3 text-lg"
            >
              <LogOut className="w-6 h-6" />
              Sign Out Securely
            </button>
          </div>
        </div>

        {/* Edit Modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Edit Admin Profile</h3>
                <button onClick={() => setEditing(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option>Municipal Department</option>
                    <option>Roads & Infrastructure</option>
                    <option>Waste Management</option>
                    <option>Urban Planning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Language Preference</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as "en" | "ta")}
                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="ta">தமிழ்</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-6 rounded-2xl font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <AIChatbot />
      </div>
    </div>
  );
}

