import { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { AIChatbot } from "../../components/AIChatbot";
import { Link, useSearchParams } from "react-router";
import { ArrowLeft, Upload, CheckCircle2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { saveMunicipalComplaint, type MunicipalComplaint } from "../../../backend/municipalComplaintService";

export function MunicipalComplaint() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "";
  
  const [mode, setMode] = useState<"general" | "road" | "garbage">("general");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [image, setImage] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Determine mode from initialType
  useEffect(() => {
    if (initialType === "road") {
      setMode("road");
    } else if (initialType === "garbage") {
      setMode("garbage");
    } else {
      setMode("general");
    }
    // Reset form
    setCategory("");
    setSubcategory("");
    setTitle("");
    setDescription("");
    setLocation("");
    setLat(null);
    setLng(null);
  }, [initialType]);

  const generalCategories = [
    "Garbage Collection",
    "Streetlight Not Working",
    "Road Damage / Pothole",
    "Drainage Issue",
    "Stray Animals",
    "Illegal Dumping",
    "Other",
  ];

  const roadCategories = {
    "Surface Damage": [
      "Potholes",
      "Cracks",
      "Uneven Surface",
      "Road Sinking",
      "Damaged Speed Breaker"
    ],
    "Safety Issues": [
      "Missing Signs",
      "Broken Signals",
      "Open Manhole",
      "Poor Visibility"
    ],
    "Drainage Issues": [
      "Waterlogging",
      "Blocked Drain",
      "Flooded Road"
    ],
    "Construction Issues": [
      "Work Delay",
      "Poor Quality",
      "Incomplete Work"
    ],
    "Obstructions": [
      "Illegal Parking",
      "Garbage on Road",
      "Fallen Tree"
    ],
    "Infrastructure": [
      "Damaged Footpath",
      "Broken Divider",
      "Missing Barricade"
    ],
    "Markings": [
      "Faded Markings",
      "Missing Zebra Crossing"
    ]
  };

  const garbageCategories = {
    "Garbage Collection": [
      "Missed Pickup",
      "Irregular Collection",
      "Delayed Collection",
      "No Door-to-Door Service",
      "Overflowing Bins"
    ],
    "Waste Dumping": [
      "Illegal Dumping",
      "Open Garbage Heap",
      "Garbage on Road",
      "Garbage Near Homes",
      "Garbage Near Water Bodies"
    ],
    "Segregation Issues": [
      "No Waste Segregation",
      "Mixed Waste Collection",
      "No Separate Bins",
      "Improper Recycling"
    ],
    "Public Bin Issues": [
      "Damaged Bin",
      "Missing Bin",
      "Insufficient Bins",
      "Overflowing Bin",
      "Unclean Bin Area"
    ],
    "Sanitation Issues": [
      "Foul Smell",
      "Pest Problems",
      "Unhygienic Area",
      "Water Logging Due to Garbage"
    ],
    "Hazardous Waste": [
      "Medical Waste",
      "Industrial Waste",
      "Chemical Waste",
      "Sharp Objects"
    ],
    "Worker Issues": [
      "Worker Not Coming",
      "Rude Behavior",
      "Improper Handling",
      "Extra Charges"
    ],
    "Other": [
      "General Complaint",
      "Feedback",
      "Other"
    ]
  };

  const getCategoriesForMode = () => {
    switch (mode) {
      case "road": return Object.keys(roadCategories);
      case "garbage": return Object.keys(garbageCategories);
      default: return generalCategories;
    }
  };

  const getSubcategories = (cat: string) => {
    switch (mode) {
      case "road": return roadCategories[cat as keyof typeof roadCategories] || [];
      case "garbage": return garbageCategories[cat as keyof typeof garbageCategories] || [];
      default: return [];
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case "road": return "Report Road Damage";
      case "garbage": return "Report Garbage Complaint";
      default: return "Register Civic Complaint";
    }
  };

  // Auto-detect GPS location for specific modes
  const detectLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude);
          setLng(longitude);
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            const address = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            setLocation(address);
            setErrors(prev => ({ ...prev, location: "" }));
          } catch {
            setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          }
          setLocationLoading(false);
          toast.success("Location detected successfully!");
        },
        () => {
          toast.error("Location access denied. Please enter manually.");
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      toast.error("Geolocation not supported.");
      setLocationLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (mode === "road" || mode === "garbage") {
      if (!title.trim()) newErrors.title = "Title is required";
      if (!category) newErrors.category = "Category is required";
      if (!subcategory) newErrors.subcategory = "Subcategory is required";
    } else {
      if (!category) newErrors.category = "Category is required";
    }
    
    if (!location.trim()) newErrors.location = "Location is required";
    if (!description.trim()) newErrors.description = "Description is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = () => {
    setImage(true);
    toast.success("Image uploaded successfully!");
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    // Generate unique ID like MUN + timestamp + random
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const newId = `MUN${timestamp}${randomNum}`;

    const complaint: MunicipalComplaint = {
      id: newId,
      title: title || undefined,
      category: `${mode} - ${category}`,
      subcategory: subcategory || undefined,
      description,
      location,
      lat,
      lng,
      status: "submitted",
      date: new Date().toISOString().split('T')[0],
      image,
      mode,
    };

    try {
      saveMunicipalComplaint(complaint);
      setComplaintId(newId);
      setSubmitted(true);
      toast.success(`Complaint ${newId} registered successfully!`);
    } catch (error) {
      toast.error("Failed to save complaint");
    }
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Complaint Registered!</h2>
            {complaintId && (
              <p className="text-xl font-mono bg-blue-100 px-4 py-2 rounded-lg mx-auto mb-8 max-w-max">
                ID: {complaintId}
              </p>
            )}
            <p className="text-gray-600 mb-8">Track your complaint status below</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/municipal/tracking"
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
        <Link to="/municipal" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Municipal Services
        </Link>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{getModeTitle()}</h2>
          <div className="space-y-6">
            {(mode === "road" || mode === "garbage") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`e.g., ${mode === "road" ? "Large pothole on main road" : "Missed garbage pickup"}`}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {(mode === "road" || mode === "garbage") ? `${mode === "road" ? "Road Damage" : "Garbage"} Category *` : "Category *"}
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubcategory("");
                  setErrors(prev => ({ ...prev, category: "", subcategory: "" }));
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">{(mode === "road" || mode === "garbage") ? "Select main category" : "Select category"}</option>
                {getCategoriesForMode().map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            {(mode === "road" || mode === "garbage") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory *</label>
                <select
                  value={subcategory}
                  onChange={(e) => {
                    setSubcategory(e.target.value);
                    setErrors(prev => ({ ...prev, subcategory: "" }));
                  }}
                  disabled={!category}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.subcategory ? "border-red-500" : "border-gray-300"
                  } ${!category ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <option value="">{category ? "Select subcategory" : "Select main category first"}</option>
                  {category && getSubcategories(category).map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
                {errors.subcategory && <p className="text-red-500 text-sm mt-1">{errors.subcategory}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setErrors(prev => ({ ...prev, location: "" }));
                  }}
                  placeholder="Enter exact location or use GPS"
                  className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={locationLoading}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <MapPin className="w-4 h-4" />
                  {locationLoading ? "..." : "GPS"}
                </button>
              </div>
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors(prev => ({ ...prev, description: "" }));
                }}
                rows={5}
                placeholder="Describe the issue in detail..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">Upload photo for faster resolution</p>
                  <button
                    onClick={handleImageUpload}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    {image ? "Uploaded ✓" : "Upload Image"}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
              disabled={locationLoading}
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

