# Electricity Session Token Fix TODO - ROOT CAUSE: NO AUTH ROUTES!

**Status:** 🔧 Ready to Fix

**CRITICAL:** src/backend/server.ts has NO /api/auth routes!
LoginPage imports backend/authService directly → Browser fails!

## Analysis ✅
- [x] LoginPage stores sessionToken from verifyOTP()
- [x] authService.verifyOTP() returns {sessionToken, user} ✅ 
- [x] server.ts authMiddleware + electricity routes ✅ 
- [❌] **No /api/auth/send-otp /api/auth/verify-otp routes**
- [❌] Frontend can't import Node.js backend modules

## Fix Plan:
1. **Add auth routes to server.ts:**
   ```
   POST /api/auth/send-otp
   POST /api/auth/verify-otp  
   POST /api/auth/logout
   ```

2. **Create src/app/services/authApi.ts** (API client)

3. **Update LoginPage.tsx:** Replace imports → authApi calls

4. **Start backend:** `cd src/backend && tsx server.ts`

5. **Test:** Login → Electricity → Submit Application ✅

**Commands:**
```
1. Backend: cd src/backend && tsx server.ts
2. Frontend: npm run dev  
3. Login (Demo OTP shown) → NewConnection → Submit
```

**✅ Step 1 Complete:** Auth routes added to server.ts!

**Next Steps:**
1. [ ] Fix LoginPage.tsx: Replace direct authService imports → fetch('/api/auth/*')
2. [ ] Create src/app/services/authApi.ts (optional)
3. [ ] Start backend: cd src/backend && tsx server.ts  
4. [ ] Test Login → Submit Application

