import { useState } from "react";
import { Header } from "../../components/Header";
import { AIChatbot } from "../../components/AIChatbot";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function ElectricityComplaint() {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [consumerNumber, setConsumerNumber] = useState("");
  const [complaintId, setComplaintId] = useState("");
  const navigate = useNavigate();

  const issueTypes = [
    "Power Outage",
    "Voltage Fluctuation",
    "Meter Issue",
    "Billing Problem",
    "Wire Damage",
    "Street Light Not Working",
    "Other",
  ];

  const handleSubmit = () => {
    if (!issueType || !description || !consumerNumber) {
      toast.error("Please fill all required fields");
      return;
    }

    const id = `COMP${Date.now()}`;
    setComplaintId(id);
    toast.success("Complaint registered successfully!");
  };

  if (complaintId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Header showAuth={true} />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Complaint Registered Successfully!
            </h2>
            <p className="text-gray-600 mb-8">
              We have received your complaint and will address it shortly
            </p>

            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">Complaint ID</p>
              <p className="text-2xl font-bold text-blue-600 mb-4">{complaintId}</p>
              <p className="text-sm text-gray-600">
                Expected Resolution Time: <strong>24-48 hours</strong>
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Link
                to="/electricity/tracking"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Track Complaint
              </Link>
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        <AIChatbot />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header showAuth={true} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/electricity"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Electricity Services
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Raise a Complaint</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consumer Number *
              </label>
              <input
                type="text"
                value={consumerNumber}
                onChange={(e) => setConsumerNumber(e.target.value)}
                placeholder="Enter your consumer number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Issue Type *
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose an issue type</option>
                {issueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Describe your issue in detail..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> For faster resolution, please provide as much detail as
                possible including location, time of occurrence, and any relevant information.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Submit Complaint
            </button>
          </div>
        </div>
      </div>

      <AIChatbot />
    </div>
  );
}
