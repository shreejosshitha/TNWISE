import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Translation resources will be loaded from public/locales/{{lng}}/{{ns}}.json
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en', // default
    supportedLngs: ['en', 'ta'],
    ns: ['common', 'landing', 'water', 'electricity'],
    defaultNS: 'common',
    debug: true, // remove in prod
    interpolation: {
      escapeValue: false // React handles escaping
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;

