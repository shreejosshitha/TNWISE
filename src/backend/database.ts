// Citizens Database
export interface CitizenProfile {
  id: string;
  phone: string;
  name: string;
  email: string;
  aadhar: string;
  password?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  dateOfBirth: string;
  gender: string;
  profilePhoto?: string;
  services: {
    electricity?: {
      consumerNumber: string;
      status: "active" | "inactive";
      connectionDate: string;
    };
    water?: {
      consumerNumber: string;
      status: "active" | "inactive";
      connectionDate: string;
    };
    municipal?: {
      propertyId: string;
      status: "active" | "inactive";
      registrationDate: string;
    };
    transport?: {
      rtcNumber: string;
      status: "active" | "inactive";
      issuedDate: string;
    };
  };
  kyc: {
    verified: boolean;
    verificationDate?: string;
    documents: {
      aadhar: boolean;
      pan?: boolean;
      license?: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

// Mock Citizens Database
export const citizensDatabase: Record<string, CitizenProfile> = {
  "9876543210": {
    id: "citizen_001",
    phone: "9876543210",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    aadhar: "1234-5678-9012",
    address: "123, Anna Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600040",
    dateOfBirth: "1985-05-15",
    gender: "Male",
    services: {
      electricity: {
        consumerNumber: "TN10001234567",
        status: "active",
        connectionDate: "2015-03-20",
      },
      water: {
        consumerNumber: "WN10001234567",
        status: "active",
        connectionDate: "2015-03-20",
      },
      municipal: {
        propertyId: "MUN10001234567",
        status: "active",
        registrationDate: "2015-03-20",
      },
      transport: {
        rtcNumber: "TN09AB1234",
        status: "active",
        issuedDate: "2020-06-15",
      },
    },
    kyc: {
      verified: true,
      verificationDate: "2015-03-20",
      documents: {
        aadhar: true,
        pan: true,
        license: true,
      },
    },
    createdAt: "2015-03-20",
    updatedAt: "2026-03-20",
  },
  "9123456789": {
    id: "citizen_002",
    phone: "9123456789",
    name: "Priya Patel",
    email: "priya.patel@email.com",
    aadhar: "2345-6789-0123",
    address: "456, Koramangala",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560034",
    dateOfBirth: "1988-12-22",
    gender: "Female",
    services: {
      electricity: {
        consumerNumber: "KA20001234567",
        status: "active",
        connectionDate: "2018-07-10",
      },
      water: {
        consumerNumber: "WN20001234567",
        status: "active",
        connectionDate: "2018-07-10",
      },
      municipal: {
        propertyId: "MUN20001234567",
        status: "active",
        registrationDate: "2018-07-10",
      },
    },
    kyc: {
      verified: true,
      verificationDate: "2018-07-10",
      documents: {
        aadhar: true,
        pan: true,
      },
    },
    createdAt: "2018-07-10",
    updatedAt: "2026-03-20",
  },
  "8765432109": {
    id: "citizen_003",
    phone: "8765432109",
    name: "Amit Singh",
    email: "amit.singh@email.com",
    aadhar: "3456-7890-1234",
    address: "789, Malleswaram",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560003",
    dateOfBirth: "1990-08-30",
    gender: "Male",
    services: {
      electricity: {
        consumerNumber: "KA20002345678",
        status: "active",
        connectionDate: "2020-02-05",
      },
      municipal: {
        propertyId: "MUN20002345678",
        status: "active",
        registrationDate: "2020-02-05",
      },
    },
    kyc: {
      verified: true,
      verificationDate: "2020-02-05",
      documents: {
        aadhar: true,
      },
    },
    createdAt: "2020-02-05",
    updatedAt: "2026-03-20",
  },
  "7654321098": {
    id: "citizen_004",
    phone: "7654321098",
    name: "Sneha Desai",
    email: "sneha.desai@email.com",
    aadhar: "4567-8901-2345",
    address: "321, MG Road",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    dateOfBirth: "1992-03-18",
    gender: "Female",
    services: {
      electricity: {
        consumerNumber: "KA20003456789",
        status: "active",
        connectionDate: "2019-11-12",
      },
      water: {
        consumerNumber: "WN20003456789",
        status: "active",
        connectionDate: "2019-11-12",
      },
      transport: {
        rtcNumber: "KA05CD5678",
        status: "active",
        issuedDate: "2018-09-20",
      },
    },
    kyc: {
      verified: true,
      verificationDate: "2019-11-12",
      documents: {
        aadhar: true,
        pan: true,
        license: true,
      },
    },
    createdAt: "2019-11-12",
    updatedAt: "2026-03-20",
  },
  "6543210987": {
    id: "citizen_005",
    phone: "6543210987",
    name: "Vijay Kumar",
    email: "vijay.kumar@email.com",
    aadhar: "5678-9012-3456",
    address: "654, Whitefield",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560066",
    dateOfBirth: "1987-07-25",
    gender: "Male",
    services: {
      electricity: {
        consumerNumber: "KA20004567890",
        status: "active",
        connectionDate: "2016-05-08",
      },
      water: {
        consumerNumber: "WN20004567890",
        status: "active",
        connectionDate: "2016-05-08",
      },
      municipal: {
        propertyId: "MUN20004567890",
        status: "active",
        registrationDate: "2016-05-08",
      },
    },
    kyc: {
      verified: true,
      verificationDate: "2016-05-08",
      documents: {
        aadhar: true,
        pan: true,
      },
    },
    createdAt: "2016-05-08",
    updatedAt: "2026-03-20",
  },
};

// OTP Storage (in-memory)
export const otpStore: Record<string, { code: string; expiresAt: number; attempts: number }> = {};

// Generate Random OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Sessions Storage
export const sessionsStore: Record<string, { userId: string; sessionToken: string; expiresAt: number }> = {};

// Generate Session Token
export const generateSessionToken = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
