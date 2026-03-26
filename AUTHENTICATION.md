# Role-Based Authentication System

## Overview
The application features a secure, multi-level role-based authentication system with two main user types:
1. **Citizens/Users** - Access public services
2. **Department Admins** - Manage department operations

## System Architecture

### Authentication Context (AuthContext)
Located in `src/app/context/AuthContext.tsx`

Provides:
- User state management
- Login/Logout functionality
- Role-based access helpers
- Persistent authentication via localStorage

### Protected Routes
Located in `src/app/components/ProtectedRoute.tsx`

Two types of protected routes:
- `ProtectedRoute` - Requires user to be authenticated
- `AdminProtectedRoute` - Requires admin role and optional department verification

## User Roles & Departments

### User Role
- **Access**: Public service pages (Electricity, Water, Municipal, Transport)
- **Features**:
  - View service information
  - Submit applications
  - Track complaints
  - Pay bills
  - View notifications

### Admin Role (4 Departments)

#### 1. Electricity Department Admin
- **Route**: `/admin/electricity`
- **Test Credentials**:
  - Phone: Any 10-digit number
  - OTP: `123456`
  - Email: `admin@electricity.gov.in`
  - Password: `ElecAdmin@123`
- **Features**:
  - Manage electricity applications
  - Review complaints
  - Track new connections
  - Analytics dashboard

#### 2. Water Department Admin
- **Route**: `/admin/water`
- **Test Credentials**:
  - Phone: Any 10-digit number
  - OTP: `123456`
  - Email: `admin@water.gov.in`
  - Password: `WaterAdmin@123`
- **Features**:
  - Manage water bills
  - Review water complaints
  - Track new connections
  - Analytics dashboard

#### 3. Municipal Department Admin
- **Route**: `/admin/municipal`
- **Test Credentials**:
  - Phone: Any 10-digit number
  - OTP: `123456`
  - Email: `admin@municipal.gov.in`
  - Password: `MuncAdmin@123`
- **Features**:
  - Manage property tax
  - Review municipal complaints
  - Track applications
  - Analytics dashboard

#### 4. Transport Department Admin
- **Route**: `/admin/transport`
- **Test Credentials**:
  - Phone: Any 10-digit number
  - OTP: `123456`
  - Email: `admin@transport.gov.in`
  - Password: `TransAdmin@123`
- **Features**:
  - Manage vehicle registrations
  - Review transport complaints
  - Track licenses
  - Analytics dashboard

## Login Flow

### For Citizens/Users
1. Click "Citizen Login"
2. Enter 10-digit phone number
3. Receive & verify OTP (test: `123456`)
4. Automatically redirected to `/dashboard`

### For Admins
1. Click "Admin Login"
2. Enter 10-digit phone number
3. Verify OTP (test: `123456`)
4. Select department
5. Enter admin credentials (email auto-filled, enter password)
6. Redirected to department-specific admin dashboard

## Security Features

### Implemented
✅ **OTP-based verification** for initial authentication
✅ **Password protection** for admin access
✅ **Role-based access control** (RBAC)
✅ **Department-level isolation** - Admins only access their department
✅ **Protected routes** - Automatic redirection if not authenticated
✅ **Persistent authentication** - Stored in localStorage
✅ **Automatic logout capability** on all dashboards

### Environment Setup
- Test credentials are hardcoded for demo purposes
- In production, integrate with:
  - OTP service (Twilio, AWS SNS)
  - Authentication backend (JWT tokens)
  - Secure password hashing (bcrypt)
  - Database for credentials

## Usage Examples

### Using Auth Context
```tsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout, hasAdminAccess } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  if (user?.role === 'admin' && user.department === 'electricity') {
    // Show admin-only content
  }
  
  return (
    <button onClick={logout}>Logout</button>
  );
}
```

### Protecting Routes
```tsx
// In routes.tsx
import { ProtectedRoute, AdminProtectedRoute } from './components/ProtectedRoute';

function ProtectedDashboard() {
  return (
    <ProtectedRoute>
      <UserDashboard />
    </ProtectedRoute>
  );
}

function AdminPage() {
  return (
    <AdminProtectedRoute department="electricity">
      <ElectricityAdminDashboard />
    </AdminProtectedRoute>
  );
}
```

## File Structure
```
src/app/
├── context/
│   └── AuthContext.tsx          # Authentication state & logic
├── components/
│   └── ProtectedRoute.tsx       # Route protection components
├── pages/
│   ├── LoginPage.tsx            # Multi-step login UI
│   ├── AdminDashboard.tsx       # Generic admin dashboard
│   └── admin/
│       ├── ElectricityAdminDashboard.tsx
│       ├── WaterAdminDashboard.tsx
│       ├── MunicipalAdminDashboard.tsx
│       └── TransportAdminDashboard.tsx
├── App.tsx                      # Wrapped with AuthProvider
└── routes.tsx                   # All routes with protection
```

## Testing Checklist

### Citizen Flow
- [ ] Navigate to `/login`
- [ ] Click "Citizen Login"
- [ ] Enter any 10-digit phone number
- [ ] Enter OTP: `123456`
- [ ] Verify redirect to `/dashboard`
- [ ] Verify stored in localStorage

### Electricity Admin Flow
- [ ] Navigate to `/login`
- [ ] Click "Admin Login"
- [ ] Enter phone: `9876543210`
- [ ] Enter OTP: `123456`
- [ ] Click "Electricity" department
- [ ] Enter password: `ElecAdmin@123`
- [ ] Verify redirect to `/admin/electricity`

### Access Control
- [ ] Try accessing `/admin/electricity` without login (should redirect)
- [ ] Login as Water Admin, try accessing `/admin/electricity` (should redirect)
- [ ] Verify OTP input accepts only 6 digits
- [ ] Verify phone input accepts only 10 digits

### Data Persistence
- [ ] Login as user
- [ ] Refresh page (should stay logged in)
- [ ] Close tab and reopen (should stay logged in)
- [ ] Click logout (should clear data)

## Future Enhancements

1. **Backend Integration**
   - Connect to actual authentication API
   - Implement JWT tokens with expiry
   - Secure password hashing

2. **Admin Features**
   - Application approval workflows
   - Complaint resolution tracking
   - User role management
   - Audit logs

3. **Security**
   - Two-factor authentication
   - Session timeout
   - Account lockout after failed attempts
   - Email verification

4. **User Features**
   - Application history
   - Document upload
   - Push notifications
   - Payment gateway integration

## Support
For issues or questions about the authentication system, check the implementation in:
- `AuthContext.tsx` - Core logic
- `ProtectedRoute.tsx` - Access control
- `LoginPage.tsx` - UI flow
