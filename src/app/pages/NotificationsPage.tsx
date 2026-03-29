import { AIChatbot } from "../components/AIChatbot";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock, AlertCircle, Bell } from "lucide-react";

export function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Payment Successful",
      message: "Electricity bill paid - ₹1,250",
      time: "2 hours ago",
      icon: CheckCircle2,
    },
    {
      id: 2,
      type: "info",
      title: "Application in Progress",
      message: "New water connection - Under verification",
      time: "1 day ago",
      icon: Clock,
    },
    {
      id: 3,
      type: "warning",
      title: "Complaint Registered",
      message: "Streetlight issue - Pending inspection",
      time: "3 days ago",
      icon: AlertCircle,
    },
    {
      id: 4,
      type: "success",
      title: "Complaint Resolved",
      message: "Water supply issue has been resolved",
      time: "5 days ago",
      icon: CheckCircle2,
    },
    {
      id: 5,
      type: "info",
      title: "Property Tax Due",
      message: "Your property tax is due on April 30, 2026",
      time: "1 week ago",
      icon: Bell,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Mark all as read
            </button>
          </div>

          <div className="space-y-4">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`p-6 rounded-xl border-2 transition-all hover:shadow-md ${
                    notification.type === "success"
                      ? "bg-green-50 border-green-200"
                      : notification.type === "warning"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notification.type === "success"
                          ? "bg-green-100"
                          : notification.type === "warning"
                          ? "bg-yellow-100"
                          : "bg-blue-100"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          notification.type === "success"
                            ? "text-green-600"
                            : notification.type === "warning"
                            ? "text-yellow-600"
                            : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 mb-2">{notification.message}</p>
                      <p className="text-sm text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {notifications.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notifications</h3>
              <p className="text-gray-600">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>

      <AIChatbot />
    </div>
  );
}
