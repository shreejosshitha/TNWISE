import { useState, useEffect } from "react";
import { AIChatbot } from "../../components/AIChatbot";

import { Link } from "react-router-dom";
import { ArrowLeft, AlertCircle, Clock, CheckCircle2, Copy } from "lucide-react";
import { toast } from "sonner";
import { getMunicipalComplaints, MunicipalComplaint, getComplaintStatus } from "../../../backend/municipalComplaintService";

interface StatusConfig {
  label: string;
  color: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const getStatusConfig = (status: MunicipalComplaint['status']): StatusConfig => {
  switch (status) {
    case 'submitted':
      return { label: "Submitted", color: "blue", Icon: AlertCircle };
    case 'assigned':
      return { label: "Assigned", color: "yellow", Icon: Clock };
    case 'in_progress':
      return { label: "In Progress", color: "yellow", Icon: Clock };
    case 'resolved':
    case 'closed':
      return { label: "Resolved", color: "green", Icon: CheckCircle2 };
    default:
      return { label: status, color: "gray", Icon: AlertCircle };
  }
};

const getStatusColorClass = (status: MunicipalComplaint['status']): string => {
  switch (status) {
    case 'submitted': return "blue";
    case 'assigned':
    case 'in_progress': return "yellow";
    case 'resolved':
    case 'closed': return "green";
    default: return "gray";
  }
};

export function MunicipalTracking() {
  const [complaints, setComplaints] = useState<MunicipalComplaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComplaints = () => {
      try {
        const data = getMunicipalComplaints();
        const recent = data.map(c => ({
          ...c,
          status: getComplaintStatus(c.id)
        })).filter(c => {
          const date = new Date(c.date);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return date > thirtyDaysAgo;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setComplaints(recent);
      } catch {
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
    const handleUpdate = () => loadComplaints();
    window.addEventListener("municipalComplaintUpdated", handleUpdate);
    return () => window.removeEventListener("municipalComplaintUpdated", handleUpdate);
  }, []);

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      toast.success("Complaint ID copied!");
    }).catch(() => {
      toast.error("Failed to copy ID");
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your complaints...</p>
          </div>
        </div>
        <AIChatbot />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/municipal" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Municipal Services
        </Link>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            Track Your Complaints ({complaints.length})
          </h2>
          
          {complaints.length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No complaints found</h3>
              <p className="text-gray-600 mb-6">All your recent complaints will appear here</p>
              <Link
                to="/municipal"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Submit New Complaint
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => {
                const statusConfig = getStatusConfig(complaint.status);
                const statusColor = getStatusColorClass(complaint.status);
                const fullType = complaint.subcategory 
                  ? `${complaint.category} - ${complaint.subcategory}` 
                  : complaint.category;
                const displayTitle = complaint.title || fullType;

                return (
                  <div
                    key={complaint.id}
                    className={`p-6 rounded-xl border-2 hover:shadow-lg transition-all ${
                      statusColor === "yellow"
                        ? "bg-gradient-to-r from-yellow-50 to-yellow-25 border-yellow-200"
                        : statusColor === "green"
                        ? "bg-gradient-to-r from-green-50 to-green-25 border-green-200"
                        : "bg-gradient-to-r from-blue-50 to-blue-25 border-blue-200"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1 lg:flex lg:items-start gap-3">
                        <statusConfig.Icon
                          className={`w-8 h-8 flex-shrink-0 mt-1 text-${statusConfig.color}-600`}
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">{displayTitle}</h4>
                          <p className="text-sm text-gray-600 mb-2">📍 {complaint.location}</p>
                          
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs font-mono bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                              {complaint.id}
                            </span>
                            <button
                              onClick={() => copyId(complaint.id)}
                              className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
                              title="Copy ID"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            {complaint.image && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">
                                📷 Photo
                              </span>
                            )}
                            <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                              {complaint.mode}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-500 mb-1">
                            Submitted: {new Date(complaint.date).toLocaleDateString()}
                          </p>
                          {complaint.subcategory && (
                            <p className="text-xs text-gray-500">Subcategory: {complaint.subcategory}</p>
                          )}
                          
                          <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                            {complaint.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 ml-auto">
                        <div
                          className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 ${
                            statusColor === "yellow"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                              : statusColor === "green"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-blue-100 text-blue-800 border-blue-200"
                          } border`}
                        >
                          <statusConfig.Icon className={`w-4 h-4 flex-shrink-0`} />
                          {statusConfig.label}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <AIChatbot />
    </div>
  );
}

