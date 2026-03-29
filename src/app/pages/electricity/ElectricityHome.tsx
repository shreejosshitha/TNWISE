import { AIChatbot } from "../../components/AIChatbot";
import { Link } from "react-router-dom";
import { 
  CreditCard, Plus, FileText, Search, Zap, ArrowLeft, Crown, Shield, 
  Activity, Bell, Phone, Clock, Calculator, AlertTriangle, Lightbulb,

  TrendingUp, Users, MapPin, Calendar, Star, Award, CheckCircle,
  Battery, Thermometer, Wifi, WifiOff, Mic, MicOff, Bot, Sparkles,
  Gauge, DollarSign, Percent, Eye, Lock, Globe, Smartphone, Landmark
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Alert, AlertDescription } from "../../components/ui/alert";

export function ElectricityHome() {
  const [isListening, setIsListening] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [continuousMode, setContinuousMode] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [recognition, setRecognition] = useState<any>(null);
  const [browserSupport, setBrowserSupport] = useState({ speechRecognition: false, speechSynthesis: false });
  const [serviceStats, setServiceStats] = useState({
    totalUsers: 2500000,
    activeConnections: 2450000,
    avgResponseTime: "2.3 hours",
    satisfactionScore: 4.2
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
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      
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

  // Voice command functionality
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
    console.log('Processing command:', command);

    // Emergency commands (highest priority)
    if (command.includes('emergency') || command.includes('power outage') || command.includes('no power')) {
      toast.error("🚨 Emergency detected! Calling 1912...");
      window.open('tel:1912', '_blank');
      speakResponse("Emergency services contacted. Help is on the way.");
      return;
    }

    if (command.includes('accident') || command.includes('electrical hazard')) {
      toast.error("🚨 Electrical emergency! Calling 108...");
      window.open('tel:108', '_blank');
      speakResponse("Emergency services contacted for electrical hazard.");
      return;
    }

    // Navigation commands
    const navigationCommands = [
      { 
        keywords: ['pay bill', 'bill payment', 'pay electricity', 'electricity bill'], 
        action: () => window.location.href = '/electricity/bill-payment', 
        response: 'Opening electricity bill payment page' 
      },
      { 
        keywords: ['new connection', 'apply connection', 'apply for electricity'], 
        action: () => window.location.href = '/electricity/new-connection', 
        response: 'Opening new connection application' 
      },
      { 
        keywords: ['complaint', 'report issue', 'raise complaint', 'file complaint'], 
        action: () => window.location.href = '/electricity/complaint', 
        response: 'Opening complaint registration' 
      },
      { 
        keywords: ['track', 'status', 'track application', 'check status'], 
        action: () => window.location.href = '/electricity/tracking', 
        response: 'Opening application tracking' 
      },
      { 
        keywords: ['calculator', 'energy calculator', 'calculate energy'], 
        action: () => window.location.href = '/electricity/calculator', 
        response: 'Opening energy calculator' 
      },
      { 
        keywords: ['transparency', 'blockchain', 'transaction history'], 
        action: () => window.location.href = '/electricity/transparency', 
        response: 'Opening transparency tracker' 
      },
      { 
        keywords: ['dashboard', 'home', 'main page'], 
        action: () => window.location.href = '/dashboard', 
        response: 'Going back to dashboard' 
      }
    ];

    // Utility commands
    const utilityCommands = [
      { 
        keywords: ['help', 'what can you do', 'commands', 'show commands'], 
        action: () => showHelp(), 
        response: 'Showing available voice commands' 
      },
      { 
        keywords: ['stop listening', 'stop', 'quit', 'exit'], 
        action: () => {
          setContinuousMode(false);
          stopVoiceCommand();
        }, 
        response: 'Stopping voice recognition' 
      },
      { 
        keywords: ['continuous mode', 'always listen', 'keep listening'], 
        action: () => toggleContinuousMode(), 
        response: continuousMode ? 'Disabling continuous mode' : 'Enabling continuous mode' 
      },
      { 
        keywords: ['status', 'system status', 'power status'], 
        action: () => {
          speakResponse("All systems operational. Power supply stable across Tamil Nadu.");
          toast.success("System status: All services operational");
        }, 
        response: 'Checking system status' 
      },
      { 
        keywords: ['statistics', 'stats', 'show stats'], 
        action: () => {
          const stats = `Total users: ${serviceStats.totalUsers.toLocaleString()}, Active connections: ${serviceStats.activeConnections.toLocaleString()}, Average response time: ${serviceStats.avgResponseTime}`;
          speakResponse(`Here are the current statistics: ${stats}`);
          toast.info("Statistics displayed");
        }, 
        response: 'Showing service statistics' 
      },
      { 
        keywords: ['time', 'current time', 'what time'], 
        action: () => {
          const time = new Date().toLocaleTimeString();
          speakResponse(`Current time is ${time}`);
          toast.info(`Current time: ${time}`);
        }, 
        response: 'Telling current time' 
      }
    ];

    // Process navigation commands
    for (const cmd of navigationCommands) {
      if (cmd.keywords.some(keyword => command.includes(keyword))) {
        cmd.action();
        toast.success(cmd.response);
        speakResponse(cmd.response);
        return;
      }
    }

    // Process utility commands
    for (const cmd of utilityCommands) {
      if (cmd.keywords.some(keyword => command.includes(keyword))) {
        cmd.action();
        toast.success(cmd.response);
        speakResponse(cmd.response);
        return;
      }
    }

    // Fallback for unrecognized commands
    const fallbackResponses = [
      "I'm sorry, I didn't understand that command. Say 'help' to see available commands.",
      "Command not recognized. Try saying 'help' for a list of available commands.",
      "I didn't catch that. Say 'help' to learn what I can do for you."
    ];
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    toast.error(randomResponse);
    speakResponse(randomResponse);
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Use a female voice if available
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Victoria') ||
        voice.name.includes('Karen') ||
        (voice.lang.startsWith('en') && voice.name.includes('Google'))
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  const checkBrowserSupport = () => {
    const speechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    const speechSynthesis = 'speechSynthesis' in window;
    
    return { speechRecognition, speechSynthesis };
  };

  const showHelp = () => {
    const helpText = `
      Available voice commands:
      Navigation: pay bill, new connection, complaint, track status, energy calculator, transparency tracker, dashboard
      Utilities: help, stop listening, continuous mode, system status, statistics, current time
      Emergency: emergency, power outage, accident, electrical hazard
    `;
    
    toast.info("Voice commands displayed below");
    speakResponse("Here are the available voice commands. You can say: pay bill, new connection, complaint, track status, energy calculator, help, or emergency commands.");
    
    // Show help modal or update UI to show commands
    setTimeout(() => {
      const helpSection = document.querySelector('[data-help-section]');
      if (helpSection) {
        helpSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1000);
  };

  // Keyboard shortcuts for voice commands
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Space bar for voice command (when not typing in input)
      if (event.code === 'Space' && !(event.target as HTMLElement)?.matches('input, textarea, [contenteditable]')) {
        event.preventDefault();
        if (!isListening) {
          startVoiceCommand();
        }
      }
      
      // Escape key to stop listening
      if (event.code === 'Escape' && isListening) {
        stopVoiceCommand();
      }
      
      // Ctrl/Cmd + V for continuous mode toggle
      if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        event.preventDefault();
        toggleContinuousMode();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isListening, continuousMode]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Government Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-lg">
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
                  <h1 className="text-3xl font-bold mb-1">Tamil Nadu Electricity Board</h1>
                  <p className="text-blue-100 text-sm">Department of Energy & Infrastructure</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs">
                    <span className="bg-white/20 px-2 py-1 rounded">ISO 9001:2015 Certified</span>
                    <span className="bg-white/20 px-2 py-1 rounded">24/7 Service Available</span>
                    <span className="bg-white/20 px-2 py-1 rounded">Emergency: 1912</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm opacity-90">Citizen Portal</div>
                  <div className="font-semibold">Welcome to TANGEDCO</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <Shield className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Real-time Status Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Alert className="border-green-200 bg-green-50 flex-1">
              <Activity className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>System Status:</strong> All services operational • Last updated: {currentTime.toLocaleTimeString()} • 
                <span className="inline-flex items-center ml-2">
                  <div className="w-2 h-2 rounded-full mr-1 bg-green-500 animate-pulse"></div>
                  Power supply stable across Tamil Nadu
                </span>
              </AlertDescription>
            </Alert>
            
            {/* Voice Command Controls */}
            <div className="flex items-center gap-3">
              {continuousMode && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 border border-green-300 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-800">Always Listening</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
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

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-blue-600">{serviceStats.totalUsers.toLocaleString()}</p>
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
                <Zap className="w-8 h-8 text-green-500" />
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

        {/* Navigation */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        {/* Main Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/electricity/bill-payment"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group border-l-4 border-blue-500"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CreditCard className="w-7 h-7 text-blue-600" />
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">Most Used</Badge>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pay Electricity Bill</h3>
            <p className="text-gray-600 mb-4">
              Pay your electricity bill quickly and securely with multiple payment options
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
            to="/electricity/new-connection"
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
              Apply for a new electricity connection with online tracking and instant approval
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
            to="/electricity/complaint"
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
              Report power outages, billing issues, or service problems with real-time updates
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
            to="/electricity/tracking"
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
            to="/electricity/transparency"
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">Energy Calculator</h3>
            <p className="text-gray-600 mb-4">
              Calculate your electricity consumption and get personalized energy-saving tips
            </p>
            <Link to="/electricity/calculator" className="block">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Emergency & Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-lg border-l-4 border-red-500">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                Emergency Services
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-red-900">Power Outage</p>
                    <p className="text-sm text-red-700">Report immediate power failure</p>
                  </div>
                  <Button size="sm" variant="destructive">
                    <Phone className="w-4 h-4 mr-1" />
                    1912
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-yellow-900">Service Emergency</p>
                    <p className="text-sm text-yellow-700">Electrical hazards or accidents</p>
                  </div>
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                    <Phone className="w-4 h-4 mr-1" />
                    108
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  onClick={() => toast.info("Outage map coming soon!")}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  View Outage Map
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info("Load shedding schedule coming soon!")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Load Shedding Schedule
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info("Energy tips coming soon!")}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Energy Saving Tips
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

        {/* Voice Commands Help */}
        <Card className="shadow-lg mb-8" data-help-section>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Voice Command Guide
              {commandHistory.length > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {commandHistory.length} recent commands
                </Badge>
              )}
              <div className="flex items-center gap-2 ml-2">
                <Badge 
                  variant={browserSupport.speechRecognition ? "default" : "destructive"} 
                  className="text-xs"
                >
                  🎤 {browserSupport.speechRecognition ? 'Recognition' : 'No Recognition'}
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
                    "Pay bill" or "Bill payment"
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    "New connection" or "Apply"
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    "Complaint" or "Report issue"
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    "Track status" or "Check status"
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    "Energy calculator"
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    "Transparency tracker"
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-green-900">⚡ Utility & Emergency Commands</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                    "Help" or "Show commands"
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    "Continuous mode" (always listen)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    "System status" or "Power status"
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    "Statistics" or "Show stats"
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                    "Emergency" or "Power outage" (calls 1912)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    "Accident" or "Electrical hazard" (calls 108)
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

        {/* Information Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">💡 Did you know?</h3>
              <p className="text-blue-800 mb-3">
                Tamil Nadu has one of the most efficient power distribution systems in India. 
                Our Transparency Tracker uses blockchain technology to ensure every transaction is secure and verifiable.
              </p>
              <div className="flex items-center gap-4 text-sm text-blue-700">
                <span className="flex items-center gap-1">
                  <Gauge className="w-4 h-4" />
                  99.9% Uptime
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Bank-grade Security
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  24/7 Support
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
