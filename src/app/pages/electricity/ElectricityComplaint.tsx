import { useState, useRef, useCallback } from "react";
import { AIChatbot } from "../../components/AIChatbot";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { electricityApi } from "../../services/electricityApi";
import { ArrowLeft, CheckCircle2, MapPin, Image, Navigation, Upload } from "lucide-react";
import { toast } from "sonner";

export function ElectricityComplaint() {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [consumerNumber, setConsumerNumber] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [complaintId, setComplaintId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);;

  const issueTypes = [
    "Power Outage",
    "Voltage Fluctuation",
    "Meter Issue",
    "Billing Problem",
    "Wire Damage",
    "Street Light Not Working",
    "Other",
  ];

  const handlePhotoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setPhoto(file);
      const preview = URL.createObjectURL(file);
      setPhotoPreview(preview);
      toast.success('Photo uploaded successfully');
    } else {
      toast.error('Please select a valid image file');
    }
  }, []);

  const handleAutoDetectLocation = useCallback(() => {
    setIsGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(4);
        const lng = position.coords.longitude.toFixed(4);
        setLocation(`Lat: ${lat}, Lng: ${lng}`);
        toast.success('Location detected successfully');
        setIsGeolocating(false);
      },
      (error) => {
        toast.error('Unable to detect location. Please enter manually.');
        setIsGeolocating(false);
      },
      { timeout: 10000 }
    );
  }, []);

  const handleSubmit = async () => {
    if (!issueType || !description || !consumerNumber || !location) {
      toast.error("Please fill all required fields including location");
      return;
    }

    if (!user?.phone) {
      toast.error("Please login to submit complaint");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("sessionToken");
      if (!token) {
        toast.error("Session expired, please login again");
        return;
      }

      const result = await electricityApi.createComplaint({
        phone: user.phone,
        consumerNumber,
        type: issueType,
        description,
        location,
      }, token);

      if (result.success && result.data?.id) {
        setComplaintId(result.data.id);
        toast.success("Complaint registered successfully!");
      } else {
        toast.error(result.message || "Failed to submit complaint");
      }
    } catch (error) {
      console.error("Complaint submission error:", error);
      toast.error("Error submitting complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (complaintId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location * (helps us reach you faster)
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location (street, area, landmark) or use auto-detect"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAutoDetectLocation}
                    disabled={isGeolocating}
                    className="px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm font-medium text-gray-700 h-auto whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-1"
                  >
                    {isGeolocating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin" />
                        Detecting...
                      </>
                    ) : (
                      <>
                        <Navigation className="w-4 h-4" />
                        Auto-detect
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Image className="w-4 h-4" />
                Photo Proof (optional)
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  className="w-full justify-start h-auto py-9 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-white text-sm text-gray-700 font-medium hover:bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-5 h-5 mr-2 inline" />
                  {photoPreview ? 'Change photo' : 'Upload photo proof (JPG/PNG, max 5MB)'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                {photoPreview && (
                  <div className="relative group">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="max-h-48 w-full object-cover rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhoto(null);
                        setPhotoPreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Location helps us dispatch the right team faster. Photos 
                provide visual context for quicker resolution.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Complaint"
              )}
            </button>
          </div>
        </div>
      </div>

      <AIChatbot />
    </div>
  );
}
