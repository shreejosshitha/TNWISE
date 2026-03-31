import { useState } from "react";
import { AIChatbot } from "../../components/AIChatbot";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Upload, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { electricityApi } from "../../services/electricityApi";

const STEPS = [
  "Personal Details",
  "Address",
  "Load Requirement",
  "Documents",
  "Fee Summary",
  "Submit",
];

export function NewConnection() {
  const { t } = useTranslation('electricity');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    loadType: "",
    loadValue: "",
    purpose: "",
    documents: {
      identity: null,
      address: null,
      ownership: null,
    },
  });
  const [applicationId, setApplicationId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Get session token from localStorage
    const token = localStorage.getItem('sessionToken');  
    if (!token) {
      toast.error("Session expired, please login again");
      return;
    }

    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await electricityApi.createApplication({
        name: formData.name,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        loadType: formData.loadType || "domestic",
        loadValue: parseInt(formData.loadValue) || 2,
        purpose: formData.purpose || "New residential connection",
        documents: formData.documents,
      }, token);

      if (response.success && response.data?.id) {
        setApplicationId(response.data.id);
        toast.success("Application submitted successfully!");
      } else {
        toast.error(response.message || "Failed to submit application");
      }
    } catch (error) {
      toast.error("Error submitting application");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (docType: string) => {
    toast.success(`${docType} document uploaded successfully!`);
    setFormData({
      ...formData,
      documents: {
        ...formData.documents,
        [docType]: true,
      },
    });
  };

  const calculateFee = () => {
    const baseFee = 500;
    const loadFee = parseInt(formData.loadValue || "0") * 10;
    const processingFee = 200;
    return baseFee + loadFee + processingFee;
  };

  if (applicationId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center"> 
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Application Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-8">
              Your new electricity connection application has been received
            </p>

            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">Application ID</p>
              <p className="text-2xl font-bold text-blue-600 mb-4">{applicationId}</p>
              <p className="text-sm text-gray-600">
                Please save this ID for tracking your application
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Link
                to={`/electricity/tracker/${applicationId}`}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Track Application
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> 
        <Link
          to="/electricity"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Electricity Services
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            New Electricity Connection
          </h2>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {STEPS.map((step, index) => (
                <div
                  key={index}
                  className={`text-xs font-medium ${
                    index <= currentStep ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-green-600 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="space-y-6">
            {currentStep === 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Personal Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Address Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complete Address *
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter complete address"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Load Requirement</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Load Type *
                  </label>
                  <select
                    value={formData.loadType}
                    onChange={(e) => setFormData({ ...formData, loadType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select load type</option>
                    <option value="domestic">Domestic</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Load Value (in kW) *
                  </label>
                  <input
                    type="number"
                    value={formData.loadValue}
                    onChange={(e) => setFormData({ ...formData, loadValue: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter load value"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose of Connection *
                  </label>
                  <textarea
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the purpose"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Upload Documents</h3>
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Identity Proof</p>
                        <p className="text-sm text-gray-600">
                          Aadhaar Card / Passport / Driving License
                        </p>
                      </div>
                      <button
                        onClick={() => handleFileUpload("identity")}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        {formData.documents.identity ? "Uploaded ✓" : "Upload"}
                      </button>
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Address Proof</p>
                        <p className="text-sm text-gray-600">Utility Bill / Rental Agreement</p>
                      </div>
                      <button
                        onClick={() => handleFileUpload("address")}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        {formData.documents.address ? "Uploaded ✓" : "Upload"}
                      </button>
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Ownership Proof</p>
                        <p className="text-sm text-gray-600">Property Document / Sale Deed</p>
                      </div>
                      <button
                        onClick={() => handleFileUpload("ownership")}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        {formData.documents.ownership ? "Uploaded ✓" : "Upload"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Fee Summary</h3>
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-700">Registration Fee</p>
                      <p className="font-semibold text-gray-900">₹500</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-700">Load Charges ({formData.loadValue} kW)</p>
                      <p className="font-semibold text-gray-900">
                        ₹{parseInt(formData.loadValue || "0") * 10}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-700">Processing Fee</p>
                      <p className="font-semibold text-gray-900">₹200</p>
                    </div>
                    <div className="border-t-2 border-gray-300 pt-3 flex items-center justify-between">
                      <p className="text-lg font-semibold text-gray-900">Total Amount</p>
                      <p className="text-2xl font-bold text-blue-600">₹{calculateFee()}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ The fee will be collected after approval of your application
                  </p>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Review & Submit</h3>
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Applicant Name</p>
                    <p className="font-semibold text-gray-900">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="font-semibold text-gray-900">
                      {formData.phone} | {formData.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-semibold text-gray-900">
                      {formData.address}, {formData.city} - {formData.pincode}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Load Details</p>
                    <p className="font-semibold text-gray-900">
                      {formData.loadType} - {formData.loadValue} kW
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Fee</p>
                    <p className="font-semibold text-blue-600 text-xl">₹{calculateFee()}</p>
                  </div>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    ✓ By submitting, you confirm that all information provided is accurate
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                {loading ? "Submitting..." : "Submit Application"}
                <CheckCircle2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <AIChatbot />
    </div>
  );
}
