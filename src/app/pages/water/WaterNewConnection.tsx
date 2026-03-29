import { useState } from "react";
import { AIChatbot } from "../../components/AIChatbot";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Upload, X, FileText, Eye, Copy, Download, Check } from "lucide-react";
import { toast } from "sonner";

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  connectionType?: string;
  dateOfBirth?: string;
  gender?: string;
  aadhar?: string;
  addressProof?: string;
  propertyDocument?: string;
}

interface UploadedFile {
  file: File;
  preview: string;
  type: string;
}

interface WaterApplication {
  id: string;
  type: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'connection_installed';
  date: string;
  formData: {
    name: string;
    phone: string;
    email: string;
    address: string;
    connectionType: string;
    dateOfBirth: string;
    gender: string;
    aadhar: string;
  };
  documents: {
    addressProof?: UploadedFile;
    propertyDocument?: UploadedFile;
  };
}

export function WaterNewConnection() {
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    connectionType: "",
    dateOfBirth: "",
    gender: "",
    aadhar: "",
  });

  const [addressProof, setAddressProof] = useState<UploadedFile | null>(null);
  const [propertyDocument, setPropertyDocument] = useState<UploadedFile | null>(null);

  // Validation functions
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = "Enter valid 10-digit phone number";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter valid email address";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.connectionType) newErrors.connectionType = "Connection type is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.aadhar.trim()) newErrors.aadhar = "Aadhar number is required";
    else if (!/^\d{12}$/.test(formData.aadhar)) newErrors.aadhar = "Enter valid 12-digit Aadhar number";
    if (!addressProof) newErrors.addressProof = "Address proof document is required";
    if (!propertyDocument) newErrors.propertyDocument = "Property ownership document is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // File handling functions
  const handleFileUpload = (file: File, type: 'addressProof' | 'propertyDocument') => {
    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

    if (file.size > maxSize) {
      toast.error("File size should be less than 5MB");
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and PDF files are allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const uploadedFile: UploadedFile = {
        file,
        preview: e.target?.result as string,
        type: file.type,
      };

      if (type === 'addressProof') {
        setAddressProof(uploadedFile);
        setErrors(prev => ({ ...prev, addressProof: undefined }));
      } else {
        setPropertyDocument(uploadedFile);
        setErrors(prev => ({ ...prev, propertyDocument: undefined }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (type: 'addressProof' | 'propertyDocument') => {
    if (type === 'addressProof') {
      setAddressProof(null);
    } else {
      setPropertyDocument(null);
    }
  };

  const copyApplicationId = async () => {
    try {
      await navigator.clipboard.writeText(applicationId);
      setCopied(true);
      toast.success("Application ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy application ID");
    }
  };

  const downloadApplicationDetails = () => {
    // Create a printable receipt
    const receiptWindow = window.open('', '_blank');
    if (!receiptWindow) {
      toast.error("Please allow popups to download the receipt");
      return;
    }

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Water Connection Application Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            .title {
              font-size: 18px;
              color: #374151;
              margin-bottom: 20px;
            }
            .receipt-info {
              background: #f8fafc;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              padding: 5px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .info-label {
              font-weight: bold;
              color: #374151;
            }
            .info-value {
              color: #6b7280;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 15px;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 5px;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              background: #dbeafe;
              color: #1e40af;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 12px;
            }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">TN WISE</div>
            <div class="title">Water Connection Application Receipt</div>
          </div>

          <div class="receipt-info">
            <div class="info-row">
              <span class="info-label">Application ID:</span>
              <span class="info-value">${applicationId}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Submission Date:</span>
              <span class="info-value">${new Date().toLocaleDateString()}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="status-badge">Submitted</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Applicant Details</div>
            <div class="info-row">
              <span class="info-label">Full Name:</span>
              <span class="info-value">${formData.name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone Number:</span>
              <span class="info-value">${formData.phone}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email Address:</span>
              <span class="info-value">${formData.email}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date of Birth:</span>
              <span class="info-value">${new Date(formData.dateOfBirth).toLocaleDateString()}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Gender:</span>
              <span class="info-value">${formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Aadhar Number:</span>
              <span class="info-value">${formData.aadhar}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Connection Details</div>
            <div class="info-row">
              <span class="info-label">Connection Type:</span>
              <span class="info-value">${formData.connectionType.charAt(0).toUpperCase() + formData.connectionType.slice(1)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Property Address:</span>
              <span class="info-value">${formData.address}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Documents Submitted</div>
            <div class="info-row">
              <span class="info-label">Address Proof:</span>
              <span class="info-value">${addressProof ? addressProof.file.name : 'Not uploaded'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Property Document:</span>
              <span class="info-value">${propertyDocument ? propertyDocument.file.name : 'Not uploaded'}</span>
            </div>
          </div>

          <div class="footer">
            <p>This is an electronically generated receipt. Please keep this receipt for your records.</p>
            <p>For any queries, contact TN WISE support with your Application ID.</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    receiptWindow.document.write(receiptHTML);
    receiptWindow.document.close();

    // Wait for content to load then print/download
    setTimeout(() => {
      receiptWindow.print();
      toast.success("Receipt opened in print dialog!");
    }, 500);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error("Please correct the errors and try again");
      return;
    }

    // Generate unique application ID
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const newApplicationId = `WTR${timestamp}${randomNum}`;

    const application: WaterApplication = {
      id: newApplicationId,
      type: "New Connection",
      status: "submitted",
      date: new Date().toISOString().split('T')[0],
      formData: { ...formData },
      documents: {
        addressProof: addressProof || undefined,
        propertyDocument: propertyDocument || undefined,
      },
    };

    // Store application data
    try {
      const storageKey = "waterApplications";
      const raw = localStorage.getItem(storageKey);
      const existing = raw ? JSON.parse(raw) : [];
      const updated = [application, ...existing];
      localStorage.setItem(storageKey, JSON.stringify(updated));

      // Also store in recent actions
      const action = {
        message: `Submitted water new connection request (${formData.connectionType}) - ID: ${newApplicationId}`,
        timestamp: new Date().toLocaleString(),
      };
      const actionStorageKey = "waterRecentActions";
      const actionRaw = localStorage.getItem(actionStorageKey);
      const actionExisting = actionRaw ? JSON.parse(actionRaw) : [];
      const actionUpdated = [action, ...actionExisting].slice(0, 5);
      localStorage.setItem(actionStorageKey, JSON.stringify(actionUpdated));
    } catch {
      // ignore storage errors
    }

    setApplicationId(newApplicationId);
    setSubmitted(true);
    toast.success("Application submitted successfully!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> 
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">Your water connection application has been received and is being processed.</p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Details</h3>
              <div className="text-left space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Application ID:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-semibold text-blue-600">{applicationId}</span>
                    <button
                      onClick={copyApplicationId}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Copy Application ID"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-600" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Submission Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Connection Type:</span>
                  <span className="font-medium capitalize">{formData.connectionType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">Submitted</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={copyApplicationId}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Copy className="w-5 h-5" />
                {copied ? "Copied!" : "Copy Application ID"}
              </button>
              <button
                onClick={downloadApplicationDetails}
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
                Track Application
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> 
        <Link to="/water" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Water Services
        </Link>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">New Water Connection</h2>
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.gender ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number *</label>
                  <input
                    type="text"
                    value={formData.aadhar}
                    onChange={(e) => setFormData({ ...formData, aadhar: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.aadhar ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter 12-digit Aadhar number"
                  />
                  {errors.aadhar && <p className="text-red-500 text-sm mt-1">{errors.aadhar}</p>}
                </div>
              </div>
            </div>

            {/* Connection Details */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Connection Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Address *</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter complete property address"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Connection Type *</label>
                  <select
                    value={formData.connectionType}
                    onChange={(e) => setFormData({ ...formData, connectionType: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.connectionType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select connection type</option>
                    <option value="domestic">Domestic</option>
                    <option value="commercial">Commercial</option>
                  </select>
                  {errors.connectionType && <p className="text-red-500 text-sm mt-1">{errors.connectionType}</p>}
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Uploads</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Address Proof */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Proof *</label>
                  <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                    addressProof ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    {addressProof ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center">
                          {addressProof.type === 'application/pdf' ? (
                            <FileText className="w-8 h-8 text-red-500" />
                          ) : (
                            <img src={addressProof.preview} alt="Address proof" className="w-16 h-16 object-cover rounded" />
                          )}
                        </div>
                        <p className="text-sm text-gray-700 font-medium">{addressProof.file.name}</p>
                        <p className="text-xs text-gray-500">{(addressProof.file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => window.open(addressProof.preview, '_blank')}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                          >
                            <Eye className="w-4 h-4 inline mr-1" />
                            Preview
                          </button>
                          <button
                            onClick={() => removeFile('addressProof')}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                          >
                            <X className="w-4 h-4 inline mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-sm text-gray-600">Upload address proof</p>
                          <p className="text-xs text-gray-500">JPG, PNG, PDF up to 5MB</p>
                        </div>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'addressProof')}
                          className="hidden"
                          id="address-proof"
                        />
                        <label
                          htmlFor="address-proof"
                          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 cursor-pointer"
                        >
                          Choose File
                        </label>
                      </div>
                    )}
                  </div>
                  {errors.addressProof && <p className="text-red-500 text-sm mt-1">{errors.addressProof}</p>}
                </div>

                {/* Property Document */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Ownership Document *</label>
                  <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                    propertyDocument ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    {propertyDocument ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center">
                          {propertyDocument.type === 'application/pdf' ? (
                            <FileText className="w-8 h-8 text-red-500" />
                          ) : (
                            <img src={propertyDocument.preview} alt="Property document" className="w-16 h-16 object-cover rounded" />
                          )}
                        </div>
                        <p className="text-sm text-gray-700 font-medium">{propertyDocument.file.name}</p>
                        <p className="text-xs text-gray-500">{(propertyDocument.file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => window.open(propertyDocument.preview, '_blank')}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                          >
                            <Eye className="w-4 h-4 inline mr-1" />
                            Preview
                          </button>
                          <button
                            onClick={() => removeFile('propertyDocument')}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                          >
                            <X className="w-4 h-4 inline mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-sm text-gray-600">Upload property document</p>
                          <p className="text-xs text-gray-500">JPG, PNG, PDF up to 5MB</p>
                        </div>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'propertyDocument')}
                          className="hidden"
                          id="property-document"
                        />
                        <label
                          htmlFor="property-document"
                          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 cursor-pointer"
                        >
                          Choose File
                        </label>
                      </div>
                    )}
                  </div>
                  {errors.propertyDocument && <p className="text-red-500 text-sm mt-1">{errors.propertyDocument}</p>}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Submit Application
            </button>
          </div>
        </div>
      </div>
      <AIChatbot />
    </div>
  );
}
