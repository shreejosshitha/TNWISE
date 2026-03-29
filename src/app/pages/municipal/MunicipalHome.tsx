import { Header } from "../../components/Header";
import { AIChatbot } from "../../components/AIChatbot";
import { Link } from "react-router";
import { Trash2, Lightbulb, Construction, CreditCard, Search, ArrowLeft, Building2 } from "lucide-react";

export function MunicipalHome() {
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

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Municipal Services</h1>
              <p className="text-green-100">Greater Chennai Corporation</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <Link
            to="/municipal/complaint?type=road"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
          >
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Construction className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Road Damage</h3>
            <p className="text-gray-600 mb-4">
              Report potholes and road damage
            </p>
            <div className="pt-4 border-t border-gray-200">
              <span className="text-blue-600 font-medium text-sm">Report →</span>
            </div>
          </Link>
          
          <Link
            to="/municipal/complaint?type=garbage"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
          >
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Trash2 className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Garbage Complaint</h3>
            <p className="text-gray-600 mb-4">
              Report garbage collection issues
            </p>
            <div className="pt-4 border-t border-gray-200">
              <span className="text-blue-600 font-medium text-sm">Report →</span>
            </div>
          </Link>

          <Link
            to="/municipal/property-tax"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CreditCard className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Property Tax</h3>
            <p className="text-gray-600 mb-4">
              Pay your property tax online
            </p>
            <div className="pt-4 border-t border-gray-200">
              <span className="text-blue-600 font-medium text-sm">Pay Now →</span>
            </div>
          </Link>

          <Link
            to="/municipal/complaint?type=streetlight"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
          >
            <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Lightbulb className="w-7 h-7 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Streetlight Issue</h3>
            <p className="text-gray-600 mb-4">
              Report non-working streetlights
            </p>
            <div className="pt-4 border-t border-gray-200">
              <span className="text-blue-600 font-medium text-sm">Report →</span>
            </div>
          </Link>


          <Link
            to="/municipal/complaint"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
          >
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Trash2 className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Other Complaints</h3>
            <p className="text-gray-600 mb-4">
              Report other civic issues
            </p>
            <div className="pt-4 border-t border-gray-200">
              <span className="text-blue-600 font-medium text-sm">Report →</span>
            </div>
          </Link>

          <Link
            to="/municipal/tracking"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
          >
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Search className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Track Complaints</h3>
            <p className="text-gray-600 mb-4">
              Check status of your complaints
            </p>
            <div className="pt-4 border-t border-gray-200">
              <span className="text-blue-600 font-medium text-sm">Track Now →</span>
            </div>
          </Link>
        </div>
      </div>

      <AIChatbot />
    </div>
  );
}
