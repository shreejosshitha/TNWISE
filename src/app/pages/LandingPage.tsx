import { Header } from "../components/Header";
import { AIChatbot } from "../components/AIChatbot";
import { Link } from "react-router-dom";
import { Zap, Droplet, Building2, Globe, Users, Shield, Eye, Bot, Mic } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function LandingPage() {
  const { t } = useTranslation('landing');

  // Voice assistance state
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  // Check browser support and initialize recognition on mount
  const { i18n } = useTranslation('landing');
  
  useEffect(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const support = {
      speechRecognition: !!SpeechRecognition,
      speechSynthesis: 'speechSynthesis' in window
    };

    if (support.speechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = i18n.language === 'ta' ? 'ta-IN' : 'en-US';
      
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        processVoiceCommand(transcript);
        setIsListening(false);
      };
      
      rec.onend = () => {
        setIsListening(false);
      };
      
      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Voice recognition error. Please try again.');
      };

      setRecognition(rec);
    } else {
      toast.warning("Voice commands not supported in this browser. Try Chrome, Edge, or Safari for best experience.");
    }

    // Cleanup
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []); // Removed i18n.language dep to avoid unnecessary re-runs, lang set on start

// Keyboard shortcuts for voice commands
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !(event.target as HTMLElement)?.matches('input, textarea, [contenteditable]')) {
        event.preventDefault();
        if (!isListening) {
          startVoiceCommand();
        }
      }

      if (event.code === 'Escape' && isListening) {
        if (recognition) {
          recognition.stop();
        }
        setIsListening(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isListening, recognition]);

  // Voice command processing with Tamil support
  const processVoiceCommand = (command: string) => {
    console.log('Landing page voice command:', command);
    const isTamil = i18n.language === 'ta';

    // Help commands - bilingual
    if (command.includes('help') || command.includes('உதவி') || command.includes('commands')) {
      const helpText = isTamil 
        ? "கிடைக்கும் கட்டளைகள்: சேவைகள், மின்சாரம், நீர், மாநகராட்சி, உள்நுழை, டாஷ்போர்டு அல்லது உதவி"
        : "Available commands: services, electricity, water, municipal, login, dashboard, or help";
      speakResponse(helpText);
      toast.info(isTamil ? "சொல்லுங்கள்: உதவி, சேவைகள், மின்சாரம், நீர், மாநகராட்சி" : "Say: help, services, electricity, water, municipal");
      return;
    }

    if (command.includes('services') || command.includes('சேவைகள்') || command.includes('what can you do')) {
      const servicesText = isTamil
        ? "மின்சாரம், நீர், மற்றும் மாநகராட்சி சேவைகளை அணுக உங்களுக்கு உதவ முடியும்."
        : "I can help you access electricity, water, and municipal services. Say the service name to get started.";
      speakResponse(servicesText);
      toast.info(isTamil ? "சொல்லுங்கள்: மின்சாரம், நீர், மாநகராட்சி" : "Say: electricity, water, municipal, login, or dashboard");
      return;
    }

    // Electricity - bilingual
    if (command.includes('electricity') || command.includes('power') || command.includes('tangedco') || 
        command.includes('மின்சாரம்') || command.includes('மின்சார') || command.includes('tangedco')) {
      window.location.href = '/electricity';
      speakResponse(isTamil ? "மின்சார சேவைகள் திறக்கிறேன்" : "Opening electricity services");
      return;
    }

    // Water - bilingual
    if (command.includes('water') || command.includes('cmwssb') || 
        command.includes('நீர்') || command.includes('நீர்வழங்கல்') || command.includes('cmwssb')) {
      window.location.href = '/water';
      speakResponse(isTamil ? "நீர் சேவைகள் திறக்கிறேன்" : "Opening water services");
      return;
    }

    // Municipal - bilingual
    if (command.includes('municipal') || command.includes('city') || command.includes('local') ||
        command.includes('மாநகராட்சி') || command.includes('நகரம்')) {
      window.location.href = '/municipal';
      speakResponse(isTamil ? "மாநகராட்சி சேவைகள் திறக்கிறேன்" : "Opening municipal services");
      return;
    }

    // Login - bilingual
    if (command.includes('login') || command.includes('sign in') ||
        command.includes('உள்நுழை') || command.includes('உள்நுழைவு')) {
      window.location.href = '/login';
      speakResponse(isTamil ? "உள்நுழை பக்கம் திறக்கிறேன்" : "Opening login page");
      return;
    }

    // Dashboard - bilingual
    if (command.includes('dashboard') || command.includes('my account') ||
        command.includes('டாஷ்போர்டு') || command.includes('என் கணக்கு')) {
      window.location.href = '/dashboard';
      speakResponse(isTamil ? "டாஷ்போர்டு திறக்கிறேன்" : "Opening dashboard");
      return;
    }

    // Fallback
    const fallbackText = isTamil 
      ? "அந்த கட்டளையை புரிந்துகொள்ளவில்லை. மீண்டும் முயற்சிக்கவும்: உதவி, மின்சாரம், நீர், மாநகராட்சி"
      : "I didn't understand that command. Try saying: help, services, electricity, water, municipal, login, or dashboard";
    speakResponse(fallbackText);
    toast.info(fallbackText);
  };

  // Voice command starter
  const startVoiceCommand = () => {
    if (!recognition) {
      toast.error("Voice commands not supported in this browser");
      return;
    }
    setIsListening(true);
    try {
      (recognition as any).start();
    } catch (error) {
      toast.error("Unable to start voice recognition");
      setIsListening(false);
    }
  };

// Text-to-speech helper with dynamic language
  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = i18n.language === 'ta' ? 'ta-IN' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen pb-20">
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50">
        Skip to main content
      </a>

      {/* Clean Header - No blue kiosk background */}
      <header className="bg-white border-b border-gray-200 py-6 shadow-sm" role="banner">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Government Info - Clean typography, better alignment */}
            <div className="text-center lg:text-left flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">{t('banner.title')}</h1>
              <p className="text-xl lg:text-2xl text-gray-600 font-medium">{t('banner.subtitle')}</p>
            </div>

            {/* Voice Assistance & AI Chat - Neutral styling */}
            <div className="flex flex-col sm:flex-row items-center gap-4 order-first lg:order-last">
              <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl border transition-colors">
                <Mic className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-semibold text-gray-800">Voice Ready</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl border transition-colors">
                <Bot className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-semibold text-gray-800">AI Assistant</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Simplified */}
      <section className="max-w-6xl mx-auto px-4 py-12 text-center" id="main-content">
        {/* Government Emblem - Smaller and cleaner */}
        <div className="mx-auto w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center shadow-lg mb-8 border-4 border-blue-200">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/8/81/TamilNadu_Logo.svg"
            alt={t('gov.emblemAlt')}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full"
            loading="lazy"
          />
        </div>

        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
          {t('gov.title')}
        </h2>
        <p className="text-2xl lg:text-3xl text-gray-700 mb-8 font-semibold leading-relaxed">
          {t('gov.tagline')}
        </p>

        <h3 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6 leading-tight">
          {t('hero.title')}
        </h3>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          {t('hero.description')}
          <br />
          <span className="text-blue-600 font-medium">{t('hero.bilingual')}</span>
        </p>

        {/* Clear Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 max-w-md mx-auto">
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors text-center min-w-[200px]"
            aria-label={t('hero.login')}
          >
            {t('hero.login')}
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors text-center min-w-[200px]"
            aria-label={t('hero.quick')}
          >
            {t('hero.quick')}
          </Link>
        </div>

        {/* Voice Command Button */}
        <div className="mb-8 flex flex-col items-center">
          <button
            onClick={startVoiceCommand}
            disabled={isListening}
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all ${
              isListening
                ? 'bg-red-100 text-red-700 border-2 border-red-300 animate-pulse'
                : 'bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-300 hover:border-blue-400'
            } focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md`}
            aria-label={isListening ? "Listening for voice command" : "Start voice command"}
          >
            <Mic className={`w-5 h-5 ${isListening ? 'text-red-600' : 'text-blue-600'}`} />
            {isListening ? 'Listening...' : 'Try Voice Commands'}
            {isListening && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            )}
          </button>
          <p className="text-sm text-gray-500 mt-2 text-center max-w-xs">
            Press <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Space</kbd> to start voice commands • 
            Say "help" to see available commands
          </p>
        </div>

        {/* Accessibility Features - Removed kiosk references */}
        <div className="flex flex-wrap gap-4 justify-center items-center text-sm font-medium text-gray-600 max-w-xl mx-auto mt-12">
          <span className="flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-xl shadow-sm border">
            ♿ Fully Accessible
          </span>
          <span className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-xl shadow-sm border">
            🌐 Bilingual (தமிழ்/English)
          </span>
          <span className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 rounded-xl shadow-sm border">
            💻 Web & Touch Friendly
          </span>
          <span className="flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 rounded-xl shadow-sm border">
            🎤 Voice Assisted
          </span>
        </div>
      </section>

      {/* Services Section - Clean and Simple */}
      <section className="py-16 bg-white" aria-labelledby="services-heading">
        <div className="max-w-6xl mx-auto px-4">
          <h2 id="services-heading" className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            {t('services.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            <Link
              to="/electricity"
              className="group p-8 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all text-center w-full max-w-sm"
              aria-label="Electricity Services"
            >
              <Zap className="w-16 h-16 text-yellow-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('services.electricity')}</h3>
              <p className="text-gray-600">{t('services.electricityDesc')}</p>
            </Link>

            <Link
              to="/water"
              className="group p-8 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all text-center w-full max-w-sm"
              aria-label="Water Services"
            >
              <Droplet className="w-16 h-16 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('services.water')}</h3>
              <p className="text-gray-600">{t('services.waterDesc')}</p>
            </Link>

            <Link
              to="/municipal"
              className="group p-8 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-green-300 transition-all text-center w-full max-w-sm"
              aria-label="Municipal Services"
            >
              <Building2 className="w-16 h-16 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('services.municipal')}</h3>
              <p className="text-gray-600">{t('services.municipalDesc')}</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Navigation - Simple and Accessible */}
      <section className="py-8 bg-white border-b" aria-label="Quick navigation">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex flex-wrap justify-center gap-4 text-sm" role="navigation">
            <Link to="/electricity" className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors">
              Electricity Services
            </Link>
            <Link to="/water" className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors">
              Water Services
            </Link>
            <Link to="/municipal" className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors">
              Municipal Services
            </Link>
            <Link to="/login" className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors">
              Login
            </Link>
            <Link to="/dashboard" className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors">
              Dashboard
            </Link>
          </nav>
        </div>
      </section>

      <section className="py-16 bg-gray-50" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto px-4">
          <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Why Choose Our Services?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border w-full max-w-xs">
              <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi Language</h3>
              <p className="text-gray-600 text-sm">Available in Tamil and English</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border w-full max-w-xs">
              <Mic className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice Commands</h3>
              <p className="text-gray-600 text-sm">Speak naturally to navigate</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border w-full max-w-xs">
              <Bot className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Assistant</h3>
              <p className="text-gray-600 text-sm">Get instant help anytime</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border w-full max-w-xs">
              <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Safe</h3>
              <p className="text-gray-600 text-sm">Bank-grade security</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Clean and Informative */}
      <footer className="bg-gray-800 text-white py-12" role="contentinfo">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 justify-items-center">
            <div className="text-center w-full max-w-xs">
              <Mic className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <h3 className="font-semibold mb-1">Voice Commands</h3>
              <p className="text-sm text-gray-300">Speak naturally to navigate</p>
            </div>
            <div className="text-center w-full max-w-xs">
              <Bot className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <h3 className="font-semibold mb-1">AI Assistant</h3>
              <p className="text-sm text-gray-300">Get help anytime</p>
            </div>
            <div className="text-center w-full max-w-xs">
              <Shield className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <h3 className="font-semibold mb-1">Secure Platform</h3>
              <p className="text-sm text-gray-300">Your data is protected</p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-sm text-gray-300 mb-2">{t('footer.copyright')}</p>
            <p className="text-sm text-gray-400">{t('footer.support')}</p>
        <div className="mt-4 flex justify-center space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
  
