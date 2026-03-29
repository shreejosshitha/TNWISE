// Header import fixed - use relative path or remove if not essential
import { AIChatbot } from "../../components/AIChatbot";


import { Link, useParams } from "react-router-dom"; // Fixed import

import { useState, useEffect } from "react";
import { waterApi } from "../../services/waterApi";

import { Loader2 } from "lucide-react";
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
  Droplet
} from "lucide-react";

export function WaterTransparencyTracker() {
  const { id } = useParams();
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("sessionToken") || "";

  useEffect(() => {
    const fetchApp = async () => {
      if (token && id) {
        const response = await waterApi.getApplicationById(id, token);
        if (response.success) {
          setAppData(response.data);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    fetchApp();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-600" />
          <p>Loading application timeline...</p>
        </div>
      </div>
    );
  }

  const timeline = appData?.timeline || [{
    id: 1, 
    status: "completed", 
    date: appData?.applicationDate || new Date().toLocaleDateString(), 
    title: "Submitted"
  }];
  const currentStepIndex = timeline.findIndex(step => step.status === "in-progress") || 0;
  const progressPercentage = Math.max(20, ((currentStepIndex + 1) / 5) * 100);

  const STEPS_CONFIG = [
    { id: 1, title: "Application Submitted", icon: FileCheck, description: "Your application has been received successfully" },
    { id: 2, title: "Document Verification", icon: Search, description: "Verifying submitted documents and details" },
    { id: 3, title: "Site Inspection", icon: Wrench, description: "Technical team will visit the premises" },
    { id: 4, title: "Approval", icon: ThumbsUp, description: "Final approval from department head" },
    { id: 5, title: "Connection", icon: CheckCircle2, description: "Pipeline connection and meter installation" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-blue-100">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> 
        <Link
          to="/water/tracking"
          className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Tracking
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Water Transparency Tracker - {id}
              </h2>
              <p className="text-gray-600">Real-time water connection application status</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-lg font-semibold text-cyan-600">{Math.round(progressPercentage)}%</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-semibold text-cyan-600">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-cyan-600 to-blue-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-6 mb-8">
            {STEPS_CONFIG.map((stepConfig, index) => {
              const stepData = timeline.find(s => s.id === stepConfig.id) || stepConfig;
              const Icon = stepConfig.icon;
              const isCompleted = stepData.status === "completed";
              const isInProgress = stepData.status === "in-progress";

              return (
                <div key={stepConfig.id} className="relative pb-8">
                  {index < STEPS_CONFIG.length - 1 && (
                    <div className={`absolute left-[22px] top-16 w-0.5 h-20 transform -translate-x-1/2 ${
                      isCompleted ? 'bg-green-500' : 
                      isInProgress ? 'bg-cyan-500' : 'bg-gray-300'
                    }`} />
                  )}
                  
                  <div className={`flex items-start gap-4 p-6 rounded-2xl transition-all ${
                    isCompleted ? 'bg-green-50 border-2 border-green-200 shadow-md' :
                    isInProgress ? 'bg-cyan-50 border-2 border-cyan-300 shadow-lg ring-2 ring-cyan-200/50' :
                    'bg-gray-50 border border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                      isCompleted ? 'bg-green-500' :
                      isInProgress ? 'bg-cyan-500 animate-pulse shadow-cyan-200' :
                      'bg-gray-300'
                    }`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className={`font-bold text-xl ${
                            isCompleted ? 'text-green-900' :
                            isInProgress ? 'text-cyan-900' :
                            'text-gray-700'
                          }`}>
                            {stepConfig.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">{stepConfig.description}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                          isCompleted ? 'bg-green-100 text-green-800' :
                          isInProgress ? 'bg-cyan-100 text-cyan-800 ring-1 ring-cyan-200' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {stepData.status === "completed" ? "✓ Completed" :
                           stepData.status === "in-progress" ? "🔄 In Progress" :
                           "⏳ Pending"}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{stepData.date || "Pending"}</span>
                      </div>

                      {isInProgress && (
                        <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-cyan-200 shadow-sm">
                          <p className="text-sm font-medium text-cyan-800">
                            <strong>Next Action:</strong> Site inspection scheduled within 2-3 days.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-2xl border border-cyan-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-green-600" />
                Fee Breakdown (₹{appData?.fee || 750})
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Registration Fee</span>
                  <span>₹500</span>
                </div>
                <div className="flex justify-between">
                  <span>Connection Charges</span>
                  <span>₹250</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                Estimated Timeline
              </h3>
              <p className="text-sm text-green-800">
                Connection complete in <strong>10-15 working days</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <AIChatbot />
    </div>
  );
}

