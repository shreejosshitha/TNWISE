import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { UserDashboard } from "./pages/UserDashboard";
import { ElectricityHome } from "./pages/electricity/ElectricityHome";
import { BillPayment } from "./pages/electricity/BillPayment";
import { NewConnection } from "./pages/electricity/NewConnection";
import { TransparencyTracker } from "./pages/electricity/TransparencyTracker";
import { ElectricityComplaint } from "./pages/electricity/ElectricityComplaint";
import { ElectricityTracking } from "./pages/electricity/ElectricityTracking";
import { WaterHome } from "./pages/water/WaterHome";
import { WaterBillPayment } from "./pages/water/WaterBillPayment";
import { WaterNewConnection } from "./pages/water/WaterNewConnection";
import { WaterComplaint } from "./pages/water/WaterComplaint";
import { WaterTracking } from "./pages/water/WaterTracking";
import { MunicipalHome } from "./pages/municipal/MunicipalHome";
import { MunicipalComplaint } from "./pages/municipal/MunicipalComplaint";
import { PropertyTax } from "./pages/municipal/PropertyTax";
import { MunicipalTracking } from "./pages/municipal/MunicipalTracking";
import { NotificationsPage } from "./pages/NotificationsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { NotFound } from "./pages/NotFound";
import { ElectricityAdminDashboard } from "./pages/admin/ElectricityAdminDashboard";
import { WaterAdminDashboard } from "./pages/admin/WaterAdminDashboard";
import { MunicipalAdminDashboard } from "./pages/admin/MunicipalAdminDashboard";
import { TransportAdminDashboard } from "./pages/admin/TransportAdminDashboard";
import { MunicipalComplaintDetails } from "./pages/admin/MunicipalComplaintDetails";
import { ProtectedRoute, AdminProtectedRoute } from "./components/ProtectedRoute";

// Wrapper components for protected routes
function ProtectedUserDashboard() {
  return (
    <ProtectedRoute>
      <UserDashboard />
    </ProtectedRoute>
  );
}

function ProtectedElectricityAdminDashboard() {
  return (
    <AdminProtectedRoute department="electricity">
      <ElectricityAdminDashboard />
    </AdminProtectedRoute>
  );
}

function ProtectedWaterAdminDashboard() {
  return (
    <AdminProtectedRoute department="water">
      <WaterAdminDashboard />
    </AdminProtectedRoute>
  );
}

function ProtectedMunicipalAdminDashboard() {
  return (
    <AdminProtectedRoute department="municipal">
      <MunicipalAdminDashboard />
    </AdminProtectedRoute>
  );
}

function ProtectedTransportAdminDashboard() {
  return (
    <AdminProtectedRoute department="transport">
      <TransportAdminDashboard />
    </AdminProtectedRoute>
  );
}

function ProtectedAdminDashboard() {
  return (
    <AdminProtectedRoute>
      <AdminDashboard />
    </AdminProtectedRoute>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/dashboard",
    Component: ProtectedUserDashboard,
  },
  {
    path: "/electricity",
    Component: ElectricityHome,
  },
  {
    path: "/electricity/bill-payment",
    Component: BillPayment,
  },
  {
    path: "/electricity/new-connection",
    Component: NewConnection,
  },
  {
    path: "/electricity/tracker/:id",
    Component: TransparencyTracker,
  },
  {
    path: "/electricity/complaint",
    Component: ElectricityComplaint,
  },
  {
    path: "/electricity/tracking",
    Component: ElectricityTracking,
  },
  {
    path: "/water",
    Component: WaterHome,
  },
  {
    path: "/water/bill-payment",
    Component: WaterBillPayment,
  },
  {
    path: "/water/new-connection",
    Component: WaterNewConnection,
  },
  {
    path: "/water/complaint",
    Component: WaterComplaint,
  },
  {
    path: "/water/tracking",
    Component: WaterTracking,
  },
  {
    path: "/municipal",
    Component: MunicipalHome,
  },
  {
    path: "/municipal/complaint",
    Component: MunicipalComplaint,
  },
  {
    path: "/municipal/property-tax",
    Component: PropertyTax,
  },
  {
    path: "/municipal/tracking",
    Component: MunicipalTracking,
  },
  {
    path: "/notifications",
    Component: NotificationsPage,
  },
  {
    path: "/profile",
    Component: ProfilePage,
  },
  {
    path: "/admin",
    Component: ProtectedAdminDashboard,
  },
  {
    path: "/admin/electricity",
    Component: ProtectedElectricityAdminDashboard,
  },
  {
    path: "/admin/water",
    Component: ProtectedWaterAdminDashboard,
  },
  {
    path: "/admin/municipal",
    Component: ProtectedMunicipalAdminDashboard,
  },
  {
    path: "/admin/municipal-complaint/:id",
    Component: () => (
      <AdminProtectedRoute department="municipal">
        <MunicipalComplaintDetails />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/transport",
    Component: ProtectedTransportAdminDashboard,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);

