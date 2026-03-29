import { createBrowserRouter } from "react-router-dom";

import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { UserDashboard } from "./pages/UserDashboard";
import { ElectricityHome } from "./pages/electricity/ElectricityHome";
import { BillPayment } from "./pages/electricity/BillPayment";
import { NewConnection } from "./pages/electricity/NewConnection";
import { TransparencyTracker } from "./pages/electricity/TransparencyTracker";
import { ElectricityComplaint } from "./pages/electricity/ElectricityComplaint";
import { ElectricityTracking } from "./pages/electricity/ElectricityTracking";
import { EnergyCalculator } from "./pages/electricity/EnergyCalculator";
import { WaterHome } from "./pages/water/WaterHome";
import { WaterBillPayment } from "./pages/water/WaterBillPayment";
import { WaterNewConnection } from "./pages/water/WaterNewConnection";
import { WaterComplaint } from "./pages/water/WaterComplaint";
import { WaterTracking } from "./pages/water/WaterTracking";
import { WaterUsageCalculator } from "./pages/water/WaterUsageCalculator";
import { WaterTransparencyTracker } from "./pages/water/TransparencyTracker";

function ProtectedWaterHome() {
  return (
    <ProtectedRoute>
      <WaterHome />
    </ProtectedRoute>
  );
}

function ProtectedWaterBillPayment() {
  return (
    <ProtectedRoute>
      <WaterBillPayment />
    </ProtectedRoute>
  );
}

function ProtectedWaterNewConnection() {
  return (
    <ProtectedRoute>
      <WaterNewConnection />
    </ProtectedRoute>
  );
}

function ProtectedWaterComplaint() {
  return (
    <ProtectedRoute>
      <WaterComplaint />
    </ProtectedRoute>
  );
}

function ProtectedWaterTracking() {
  return (
    <ProtectedRoute>
      <WaterTracking />
    </ProtectedRoute>
  );
}

function ProtectedWaterUsageCalculator() {
  return (
    <ProtectedRoute>
      <WaterUsageCalculator />
    </ProtectedRoute>
  );
}

function ProtectedWaterTransparencyTracker() {
  return (
    <ProtectedRoute>
      <WaterTransparencyTracker />
    </ProtectedRoute>
  );
}

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

import { RootLayout } from './layout/RootLayout';
// import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    basename: "/",
    path: "/",
    errorElement: <NotFound />,
    element: <RootLayout />,
    children: [
      {
        index: true,
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
    path: "/electricity/calculator",
    Component: EnergyCalculator,
  },
  {
    path: "/water",
    Component: ProtectedWaterHome,
  },
  {
    path: "/water/bill-payment",
    Component: ProtectedWaterBillPayment,
  },
  {
    path: "/water/new-connection",
    Component: ProtectedWaterNewConnection,
  },
  {
    path: "/water/complaint",
    Component: ProtectedWaterComplaint,
  },
  {
    path: "/water/tracking",
    Component: ProtectedWaterTracking,
  },
  {
    path: "/water/calculator",
    Component: ProtectedWaterUsageCalculator,
  },
  {
    path: "/water/transparency",
    Component: ProtectedWaterTransparencyTracker,
  },
  {
    path: "/water/tracker/:id",
    Component: ProtectedWaterTransparencyTracker,
  },

  {
    path: "/municipal",
    Component: () => (
      <ProtectedRoute>
        <MunicipalHome />
      </ProtectedRoute>
    ),
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
  ],
  },
]);

