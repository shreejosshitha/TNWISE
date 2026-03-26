// Backend API Service for Authentication
import {
  citizensDatabase,
  otpStore,
  sessionsStore,
  generateOTP,
  generateSessionToken,
  CitizenProfile,
} from "./database";

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface LoginResponse extends AuthResponse {
  data?: {
    sessionToken?: string;
    user?: CitizenProfile;
    isNewUser?: boolean;
    phone?: string;
  };
}

// Simulate network delay
const simulateNetworkDelay = (ms: number = 800) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Send OTP to citizen's phone number
 */
export const sendOTP = async (phone: string): Promise<AuthResponse> => {
  await simulateNetworkDelay();

  if (!phone || phone.length !== 10) {
    return {
      success: false,
      message: "Invalid phone number format",
      error: "INVALID_PHONE",
    };
  }

  // Check if citizen exists in database
  const citizenExists = citizensDatabase[phone];

  if (!citizenExists) {
    // For new citizens, allow registration
    const otp = generateOTP();
    otpStore[phone] = {
      code: otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0,
    };

    console.log(`[DEMO] OTP for ${phone}: ${otp}`);

    return {
      success: true,
      message: `OTP sent to ${phone}. (Demo OTP: ${otp})`,
      data: {
        phone,
        isNewUser: true,
        demoOTP: process.env.NODE_ENV === "development" ? otp : undefined,
      },
    };
  }

  // Existing citizen
  const otp = generateOTP();
  otpStore[phone] = {
    code: otp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    attempts: 0,
  };

  console.log(`[DEMO] OTP for ${phone}: ${otp}`);

  return {
    success: true,
    message: `OTP sent to ${phone}. (Demo OTP: ${otp})`,
    data: {
      phone,
      citizenName: citizenExists.name,
      demoOTP: process.env.NODE_ENV === "development" ? otp : undefined,
    },
  };
};

/**
 * Verify OTP
 */
export const verifyOTP = async (
  phone: string,
  otp: string
): Promise<LoginResponse> => {
  await simulateNetworkDelay();

  if (!phone || phone.length !== 10) {
    return {
      success: false,
      message: "Invalid phone number",
      error: "INVALID_PHONE",
    };
  }

  if (!otp || otp.length !== 6) {
    return {
      success: false,
      message: "Invalid OTP format",
      error: "INVALID_OTP_FORMAT",
    };
  }

  // Check if OTP exists and is valid
  const storedOTP = otpStore[phone];

  if (!storedOTP) {
    return {
      success: false,
      message: "OTP not found. Please request a new OTP.",
      error: "OTP_NOT_FOUND",
    };
  }

  if (storedOTP.expiresAt < Date.now()) {
    delete otpStore[phone];
    return {
      success: false,
      message: "OTP has expired. Please request a new OTP.",
      error: "OTP_EXPIRED",
    };
  }

  if (storedOTP.attempts >= 3) {
    delete otpStore[phone];
    return {
      success: false,
      message: "Maximum OTP attempts exceeded. Please request a new OTP.",
      error: "MAX_ATTEMPTS_EXCEEDED",
    };
  }

  if (storedOTP.code !== otp) {
    storedOTP.attempts++;
    return {
      success: false,
      message: `Invalid OTP. ${3 - storedOTP.attempts} attempts remaining.`,
      error: "INVALID_OTP",
    };
  }

  // OTP is valid
  delete otpStore[phone];

  // Check if citizen exists
  const citizen = citizensDatabase[phone];

  if (!citizen) {
    // Create session for new citizen registration
    const sessionToken = generateSessionToken();
    sessionsStore[sessionToken] = {
      userId: `new_${phone}`,
      sessionToken,
      expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
    };

    return {
      success: true,
      message: "OTP verified. Please complete your profile registration.",
      data: {
        sessionToken,
        isNewUser: true,
        phone,
      },
    };
  }

  // Existing citizen - create session
  const sessionToken = generateSessionToken();
  sessionsStore[sessionToken] = {
    userId: citizen.id,
    sessionToken,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };

  return {
    success: true,
    message: "Login successful!",
    data: {
      sessionToken,
      user: citizen,
      isNewUser: false,
    },
  };
};

/**
 * Get citizen profile by phone
 */
export const getCitizenProfile = async (
  phone: string
): Promise<AuthResponse> => {
  await simulateNetworkDelay();

  if (!phone || phone.length !== 10) {
    return {
      success: false,
      message: "Invalid phone number",
      error: "INVALID_PHONE",
    };
  }

  const citizen = citizensDatabase[phone];

  if (!citizen) {
    return {
      success: false,
      message: "Citizen profile not found",
      error: "CITIZEN_NOT_FOUND",
    };
  }

  return {
    success: true,
    message: "Citizen profile retrieved successfully",
    data: citizen,
  };
};

/**
 * Register new citizen
 */
export const registerCitizen = async (
  citizenData: Partial<CitizenProfile>
): Promise<LoginResponse> => {
  await simulateNetworkDelay(1500);

  if (!citizenData.phone || !citizenData.name || !citizenData.email) {
    return {
      success: false,
      message: "Missing required fields",
      error: "MISSING_FIELDS",
    };
  }

  if (citizensDatabase[citizenData.phone]) {
    return {
      success: false,
      message: "Phone number already registered",
      error: "PHONE_EXISTS",
    };
  }

  // Create new citizen profile
  const newCitizen: CitizenProfile = {
    id: `citizen_${Date.now()}`,
    phone: citizenData.phone,
    name: citizenData.name,
    email: citizenData.email,
    aadhar: citizenData.aadhar || "",
    address: citizenData.address || "",
    city: citizenData.city || "",
    state: citizenData.state || "",
    pincode: citizenData.pincode || "",
    dateOfBirth: citizenData.dateOfBirth || "",
    gender: citizenData.gender || "",
    services: {
      electricity: undefined,
      water: undefined,
      municipal: undefined,
      transport: undefined,
    },
    kyc: {
      verified: false,
      documents: {
        aadhar: false,
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add to database (in production, save to database)
  citizensDatabase[citizenData.phone] = newCitizen;

  // Create session
  const sessionToken = generateSessionToken();
  sessionsStore[sessionToken] = {
    userId: newCitizen.id,
    sessionToken,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };

  return {
    success: true,
    message: "Registration successful!",
    data: {
      sessionToken,
      user: newCitizen,
    },
  };
};

/**
 * Verify session token
 */
export const verifySession = async (
  sessionToken: string
): Promise<AuthResponse> => {
  await simulateNetworkDelay();

  const session = sessionsStore[sessionToken];

  if (!session) {
    return {
      success: false,
      message: "Invalid session token",
      error: "INVALID_SESSION",
    };
  }

  if (session.expiresAt < Date.now()) {
    delete sessionsStore[sessionToken];
    return {
      success: false,
      message: "Session expired",
      error: "SESSION_EXPIRED",
    };
  }

  // Get user data
  const citizen = Object.values(citizensDatabase).find(
    (c) => c.id === session.userId
  );

  if (!citizen) {
    return {
      success: false,
      message: "User not found",
      error: "USER_NOT_FOUND",
    };
  }

  return {
    success: true,
    message: "Session valid",
    data: citizen,
  };
};

/**
 * Logout - invalidate session
 */
export const logout = async (sessionToken: string): Promise<AuthResponse> => {
  await simulateNetworkDelay();

  if (sessionsStore[sessionToken]) {
    delete sessionsStore[sessionToken];
  }

  return {
    success: true,
    message: "Logged out successfully",
  };
};

/**
 * Get all registered citizens (for admin)
 */
export const getAllCitizens = async (): Promise<AuthResponse> => {
  await simulateNetworkDelay();

  const citizens = Object.values(citizensDatabase);

  return {
    success: true,
    message: `Retrieved ${citizens.length} citizens`,
    data: {
      count: citizens.length,
      citizens,
    },
  };
};

/**
 * Get citizens by city (for admin)
 */
export const getCitizensByCity = async (city: string): Promise<AuthResponse> => {
  await simulateNetworkDelay();

  const citizens = Object.values(citizensDatabase).filter(
    (c) => c.city.toLowerCase() === city.toLowerCase()
  );

  return {
    success: true,
    message: `Retrieved ${citizens.length} citizens from ${city}`,
    data: {
      city,
      count: citizens.length,
      citizens,
    },
  };
};

/**
 * Update citizen profile
 */
export const updateCitizenProfile = async (
  phone: string,
  updates: Partial<CitizenProfile>
): Promise<AuthResponse> => {
  await simulateNetworkDelay();

  if (!phone || phone.length !== 10) {
    return {
      success: false,
      message: "Invalid phone number",
      error: "INVALID_PHONE",
    };
  }

  const citizen = citizensDatabase[phone];

  if (!citizen) {
    return {
      success: false,
      message: "Citizen not found",
      error: "CITIZEN_NOT_FOUND",
    };
  }

  // Update citizen data (exclude sensitive fields)
  const updatedCitizen = {
    ...citizen,
    ...updates,
    id: citizen.id, // Prevent ID change
    phone: citizen.phone, // Prevent phone change
    updatedAt: new Date().toISOString(),
  };

  citizensDatabase[phone] = updatedCitizen;

  return {
    success: true,
    message: "Profile updated successfully",
    data: updatedCitizen,
  };
};
