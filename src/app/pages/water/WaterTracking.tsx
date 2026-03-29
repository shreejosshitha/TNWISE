import { AIChatbot } from "../../components/AIChatbot";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, AlertCircle, Clock, CheckCircle, XCircle, Wrench } from "lucide-react";
import { useState, useEffect } from "react";

interface WaterApplication {
  id: string;
  type: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'connection_installed';
  date: string;
  formData: {
    name: string;
    phone: string;
    email: string;
    address: string;
    connectionType: string;
    dateOfBirth: string;
    gender: string;
    aadhar: string;
  };
  documents: {
    addressProof?: any;
    propertyDocument?: any;
  };
}

interface WaterComplaint {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  location: string;
  status: 'submitted' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  date: string;
  proof?: any[];
}

export function WaterTracking() {
  const [applications, setApplications] = useState<WaterApplication[]>([]);
  const [complaints, setComplaints] = useState<WaterComplaint[]>([]);

  useEffect(() => {
    try {
      // Load applications
      const appStorageKey = "waterApplications";
      const appRaw = localStorage.getItem(appStorageKey);
      if (appRaw) {
        const storedApplications = JSON.parse(appRaw);
        setApplications(storedApplications);
      }

      // Load complaints
      const compStorageKey = "waterComplaints";
      const compRaw = localStorage.getItem(compStorageKey);
      if (compRaw) {
        const storedComplaints = JSON.parse(compRaw);
        setComplaints(storedComplaints);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const getStatusConfig = (status: string, type: 'application' | 'complaint' = 'application') => {
    if (type === 'complaint') {
      switch (status) {
        case 'submitted':
          return {
            color: 'bg-blue-100 text-blue-700 border-blue-200',
            icon: Clock,
            label: 'Submitted'
          };
        case 'assigned':
          return {
            color: 'bg-orange-100 text-orange-700 border-orange-200',
            icon: Clock,
            label: 'Assigned'
          };
        case 'in_progress':
          return {
            color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            icon: Clock,
            label: 'In Progress'
          };
        case 'resolved':
          return {
            color: 'bg-green-100 text-green-700 border-green-200',
            icon: CheckCircle,
            label: 'Resolved'
          };
        case 'closed':
          return {
            color: 'bg-gray-100 text-gray-700 border-gray-200',
            icon: XCircle,
            label: 'Closed'
          };
        default:
          return {
            color: 'bg-gray-100 text-gray-700 border-gray-200',
            icon: Clock,
            label: status
          };
      }
    } else {
      // Application statuses
      switch (status) {
        case 'submitted':
          return {
            color: 'bg-blue-100 text-blue-700 border-blue-200',
            icon: Clock,
            label: 'Submitted'
          };
        case 'under_review':
          return {
            color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            icon: Clock,
            label: 'Under Review'
          };
        case 'approved':
          return {
            color: 'bg-green-100 text-green-700 border-green-200',
            icon: CheckCircle,
            label: 'Approved'
          };
        case 'rejected':
          return {
            color: 'bg-red-100 text-red-700 border-red-200',
            icon: XCircle,
            label: 'Rejected'
          };
        case 'connection_installed':
          return {
            color: 'bg-purple-100 text-purple-700 border-purple-200',
            icon: Wrench,
            label: 'Connection Installed'
          };
        default:
          return {
            color: 'bg-gray-100 text-gray-700 border-gray-200',
            icon: Clock,
            label: status
          };
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> 
        <Link to="/water" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Water Services
        </Link>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Track Your Requests</h2>
          
          <div>
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">New Connection Applications</h3>
            </div>
            
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h4>
                <p className="text-gray-600">You haven't submitted any water connection applications yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => {
                  const statusConfig = getStatusConfig(app.status, 'application');
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <div key={app.id} className="p-6 bg-gradient-to-r from-blue-50 to-white border-2 border-blue-100 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg mb-2">{app.type}</h4>
                          <p className="text-sm text-gray-600">Application ID: <span className="font-mono font-semibold">{app.id}</span></p>
                          <p className="text-sm text-gray-600 mt-1">Submitted on {new Date(app.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">Connection Type: <span className="capitalize font-medium">{app.formData.connectionType}</span></p>
                        </div>
                        <div className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-semibold border ml-4 ${statusConfig.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusConfig.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Complaints Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-semibold text-gray-900">Complaints</h3>
            </div>
            
            {complaints.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-sm font-medium text-gray-900 mb-1">No Complaints Found</h4>
                <p className="text-xs text-gray-600">You haven't submitted any complaints yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {complaints.map((complaint) => {
                  const statusConfig = getStatusConfig(complaint.status, 'complaint');
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <div key={complaint.id} className="p-6 bg-gradient-to-r from-red-50 to-white border-2 border-red-100 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg mb-2">{complaint.title}</h4>
                          <p className="text-sm text-gray-600">Complaint ID: <span className="font-mono font-semibold">{complaint.id}</span></p>
                          <p className="text-sm text-gray-600 mt-1">Category: <span className="font-medium">{complaint.category} - {complaint.subcategory}</span></p>
                          <p className="text-sm text-gray-600">Submitted on {new Date(complaint.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">Location: <span className="font-medium">{complaint.location}</span></p>
                        </div>
                        <div className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-semibold border ml-4 ${statusConfig.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusConfig.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <AIChatbot />
    </div>
  );
}
