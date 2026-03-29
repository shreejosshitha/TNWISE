import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Header } from "../../components/Header";
import { ArrowLeft, AlertCircle, Clock, CheckCircle2, MapPin, User, FileText } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNowStrict } from "date-fns";
import { getMunicipalAdminComplaints } from "../../../backend/municipalAdminService";
import type { AdminComplaint } from "../../../backend/adminApi";
import { getMunicipalComplaintById } from "../../../backend/municipalComplaintService";
import type { MunicipalComplaint } from "../../../backend/municipalComplaintService";

export function MunicipalComplaintDetails() {
  const { id } = useParams<"id">();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<AdminComplaint | null>(null);
  const [userComplaint, setUserComplaint] = useState<MunicipalComplaint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    try {
      const adminComplaints = getMunicipalAdminComplaints();
      const adminComplaint = adminComplaints.find(c => c._id === id);
      const uc = getMunicipalComplaintById(id);
      
      setComplaint(adminComplaint || null);
      setUserComplaint(uc || null);
    } catch (error) {
      toast.error("Failed to load complaint details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      NEW: "bg-slate-100 text-slate-700",
      ASSIGNED: "bg-blue-100 text-blue-700",
      'IN_PROGRESS': "bg-sky-100 text-sky-700",
      RESOLVED: "bg-emerald-100 text-emerald-700",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-center text-slate-600">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-12 text-center shadow-xl">
            <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Complaint not found</h2>
            <p className="text-slate-600 mb-8">The requested complaint could not be found.</p>
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12">
        {/* Back button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-1">Complaint #{complaint.complaintId}</h1>
                <span className={`inline-flex rounded-full px-4 py-1 text-sm font-semibold ${getStatusStyle(complaint.status)}`}>
                  {complaint.status.replace("_", " ")}
                </span>
              </div>
              <div className="text-right">
                <p className="text-slate-300 text-sm">Submitted {formatDistanceToNowStrict(new Date(complaint.createdAt), { addSuffix: true })}</p>
                {complaint.updatedAt !== complaint.createdAt && (
                  <p className="text-slate-400 text-xs">Updated {formatDistanceToNowStrict(new Date(complaint.updatedAt), { addSuffix: true })}</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            {/* Main info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column - Details */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-slate-600" />
                  Complaint Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                    <p className="text-lg font-semibold">{complaint.category || complaint.type}</p>
                    {complaint.subcategory && (
                      <p className="text-sm text-slate-500 ml-2">→ {complaint.subcategory}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Location</label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-slate-500" />
                      <span className="text-lg">{complaint.location}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Priority</label>
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold border bg-white ${(complaint.priority === 'HIGH' ? 'bg-rose-100 text-rose-700 border-rose-200' : complaint.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200')}`}>
                      {complaint.priority}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Ward/Area</label>
                    <p className="text-lg">{complaint.ward} - {complaint.area}</p>
                  </div>
                </div>
              </div>

              {/* Right column - Status & Assignment */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-slate-600" />
                  Assignment & Timeline
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Assigned To</label>
                    <p className="text-lg">{complaint.assignedTo || "Not assigned"}</p>
                  </div>
                  {complaint.assignedAt && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Assigned</label>
                      <p className="text-sm text-slate-600">{new Date(complaint.assignedAt).toLocaleString()}</p>
                    </div>
                  )}
                  {complaint.resolvedAt && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Resolved</label>
                      <p className="text-sm text-slate-600">{new Date(complaint.resolvedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Description
              </h3>
              <div className="bg-slate-50 rounded-2xl p-6">
                <p className="text-lg leading-relaxed text-slate-800 whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </div>
            </div>

            {userComplaint?.image && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Photo Evidence
                </h3>
                <div className="bg-slate-50 rounded-2xl p-6 text-center">
                <img className="w-full max-w-sm sm:max-w-md h-48 sm:h-64 object-cover rounded-xl mx-auto shadow-lg" src="/api/placeholder/384/256" alt="Complaint photo" />
 
                </div>
              </div>
            )}

            {complaint.resolutionNotes && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  Resolution Notes
                </h3>
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                  <p className="text-slate-800 whitespace-pre-wrap">{complaint.resolutionNotes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const priorityStyles = {
  HIGH: "bg-rose-100 text-rose-700 border-rose-200",
  MEDIUM: "bg-amber-100 text-amber-700 border-amber-200", 
  LOW: "bg-emerald-100 text-emerald-700 border-emerald-200"
};

