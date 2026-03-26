# Backend Testing Guide - Citizen Login

## Quick Start

### Test Credentials Summary

| Phone | Name | City | Email |
|-------|------|------|-------|
| 9876543210 | Rajesh Kumar | Chennai | rajesh.kumar@email.com |
| 9123456789 | Priya Patel | Bangalore | priya.patel@email.com |
| 8765432109 | Amit Singh | Bangalore | amit.singh@email.com |
| 7654321098 | Sneha Desai | Bangalore | sneha.desai@email.com |
| 6543210987 | Vijay Kumar | Bangalore | vijay.kumar@email.com |

**Default Demo OTP**: 123456 (or check the UI for the displayed OTP)

---

## Test Scenario 1: Citizen Login - Rajesh Kumar

### Steps:
1. Click on **"Citizen Login"** button
2. Enter Phone: **9876543210**
3. Click **"Send OTP"**
4. Use Demo OTP: **123456** (shown on screen)
5. Click **"Verify OTP"**
6. ✅ Success! Redirected to Dashboard

### Expected Profile Data:
```
Name: Rajesh Kumar
Email: rajesh.kumar@email.com
Phone: 9876543210
Aadhar: 1234-5678-9012
City: Chennai, Tamil Nadu
Address: 123, Anna Nagar

Services:
- Electricity: TN10001234567 (Active)
- Water: WN10001234567 (Active)
- Municipal: MUN10001234567 (Active)
- Transport: TN09AB1234 (Active)

KYC Status: Verified ✓
```

---

## Test Scenario 2: Citizen Login - New User

### Steps:
1. Click on **"Citizen Login"** button
2. Enter Phone: **9000000000** (any unregistered number)
3. Click **"Send OTP"**
4. Use Demo OTP: **123456**
5. Click **"Verify OTP"**
6. ✅ Redirected to Registration page

### Expected Behavior:
- System recognizes it as new user
- Prompts for complete profile registration

---

## Test Scenario 3: Admin Login

### Steps:
1. Click on **"Admin Login"** button
2. Enter Phone: **9876543210** (admin phone)
3. Click **"Send OTP"**
4. Use Demo OTP: **123456**
5. Click **"Verify OTP"**
6. Select Department: **"Electricity"** (or any department)
7. Enter Credentials:
   - Email: `admin@electricity.gov.in` (auto-filled)
   - Password: **ElecAdmin@123**
8. Click **"Login"**
9. ✅ Redirected to Admin Dashboard

### Admin Credentials:

| Department | Email | Password |
|-----------|-------|----------|
| Electricity | admin@electricity.gov.in | ElecAdmin@123 |
| Water | admin@water.gov.in | WaterAdmin@123 |
| Municipal | admin@municipal.gov.in | MuncAdmin@123 |
| Transport | admin@transport.gov.in | TransAdmin@123 |

---

## Test Scenario 4: Invalid OTP

### Steps:
1. Click on **"Citizen Login"**
2. Enter Phone: **9876543210**
3. Click **"Send OTP"**
4. Enter Invalid OTP: **000000**
5. Click **"Verify OTP"**
6. ❌ Error: "Invalid OTP. 2 attempts remaining."
7. Try again with correct OTP: **123456**
8. ✅ Login successful on 2nd attempt

### Expected Behavior:
- System allows 3 attempts per OTP
- Provides remaining attempts count
- After 3 failed attempts, requires new OTP

---

## Test Scenario 5: OTP Expiration

### Steps:
1. Click on **"Citizen Login"**
2. Enter Phone: **9876543210**
3. Click **"Send OTP"**
4. Wait for 10 minutes (OTP expiration time)
5. Try to enter/verify OTP
6. ❌ Error: "OTP has expired. Please request a new OTP."
7. Click **"Back"** to request new OTP

**Note**: In development/testing, you can modify the TTL in `src/backend/database.ts`

---

## Test Scenario 6: Invalid Phone Number

### Steps:
1. Click on **"Citizen Login"**
2. Enter Phone: **123** (less than 10 digits)
3. "Send OTP" button remains **disabled**
4. Enter Phone: **12345678901** (more than 10 digits)
5. Input automatically limits to **10 digits**

### Expected Behavior:
- Only allows exactly 10 digits
- "Send OTP" button only enabled with valid input

---

## Test Scenario 7: View User Profile After Login

### Steps:
1. Login successfully (use any test phone number)
2. Go to **/profile** or **Profile** page
3. View citizen information:
   - Personal details (name, email, phone, etc.)
   - Address and location
   - Service connections
   - KYC verification status
   - Document status

### Expected Data:
All fields should match the database record for the logged-in citizen

---

## Test Scenario 8: Service Connections

### Steps:
1. Login as **Rajesh Kumar** (9876543210)
2. Navigate to **Electricity Service**
3. View Bill Payment page
4. Check Consumer Number: **TN10001234567**
5. Fetch bill details (should auto-populate from profile)
6. Repeat for Water, Municipal, Transport services

### Expected Behavior:
- Consumer numbers automatically populate from citizen profile
- All active services are accessible
- Inactive services show appropriate status

---

## Testing Checklist

### Authentication Flow
- [ ] Send OTP for registered user
- [ ] Send OTP for new user
- [ ] Verify OTP with correct code
- [ ] Reject OTP with incorrect code
- [ ] Reject after 3 failed attempts
- [ ] Handle OTP expiration
- [ ] Validate phone number format
- [ ] Handle network errors gracefully

### Profile Retrieval
- [ ] Display citizen full profile after login
- [ ] Show all service connections
- [ ] Display KYC verification status
- [ ] Show document verification status
- [ ] Display personal information correctly

### Session Management
- [ ] Create session after successful login
- [ ] Maintain session across pages
- [ ] Logout clears session
- [ ] Invalid/expired session redirects to login

### Error Handling
- [ ] Network error messages
- [ ] Invalid input validation
- [ ] User not found handling
- [ ] Session expired handling
- [ ] Duplicate registration prevention

### UI/UX
- [ ] Loading states during API calls
- [ ] Demo OTP displayed on screen
- [ ] Error messages clear and helpful
- [ ] Success notifications shown
- [ ] Buttons disabled appropriately
- [ ] Responsive design on mobile

---

## API Response Examples

### Successful Login Response
```json
{
  "success": true,
  "message": "Login successful!",
  "data": {
    "sessionToken": "session_1711353821245_a1b2c3d4e",
    "user": {
      "id": "citizen_001",
      "phone": "9876543210",
      "name": "Rajesh Kumar",
      "email": "rajesh.kumar@email.com",
      "services": {
        "electricity": {
          "consumerNumber": "TN10001234567",
          "status": "active"
        }
      },
      "kyc": {
        "verified": true,
        "verificationDate": "2015-03-20"
      }
    }
  }
}
```

### OTP Send Response
```json
{
  "success": true,
  "message": "OTP sent to 9876543210. (Demo OTP: 123456)",
  "data": {
    "phone": "9876543210",
    "citizenName": "Rajesh Kumar",
    "demoOTP": "123456"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid OTP. 2 attempts remaining.",
  "error": "INVALID_OTP"
}
```

---

## Debugging Tips

### Check Browser Console
```javascript
// View all stored sessions
console.log(sessionsStore);

// View OTP storage
console.log(otpStore);

// Check citizen database
console.log(citizensDatabase);
```

### Common Issues

1. **OTP Not Displaying**
   - Check if "Send OTP" button was clicked
   - Verify phone number is 10 digits
   - Look for the blue demo OTP text

2. **Login Loop**
   - Clear localStorage: `localStorage.clear()`
   - Check if session is expired
   - Verify browser cookies are enabled

3. **Profile Not Loading**
   - Check if user exists in database
   - Verify session token is valid
   - Check browser network tab for API response

### Network Tab Inspection
1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Filter by **Fetch** requests
4. Look for API calls to `authService`
5. Check response status and data

---

## Performance Notes

- OTP verification: ~800ms (simulated network delay)
- Profile retrieval: ~800ms (simulated network delay)
- Registration: ~1500ms (simulated network delay)

These delays simulate real API calls and can be adjusted in `src/backend/authService.ts`

---

## Production Considerations

For production deployment:

1. **Replace Mock Backend**
   - Use real database (MongoDB, PostgreSQL, etc.)
   - Implement actual SMS/Email OTP delivery
   - Add rate limiting and DDoS protection

2. **Security**
   - Implement HTTPS/TLS
   - Use secure session tokens (JWT)
   - Hash and salt passwords
   - Implement 2FA

3. **Monitoring**
   - Add audit logging
   - Track failed login attempts
   - Monitor OTP delivery
   - Alert on suspicious activity

4. **Compliance**
   - GDPR compliance for EU users
   - Data protection regulations
   - Right to be forgotten
   - Consent management
