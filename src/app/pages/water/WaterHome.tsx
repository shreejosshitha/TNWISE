import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { 
  CreditCard, Plus, FileText, Search, Droplet, ArrowLeft, Crown, Shield, 
  Activity, Phone, Clock, Award, Mic, MicOff, Bot, TrendingUp, AlertTriangle, Lightbulb,
  Users, MapPin, Calendar, Star, CheckCircle, Battery, Gauge, DollarSign, Percent, Eye, Lock, Globe, Smartphone, Landmark,
  Droplets, Bell, Calculator
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { AIChatbot } from "../../components/AIChatbot";
import { Link } from "react-router-dom";

export function WaterHome() {
  const { t } = useTranslation('water');
  const [recentActions, setRecentActions] = useState<Array<{ message: string; timestamp: string }>>([]);

  // Helper functions for localStorage
  const readRecentActions = (): Array<{ message: string; timestamp: string }> => {
    try {
      const stored = localStorage.getItem('waterRecentActions');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading recent actions:', error);
      return [];
    }
  };

  const writeRecentActions = (actions: Array<{ message: string; timestamp: string }>) => {
    try {
      localStorage.setItem('waterRecentActions', JSON.stringify(actions));
    } catch (error) {
      console.error('Error writing recent actions:', error);
    }
  };
  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [continuousMode, setContinuousMode] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [recognition, setRecognition] = useState<any>(null);
  const [browserSupport, setBrowserSupport] = useState({ speechRecognition: false, speechSynthesis: false });
  const [serviceStats, setServiceStats] = useState({
    totalProperties: 1500000,
    activeConnections: 1480000,
    avgResponseTime: "3.1 hours",
    satisfactionScore: 4.1
  });

  // Check browser support on mount
  useEffect(() => {
    const support = checkBrowserSupport();
    setBrowserSupport(support);
    
    if (!support.speechRecognition) {
      toast.warning("Voice commands not supported in this browser. Try Chrome, Edge, or Safari for best experience.");
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-IN'; // Support both English and Tamil
      
      rec.onstart = () => {
        setIsListening(true);
        toast.info("🎤 Listening for voice commands...");
      };

      rec.onresult = (event: any) => {
        const command = event.results[0][0].transcript.toLowerCase().trim();
        setCommandHistory(prev => [command, ...prev.slice(0, 4)]);
        processVoiceCommand(command);
      };

      rec.onerror = (event: any) => {
        setIsListening(false);
        toast.error(`Voice recognition error: ${event.error}`);
      };

      rec.onend = () => {
        setIsListening(false);
        if (continuousMode) {
          setTimeout(() => startVoiceCommand(), 1000);
        }
      };

      setRecognition(rec);
    }
  }, [continuousMode]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

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
        stopVoiceCommand();
      }
      
      if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        event.preventDefault();
        toggleContinuousMode();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isListening, continuousMode]);

  useEffect(() => {
    setRecentActions(readRecentActions());
  }, []);

  const addRecentAction = (message: string) => {
    const entry = { message, timestamp: new Date().toLocaleString() };
    const updated = [entry, ...recentActions].slice(0, 5);
    setRecentActions(updated);
    writeRecentActions(updated);
  };

  // Voice command functions (adapted for water)
  const startVoiceCommand = () => {
    if (!recognition) {
      toast.error("Voice commands not supported in this browser");
      return;
    }
    try {
      recognition.start();
    } catch (error) {
      toast.error("Unable to start voice recognition");
    }
  };

  const stopVoiceCommand = () => {
    if (recognition) {
      recognition.stop();
      setContinuousMode(false);
    }
  };

  const toggleContinuousMode = () => {
    setContinuousMode(!continuousMode);
    if (!continuousMode) {
      toast.info("Continuous mode enabled - say 'stop listening' to disable");
      startVoiceCommand();
    } else {
      stopVoiceCommand();
      toast.info("Continuous mode disabled");
    }
  };

  const processVoiceCommand = (command: string) => {
    console.log('Water voice command:', command);

    // Emergency commands (water-specific)
    if (command.includes('emergency') || command.includes('leak') || command.includes('leakage') || command.includes('no water') ||
        command.includes('அவசரம்') || command.includes('கசிவு') || command.includes('தண்ணீர் இல்லை') ||
        command.includes('leak aachu') || command.includes('water leak') || command.includes('thanni illa') ||
        command.includes('water emergency') || command.includes('pipe burst') || command.includes('water problem') ||
        command.includes('no water supply') || command.includes('water outage') ||
        command.includes('தண்ணீர் அவசரம்') || command.includes('குழாய் வெடித்தது') || command.includes('தண்ணீர் சிக்கல்') ||
        command.includes('தண்ணீர் வழங்கல் இல்லை') || command.includes('தண்ணீர் துண்டிப்பு')) {
      toast.error("🚨 Water emergency detected! Calling leakage helpline...");
      window.open('tel:108', '_blank'); // Mock water emergency
      speakResponse("தண்ணீர் கசிவுக்கு அவசர சேவை தொடர்பு கொள்ளப்பட்டது. உதவி வந்துகொண்டிருக்கிறது.");
      return;
    }

    if (command.includes('contamination') || command.includes('dirty water') || command.includes('bad water') ||
        command.includes('மாசு') || command.includes('அழுக்கு தண்ணீர்') ||
        command.includes('water contamination') || command.includes('bad water quality') ||
        command.includes('polluted water') || command.includes('unsafe water') || command.includes('water not clean') ||
        command.includes('தண்ணீர் மாசு') || command.includes('கெட்ட தண்ணீர்') || command.includes('தண்ணீர் தரம் கெட்டது') ||
        command.includes('மாசு தண்ணீர்') || command.includes('பாதுகாப்பில்லாத தண்ணீர்') || command.includes('தண்ணீர் சுத்தமாக இல்லை')) {
      toast.error("🚨 Water quality emergency! Calling 1913...");
      window.open('tel:1913', '_blank'); // Mock contamination
      speakResponse("தண்ணீர் தர குழு எச்சரிக்கப்பட்டது. மாசு தண்ணீரை பயன்படுத்த வேண்டாம்.");
      return;
    }

    // Navigation commands (water-specific)
    const navigationCommands = [
      { 
        keywords: ['pay tax', 'bill payment', 'pay water', 'water tax', 'தண்ணீர் கட்டணம்', 'கட்டணம் செலுத்து', 'tax pay pannu', 'water bill pay pannu', 'pay water bill', 'water payment', 'settle water bill'], 
        action: () => window.location.href = '/water/bill-payment', 
        response: 'Opening water tax payment' 
      },
      { 
        keywords: ['new connection', 'apply connection', 'புதிய இணைப்பு', 'இணைப்பு விண்ணப்பிக்க', 'new connection apply pannu', 'connection podu', 'apply for new connection', 'get new water connection', 'new water service', 'request water connection'], 
        action: () => window.location.href = '/water/new-connection', 
        response: 'Opening new connection application' 
      },
      { 
        keywords: ['complaint', 'leak complaint', 'no water', 'low pressure', 'புகார்', 'கசிவு புகார்', 'தண்ணீர் இல்லை', 'குறைந்த அழுத்தம்', 'complaint podu', 'leak complaint pannu', 'water problem', 'file water complaint', 'report water issue', 'water complaint'], 
        action: () => window.location.href = '/water/complaint', 
        response: 'Opening complaint registration' 
      },
      { 
        keywords: ['track', 'status', 'கண்காணி', 'நிலை', 'track pannu', 'status check pannu', 'check my application status', 'track my water application', 'see water status', 'water application tracking'], 
        action: () => window.location.href = '/water/tracking', 
        response: 'Opening status tracking' 
      },
      { 
        keywords: ['calculator', 'water calculator', 'கணக்கிடு', 'தண்ணீர் கணக்கிடு', 'calculator open pannu', 'water calculate pannu', 'water usage calculator', 'calculate water usage', 'water bill calculator'], 
        action: () => window.location.href = '/water/calculator', 
        response: 'Opening water calculator' 
      },
      { 
        keywords: ['transparency', 'வெளிப்படைத்தன்மை', 'transparency check pannu', 'view water transactions', 'water transaction history', 'water payment records'], 
        action: () => window.location.href = '/water/transparency', 
        response: 'Opening transparency tracker' 
      }
    ];

    // Utility commands
    const utilityCommands = [
      { keywords: ['help', 'உதவி', 'help pannu', 'what can you do', 'show commands', 'available commands', 'how to use', 'tell me what you can do'], action: () => showHelp(), response: 'Showing available voice commands' },
      { keywords: ['stop listening', 'stop', 'கேட்பதை நிறுத்து', 'நிறுத்து', 'stop pannu', 'stop voice', 'end listening', 'quit listening'], action: () => stopVoiceCommand(), response: 'Stopping voice recognition' },
      { keywords: ['continuous mode', 'தொடர்ந்து முறை', 'continuous mode on pannu', 'always listen', 'keep listening on', 'continuous listening'], action: () => toggleContinuousMode(), response: continuousMode ? 'Disabling continuous mode' : 'Enabling continuous mode' },
      { keywords: ['status', 'நிலை', 'status check pannu', 'check system status', 'water system status', 'current status'], action: () => { speakResponse("தண்ணீர் வழங்கல் நிலையானது. தர சோதனைகள் தேர்ச்சி பெற்றன."); toast.success("Water system status: All services operational"); }, response: 'Checking system status' },
    ];

    for (const cmd of [...navigationCommands, ...utilityCommands]) {
      if (cmd.keywords.some(keyword => command.includes(keyword))) {
        cmd.action();
        toast.success(cmd.response);
        speakResponse(cmd.response);
        return;
      }
    }

    toast.error("Command not recognized. Say 'help' for water commands.");
    speakResponse("மன்னிக்கவும், புரிந்துகொள்ளவில்லை. தண்ணீர் கட்டளைகளுக்கு 'உதவி' என்று சொல்லுங்கள்.");
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      // Detect if text contains Tamil characters
      const hasTamil = /[\u0B80-\u0BFF]/.test(text);
      utterance.lang = hasTamil ? 'ta-IN' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        hasTamil ? 
          (voice.lang.startsWith('ta') || voice.name.includes('Tamil')) :
          (voice.name.includes('Female') || voice.lang.startsWith('en'))
      );
      if (preferredVoice) utterance.voice = preferredVoice;
      speechSynthesis.speak(utterance);
    }
  };

  const checkBrowserSupport = () => {
    const speechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    const speechSynthesis = 'speechSynthesis' in window;
    return { speechRecognition, speechSynthesis };
  };

  const showHelp = () => {
    toast.info("Voice commands: pay tax/பில் கட்டணம், new connection/புது இணைப்பு, complaint/புகார் செய்ய, track/நிலை சரிபார், calculator/கணக்கிடு, transparency/வெளிப்படைத்தன்மை, emergency leakage/கசிவு அவசரம், help/உதவி");
    speakResponse("கிடைக்கும் கட்டளைகள்: பில் கட்டணம், புது இணைப்பு, புகார் செய்ய, நிலை சரிபார், கணக்கிடு, வெளிப்படைத்தன்மை, கசிவு அவசரம், அல்லது உதவி. தொடர்ந்து முறைக்கு 'தொடர்ந்து முறை' என்று சொல்லுங்கள்.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-900 text-white shadow-lg">
        <div className="px-4 py-6">

          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* Government Seal */}
                <div className="bg-white/10 p-4 rounded-lg border-2 border-white/20">
                  <div className="text-center">
                    <Crown className="w-10 h-10 mx-auto mb-1" />
                    <div className="text-xs font-bold">GOVERNMENT OF</div>
                    <div className="text-sm font-bold">TAMIL NADU</div>
                  </div>
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold mb-1">{t('home.title')}</h1>
                  <p className="text-blue-100 text-sm">{t('home.subtitle')}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs">
                    <span className="bg-white/20 px-2 py-1 rounded">ISO Certified</span>
                    <span className="bg-white/20 px-2 py-1 rounded">24/7 Monitoring</span>
                    <span className="bg-white/20 px-2 py-1 rounded">Emergency: 108</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm opacity-90">Citizen Portal</div>
                  <div className="font-semibold">Welcome to CMWSSB</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <Shield className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-time Status Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Alert className="border-green-200 bg-green-50 flex-1">
              <Activity className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>System Status:</strong> Water supply stable • Quality: A+ • Last updated: {currentTime.toLocaleTimeString()} • 
                <span className="inline-flex items-center ml-2">
                  <div className="w-2 h-2 rounded-full mr-1 bg-green-500 animate-pulse"></div>
                  All treatment plants operational
                </span>
              </AlertDescription>
            </Alert>
            
            {/* Voice Command Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {continuousMode && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 border border-green-300 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-800">Always Listening</span>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <Button 
                  onClick={startVoiceCommand}
                  variant={isListening ? "destructive" : "outline"}
                  className={`relative ${isListening ? 'animate-pulse' : ''}`}
                  disabled={isListening}
                >
                  {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                  {isListening ? 'Listening...' : 'Voice Command'}
                  {isListening && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                  )}
                </Button>
                
                <Button 
                  onClick={toggleContinuousMode}
                  variant={continuousMode ? "default" : "ghost"}
                  size="sm"
                  className={continuousMode ? 'bg-green-600 hover:bg-green-700' : ''}
                  title={continuousMode ? 'Disable continuous listening' : 'Enable continuous listening'}
                >
                  <Bot className="w-4 h-4 mr-1" />
                  {continuousMode ? 'Always On' : 'Continuous'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-blue-600">{serviceStats.totalProperties.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Connections</p>
                  <p className="text-2xl font-bold text-green-600">{serviceStats.activeConnections.toLocaleString()}</p>
                </div>
                <Droplet className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-orange-600">{serviceStats.avgResponseTime}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Satisfaction Score</p>
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-bold text-purple-600">{serviceStats.satisfactionScore}</p>
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                </div>
                <Award className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <Link
            to="/water/bill-payment?propertyId=12345678"
            onClick={() => addRecentAction("Requested water bill payment for property 12345678")}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group border-l-4 border-blue-500"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CreditCard className="w-7 h-7 text-blue-600" />
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">Most Used</Badge>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pay Water Tax</h3>
            <p className="text-gray-600 mb-4">
              Pay your water tax quickly and securely with multiple payment options
            </p>
            <div className="flex items-center justify-between">
              <span className="text-blue-600 font-medium text-sm">Pay Now →</span>
              <div className="flex gap-1">
                <Smartphone className="w-4 h-4 text-gray-400" />
                <Landmark className="w-4 h-4 text-gray-400" />
                <Globe className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </Link>

          <Link
            to="/water/new-connection"
            onClick={() => addRecentAction("Started new water connection request")}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group border-l-4 border-green-500"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-7 h-7 text-green-600" />
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">New</Badge>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">New Connection</h3>
            <p className="text-gray-600 mb-4">
              Apply for a new water connection with online tracking and instant approval
            </p>
            <div className="flex items-center justify-between">
              <span className="text-green-600 font-medium text-sm">Apply Now →</span>
              <div className="flex gap-1">
                <CheckCircle className="w-4 h-4 text-gray-400" />
                <Eye className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </Link>

          <Link
            to="/water/complaint"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group border-l-4 border-red-500"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-red-600" />
              </div>
              <Badge variant="secondary" className="bg-red-100 text-red-700">Priority</Badge>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Raise Complaint</h3>
            <p className="text-gray-600 mb-4">
              Report leakage or supply issues with real-time updates
            </p>
            <div className="flex items-center justify-between">
              <span className="text-red-600 font-medium text-sm">Report Issue →</span>
              <div className="flex gap-1">
                <AlertTriangle className="w-4 h-4 text-gray-400" />
                <Bell className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </Link>

          <Link
            to="/water/tracking"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group border-l-4 border-purple-500"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Search className="w-7 h-7 text-purple-600" />
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">Track</Badge>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Track Applications</h3>
            <p className="text-gray-600 mb-4">
              Monitor your connection applications, complaints, and bill payments in real-time
            </p>
            <div className="flex items-center justify-between">
              <span className="text-purple-600 font-medium text-sm">Track Now →</span>
              <div className="flex gap-1">
                <Activity className="w-4 h-4 text-gray-400" />
                <MapPin className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </Link>

          <Link
            to="/water/transparency"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group border-l-4 border-indigo-500"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Lock className="w-7 h-7 text-indigo-600" />
              </div>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">Secure</Badge>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Transparency Tracker</h3>
            <p className="text-gray-600 mb-4">
              View blockchain-verified transaction history and service transparency
            </p>
            <div className="flex items-center justify-between">
              <span className="text-indigo-600 font-medium text-sm">View Records →</span>
              <div className="flex gap-1">
                <Shield className="w-4 h-4 text-gray-400" />
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </Link>

          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                <Calculator className="w-7 h-7 text-orange-600" />
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">Free Tool</Badge>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Water Usage Calculator</h3>
            <p className="text-gray-600 mb-4">
              Calculate your water consumption and get personalized water-saving tips
            </p>
            <Link to="/water/calculator" className="block">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Now
              </Button>
            </Link>
          </div>

          <Card className="shadow-lg border-l-4 border-blue-500">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Lightbulb className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info("Water quality map coming soon!")}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  View Quality Map
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info("Conservation tips coming soon!")}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Water Saving Tips
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info("AI assistant coming soon!")}
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Ask AI Assistant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg mb-8" data-help-section>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              {t('voice.title')}
              {commandHistory.length > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {commandHistory.length} recent
                </Badge>
              )}
              <div className="flex items-center gap-2 ml-2">
                <Badge 
                  variant={browserSupport.speechRecognition ? "default" : "destructive"} 
                  className="text-xs"
                >
                  🎤 {browserSupport.speechRecognition ? 'Supported' : 'Not Supported'}
                </Badge>
                <Badge 
                  variant={browserSupport.speechSynthesis ? "default" : "secondary"} 
                  className="text-xs"
                >
                  🔊 {browserSupport.speechSynthesis ? 'Speech' : 'No Speech'}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-blue-900">🧭 Navigation Commands</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    "Pay tax" or "பில் கட்டணம்" (Bill payment)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    "New connection" or "புது இணைப்பு" (Apply)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    "Complaint" or "புகார் செய்ய" (Report issue)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    "Track status" or "நிலை சரிபார்" (Check status)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    "Calculator" or "கணக்கிடு" (Usage calculator)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    "Transparency" or "வெளிப்படைத்தன்மை" (View records)
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-green-900">🚨 Emergency & Utility Commands</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                    "Help" or "உதவி" (Show commands)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    "Continuous mode" or "தொடர்ந்து முறை" (Always listen)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    "Status" or "நிலை" (System status)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                    "Emergency" or "கசிவு" (Leakage - calls 108)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    "Contamination" or "மாசு" (Bad water - calls 1913)
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">💡 Pro Tips & Shortcuts:</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• <kbd className="px-1 py-0.5 bg-white border rounded text-xs">Space</kbd> - Start voice command (when not typing)</li>
                    <li>• <kbd className="px-1 py-0.5 bg-white border rounded text-xs">Esc</kbd> - Stop listening</li>
                    <li>• <kbd className="px-1 py-0.5 bg-white border rounded text-xs">Ctrl+V</kbd> - Toggle continuous mode</li>
                    <li>• Speak naturally and clearly for best results</li>
                    <li>• Emergency commands work instantly - no confirmation needed</li>
                    <li>• The system responds with voice feedback when available</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {commandHistory.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Recent Commands:</p>
                <div className="flex flex-wrap gap-2">
                  {commandHistory.slice(0, 3).map((cmd, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      "{cmd}"
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-lg border-l-4 border-red-500">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                Water Emergencies
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-red-900">Leakage/Burst</p>
                    <p className="text-sm text-red-700">Report pipe burst or leakage</p>
                  </div>
                  <Button size="sm" variant="destructive">
                    <Phone className="w-4 h-4 mr-1" />
                    108
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-yellow-900">Contamination</p>
                    <p className="text-sm text-yellow-700">Report dirty water</p>
                  </div>
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                    <Phone className="w-4 h-4 mr-1" />
                    1913
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-l-4 border-green-500">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Droplet className="w-5 h-5" />
                Water Conservation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900 mb-1">💧 Save Water Tips</p>
                  <p className="text-sm text-blue-700">Fix leaky faucets, use water-efficient appliances, and collect rainwater.</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-900 mb-1">🌱 Environmental Impact</p>
                  <p className="text-sm text-green-700">Every liter saved helps preserve our water resources for future generations.</p>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('recent')}</h2>
          {recentActions.length === 0 ? (
            <p className="text-gray-600">No actions yet. Use an action card above to get started.</p>
          ) : (
            <ul className="space-y-3">
              {recentActions.map((a, idx) => (
                <li key={idx} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <p className="text-gray-700">{a.message}</p>
                    <span className="text-xs text-gray-500">{a.timestamp}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Information Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">💡 Did you know?</h3>
              <p className="text-blue-800 mb-3">
                Chennai Metropolitan Water Supply and Sewerage Board (CMWSSB) serves over 1.5 million properties 
                with world-class water treatment facilities. Our Transparency Tracker uses blockchain technology 
                to ensure every transaction is secure and verifiable.
              </p>
              <div className="flex items-center gap-4 text-sm text-blue-700">
                <span className="flex items-center gap-1">
                  <Gauge className="w-4 h-4" />
                  99.8% Water Quality
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Bank-grade Security
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  24/7 Monitoring
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIChatbot />
    </div>
  );
}
