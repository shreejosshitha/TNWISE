import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
}
