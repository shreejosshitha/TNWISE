import { useState, useEffect } from "react";
import { AIChatbot } from "../../components/AIChatbot";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Upload, X, FileText, Eye, Copy, Download, MapPin, Camera } from "lucide-react";
import { toast } from "sonner";
import { saveWaterComplaint, WaterComplaint as StoredWaterComplaint, StoredProofFile } from "../../../backend/waterComplaintService";

interface ComplaintErrors {
  title?: string;
  category?: string;
  subcategory?: string;
  description?: string;
  location?: string;
  proof?: string;
}

interface UploadedFile {
  file: File;
  preview: string;
  type: string;
}

interface WaterComplaint {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  location: string;
  status: 'submitted' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  date: string;
  proof?: UploadedFile[];
}

export function WaterComplaint() {
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<ComplaintErrors>({});
  const [formData, setFormData] = useState({
  title: "",
  category: "",
  subcategory: "",
  description: "",
  location: "",
  lat: null as number | null,
  lng: null as number | null,
});
  const [proofFiles, setProofFiles] = useState<UploadedFile[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);

  const categories = {
    "Water Supply": ["No Water Supply", "Low Water Pressure", "Intermittent Supply"],
    "Water Quality": ["Contaminated Water", "Bad Taste/Odor", "Discolored Water"],
    "Billing": ["Incorrect Bill", "Meter Reading Error", "Payment Issues"],
    "Infrastructure": ["Pipe Leakage", "Broken Meter", "Damaged Infrastructure"],
    "Other": ["General Complaint", "Service Request", "Feedback"],
  };

  const getSubcategories = (category: string) => {
    return categories[category as keyof typeof categories] || [];
  };

  // Validation functions
  const validateForm = (): boolean => {
    const newErrors: ComplaintErrors = {};

    if (!formData.title.trim()) newErrors.title = "Complaint title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subcategory) newErrors.subcategory = "Subcategory is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    else if (formData.description.trim().length < 20) newErrors.description = "Description must be at least 20 characters";
    if (!formData.location.trim()) newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Location detection
  const detectLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.crt.io/v1/reverse-geocode?latitude=${latitude}&longitude=${longitude}`
            );
            const data = await response.json();
            const formattedAddress =
              data.formatted_address ||
              data.address ||
              data.result?.formatted ||
              data.results?.[0]?.formatted ||
              data.features?.[0]?.properties?.formatted ||
              [data.city, data.state, data.country].filter(Boolean).join(", ");
            const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

setFormData({
  ...formData,
  location: locationString,
  lat: latitude,
  lng: longitude,
});
            setErrors(prev => ({ ...prev, location: undefined }));
          } catch {
            setFormData({ ...formData, location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` });
          }
          setLocationLoading(false);
        },
        (error) => {
          toast.error("Unable to detect location. Please enter manually.");
          setLocationLoading(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
      setLocationLoading(false);
    }
  };

  // File handling functions
  const handleFileUpload = (files: FileList) => {
    const maxFiles = 5;
    const maxSize = 10 * 1024 * 1024; // 10MB per file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/quicktime', 'video/x-msvideo'];

    if (proofFiles.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`);
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not supported. Only images and videos allowed`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const uploadedFile: UploadedFile = {
          file,
          preview: e.target?.result as string,
          type: file.type,
        };
        setProofFiles(prev => [...prev, uploadedFile]);
        setErrors(prev => ({ ...prev, proof: undefined }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setProofFiles(prev => prev.filter((_, i) => i !== index));
  };

  const copyComplaintId = async () => {
    try {
      await navigator.clipboard.writeText(complaintId);
      setCopied(true);
      toast.success("Complaint ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy complaint ID");
    }
  };

  const downloadComplaintDetails = () => {
    const complaintDetails = {
      complaintId,
      submittedDate: new Date().toLocaleDateString(),
      status: "Submitted",
      title: formData.title,
      category: formData.category,
      subcategory: formData.subcategory,
      description: formData.description,
      location: formData.location,
      proofFiles: proofFiles.map(f => f.file.name),
    };

    const dataStr = JSON.stringify(complaintDetails, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `water-complaint-${complaintId}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast.success("Complaint details downloaded!");
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error("Please correct the errors and try again");
      return;
    }

    // Generate unique complaint ID
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const newComplaintId = `WCOMP${timestamp}${randomNum}`;

    const storedProof: StoredProofFile[] | undefined = proofFiles.length > 0
      ? proofFiles.map((file) => ({ name: file.file.name, type: file.type, preview: file.preview }))
      : undefined;

    const complaint: StoredWaterComplaint = {
  id: newComplaintId,
  title: formData.title,
  category: formData.category,
  subcategory: formData.subcategory,
  description: formData.description,
  location: formData.location,
  lat: formData.lat,   // ✅ ADD
  lng: formData.lng,   // ✅ ADD
  status: "submitted",
  date: new Date().toISOString().split('T')[0],
  proof: storedProof,
};

    try {
      saveWaterComplaint(complaint);
    } catch {
      // ignore storage errors
    }

    setComplaintId(newComplaintId);
    setSubmitted(true);
    toast.success("Complaint registered successfully!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Header showAuth={true} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Complaint Registered Successfully!</h2>
            <p className="text-gray-600 mb-6">Your complaint has been registered and will be addressed within 24-48 hours.</p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Complaint Details</h3>
              <div className="text-left space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Complaint ID:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-semibold text-blue-600">{complaintId}</span>
                    <button
                      onClick={copyComplaintId}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Copy Complaint ID"
                    >
                      {copied ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-600" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Title:</span>
                  <span className="font-medium">{formData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{formData.category} - {formData.subcategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Submission Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">Submitted</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={copyComplaintId}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Copy className="w-5 h-5" />
                {copied ? "Copied!" : "Copy Complaint ID"}
              </button>
              <button
                onClick={downloadComplaintDetails}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Details
              </button>
            </div>

            <div className="space-y-4">
              <Link
                to="/water/tracking"
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors mr-4"
              >
                Track Complaint
              </Link>
              <Link
                to="/dashboard"
                className="inline-block px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
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
        <Link to="/water" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Water Services
        </Link>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Raise a Complaint</h2>
          <div className="space-y-6">
            {/* Complaint Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Complaint Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Brief title for your complaint"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Category and Subcategory */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: "" })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select category</option>
                  {Object.keys(categories).map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory *</label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  disabled={!formData.category}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.subcategory ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select subcategory</option>
                  {getSubcategories(formData.category).map((subcategory) => (
                    <option key={subcategory} value={subcategory}>{subcategory}</option>
                  ))}
                </select>
                {errors.subcategory && <p className="text-red-500 text-sm mt-1">{errors.subcategory}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your complaint in detail (minimum 20 characters)..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              <p className="text-xs text-gray-500 mt-1">{formData.description.length}/20 characters minimum</p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter location or use auto-detect"
                />
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={locationLoading}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  {locationLoading ? "Detecting..." : "Auto-Detect"}
                </button>
              </div>
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            {/* Proof Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Proof (Optional)</label>
              <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                proofFiles.length > 0 ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
              }`}>
                {proofFiles.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {proofFiles.map((file, index) => (
                        <div key={index} className="relative">
                          {file.type.startsWith('image/') ? (
                            <img src={file.preview} alt="Proof" className="w-full h-24 object-cover rounded" />
                          ) : (
                            <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                              <FileText className="w-8 h-8 text-gray-600" />
                            </div>
                          )}
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <p className="text-xs text-gray-600 mt-1 truncate">{file.file.name}</p>
                        </div>
                      ))}
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                      className="hidden"
                      id="proof-upload"
                    />
                    <label
                      htmlFor="proof-upload"
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 cursor-pointer"
                    >
                      Add More Files
                    </label>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-sm text-gray-600">Upload images or videos as proof</p>
                      <p className="text-xs text-gray-500">JPG, PNG, MP4 up to 10MB each (max 5 files)</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                      className="hidden"
                      id="proof-upload"
                    />
                    <label
                      htmlFor="proof-upload"
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 cursor-pointer"
                    >
                      Choose Files
                    </label>
                  </div>
                )}
              </div>
              {errors.proof && <p className="text-red-500 text-sm mt-1">{errors.proof}</p>}
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
