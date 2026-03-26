import { Header } from "../../components/Header";
import { AIChatbot } from "../../components/AIChatbot";
import { Link } from "react-router";
import { ArrowLeft, AlertCircle, Clock, CheckCircle2 } from "lucide-react";

export function MunicipalTracking() {
  const complaints = [
    {
      id: "MUN1710752400000",
      type: "Streetlight Not Working",
      location: "Anna Nagar Main Road",
      status: "In Progress",
      date: "2026-03-21",
      statusColor: "yellow",
    },
    {
      id: "MUN1710666000000",
      type: "Garbage Collection",
      location: "T. Nagar, 5th Street",
      status: "Resolved",
      date: "2026-03-15",
      statusColor: "green",
    },
    {
      id: "MUN1710580000000",
      type: "Road Damage",
      location: "Adyar Main Road",
      status: "Under Review",
      date: "2026-03-10",
      statusColor: "blue",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header showAuth={true} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/municipal" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Municipal Services
        </Link>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Track Your Complaints</h2>
          
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className={`p-6 bg-gradient-to-r rounded-xl border-2 ${
                  complaint.statusColor === "yellow"
                    ? "from-yellow-50 to-white border-yellow-100"
                    : complaint.statusColor === "green"
                    ? "from-green-50 to-white border-green-100"
                    : "from-blue-50 to-white border-blue-100"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <AlertCircle
                        className={`w-6 h-6 flex-shrink-0 mt-1 ${
                          complaint.statusColor === "yellow"
                            ? "text-yellow-600"
                            : complaint.statusColor === "green"
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{complaint.type}</h4>
                        <p className="text-sm text-gray-600 mt-1">📍 {complaint.location}</p>
                        <p className="text-sm text-gray-600">Complaint ID: {complaint.id}</p>
                        <p className="text-sm text-gray-600">Registered on {complaint.date}</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 ${
                      complaint.statusColor === "yellow"
                        ? "bg-yellow-100 text-yellow-700"
                        : complaint.statusColor === "green"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {complaint.statusColor === "yellow" && <Clock className="w-4 h-4" />}
                    {complaint.statusColor === "green" && <CheckCircle2 className="w-4 h-4" />}
                    {complaint.status}
                  </div>
                </div>

                {complaint.statusColor === "yellow" && (
                  <div className="mt-4 pt-4 border-t border-yellow-200">
                    <p className="text-sm text-gray-700">
                      <strong>Status Update:</strong> Our team has been assigned to your complaint. 
                      Work is scheduled to begin within 2-3 working days.
                    </p>
                  </div>
                )}

                {complaint.statusColor === "green" && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="text-sm text-green-800">
                      ✓ Complaint resolved successfully. Thank you for reporting!
                    </p>
                  </div>
                )}

                {complaint.statusColor === "blue" && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <p className="text-sm text-gray-700">
                      <strong>Status Update:</strong> Your complaint is being reviewed by our team.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <AIChatbot />
    </div>
  );
}
