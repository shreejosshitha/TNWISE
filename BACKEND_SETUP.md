# Backend Authentication System - Smart Public Services

## Overview

The backend authentication system provides secure citizen login with OTP-based verification and centralized citizen profile management. Each citizen has their own unique profile with service connection details.

## Architecture

### Components

1. **Database Layer** (`src/backend/database.ts`)
   - Citizens database with mock data
   - OTP storage and management
   - Session management
   - Utility functions for OTP and session token generation

2. **Authentication Service** (`src/backend/authService.ts`)
   - OTP management (send, verify, validate)
   - Citizen authentication
   - Profile retrieval and updates
   - Session token management
   - New citizen registration

3. **Login Page Integration** (`src/app/pages/LoginPage.tsx`)
   - Citizen login flow
   - Admin login flow
   - Integration with backend services
   - Loading states and error handling

## Sample Users for Testing

The system comes with 5 pre-registered citizens:

### 1. **Rajesh Kumar**
- **Phone**: 9876543210
- **Email**: rajesh.kumar@email.com
- **City**: Chennai, Tamil Nadu
- **Aadhar**: 1234-5678-9012
- **Services**:
  - Electricity: TN10001234567 (Active)
  - Water: WN10001234567 (Active)
  - Municipal: MUN10001234567 (Active)
  - Transport: TN09AB1234 (Active)

### 2. **Priya Patel**
- **Phone**: 9123456789
- **Email**: priya.patel@email.com
- **City**: Bangalore, Karnataka
- **Aadhar**: 2345-6789-0123
- **Services**:
  - Electricity: KA20001234567 (Active)
  - Water: WN20001234567 (Active)
  - Municipal: MUN20001234567 (Active)

### 3. **Amit Singh**
- **Phone**: 8765432109
- **Email**: amit.singh@email.com
- **City**: Bangalore, Karnataka
- **Aadhar**: 3456-7890-1234
- **Services**:
  - Electricity: KA20002345678 (Active)
  - Municipal: MUN20002345678 (Active)

### 4. **Sneha Desai**
- **Phone**: 7654321098
- **Email**: sneha.desai@email.com
- **City**: Bangalore, Karnataka
- **Aadhar**: 4567-8901-2345
- **Services**:
  - Electricity: KA20003456789 (Active)
  - Water: WN20003456789 (Active)
  - Transport: KA05CD5678 (Active)

### 5. **Vijay Kumar**
- **Phone**: 6543210987
- **Email**: vijay.kumar@email.com
- **City**: Bangalore, Karnataka
- **Aadhar**: 5678-9012-3456
- **Services**:
  - Electricity: KA20004567890 (Active)
  - Water: WN20004567890 (Active)
  - Municipal: MUN20004567890 (Active)

## How to Test

### Step 1: Start the Application
```bash
npm install
npm run dev
```

### Step 2: Go to Login Page
Navigate to the login page and select "Citizen Login"

### Step 3: Enter Phone Number
Enter any of the test phone numbers from the sample users list (e.g., 9876543210)

### Step 4: Verify OTP
- Click "Send OTP"
- The system will display a demo OTP on the page
- Enter the demo OTP (typically 123456 or shown in the UI)
- Click "Verify OTP"

### Step 5: Access Dashboard
After successful login, you'll be redirected to your personalized dashboard with:
- Your profile information
- Service connection details
- Access to all applicable services

## API Functions

### `sendOTP(phone: string)`
Sends OTP to the citizen's phone number
- **Parameters**: phone (10-digit string)
- **Returns**: `AuthResponse` with demo OTP for testing

### `verifyOTP(phone: string, otp: string)`
Verifies the OTP and creates session
- **Parameters**: phone, otp (6-digit string)
- **Returns**: `LoginResponse` with user data and session token

### `getCitizenProfile(phone: string)`
Retrieves citizen profile information
- **Parameters**: phone (10-digit string)
- **Returns**: `AuthResponse` with complete citizen profile

### `registerCitizen(citizenData: Partial<CitizenProfile>)`
Registers a new citizen
- **Parameters**: Citizen registration data
- **Returns**: `LoginResponse` with created user profile

### `updateCitizenProfile(phone: string, updates: Partial<CitizenProfile>)`
Updates existing citizen profile
- **Parameters**: phone, update data
- **Returns**: `AuthResponse` with updated profile

### `verifySession(sessionToken: string)`
Verifies if session is still valid
- **Parameters**: sessionToken from login
- **Returns**: `AuthResponse` with user data

### `logout(sessionToken: string)`
Invalidates user session
- **Parameters**: sessionToken
- **Returns**: `AuthResponse` with success status

## Citizen Profile Structure

```typescript
interface CitizenProfile {
  id: string;
  phone: string;
  name: string;
  email: string;
  aadhar: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  dateOfBirth: string;
  gender: string;
  profilePhoto?: string;
  services: {
    electricity?: { consumerNumber: string; status: string; connectionDate: string };
    water?: { consumerNumber: string; status: string; connectionDate: string };
    municipal?: { propertyId: string; status: string; registrationDate: string };
    transport?: { rtcNumber: string; status: string; issuedDate: string };
  };
  kyc: {
    verified: boolean;
    documents: { aadhar: boolean; pan?: boolean; license?: boolean };
  };
  createdAt: string;
  updatedAt: string;
}
```

## Key Features

✅ **OTP-based Authentication**
- 10-minute OTP expiration
- 3 attempts max per OTP
- Real-time OTP display for testing

✅ **Citizen Profiles**
- Comprehensive profile information
- Multiple service connections per citizen
- KYC verification status

✅ **Service Integration**
- Electricity connection tracking
- Water supply management
- Municipal property records
- Transport/License information

✅ **Session Management**
- Secure session tokens
- 24-hour session expiration
- Automatic session invalidation

✅ **Admin Features**
- Retrieve all citizens
- Filter citizens by city
- Full citizen profile access
- Update citizen information

## Security Considerations

For production implementation:

1. **Move to Database**: Replace in-memory storage with actual database
2. **Hash Passwords**: Use bcrypt or similar for password hashing
3. **Backend Validation**: Implement actual OTP delivery via SMS/Email
4. **HTTPS Only**: Ensure all communications are encrypted
5. **Rate Limiting**: Prevent brute force attacks
6. **Token Refresh**: Implement refresh token mechanism
7. **Audit Logging**: Track all authentication events

## Future Enhancements

- Multi-factor authentication (2FA)
- Social login integration
- Biometric authentication
- Email-based registration
- Password recovery flow
- Account linking across services
- Role-based access control (RBAC)
- Activity logging and analytics

## Troubleshooting

### OTP Not Appearing
- Ensure you've clicked "Send OTP"
- Check browser console for errors
- Verify phone number is in correct format (10 digits)

### Login Fails
- Confirm you're using a registered test phone number
- Verify OTP is entered correctly
- Clear browser cache/sessionStorage if issues persist

### Profile Not Loading
- Check network connectivity
- Verify user is properly authenticated
- Check browser console for API errors
