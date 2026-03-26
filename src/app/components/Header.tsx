import { Globe, Bell, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";

interface HeaderProps {
  showAuth?: boolean;
}

export function Header({ showAuth = false }: HeaderProps) {
  const [language, setLanguage] = useState<"en" | "ta">("en");
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "ta" : "en");
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to={showAuth ? "/dashboard" : "/"} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🏛️</span>
            </div>
            <div>
              <h1 className="font-semibold text-lg text-gray-900">
                {language === "en" ? "Smart Public Services" : "ஸ்மார்ட் பொது சேவைகள்"}
              </h1>
              <p className="text-xs text-gray-600">
                {language === "en" ? "Government of Tamil Nadu" : "தமிழ்நாடு அரசு"}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Globe className="w-5 h-5 text-blue-600" />
              <span className="font-medium">{language === "en" ? "தமிழ்" : "English"}</span>
            </button>

            {showAuth ? (
              <>
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-700" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Link>

                <Link
                  to="/profile"
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <User className="w-5 h-5 text-gray-700" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                {language === "en" ? "Login" : "உள்நுழைய"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
