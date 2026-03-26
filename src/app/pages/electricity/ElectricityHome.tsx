import { Header } from "../../components/Header";
import { AIChatbot } from "../../components/AIChatbot";
import { Link } from "react-router";
import { CreditCard, Plus, FileText, Search, Zap, ArrowLeft } from "lucide-react";

export function ElectricityHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header showAuth={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Electricity Services</h1>
              <p className="text-yellow-100">TANGEDCO - Tamil Nadu Electricity Board</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/electricity/bill-payment"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CreditCard className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pay Bill</h3>
            <p className="text-gray-600 mb-4">
              Pay your electricity bill quickly and securely
            </p>
            <div className="pt-4 border-t border-gray-200">
              <span className="text-blue-600 font-medium text-sm">Continue →</span>
            </div>
          </Link>

          <Link
            to="/electricity/new-connection"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
          >
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">New Connection</h3>
            <p className="text-gray-600 mb-4">
              Apply for a new electricity connection
            </p>
            <div className="pt-4 border-t border-gray-200">
              <span className="text-blue-600 font-medium text-sm">Apply Now →</span>
            </div>
          </Link>

          <Link
            to="/electricity/complaint"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
          >
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Raise Complaint</h3>
            <p className="text-gray-600 mb-4">
              Report power outage or other issues
            </p>
            <div className="pt-4 border-t border-gray-200">
              <span className="text-blue-600 font-medium text-sm">Report Issue →</span>
            </div>
          </Link>

          <Link
            to="/electricity/tracking"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
          >
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Search className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Track Status</h3>
            <p className="text-gray-600 mb-4">
              Check your applications and complaints
            </p>
            <div className="pt-4 border-t border-gray-200">
              <span className="text-blue-600 font-medium text-sm">Track Now →</span>
            </div>
          </Link>
        </div>

        <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Did you know?</h3>
          <p className="text-blue-800">
            You can track every step of your application with our Transparency Tracker. 
            Know exactly where your application is and what happens next!
          </p>
        </div>
      </div>

      <AIChatbot />
    </div>
  );
}
