import { useState, useEffect } from "react";
import { AIChatbot } from "../../components/AIChatbot";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, CreditCard, Download, CheckCircle2, AlertCircle, Smartphone, Landmark, History, Calendar, IndianRupee, Mic, MicOff, Zap, TrendingUp, TrendingDown, Leaf, Clock, Bell, Shield, Calculator, BarChart3, PieChart, Activity, Phone, MapPin, Users, Award, Target, Lightbulb, DollarSign, CalendarDays, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

// Mock payment history data
const PAYMENT_HISTORY = [
  { month: "March 2026", amount: 1250, dueDate: "2026-04-05", status: "pending", paid: false, unitsConsumed: 250 },
  { month: "February 2026", amount: 1120, dueDate: "2026-03-05", status: "paid", paid: true, paidDate: "2026-03-02", unitsConsumed: 224 },
  { month: "January 2026", amount: 1450, dueDate: "2026-02-05", status: "paid", paid: true, paidDate: "2026-01-28", unitsConsumed: 290 },
  { month: "December 2025", amount: 1680, dueDate: "2026-01-05", status: "paid", paid: true, paidDate: "2025-12-20", unitsConsumed: 336 },
  { month: "November 2025", amount: 980, dueDate: "2025-12-05", status: "paid", paid: true, paidDate: "2025-11-25", unitsConsumed: 196 },
  { month: "October 2025", amount: 1320, dueDate: "2025-11-05", status: "paid", paid: true, paidDate: "2025-10-15", unitsConsumed: 264 },
];

export function BillPayment() {
  const { t } = useTranslation('electricity');
  const [consumerNumber, setConsumerNumber] = useState("");
  const [billData, setBillData] = useState<any>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [consumerVerified, setConsumerVerified] = useState(false);
  const [history, setHistory] = useState(PAYMENT_HISTORY);
  const navigate = useNavigate();

  // Voice command states
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");

  // Auto-payment scheduling
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);
  const [autoPayDate, setAutoPayDate] = useState("");

  // Energy insights
  const [energyInsights, setEnergyInsights] = useState({
    averageUsage: 245,
    lastMonthUsage: 250,
    efficiency: 85,
    carbonFootprint: 125,
    savings: 450
  });

  // Real-time status
  const [systemStatus, setSystemStatus] = useState({
    paymentGateway: 'online',
    billGeneration: 'active',
    customerSupport: 'available'
  });

  const handleFetchBill = () => {
    if (consumerNumber.length >= 10) {
      // Mock bill data
      setBillData({
        consumerNumber: consumerNumber,
        name: "Rajesh Kumar",
        address: "123, Anna Nagar, Chennai - 600040",
        billAmount: 1250,
        dueDate: "2026-04-05",
        lastReading: 2450,
        currentReading: 2700,
        unitsConsumed: 250,
        billMonth: "March 2026",
        previousDues: 450,
        totalAmount: 1700,
        ratePerUnit: 5.0,
      });
      setSelectedPaymentMethod(""); // Reset payment method
      setConsumerVerified(true); // Flag consumer as verified
      setShowHistory(false); // Show pay bill first
      toast.success("Bill details fetched successfully!");
    }
  };

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      const txnId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      setTransactionId(txnId);
      setPaymentSuccess(true);
      setIsProcessing(false);
      toast.success(`Payment successful via ${selectedPaymentMethod}!`);

      // mark payment complete in history and current bill
      if (billData?.billMonth) {
        const paidDate = new Date().toISOString().split('T')[0];
        setHistory(prev => prev.map(item =>
          item.month === billData.billMonth
            ? { ...item, status: 'paid', paid: true, paidDate }
            : item
        ));
      }

      setBillData(prev => prev ? { ...prev, previousDues: 0, totalAmount: prev.billAmount, status: 'paid' } : prev);
    }, 2000);
  };

  const handleDownloadReceipt = () => {
    toast.success("Receipt downloaded successfully!");
  };

  // Voice command functions
  const startVoiceCommand = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Voice commands not supported in this browser");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening for voice commands...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setVoiceTranscript(transcript);
      processVoiceCommand(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Voice recognition failed. Please try again.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processVoiceCommand = (command: string) => {
    if (command.includes('pay bill') || command.includes('make payment')) {
      if (billData && !showHistory) {
        toast.success("Voice command: Initiating payment");
        if (selectedPaymentMethod) {
          handlePayment();
        } else {
          setSelectedPaymentMethod('UPI');
          toast.info("Selected UPI as payment method. Say 'confirm payment' to proceed.");
        }
      }
    } else if (command.includes('show history') || command.includes('payment history')) {
      setShowHistory(true);
      toast.success("Voice command: Showing payment history");
    } else if (command.includes('go back') || command.includes('back to pay')) {
      setShowHistory(false);
      toast.success("Voice command: Back to payment");
    } else if (command.includes('select upi') || command.includes('pay with upi')) {
      setSelectedPaymentMethod('UPI');
      toast.success("Voice command: Selected UPI payment");
    } else if (command.includes('select card') || command.includes('pay with card')) {
      setSelectedPaymentMethod('Credit Card');
      toast.success("Voice command: Selected Credit Card payment");
    } else if (command.includes('select net banking') || command.includes('net banking')) {
      setSelectedPaymentMethod('Net Banking');
      toast.success("Voice command: Selected Net Banking");
    } else if (command.includes('enable auto pay') || command.includes('auto payment')) {
      setAutoPayEnabled(true);
      toast.success("Voice command: Auto-payment enabled");
    } else if (command.includes('help') || command.includes('what can i say')) {
      showVoiceHelp();
    } else {
      toast.info(`Voice command not recognized: "${command}". Say "help" for available commands.`);
    }
  };

  const showVoiceHelp = () => {
    toast.info("Available voice commands: pay bill, show history, select UPI/card/net banking, enable auto pay, help");
  };

  // Auto-payment setup
  const setupAutoPay = () => {
    if (!autoPayDate) {
      toast.error("Please select an auto-payment date");
      return;
    }
    toast.success(`Auto-payment scheduled for ${autoPayDate}`);
    setAutoPayEnabled(true);
  };

  // Calculate carbon footprint
  const calculateCarbonFootprint = (units: number) => {
    // Average CO2 emission factor for electricity in India is about 0.5 kg CO2/kWh
    return Math.round(units * 0.5);
  };

  // Energy saving tips
  const energySavingTips = [
    "Use LED bulbs - they use 75% less energy than incandescent bulbs",
    "Unplug electronics when not in use to avoid phantom loads",
    "Set your air conditioner to 24°C for optimal energy efficiency",
    "Use energy-efficient appliances with star ratings",
    "Install solar panels to generate your own electricity"
  ];

  // Emergency contacts
  const emergencyContacts = [
    { name: "Electricity Emergency", number: "1912", description: "Power outages & emergencies" },
    { name: "Customer Care", number: "044-28521109", description: "General inquiries" },
    { name: "Fault Reporting", number: "155333", description: "Report electrical faults" }
  ];

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Government Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img src="/api/placeholder/48/48" alt="Tamil Nadu Government" className="h-12 w-12 rounded-full bg-white p-1" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">தமிழ்நாடு மின்சார துறை</h1>
                  <p className="text-sm opacity-90">Tamil Nadu Electricity Department</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-semibold">Government of Tamil Nadu</p>
                  <p className="text-xs opacity-75">Digital Services Portal</p>
                </div>
                <Shield className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('billPayment.paymentSuccessful')}</h2>
            <p className="text-gray-600 mb-8">
              {t('billPayment.paymentSuccessDesc')}
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Transaction Details</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <p className="font-mono font-semibold text-gray-900">{transactionId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold text-gray-900">{selectedPaymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Consumer Number</p>
                  <p className="font-semibold text-gray-900">{billData?.consumerNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Consumer Name</p>
                  <p className="font-semibold text-gray-900">{billData?.name}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-3">Payment Breakdown</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current Bill Amount</span>
                    <span className="font-semibold text-gray-900">₹{billData?.billAmount}</span>
                  </div>
                  {billData?.previousDues > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Previous Dues</span>
                      <span className="font-semibold text-red-600">₹{billData?.previousDues}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base border-t border-gray-300 pt-2 mt-2">
                    <span className="font-semibold text-gray-900">Total Paid</span>
                    <span className="font-bold text-green-600">₹{billData?.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-semibold text-gray-900">
                  {new Date().toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-center flex-col sm:flex-row">
              <button
                onClick={handleDownloadReceipt}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-5 h-5" />
                {t('billPayment.downloadReceipt')}
              </button>
              <button
                onClick={() => {
                  setPaymentSuccess(false);
                  setBillData(null);
                  setConsumerNumber("");
                  setSelectedPaymentMethod("");
                }}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
              >
                {t('billPayment.payAnotherBill')}
              </button>
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-semibold transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        <AIChatbot />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Government Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img src="/api/placeholder/48/48" alt="Tamil Nadu Government" className="h-12 w-12 rounded-full bg-white p-1" />
              </div>
              <div>
                <h1 className="text-xl font-bold">தமிழ்நாடு மின்சார துறை</h1>
                <p className="text-sm opacity-90">Tamil Nadu Electricity Department</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold">Government of Tamil Nadu</p>
                <p className="text-xs opacity-75">Digital Services Portal</p>
              </div>
              <Shield className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Status Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm"> 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${systemStatus.paymentGateway === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">Payment Gateway: {systemStatus.paymentGateway}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${systemStatus.billGeneration === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-sm text-gray-600">Bill Generation: {systemStatus.billGeneration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${systemStatus.customerSupport === 'available' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-sm text-gray-600">Support: {systemStatus.customerSupport}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={startVoiceCommand}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isListening
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : 'bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span className="text-sm font-medium">{isListening ? 'Listening...' : 'Voice Commands'}</span>
              </button>
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Service Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Average Monthly Usage</p>
                <p className="text-2xl font-bold text-blue-600">{energyInsights.averageUsage} kWh</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+5% from last month</span>
                </div>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Energy Efficiency</p>
                <p className="text-2xl font-bold text-green-600">{energyInsights.efficiency}%</p>
                <div className="flex items-center mt-2">
                  <Award className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">Above average</span>
                </div>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Carbon Footprint</p>
                <p className="text-2xl font-bold text-yellow-600">{energyInsights.carbonFootprint} kg CO₂</p>
                <div className="flex items-center mt-2">
                  <Leaf className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-xs text-yellow-600">Monthly estimate</span>
                </div>
              </div>
              <PieChart className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Potential Savings</p>
                <p className="text-2xl font-bold text-purple-600">₹{energyInsights.savings}</p>
                <div className="flex items-center mt-2">
                  <DollarSign className="w-4 h-4 text-purple-500 mr-1" />
                  <span className="text-xs text-purple-600">With efficiency measures</span>
                </div>
              </div>
              <Lightbulb className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Voice Commands Help */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <div className="flex items-start space-x-3">
            <Mic className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Voice Commands Available</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-800">
                <span>• "Pay bill"</span>
                <span>• "Show history"</span>
                <span>• "Select UPI/Card"</span>
                <span>• "Enable auto pay"</span>
              </div>
              <p className="text-xs text-blue-700 mt-2">Click the voice button above or say "help" for more commands</p>
            </div>
          </div>
        </div>

        {/* Emergency Contacts & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Emergency Contacts */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="w-5 h-5 text-red-600 mr-2" />
              Emergency Contacts
            </h3>
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{contact.name}</p>
                    <p className="text-xs text-gray-600">{contact.description}</p>
                  </div>
                  <a
                    href={`tel:${contact.number}`}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {contact.number}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Energy Saving Tips */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
              Energy Saving Tips
            </h3>
            <div className="space-y-3">
              {energySavingTips.slice(0, 3).map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-semibold">
              View all tips →
            </button>
          </div>

          {/* Auto Payment Setup */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 text-green-600 mr-2" />
              Auto Payment
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Auto-payment enabled</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPayEnabled}
                    onChange={(e) => setAutoPayEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              {autoPayEnabled && (
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Payment Date</label>
                  <input
                    type="date"
                    value={autoPayDate}
                    onChange={(e) => setAutoPayDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={setupAutoPay}
                    className="mt-2 w-full px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Schedule Auto Payment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 mb-6">
            <Link to="/electricity" className="text-blue-600 hover:text-blue-800 flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Electricity Services
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">Bill Payment</span>
          </div>

        {/* Initial Consumer Number Input */}
        {!consumerVerified && !paymentSuccess && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">💳 Electricity Bill Payment</h2>
              <p className="text-gray-600">Secure and instant bill payment for Tamil Nadu Electricity Department</p>
            </div>

            <div className="space-y-6">
              {/* Step 1: Consumer Details */}
              <div className="border-l-4 border-blue-600 bg-blue-50 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    1
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900">📋 Enter Consumer Details</h3>
                </div>
                <p className="text-sm text-blue-800 mb-4">Enter your unique consumer/service number to fetch bill details and view payment history</p>

                {/* Consumer Number Input with Enhanced Styling */}
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Consumer Number (Service Number) <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-600 mb-4 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    👉 This is the unique ID for each connection. You can find it on your previous electricity bill.
                  </p>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={consumerNumber}
                        onChange={(e) => setConsumerNumber(e.target.value)}
                        placeholder="Enter your consumer number (min. 10 digits)"
                        className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg font-mono"
                      />
                      {consumerNumber && (
                        <p className="text-xs text-gray-500 mt-2">
                          Characters entered: {consumerNumber.length} (minimum 10 required)
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleFetchBill}
                      disabled={consumerNumber.length < 10}
                      className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center gap-3 transition-all shadow-lg hover:shadow-xl"
                    >
                      <Search className="w-6 h-6" />
                      Fetch Bill
                    </button>
                  </div>
                </div>
              </div>

              {/* Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-100 to-cyan-100 border-l-4 border-blue-500 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Shield className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="font-semibold text-blue-900">Secure Payment</h4>
                  </div>
                  <p className="text-sm text-blue-800">
                    All transactions are secured with 256-bit SSL encryption and comply with RBI guidelines.
                  </p>
                </div>
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-l-4 border-green-500 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Clock className="w-5 h-5 text-green-600 mr-2" />
                    <h4 className="font-semibold text-green-900">Instant Processing</h4>
                  </div>
                  <p className="text-sm text-green-800">
                    Payments are processed instantly with real-time confirmation and receipt generation.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-l-4 border-amber-500 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Lightbulb className="w-5 h-5 text-amber-600 mr-2" />
                  <h4 className="font-semibold text-amber-900">💡 Pro Tip</h4>
                </div>
                <p className="text-sm text-amber-800">
                  <strong>Save time:</strong> Your consumer number is a unique identifier for your electricity connection. It typically consists of 10-15 digits and is mentioned on every bill you receive. Keep it handy for quick payments!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation and Content - appears only after consumer is verified */}
        {consumerVerified && !paymentSuccess && (
          <div>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setShowHistory(false)}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                  !showHistory
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300"
                }`}
              >
                <CreditCard className="w-5 h-5" />
                Pay Bill
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                  showHistory
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300"
                }`}
              >
                <History className="w-5 h-5" />
                Payment History
              </button>
            </div>

            {/* Payment History View */}
            {showHistory && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">📊 Payment History</h2>
                    <p className="text-gray-600">Complete payment records for Consumer #: <span className="font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">{consumerNumber}</span></p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors">
                      <Download className="w-4 h-4 inline mr-1" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Enhanced Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Total Bills</p>
                        <p className="text-3xl font-bold text-blue-600">{PAYMENT_HISTORY.length}</p>
                      </div>
                      <Calendar className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-l-4 border-green-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Paid Bills</p>
                        <p className="text-3xl font-bold text-green-600">{history.filter(b => b.paid).length}</p>
                        <p className="text-xs text-green-600 mt-1">100% success rate</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border-l-4 border-yellow-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Pending Bills</p>
                        <p className="text-3xl font-bold text-yellow-600">{history.filter(b => !b.paid).length}</p>
                        <p className="text-xs text-yellow-600 mt-1">Requires attention</p>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-l-4 border-purple-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Avg. Monthly</p>
                        <p className="text-3xl font-bold text-purple-600">₹{Math.round(history.reduce((sum, b) => sum + b.amount, 0) / history.length)}</p>
                        <p className="text-xs text-purple-600 mt-1">Based on history</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Enhanced Payment History Table */}
                <div className="overflow-x-auto bg-gray-50 rounded-xl p-6">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 bg-white rounded-lg">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 rounded-l-lg">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Bill Month
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          <div className="flex items-center gap-2">
                            <IndianRupee className="w-4 h-4" />
                            Amount
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Due Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Units
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 rounded-r-lg">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((bill, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-white transition-all rounded-lg">
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">{bill.month}</td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{bill.amount.toLocaleString('en-IN')}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="w-4 h-4" />
                              {new Date(bill.dueDate).toLocaleDateString('en-IN')}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4" />
                              {bill.unitsConsumed} kWh
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                                  bill.paid
                                    ? "bg-green-100 text-green-700"
                                    : new Date(bill.dueDate) < new Date()
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {bill.paid ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Paid
                                  </>
                                ) : new Date(bill.dueDate) < new Date() ? (
                                  <>
                                    <XCircle className="w-4 h-4" />
                                    Overdue
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-4 h-4" />
                                    Pending
                                  </>
                                )}
                              </span>
                              {bill.paid && bill.paidDate && (
                                <span className="text-xs text-gray-500 block mt-1">
                                  ({new Date(bill.paidDate).toLocaleDateString('en-IN')})
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                if (!bill.paid) {
                                  setBillData({
                                    consumerNumber: consumerNumber,
                                    name: "Rajesh Kumar",
                                    address: "123, Anna Nagar, Chennai - 600040",
                                    billAmount: bill.amount,
                                    dueDate: bill.dueDate,
                                    billMonth: bill.month,
                                    unitsConsumed: bill.unitsConsumed,
                                    previousDues: 0,
                                    totalAmount: bill.amount,
                                    ratePerUnit: 5.0,
                                    lastReading: 2450,
                                    currentReading: 2450 + bill.unitsConsumed,
                                  });
                                  setShowHistory(false);
                                  toast.success(`Bill for ${bill.month} loaded. Ready to pay!`);
                                } else {
                                  toast.info(`Bill for ${bill.month} already paid on ${bill.paidDate}`);
                                }
                              }}
                              disabled={bill.paid}
                              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                bill.paid
                                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                              }`}
                            >
                              {bill.paid ? "Paid" : "Pay Now"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Additional Stats Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                      Payment Summary
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Total Amount Paid</span>
                        <span className="font-bold text-green-600">₹{history.filter(b => b.paid).reduce((sum, b) => sum + b.amount, 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Pending Amount</span>
                        <span className="font-bold text-yellow-600">₹{history.filter(b => !b.paid).reduce((sum, b) => sum + b.amount, 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900">Total Outstanding</span>
                          <span className="font-bold text-lg text-blue-600">₹{(history.filter(b => !b.paid).reduce((sum, b) => sum + b.amount, 0)).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Activity className="w-5 h-5 text-green-600 mr-2" />
                      Usage Analytics
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Average Monthly Usage</span>
                        <span className="font-semibold text-green-600">{Math.round(history.reduce((sum, b) => sum + b.unitsConsumed, 0) / history.length)} kWh</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Highest Usage Month</span>
                        <span className="font-semibold text-green-600">{Math.max(...history.map(b => b.unitsConsumed))} kWh</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Lowest Usage Month</span>
                        <span className="font-semibold text-green-600">{Math.min(...history.map(b => b.unitsConsumed))} kWh</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back to Pay Bill Button */}
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setShowHistory(false)}
                    className="px-8 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                  >
                    ← Back to Pay Bill
                  </button>
                </div>
              </div>
            )}

            {/* Pay Bill View */}
            {!showHistory && billData && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">💳 Pay Electricity Bill</h2>
                  <p className="text-gray-600">Secure payment for {billData.billMonth} bill</p>
                </div>

                <div className="space-y-8">
                  {/* Step 2 & 3: Bill Details */}
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                        2-3
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">📊 Bill & Consumption Details</h3>
                    </div>

                    {/* Enhanced Consumer Info Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-6 border border-blue-100">
                      <div className="flex items-center mb-4">
                        <Users className="w-5 h-5 text-blue-600 mr-2" />
                        <h4 className="font-semibold text-gray-900">Consumer Information</h4>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Consumer Name</p>
                          <p className="font-semibold text-gray-900 text-lg">{billData.name}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Consumer Number</p>
                          <p className="font-mono font-semibold text-gray-900 text-lg bg-gray-50 px-3 py-1 rounded">{billData.consumerNumber}</p>
                        </div>
                        <div className="md:col-span-2 bg-white rounded-lg p-4 border border-blue-200">
                          <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Service Address</p>
                          <p className="font-semibold text-gray-900 flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                            {billData.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Consumption Details Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
                      <div className="flex items-center mb-4">
                        <Activity className="w-5 h-5 text-green-600 mr-2" />
                        <h4 className="font-semibold text-gray-900">⚡ Consumption Details</h4>
                      </div>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center border border-blue-200">
                          <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                            <TrendingDown className="w-6 h-6 text-blue-600" />
                          </div>
                          <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Last Reading</p>
                          <p className="text-3xl font-bold text-blue-600">{billData.lastReading?.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-gray-600">kWh</p>
                        </div>
                        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 text-center border border-cyan-200">
                          <div className="w-12 h-12 bg-cyan-200 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Activity className="w-6 h-6 text-cyan-600" />
                          </div>
                          <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Current Reading</p>
                          <p className="text-3xl font-bold text-cyan-600">{billData.currentReading?.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-gray-600">kWh</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center border border-green-200">
                          <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Zap className="w-6 h-6 text-green-600" />
                          </div>
                          <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Units Consumed</p>
                          <p className="text-3xl font-bold text-green-600">{billData.unitsConsumed}</p>
                          <p className="text-xs text-gray-600">kWh</p>
                        </div>
                      </div>

                      {/* Energy Insights */}
                      <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                        <div className="flex items-center mb-3">
                          <Calculator className="w-5 h-5 text-purple-600 mr-2" />
                          <h5 className="font-semibold text-purple-900">Energy Insights</h5>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <p className="text-xs text-gray-600">Rate per Unit</p>
                            <p className="font-bold text-purple-600">₹{billData.ratePerUnit}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Monthly Avg</p>
                            <p className="font-bold text-purple-600">{energyInsights.averageUsage} kWh</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Efficiency</p>
                            <p className="font-bold text-purple-600">{energyInsights.efficiency}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">CO₂ Footprint</p>
                            <p className="font-bold text-purple-600">{calculateCarbonFootprint(billData.unitsConsumed)} kg</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Bill Amount Summary */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-6 shadow-lg">
                      <div className="flex items-center mb-4">
                        <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                        <h4 className="font-semibold text-gray-900">💰 Bill Summary</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center bg-white rounded-lg p-4 border border-green-200">
                          <span className="text-gray-700 font-medium">Current Bill Amount</span>
                          <span className="font-bold text-xl text-gray-900">₹{billData.billAmount.toLocaleString('en-IN')}</span>
                        </div>
                        {billData.previousDues > 0 && (
                          <div className="flex justify-between items-center bg-white rounded-lg p-4 border border-red-200">
                            <span className="text-gray-700 font-medium">Previous Dues</span>
                            <span className="font-bold text-xl text-red-600">+ ₹{billData.previousDues.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        <div className="border-t-2 border-green-300 pt-4">
                          <div className="flex justify-between items-center bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border-2 border-green-300">
                            <span className="font-bold text-gray-900 text-lg">Total Amount Due</span>
                            <span className="font-bold text-3xl text-green-600">₹{billData.totalAmount.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-200">
                          <span className="text-gray-600 flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Due Date
                          </span>
                          <span className={`font-semibold ${new Date(billData.dueDate) < new Date() ? 'text-red-600' : 'text-green-600'}`}>
                            {new Date(billData.dueDate).toLocaleDateString('en-IN', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Payment Method Selection */}
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                        4
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">💳 Select Payment Method</h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      {[
                        {
                          id: "UPI",
                          label: "UPI Payment",
                          icon: <Smartphone className="w-8 h-8" />,
                          description: "Instant payment via UPI apps like GPay, PhonePe, Paytm",
                          benefits: ["Instant confirmation", "No transaction fees", "Secure & encrypted"],
                          color: "blue"
                        },
                        {
                          id: "Credit Card",
                          label: "Credit/Debit Card",
                          icon: <CreditCard className="w-8 h-8" />,
                          description: "Pay using your credit or debit card",
                          benefits: ["Reward points", "EMI options", "International cards accepted"],
                          color: "purple"
                        },
                        {
                          id: "Net Banking",
                          label: "Net Banking",
                          icon: <Landmark className="w-8 h-8" />,
                          description: "Direct payment from your bank account",
                          benefits: ["Direct from account", "No card required", "Bank-level security"],
                          color: "green"
                        }
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setSelectedPaymentMethod(method.id)}
                          className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                            selectedPaymentMethod === method.id
                              ? `border-${method.color}-600 bg-${method.color}-50 shadow-md`
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className={`mb-4 flex justify-center ${
                            selectedPaymentMethod === method.id ? `text-${method.color}-600` : "text-gray-600"
                          }`}>
                            {method.icon}
                          </div>
                          <p className="font-bold text-gray-900 text-lg mb-2">{method.label}</p>
                          <p className="text-sm text-gray-600 mb-4">{method.description}</p>
                          <div className="space-y-1">
                            {method.benefits.map((benefit, index) => (
                              <div key={index} className="flex items-center text-xs text-gray-500">
                                <CheckCircle2 className="w-3 h-3 mr-2 text-green-500" />
                                {benefit}
                              </div>
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>

                    {selectedPaymentMethod && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-600 rounded-lg p-6 mb-6">
                        <div className="flex items-center mb-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <h4 className="font-semibold text-green-900">Payment Method Selected</h4>
                        </div>
                        <p className="text-sm text-green-800 mb-4">
                          👉 You've selected <strong className="text-green-900">{selectedPaymentMethod}</strong> as your payment method.
                          Click "Pay Now" to proceed with the payment of <strong className="text-green-900">₹{billData.totalAmount.toLocaleString('en-IN')}</strong>.
                        </p>
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                          <p className="text-xs text-gray-600">
                            <strong>Security Note:</strong> All transactions are secured with 256-bit SSL encryption and comply with RBI guidelines.
                            Your payment information is protected by industry-standard security measures.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {/* Energy Saving Tips */}
                      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
                        <div className="flex items-center mb-4">
                          <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
                          <h4 className="font-semibold text-yellow-900">💡 Energy Saving Tip</h4>
                        </div>
                        <p className="text-sm text-yellow-800 mb-3">
                          {energySavingTips[Math.floor(Math.random() * energySavingTips.length)]}
                        </p>
                        <p className="text-xs text-yellow-700">
                          Save up to ₹{energyInsights.savings} monthly with smart energy practices!
                        </p>
                      </div>

                      {/* Quick Actions */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                        <div className="flex items-center mb-4">
                          <Zap className="w-5 h-5 text-blue-600 mr-2" />
                          <h4 className="font-semibold text-blue-900">⚡ Quick Actions</h4>
                        </div>
                        <div className="space-y-2">
                          <button
                            onClick={() => setAutoPayEnabled(!autoPayEnabled)}
                            className="w-full text-left px-3 py-2 text-sm bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                          >
                            {autoPayEnabled ? '✅' : '⏰'} Auto-payment {autoPayEnabled ? 'Enabled' : 'Setup'}
                          </button>
                          <button
                            onClick={() => setShowHistory(true)}
                            className="w-full text-left px-3 py-2 text-sm bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                          >
                            📊 View Payment History
                          </button>
                          <button
                            onClick={() => toast.info("Download feature coming soon!")}
                            className="w-full text-left px-3 py-2 text-sm bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                          >
                            📄 Download Bill PDF
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handlePayment}
                        disabled={!selectedPaymentMethod || isProcessing}
                        className="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-6 h-6" />
                            Pay Now (₹{billData.totalAmount.toLocaleString('en-IN')})
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setBillData(null);
                          setConsumerNumber("");
                          setSelectedPaymentMethod("");
                          setConsumerVerified(false);
                        }}
                        className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Payment Security Notice */}
                    <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center mb-2">
                        <Shield className="w-5 h-5 text-gray-600 mr-2" />
                        <h5 className="font-semibold text-gray-900 text-sm">Secure Payment Guarantee</h5>
                      </div>
                      <p className="text-xs text-gray-600">
                        Your payment is protected by bank-level security. All transactions are monitored and insured.
                        Tamil Nadu Government ensures 100% secure and transparent billing process.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        </div>
        <AIChatbot />
      </div>
    </div>
  );
}
