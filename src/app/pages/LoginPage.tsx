import { useState } from "react";
import { Header } from "../components/Header";
import { useNavigate } from "react-router";
import { Phone, Shield, User, Building, Lock, Mail, Eye, EyeOff, Loader } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Department } from "../context/AuthContext";
import { toast } from "sonner";
// Auth API calls moved to backend routes /api/auth/*

// Removed backend/database import - use any for citizenProfile


export function LoginPage() {
  const [step, setStep] = useState<"role" | "phone" | "otp" | "admin-dept" | "admin-creds">("role");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminOtp, setAdminOtp] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [adminName, setAdminName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [demoOTP, setDemoOTP] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // Mock credentials for admins (in production, use backend validation)
  const adminCredentials: Record<Department, { name: string; password: string }> = {
    electricity: { name: "Electricity Admin", password: "ElecAdmin@123" },
    water: { name: "Water Admin", password: "WaterAdmin@123" },
    municipal: { name: "Municipal Admin", password: "MuncAdmin@123" },
    transport: { name: "Transport Admin", password: "TransAdmin@123" },
  };

  const departments: { id: Department; name: string; color: string; icon: string }[] = [
    { id: "electricity", name: "Electricity", color: "from-yellow-50 to-yellow-100", icon: "⚡" },
    { id: "water", name: "Water", color: "from-blue-50 to-blue-100", icon: "💧" },
    { id: "municipal", name: "Municipal", color: "from-purple-50 to-purple-100", icon: "🏛️" },
    { id: "transport", name: "Transport", color: "from-orange-50 to-orange-100", icon: "🚌" },
  ];

  // Citizen Login Flow - Send OTP
  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit number");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      
      if (data.success) {
        setDemoOTP(data.data?.demoOTP || "123456");
        toast.success(data.message);
        setStep("otp");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Backend not running? Start: cd src/backend && tsx server.ts");
      console.error("OTP send error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Citizen Login Flow - Verify OTP
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await response.json();
      
      if (data.success) {
        const { sessionToken, user: citizenData, isNewUser } = data.data || {};
        
        // Store session token for API calls
        if (sessionToken) {
          localStorage.setItem('sessionToken', sessionToken);
        }
        
        if (citizenData) {
          // Existing citizen - login with profile
          const user = {
            id: citizenData.id,
            phone: citizenData.phone,
            name: citizenData.name,
            email: citizenData.email,
            role: "user" as const,
            citizenProfile: citizenData,
          };
          
          login(user);
          toast.success(`Welcome, ${citizenData.name}!`);
          navigate("/dashboard");
        } else if (isNewUser) {
          // New user - redirect to registration
          toast.success("OTP verified! Please complete your profile.");
          navigate("/register", { state: { phone, sessionToken } });
        }
      } else {
        toast.error(data.message || "OTP verification failed");
      }
    } catch (error) {
      toast.error("Network error. Backend running?");
      console.error("OTP verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Admin Login Flow
  const handleAdminSendOTP = async () => {
    if (adminPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit number");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: adminPhone }),
      });
      const data = await response.json();
      
      if (data.success) {
        setDemoOTP(data.data?.demoOTP || "123456");
        toast.success(data.message);
        setStep("admin-otp");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Backend not running? Start: cd src/backend && tsx server.ts");
      console.error("Admin OTP error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminVerifyOTP = async () => {
    if (adminOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: adminPhone, otp: adminOtp }),
      });
      const data = await response.json();
      
      if (data.success) {
        // OTP verified, store session token
        const { sessionToken } = data.data || {};
        if (sessionToken) {
          localStorage.setItem('sessionToken', sessionToken);
        }
        // OTP verified, move to department selection
        setStep("admin-dept");
        toast.success("OTP verified! Select your department.");
      } else {
        toast.error(data.message || "OTP verification failed");
      }
    } catch (error) {
      toast.error("Network error. Backend running?");
      console.error("Admin OTP verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDepartment = (dept: Department) => {
    setSelectedDept(dept);
    setStep("admin-creds");
  };

  const handleAdminLogin = () => {
    if (!selectedDept || !adminPassword) {
      toast.error("Please fill in all required fields");
      return;
    }

    const deptCreds: { name: string; password: string } = adminCredentials[selectedDept as Department];

    if (adminPassword === deptCreds.password) {
      const adminUser = {
        id: `admin_${selectedDept}_${Date.now()}`,
        phone: adminPhone,
        name: deptCreds.name,
        email: `admin@${selectedDept}.gov.in`,
        role: "admin" as const,
        department: selectedDept as Department,
      };
      
      // Get session token from OTP verification and store it
      const token = localStorage.getItem('sessionToken');
      if (!token) {
        localStorage.setItem('sessionToken', `admin_${selectedDept}_${Date.now()}`);
      }
      
      login(adminUser);
      toast.success(`Welcome ${deptCreds.name}!`);
      navigate(`/admin/${selectedDept}`);
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />

      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Role Selection */}
          {step === "role" && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Smart Public Services</h2>
                <p className="text-gray-600 mt-2">Choose how you want to access the platform</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setStep("phone")}
                  className="w-full p-6 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 hover:border-blue-400 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg text-gray-900">Citizen Login</h3>
                      <p className="text-sm text-gray-600">Access all public services</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setStep("admin-otp")}
                  className="w-full p-6 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-200 hover:border-green-400 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center">
                      <Building className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg text-gray-900">Admin Login</h3>
                      <p className="text-sm text-gray-600">Manage department operations</p>
                    </div>
                  </div>
                </button>
              </div>
            </>
          )}

          {/* User Phone Input */}
          {step === "phone" && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Verify Your Number</h2>
                <p className="text-gray-600 mt-2">Enter your mobile number to continue</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.slice(0, 10))}
                      placeholder="Enter 10-digit number"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSendOTP}
                  disabled={phone.length !== 10 || isLoading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
                <button
                  onClick={() => {setStep("role"); setPhone("");}}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  Back
                </button>
              </div>
            </>
          )}

          {/* User OTP Verification */}
          {step === "otp" && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Verify OTP</h2>
                <p className="text-gray-600 mt-2">Enter the 6-digit code sent to {phone}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                  {demoOTP && (
                    <p className="text-xs text-blue-600 mt-2 font-semibold">Demo OTP: {demoOTP}</p>
                  )}
                </div>
                <button
                  onClick={handleVerifyOTP}
                  disabled={otp.length !== 6 || isLoading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
                <button
                  onClick={() => {setStep("phone"); setOtp(""); setDemoOTP("");}}
                  disabled={isLoading}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  Change Number
                </button>
              </div>
            </>
          )}

          {/* Admin OTP Verification */}
          {step === "admin-otp" && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Admin Verification</h2>
                <p className="text-gray-600 mt-2">Enter your official mobile number</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value.slice(0, 10))}
                      placeholder="Enter 10-digit number"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAdminSendOTP}
                  disabled={adminPhone.length !== 10 || isLoading}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
                <button
                  onClick={() => {setStep("role"); setAdminPhone(""); setDemoOTP("");}}
                  disabled={isLoading}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  Back
                </button>
              </div>

              {adminPhone.length === 10 && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OTP Code
                    </label>
                    <input
                      type="text"
                      value={adminOtp}
                      onChange={(e) => setAdminOtp(e.target.value.slice(0, 6))}
                      placeholder="000000"
                      maxLength={6}
                      disabled={isLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                    />
                    {demoOTP && (
                      <p className="text-xs text-green-600 mt-2 font-semibold">Demo OTP: {demoOTP}</p>
                    )}
                  </div>
                  <button
                    onClick={handleAdminVerifyOTP}
                    disabled={adminOtp.length !== 6 || isLoading}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Admin Department Selection */}
          {step === "admin-dept" && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Select Department</h2>
                <p className="text-gray-600 mt-2">Choose your department to manage</p>
              </div>

              <div className="space-y-3">
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => handleSelectDepartment(dept.id)}
                    className={`w-full p-4 bg-gradient-to-r ${dept.color} border-2 border-gray-200 hover:border-gray-400 rounded-lg transition-all text-left`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{dept.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                        <p className="text-xs text-gray-600">Admin Dashboard</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => {setStep("admin-otp"); setAdminOtp("");}}
                className="w-full py-3 mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
              >
                Back
              </button>
            </>
          )}

          {/* Admin Credentials */}
          {step === "admin-creds" && selectedDept && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
                <p className="text-gray-600 mt-2">
                  {adminCredentials[selectedDept].name}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={`admin@${selectedDept}.gov.in`}
                      disabled
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Test password: {adminCredentials[selectedDept].password}
                  </p>
                </div>

                <button
                  onClick={handleAdminLogin}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Login
                </button>

                <button
                  onClick={() => {setStep("admin-dept"); setAdminPassword("");}}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  Back
                </button>
              </div>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-600">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
