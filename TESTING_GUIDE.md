# Quick Start - Authentication Testing

## Get Started Quickly

### 1. Access the Application
- Open http://localhost:5173/login in your browser

### 2. Test as Citizen User

**Step 1**: Click "Citizen Login"
- Enter any 10-digit number (e.g., 9876543210)
- Click "Send OTP"

**Step 2**: Enter OTP
- Enter: `123456`
- Click "Verify OTP"

**Result**: Redirected to `/dashboard`

---

## 3. Test as Department Admin

### Electricity Admin

**Step 1**: Click "Admin Login"
- Enter phone: `9876543210`
- Click "Send OTP"

**Step 2**: Verify OTP
- Enter: `123456`
- Click "Verify OTP"

**Step 3**: Select Department
- Click "⚡ Electricity"

**Step 4**: Login with Credentials
- Email: `admin@electricity.gov.in` (pre-filled)
- Password: `ElecAdmin@123`
- Click "Login"

**Result**: Redirected to Electricity Admin Dashboard at `/admin/electricity`

---

### Water Admin

Same flow, but:
- Select "💧 Water" in Step 3
- Password: `WaterAdmin@123`
- Email: `admin@water.gov.in`

Result: `/admin/water`

---

### Municipal Admin

Same flow, but:
- Select "🏛️ Municipal" in Step 3
- Password: `MuncAdmin@123`
- Email: `admin@municipal.gov.in`

Result: `/admin/municipal`

---

### Transport Admin

Same flow, but:
- Select "🚌 Transport" in Step 3
- Password: `TransAdmin@123`
- Email: `admin@transport.gov.in`

Result: `/admin/transport`

---

## Quick Reference - Test Credentials

| Department | Phone | OTP | Password |
|-----------|-------|-----|----------|
| Any | 9876543210 | 123456 | See below |
| Electricity | Any 10-digit | 123456 | ElecAdmin@123 |
| Water | Any 10-digit | 123456 | WaterAdmin@123 |
| Municipal | Any 10-digit | 123456 | MuncAdmin@123 |
| Transport | Any 10-digit | 123456 | TransAdmin@123 |

---

## Key Features to Test

### Security
- ✅ Try to access `/admin/electricity` without login → redirects to `/login`
- ✅ Login as Water Admin, try accessing `/admin/electricity` → redirects to `/admin`
- ✅ Click "Logout" button on any admin dashboard
- ✅ Refresh page after login → stays logged in (localStorage)

### UI/UX
- ✅ Phone number input limits to 10 digits
- ✅ OTP input limits to 6 digits
- ✅ Password field has show/hide toggle
- ✅ Back buttons work to go to previous step
- ✅ Error messages for invalid credentials
- ✅ Success toasts for successful login

### Admin Dashboards
Each admin dashboard shows:
- Statistics cards (Applications, Complaints, Resolved cases)
- Quick actions menu
- Recent applications with status
- Logout button
- Personalized welcome message

---

## Troubleshooting

**Q: Wrong password message appears**
- A: Make sure you're using the exact password for your department (check table above)

**Q: Still seeing login page after successful login**
- A: The redirect happens automatically. If not, check browser console for errors

**Q: "Cannot find imported admin dashboard"**
- A: Make sure all admin dashboard files exist in `src/app/pages/admin/`

**Q: localStorage data persists after refreshing**
- A: This is intentional! Users stay logged in. Click logout to clear.

---

## Dev Notes

### Modify Test Credentials
In `src/app/pages/LoginPage.tsx`, find:
```tsx
const adminCredentials: Record<Department, { name: string; password: string }> = {
  electricity: { name: "Electricity Admin", password: "ElecAdmin@123" },
  // ... modify passwords here
};
```

### Modify Test OTP
In LoginPage, find:
```tsx
if (otp === "123456") {
  // accept OTP
}
```
Change `"123456"` to whatever you want.

### Implement Real Authentication
Replace:
1. OTP verification with actual SMS service
2. Password check with backend API call
3. localStorage with JWT tokens
4. Phone number validation with real database

---

## Next Steps

1. **Test the login flow** using credentials above
2. **Try accessing unauthorized routes** - should redirect
3. **Check admin dashboards** - each department has unique styling
4. **Review code structure** in `AUTHENTICATION.md`
5. **Integrate with backend** when ready for production
