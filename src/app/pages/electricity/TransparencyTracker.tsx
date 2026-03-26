import { Header } from "../../components/Header";
import { AIChatbot } from "../../components/AIChatbot";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileCheck,
  Search,
  Wrench,
  ThumbsUp,
  Calendar,
  IndianRupee,
} from "lucide-react";

const PROCESS_STEPS = [
  {
    id: 1,
    title: "Application Submitted",
    description: "Your application has been received successfully",
    status: "completed",
    date: "2026-03-20 10:30 AM",
    icon: FileCheck,
  },
  {
    id: 2,
    title: "Document Verification",
    description: "Verifying submitted documents and details",
    status: "completed",
    date: "2026-03-21 02:15 PM",
    icon: Search,
  },
  {
    id: 3,
    title: "Site Inspection",
    description: "Technical team will visit the premises",
    status: "in-progress",
    date: "Scheduled: 2026-03-25",
    icon: Wrench,
  },
  {
    id: 4,
    title: "Approval",
    description: "Final approval from department head",
    status: "pending",
    date: "Pending",
    icon: ThumbsUp,
  },
  {
    id: 5,
    title: "Installation",
    description: "Meter installation and connection",
    status: "pending",
    date: "Pending",
    icon: CheckCircle2,
  },
];

export function TransparencyTracker() {
  const { id } = useParams();

  const currentStepIndex = PROCESS_STEPS.findIndex((step) => step.status === "in-progress");
  const progressPercentage = ((currentStepIndex + 1) / PROCESS_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header showAuth={true} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/electricity/tracking"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Tracking
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Transparency Tracker
              </h2>
              <p className="text-gray-600">Application ID: {id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Current Status</p>
              <p className="text-lg font-semibold text-blue-600">Site Inspection</p>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Overall Progress</p>
              <p className="text-sm font-semibold text-blue-600">
                {Math.round(progressPercentage)}%
              </p>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-green-600 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-6 mb-8">
            {PROCESS_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="relative">
                  {index < PROCESS_STEPS.length - 1 && (
                    <div
                      className={`absolute left-6 top-14 w-0.5 h-16 ${
                        step.status === "completed"
                          ? "bg-green-500"
                          : step.status === "in-progress"
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    />
                  )}

                  <div
                    className={`flex gap-4 p-4 rounded-xl transition-all ${
                      step.status === "completed"
                        ? "bg-green-50 border-2 border-green-200"
                        : step.status === "in-progress"
                        ? "bg-blue-50 border-2 border-blue-400 shadow-lg"
                        : "bg-gray-50 border-2 border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.status === "completed"
                          ? "bg-green-500"
                          : step.status === "in-progress"
                          ? "bg-blue-500 animate-pulse"
                          : "bg-gray-300"
                      }`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3
                            className={`font-semibold text-lg ${
                              step.status === "completed"
                                ? "text-green-900"
                                : step.status === "in-progress"
                                ? "text-blue-900"
                                : "text-gray-600"
                            }`}
                          >
                            {step.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            step.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : step.status === "in-progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {step.status === "completed"
                            ? "Completed"
                            : step.status === "in-progress"
                            ? "In Progress"
                            : "Pending"}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {step.date}
                      </div>

                      {step.status === "in-progress" && (
                        <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-800">
                            <strong>Next Action:</strong> Our technical team will visit your
                            premises on March 25, 2026 between 10 AM - 2 PM
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fee Breakdown */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              Fee Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-gray-700">Registration Fee</p>
                <p className="font-semibold text-gray-900">₹500</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-700">Load Charges (5 kW)</p>
                <p className="font-semibold text-gray-900">₹50</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-700">Processing Fee</p>
                <p className="font-semibold text-gray-900">₹200</p>
              </div>
              <div className="border-t-2 border-gray-300 pt-3 flex items-center justify-between">
                <p className="text-lg font-semibold text-gray-900">Total Amount</p>
                <p className="text-2xl font-bold text-blue-600">₹750</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                Payment will be collected after final approval
              </p>
            </div>
          </div>

          {/* Estimated Timeline */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Estimated Timeline
            </h3>
            <p className="text-sm text-yellow-800">
              Your connection will be completed within <strong>7-10 working days</strong> from
              the date of final approval.
            </p>
          </div>

          {/* Help Section */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Need Help?</strong> Contact our helpline at{" "}
              <a href="tel:1912" className="font-semibold underline">
                1912
              </a>{" "}
              or use the AI chatbot for instant assistance.
            </p>
          </div>
        </div>
      </div>

      <AIChatbot />
    </div>
  );
}
