import { Globe, Bell, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { TranslationButton } from "./TranslationButton";

interface HeaderProps {
  showAuth?: boolean;
}

export function Header({ showAuth = false }: HeaderProps) {
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ta" : "en";
    i18n.changeLanguage(newLang);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const emblem = (
    <div className="relative">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/8/81/TamilNadu_Logo.svg"
        alt="Tamil Nadu Government Emblem | தமிழ்நாடு அரசு சின்னம்"
        className="w-14 h-14 md:w-16 md:h-16 rounded-xl border-2 border-white/60 shadow-lg bg-white/90 p-1"
        loading="lazy"
      />
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl opacity-20 blur-sm"></div>
    </div>
  );

  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white shadow-2xl sticky top-0 z-50 border-b border-blue-400/30 backdrop-blur-sm" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Title Section */}
          <Link to={showAuth ? "/dashboard" : "/"} className="flex items-center gap-4 group" aria-label="Home">
            {emblem}
            <div className="text-left">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight group-hover:text-blue-200 transition-colors">
                {t('header.title')}
              </h1>
              <p className="text-sm md:text-base text-blue-200/80 font-medium">{t('header.subtitle')}</p>
            </div>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Translation Button - Hidden on mobile */}
            <div className="hidden lg:block">
              <TranslationButton
                text="Welcome to Tamil Nadu Public Services"
                targetLanguage="ta"
                sourceLanguage="en"
                variant="ghost"
                size="sm"
                className="text-white/90 hover:text-white hover:bg-white/10 border-white/20"
              />
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              aria-label={`Switch to ${t('language.ta')}`}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">{t(`language.${i18n.language}`)}</span>
              <span className="sm:hidden text-sm">{i18n.language.toUpperCase()}</span>
            </button>

            {showAuth ? (
              <div className="flex items-center gap-2">
                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="relative p-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 group"
                  aria-label={t('header.notifications')}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-bold animate-pulse" aria-hidden="true">3</span>
                </Link>

                {/* Profile */}
                <Link
                  to="/profile"
                  className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                  aria-label={t('header.profile')}
                >
                  <User className="w-5 h-5" />
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="p-2 bg-red-500/80 hover:bg-red-600 border border-red-400/50 hover:border-red-400 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                  aria-label={t('header.logout')}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                aria-label="Citizen Login - Touch to Start"
              >
                <span className="hidden sm:inline">{t('header.start')}</span>
                <span className="sm:hidden">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Subtle bottom border gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
    </header>
  );
}

