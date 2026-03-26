import { Header } from "../../components/Header";
import { AIChatbot } from "../../components/AIChatbot";
import { Link } from "react-router";
import { ArrowLeft, FileText, AlertCircle } from "lucide-react";

export function WaterTracking() {
  const applications = [
    {
      id: "WTR1710752400000",
      type: "New Connection",
      status: "In Progress",
      date: "2026-03-15",
    },
  ];

  const complaints = [
    {
      id: "WCOMP1710838800000",
      type: "Low Water Pressure",
      status: "Resolved",
      date: "2026-03-18",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header showAuth={true} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/water" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Water Services
        </Link>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Track Your Requests</h2>
          
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Applications</h3>
            </div>
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="p-6 bg-gradient-to-r from-blue-50 to-white border-2 border-blue-100 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{app.type}</h4>
                      <p className="text-sm text-gray-600">Application ID: {app.id}</p>
                      <p className="text-sm text-gray-600 mt-1">Submitted on {app.date}</p>
                    </div>
                    <div className="px-4 py-2 rounded-full font-semibold text-sm bg-blue-100 text-blue-700">
                      {app.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-semibold text-gray-900">Complaints</h3>
            </div>
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div key={complaint.id} className="p-6 bg-gradient-to-r from-green-50 to-white border-2 border-green-100 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{complaint.type}</h4>
                      <p className="text-sm text-gray-600">Complaint ID: {complaint.id}</p>
                      <p className="text-sm text-gray-600 mt-1">Registered on {complaint.date}</p>
                    </div>
                    <div className="px-4 py-2 rounded-full font-semibold text-sm bg-green-100 text-green-700">
                      {complaint.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <AIChatbot />
    </div>
  );
}
