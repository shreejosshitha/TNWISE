import { MessageCircle, Send, Mic, X } from "lucide-react";
import { useState } from "react";
import { TranslationButton } from "./TranslationButton";

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string; translatedText?: string }>>([
    {
      sender: "bot",
      text: "Hello! I'm your AI assistant. How can I help you today?",
    },
  ]);

  const suggestedActions = [
    "Pay EB bill",
    "Raise complaint",
    "Apply for new connection",
    "Track my application",
  ];

  const getBotResponse = (userMessage: string, lang: string) => {
    const msg = userMessage.toLowerCase();
    const isTamil = lang === 'ta';

    // Payments / Bills
    if (msg.includes('bill') || msg.includes('payment') || msg.includes('pay') || msg.includes('eb') || msg.includes('மணிக்கட்டணம்') || msg.includes('கட்டணம்') || msg.includes('அளவு')) {
      return isTamil 
        ? "EB மற்றும் நீர் கட்டணத்தை செலுத்துவதற்கு:\n1. உள்நுழையவும்\n2. Electricity/Water → Bill Payment\n3. Consumer No ஐ உள்ளிடவும்\n4. Pay Now\nஉங்கள் Consumer No தயவு செய்து கொடுங்கள்."
        : "To pay EB/Water bills:\n1. Login\n2. Electricity/Water → Bill Payment\n3. Enter Consumer No\n4. Pay Now\nPlease share your Consumer No.";
    }

    // Complaints
    if (msg.includes('complaint') || msg.includes('issue') || msg.includes('problem') || msg.includes('எ投ப்பளை') || msg.includes('பிரச்சனை') || msg.includes('அதிருப்தி')) {
      return isTamil 
        ? "எரிச்சல் புகார்:\n1. Electricity/Water → Complaint\n2. விவரங்களை உள்ளிடவும்\n3. Submit\nஉங்கள் Consumer No மற்றும் பிரச்சனை விவரம் கொடுங்கள்."
        : "File complaints:\n1. Electricity/Water → Complaint\n2. Fill details\n3. Submit\nShare Consumer No and issue details.";
    }

    // New connection
    if (msg.includes('new') || msg.includes('connection') || msg.includes('apply') || msg.includes('மெw') || msg.includes('இணைப்பு') || msg.includes('விண்ணப்பி')) {
      return isTamil 
        ? "புதிய இணைப்பு:\n1. Electricity/Water → New Connection\n2. Form நிரப்பவும்\n3. Documents upload செய்யவும்\nஉங்கள் முகவரி மற்றும் தேவை கொடுங்கள்."
        : "New connection:\n1. Electricity/Water → New Connection\n2. Fill form\n3. Upload docs\nShare address and requirements.";
    }

    // Tracking
    if (msg.includes('track') || msg.includes('status') || msg.includes('application') || msg.includes('நிலை') || msg.includes('பின்தொடர') || msg.includes('விண்ணப்பம்')) {
      return isTamil 
        ? "பின்தொடர:\n1. Electricity/Water → Tracking\n2. Application ID உள்ளிடவும்\nஉங்கள் App ID கொடுங்கள்."
        : "Track status:\n1. Electricity/Water → Tracking\n2. Enter Application ID\nShare your App ID.";
    }

    // Navigation
    if (msg.includes('login') || msg.includes('உள்நுழை')) {
      return isTamil ? "உள்நுழை பக்கத்திற்கு செல்ல: /login" : "Go to login: /login";
    }
    if (msg.includes('dashboard') || msg.includes('டாஷ்போர்டு')) {
      return isTamil ? "டாஷ்போர்டு: /dashboard" : "Dashboard: /dashboard";
    }
    if (msg.includes('electricity') || msg.includes('eb') || msg.includes('மின்சாரம்')) {
      return isTamil ? "மின்சார சேவைகள்: /electricity" : "Electricity services: /electricity";
    }
    if (msg.includes('water') || msg.includes('நீர்')) {
      return isTamil ? "நீர் சேவைகள்: /water" : "Water services: /water";
    }

    // General help
    return isTamil 
      ? "என்ன உதவி தேவை?\n• கட்டணம் செலுத்த\n• புகார் அளி\n• புதிய இணைப்பு\n• பின்தொடர\nமேலே உள்ள buttons ஐ கிளிக் செய்யவும் அல்லது விவரம் கொடுங்கள்."
      : "How can I help?\n• Pay bills\n• Raise complaints\n• New connections\n• Track applications\nClick buttons above or provide details.";
  };

  const handleSend = () => {
    if (!message.trim()) return;

    const userMsg = message.trim();
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setMessage("");

    // Simulate typing delay
    setTimeout(() => {
      const botReply = getBotResponse(userMsg, selectedLanguage);
      setMessages(prev => [...prev, { sender: "bot", text: botReply }]);
    }, 800);
  };

  const handleSuggestion = (action: string) => {
    setMessages(prev => [...prev, { sender: "user", text: action }]);

    setTimeout(() => {
      const botReply = getBotResponse(action, selectedLanguage);
      setMessages(prev => [...prev, { sender: "bot", text: botReply }]);
    }, 800);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-blue-100">Here to help you</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  {msg.sender === "bot" && selectedLanguage !== "en" && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <TranslationButton
                        text={msg.text}
                        targetLanguage={selectedLanguage}
                        sourceLanguage="en"
                        onTranslated={(translated) => {
                          setMessages(prev => prev.map((m, i) => 
                            i === index ? { ...m, translatedText: translated } : m
                          ));
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-xs h-6 px-2"
                      />
                      {msg.translatedText && (
                        <p className="text-xs text-gray-600 mt-1 italic">
                          {msg.translatedText}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-gray-200">
            {/* Language Selection */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-gray-600">Language:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {suggestedActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestion(action)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm font-medium transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Mic className="w-5 h-5 text-blue-600" />
              </button>
              <button
                onClick={handleSend}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
