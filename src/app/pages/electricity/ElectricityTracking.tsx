import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { AIChatbot } from "../../components/AIChatbot";
import { Link } from "react-router";
import { ArrowLeft, FileText, AlertCircle, Clock, CheckCircle2, Loader, Activity } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { electricityApi } from "../../services/electricityApi";
import { wsService } from "../../services/websocket";
import { toast } from "sonner";

export function ElectricityTracking() {
  const [applications, setApplications] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  const { user } = useAuth();
  const token = localStorage.getItem('sessionToken');

  useEffect(() => {
    const fetchTrackings = async () => {
      const token = localStorage.getItem('sessionToken');
      if (!token) return;
      
      setLoading(true);
      try {
        const response = await electricityApi.getTrackings(token);
        if (response.success && response.data) {
          const appList = response.data.applications || [];
          const complaintList = response.data.complaints || [];
          
          setApplications(appList.map((app: any) => ({
            id: app.id,
            type: app.loadType === "domestic" ? "New Connection" : `${app.loadType} Connection`,
            status: app.status === "pending" ? "In Progress" : app.status === "approved" ? "Completed" : "Rejected",
            date: app.applicationDate,
            statusColor: app.status === "pending" ? "blue" : app.status === "approved" ? "green" : "red",
          })));
          
          setComplaints(complaintList.map((complaint: any) => ({
            id: complaint.id,
            type: complaint.type,
            status: complaint.status === "pending" ? "In Progress" : complaint.status === "in-progress" ? "In Progress" : "Resolved",
            date: complaint.createdAt,
            statusColor: complaint.status === "resolved" ? "green" : complaint.status === "in-progress" ? "blue" : "yellow",
          })));
        }
      } catch (error) {
        console.error("Error fetching trackings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackings();
  }, [token]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!user?.phone) return;

    // Connect to WebSocket
    const socket = wsService.connect();
    wsService.joinCitizenRoom(user.phone);

    // Track connection status
    const checkConnection = () => {
      setWsConnected(wsService.isConnected());
    };

    checkConnection();
    const connectionInterval = setInterval(checkConnection, 5000);

    // Handle real-time tracking updates
    const handleTrackingUpdate = (data: any) => {
      console.log('🔄 Real-time tracking update:', data);
      
      if (data.type === 'complaint') {
        toast.success(`Complaint Update: ${data.message}`, {
          description: 'Status updated in real-time'
        });
        
        // Update complaints list
        setComplaints(prev => prev.map(c => 
          c.id === data.id 
            ? { 
                ...c, 
                status: data.status === 'resolved' ? 'Resolved' : 'In Progress',
                statusColor: data.status === 'resolved' ? 'green' : 'blue'
              }
            : c
        ));
      } else if (data.type === 'application') {
        toast.success(`Application Update: ${data.message}`, {
          description: 'Status updated in real-time'
        });
        
        // Update applications list
        setApplications(prev => prev.map(a => 
          a.id === data.id 
            ? { 
                ...a, 
                status: data.status === 'approved' ? 'Completed' : data.status === 'rejected' ? 'Rejected' : 'In Progress',
                statusColor: data.status === 'approved' ? 'green' : data.status === 'rejected' ? 'red' : 'blue'
              }
            : a
        ));
      }
    };

    // Register event listener
    wsService.onTrackingUpdated(handleTrackingUpdate);

    // Cleanup
    return () => {
      clearInterval(connectionInterval);
      wsService.disconnect();
    };
  }, [user?.phone]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header showAuth={true} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/electricity"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Electricity Services
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Track Your Requests</h2>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              wsConnected 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              <Activity className={`w-3 h-3 ${wsConnected ? 'animate-pulse' : ''}`} />
              {wsConnected ? 'Live Updates' : 'Connecting...'}
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading your requests...</span>
            </div>
          )}

          {!loading && (
            <>
              {/* Applications Section */}
              <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Applications</h3>
            </div>

            <div className="space-y-4">
              {applications.map((app) => (
                <Link
                  key={app.id}
                  to={`/electricity/tracker/${app.id}`}
                  className="block p-6 bg-gradient-to-r from-blue-50 to-white border-2 border-blue-100 hover:border-blue-300 rounded-xl transition-all hover:shadow-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{app.type}</h4>
                      <p className="text-sm text-gray-600">Application ID: {app.id}</p>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-full font-semibold text-sm ${
                        app.statusColor === "blue"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {app.status}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Submitted on {app.date}</p>
                    {app.statusColor === "blue" ? (
                      <div className="flex items-center gap-2 text-blue-600">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">View Progress →</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-medium">View Details →</span>
                      </div>
                    )}
                  </div>

                  {app.statusColor === "blue" && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full w-3/5"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">60%</span>
                      </div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Complaints Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-semibold text-gray-900">Complaints</h3>
            </div>

            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="p-6 bg-gradient-to-r from-red-50 to-white border-2 border-red-100 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{complaint.type}</h4>
                      <p className="text-sm text-gray-600">Complaint ID: {complaint.id}</p>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-full font-semibold text-sm ${
                        complaint.statusColor === "yellow"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {complaint.status}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Registered on {complaint.date}</p>
                    {complaint.statusColor === "yellow" ? (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">Under Review</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    )}
                  </div>

                  {complaint.statusColor === "yellow" && (
                    <div className="mt-4 pt-4 border-t border-red-200">
                      <p className="text-sm text-gray-700">
                        <strong>Status:</strong> Our team is currently investigating your
                        complaint. Expected resolution within 24-48 hours.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {applications.length === 0 && complaints.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Requests Found</h3>
              <p className="text-gray-600 mb-6">
                You haven't submitted any applications or complaints yet
              </p>
              <Link
                to="/electricity"
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Explore Services
              </Link>
            </div>
          )}
            </>
          )}
        </div>
      </div>

      <AIChatbot />
    </div>
  );
}
