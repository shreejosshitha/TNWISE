import { MessageCircle, Send, Mic, X, Keyboard } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { TranslationButton } from "./TranslationButton";
import { TamilKeyboard } from "./TamilKeyboard";
import { useTamilVoiceRecognition } from "../hooks/useTamilVoiceRecognition";

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string; translatedText?: string }>>([
    {
      sender: "bot",
      text: "Hello! I'm your AI assistant. How can I help you today?",
    },
  ]);

  // Use the NLP-based voice recognition hook
  const {
    isListening,
    transcript,
    command,
    language,
    startListening,
    switchLanguage,
    processTextCommand
  } = useTamilVoiceRecognition();

  const suggestedActions = [
    "Pay EB bill",
    "Raise complaint",
    "Apply for new connection",
    "Track my application",
  ];

  // Dynamic suggested actions based on language
  const getSuggestedActions = (lang: string) => {
    if (lang === 'ta') {
      return [
        "மணிக்கட்டணம் செலுத்து",
        "புகார் அளி",
        "புதிய இணைப்பு கேட்க",
        "விண்ணப்பம் பின்தொடர",
      ];
    }
    return suggestedActions;
  };

  // Update message when transcript changes
  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  // Handle voice commands
  useEffect(() => {
    if (command) {
      // Execute voice command
      handleVoiceCommand(command);
    }
  }, [command]);

  const startVoiceRecognition = () => {
    startListening();
  };

  const stopVoiceRecognition = () => {
    // The hook handles stopping
  };

  const handleVoiceCommand = (cmd: any) => {
    let response = "";
    let translatedResponse = "";

    switch (cmd.action) {
      case 'navigate':
        response = `Navigating to ${cmd.target}...`;
        translatedResponse = cmd.target === 'dashboard' ? 'டாஷ்போர்டுக்கு செல்கிறது...' :
                           cmd.target === 'complaints' ? 'புகார்கள் பக்கத்துக்கு செல்கிறது...' :
                           cmd.target === 'water' ? 'நீர் சேவை பக்கத்துக்கு செல்கிறது...' :
                           cmd.target === 'electricity' ? 'மின்சார சேவை பக்கத்துக்கு செல்கிறது...' :
                           `Navigating to ${cmd.target}...`;
        break;
      case 'submit':
        response = "Opening complaint form...";
        translatedResponse = "புகார் படிவத்தை திறக்கிறது...";
        break;
      case 'pay':
        response = "Opening payment page...";
        translatedResponse = "கட்டண பக்கத்தை திறக்கிறது...";
        break;
      case 'check':
        response = "Checking status...";
        translatedResponse = "நிலையை சரிபார்க்கிறது...";
        break;
      case 'help':
        response = "Here are available voice commands: go to dashboard, submit complaint, pay bill, check status";
        translatedResponse = "கிடைக்கும் குரல் கட்டளைகள்: டாஷ்போர்டுக்கு செல், புகார் செய், பில் செலுத்து, நிலை பார்";
        break;
      case 'language':
        response = cmd.target === 'ta' ? "Switched to Tamil" : "Switched to English";
        translatedResponse = cmd.target === 'ta' ? "தமிழுக்கு மாற்றப்பட்டது" : "ஆங்கிலத்துக்கு மாற்றப்பட்டது";
        setSelectedLanguage(cmd.target);
        switchLanguage(cmd.target);
        break;
      default:
        response = "Command not recognized";
        translatedResponse = "கட்டளை அங்கீகரிக்கப்படவில்லை";
    }

    // Add bot response to messages
    setMessages(prev => [...prev, {
      sender: "bot",
      text: selectedLanguage === 'ta' ? translatedResponse : response,
      translatedText: selectedLanguage === 'ta' ? response : translatedResponse
    }]);
  };

  const handleKeyboardInput = (key: string) => {
    if (key === 'BACKSPACE') {
      setMessage(prev => prev.slice(0, -1));
    } else {
      setMessage(prev => prev + key);
    }
  };

  const toggleKeyboard = () => {
    setIsKeyboardVisible(!isKeyboardVisible);
  };

  const containsTamil = (text: string) => {
    // Tamil Unicode range: U+0B80 to U+0BFF
    const tamilRegex = /[\u0B80-\u0BFF]/;
    return tamilRegex.test(text);
  };

  const speakText = (text: string, language: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice based on language
      const voices = speechSynthesis.getVoices();
      if (language === 'ta') {
        const tamilVoice = voices.find(voice => voice.lang.startsWith('ta') || voice.name.toLowerCase().includes('tamil'));
        if (tamilVoice) utterance.voice = tamilVoice;
        utterance.lang = 'ta-IN';
      } else if (language === 'hi') {
        const hindiVoice = voices.find(voice => voice.lang.startsWith('hi') || voice.name.toLowerCase().includes('hindi'));
        if (hindiVoice) utterance.voice = hindiVoice;
        utterance.lang = 'hi-IN';
      } else if (language === 'te') {
        const teluguVoice = voices.find(voice => voice.lang.startsWith('te') || voice.name.toLowerCase().includes('telugu'));
        if (teluguVoice) utterance.voice = teluguVoice;
        utterance.lang = 'te-IN';
      } else {
        utterance.lang = 'en-US';
      }
      
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const getBotResponse = (userMessage: string, lang: string) => {
    const msg = userMessage.toLowerCase();
    const isTamil = lang === 'ta';

    // Payments / Bills - Tamil: மணிக்கட்டணம் (bill), கட்டணம் (payment), செலுத்த (pay), அளவு (amount)
    if (msg.includes('bill') || msg.includes('payment') || msg.includes('pay') || msg.includes('eb') || 
        msg.includes('மணிக்கட்டணம்') || msg.includes('கட்டணம்') || msg.includes('அளவு') || 
        msg.includes('செலுத்த') || msg.includes('பணம்')) {
      return isTamil 
        ? "EB மற்றும் நீர் கட்டணத்தை செலுத்துவதற்கு:\n1. உள்நுழையவும்\n2. Electricity/Water → Bill Payment\n3. Consumer No ஐ உள்ளிடவும்\n4. Pay Now\nஉங்கள் Consumer No தயவு செய்து கொடுங்கள்."
        : "To pay EB/Water bills:\n1. Login\n2. Electricity/Water → Bill Payment\n3. Enter Consumer No\n4. Pay Now\nPlease share your Consumer No.";
    }

    // Complaints - Tamil: புகார் (complaint), பிரச்சனை (problem), அதிருப்தி (dissatisfaction), அளி (raise/file)
    if (msg.includes('complaint') || msg.includes('issue') || msg.includes('problem') || 
        msg.includes('புகார்') || msg.includes('பிரச்சனை') || msg.includes('அதிருப்தி') || 
        msg.includes('அளி') || msg.includes('தாக்கல்')) {
      return isTamil 
        ? "புகார் அளிப்பதற்கு:\n1. Electricity/Water → Complaint\n2. பிரச்சனை வகையை தேர்ந்தெடுக்கவும்\n3. விவரங்களை உள்ளிடவும் (Consumer No, பிரச்சனை விவரம்)\n4. புகைப்படங்கள் அல்லது ஆவணங்களை இணைக்கவும்\n5. Submit கிளிக் செய்யவும்\n\nஉங்கள் Consumer No மற்றும் பிரச்சனை விவரம் கொடுங்கள்."
        : "To file a complaint:\n1. Electricity/Water → Complaint\n2. Select complaint type\n3. Enter details (Consumer No, issue description)\n4. Attach photos or documents if needed\n5. Click Submit\n\nPlease share your Consumer No and issue details.";
    }

    // New connection - Tamil: புதிய (new), இணைப்பு (connection), விண்ணப்பி (apply)
    if (msg.includes('new') || msg.includes('connection') || msg.includes('apply') || 
        msg.includes('புதிய') || msg.includes('இணைப்பு') || msg.includes('விண்ணப்பி') || 
        msg.includes('கேட்க')) {
      return isTamil 
        ? "புதிய இணைப்பு கேட்பதற்கு:\n1. Electricity/Water → New Connection\n2. விண்ணப்பப் படிவத்தை நிரப்பவும்\n3. தேவையான ஆவணங்களை upload செய்யவும்\n4. முகவரி மற்றும் தொடர்பு விவரங்களை கொடுங்கள்\n\nஉங்கள் முழு முகவரி மற்றும் தேவை கொடுங்கள்."
        : "For new connection:\n1. Electricity/Water → New Connection\n2. Fill application form\n3. Upload required documents\n4. Provide address and contact details\n\nShare your full address and requirements.";
    }

    // Tracking - Tamil: நிலை (status), பின்தொடர (track), விண்ணப்பம் (application)
    if (msg.includes('track') || msg.includes('status') || msg.includes('application') || 
        msg.includes('நிலை') || msg.includes('பின்தொடர') || msg.includes('விண்ணப்பம்') || 
        msg.includes('சரிபார்')) {
      return isTamil 
        ? "விண்ணப்ப நிலையை சரிபார்க்க:\n1. Electricity/Water → Tracking\n2. உங்கள் Application ID உள்ளிடவும்\n3. அல்லது Consumer No கொடுங்கள்\n\nஉங்கள் App ID அல்லது Consumer No கொடுங்கள்."
        : "To track application status:\n1. Electricity/Water → Tracking\n2. Enter your Application ID\n3. Or provide Consumer No\n\nShare your App ID or Consumer No.";
    }

    // Navigation - Tamil keywords
    if (msg.includes('login') || msg.includes('உள்நுழை') || msg.includes('லாகின்')) {
      return isTamil ? "உள்நுழை பக்கத்திற்கு செல்ல: /login" : "Go to login: /login";
    }
    if (msg.includes('dashboard') || msg.includes('டாஷ்போர்டு') || msg.includes('முகப்பு')) {
      return isTamil ? "டாஷ்போர்டு: /dashboard" : "Dashboard: /dashboard";
    }
    if (msg.includes('electricity') || msg.includes('eb') || msg.includes('மின்சாரம்') || msg.includes('விளக்கு')) {
      return isTamil ? "மின்சார சேவைகள்: /electricity" : "Electricity services: /electricity";
    }
    if (msg.includes('water') || msg.includes('நீர்') || msg.includes('தண்ணீர்')) {
      return isTamil ? "நீர் சேவைகள்: /water" : "Water services: /water";
    }

    // General help - fallback response
    return isTamil 
      ? "என்ன உதவி தேவை?\n• கட்டணம் செலுத்த\n• புகார் அளி\n• புதிய இணைப்பு கேட்க\n• விண்ணப்பம் பின்தொடர\nமேலே உள்ள buttons ஐ கிளிக் செய்யவும் அல்லது விவரமாக சொல்லுங்கள்."
      : "How can I help?\n• Pay bills\n• Raise complaints\n• Apply for new connections\n• Track applications\nClick buttons above or provide details.";
  };

  const handleSend = () => {
    if (!message.trim()) return;

    const userMsg = message.trim();

    // Auto-detect Tamil input and switch language if needed
    if (containsTamil(userMsg) && selectedLanguage !== 'ta') {
      setSelectedLanguage('ta');
      switchLanguage('ta');
    }

    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setMessage("");
    setIsKeyboardVisible(false); // Hide keyboard after sending

    // Determine response language based on input
    const responseLang = containsTamil(userMsg) ? 'ta' : selectedLanguage;

    // Simulate typing delay
    setTimeout(() => {
      const botReply = getBotResponse(userMsg, responseLang);
      setMessages(prev => [...prev, { sender: "bot", text: botReply }]);
      speakText(botReply, responseLang);
    }, 800);
  };

  const handleSuggestion = (action: string) => {
    // Auto-detect Tamil input and switch language if needed
    if (containsTamil(action) && selectedLanguage !== 'ta') {
      setSelectedLanguage('ta');
      switchLanguage('ta');
    }

    setMessages(prev => [...prev, { sender: "user", text: action }]);

    // Determine response language based on input
    const responseLang = containsTamil(action) ? 'ta' : selectedLanguage;

    setTimeout(() => {
      const botReply = getBotResponse(action, responseLang);
      setMessages(prev => [...prev, { sender: "bot", text: botReply }]);
      speakText(botReply, responseLang);
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
                  <div className="flex items-start gap-2">
                    <p className="text-sm flex-1">{msg.text}</p>
                    {msg.sender === "bot" && isSpeaking && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
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
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  switchLanguage(e.target.value);
                }}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {getSuggestedActions(selectedLanguage).map((action, index) => (
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
                placeholder={selectedLanguage === 'ta' ? "உங்கள் செய்தியை தட்டச்சு செய்யவும்..." : "Type your message..."}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={toggleKeyboard}
                className={`p-2 rounded-lg transition-colors ${
                  isKeyboardVisible 
                    ? 'bg-blue-100 hover:bg-blue-200 text-blue-600' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <Keyboard className="w-5 h-5" />
              </button>
              <button 
                onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                className={`p-2 rounded-lg transition-colors ${
                  isListening 
                    ? 'bg-red-100 hover:bg-red-200 text-red-600' 
                    : 'bg-gray-100 hover:bg-gray-200 text-blue-600'
                }`}
              >
                <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
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

      <TamilKeyboard
        isVisible={isKeyboardVisible}
        onKeyPress={handleKeyboardInput}
        onClose={() => setIsKeyboardVisible(false)}
      />

      {isKeyboardVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsKeyboardVisible(false)} />
      )}
    </>
  );
}
