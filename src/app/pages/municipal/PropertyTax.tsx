import { useState, useEffect } from "react";
import { AIChatbot } from "../../components/AIChatbot";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  CreditCard, 
  CheckCircle2, 
  Download, 
  History, 
  AlertTriangle,
  Edit3,
  Bell,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { 
  getPropertyTaxRecord,
  payPropertyTax, 
  getPaymentHistory, 
  requestPropertyCorrection,
  checkReminders,
  PropertyTaxRecord,
  TaxBreakdown
} from "../../../backend/propertyTaxService";

export function PropertyTax() {
  const [propertyId, setPropertyId] = useState("");
  const [taxData, setTaxData] = useState<PropertyTaxRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);
  const [correctionDetails, setCorrectionDetails] = useState("");
  const [reminders, setReminders] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking'>('UPI');
  const [partialAmount, setPartialAmount] = useState(0);

  useEffect(() => {
    // Check for reminders on load
    const todayReminders = checkReminders();
    if (todayReminders.length > 0) {
      toast.warning("You have overdue property tax payments!");
      setReminders(todayReminders);
    }
  }, []);

  const handleFetchTax = async () => {
    if (propertyId.length < 8) {
      toast.error("Property ID must be at least 8 characters (PTN + 8 digits)");
      return;
    }

    setLoading(true);
    try {
      const record = getPropertyTaxRecord(propertyId);
      if (record) {
        setTaxData(record);
        setPartialAmount(record.breakdown.total / 2); // Default partial
        toast.success("Property details loaded successfully");
      } else {
        toast.error("Property ID not found. Verify and try again.");
      }
    } catch (error) {
      toast.error("Failed to fetch property tax details");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!taxData) return;

    const amount = partialAmount || taxData.breakdown.total;
    if (amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    setPaymentLoading(true);
    try {
      const result = await payPropertyTax(propertyId, amount, paymentMethod);
      setPaymentId(result.transactionId);
      setTaxData(result.newRecord);
      setPaymentSuccess(true);
      toast.success(`Payment successful! TXN: ${result.transactionId}`);
    } catch (error: any) {
      toast.error(error.message || "Payment processing failed");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCorrectionRequest = () => {
    if (!correctionDetails.trim()) {
      toast.error("Please provide correction details");
      return;
    }
    const requestId = requestPropertyCorrection(propertyId, correctionDetails);
    toast.success(`Correction request ${requestId} submitted. Reference number emailed.`);
    setShowCorrectionForm(false);
    setCorrectionDetails("");
  };

  const downloadReceipt = () => {
    if (!paymentId || !taxData) return;
    
    const receipt = {
      transactionId: paymentId,
      propertyId: taxData.propertyId,
      ownerName: taxData.ownerName,
      address: taxData.address,
      breakdown: taxData.breakdown,
      amountPaid: partialAmount || taxData.breakdown.total,
      paymentMethod,
      date: new Date().toLocaleDateString(),
      status: "PAID"
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(receipt, null, 2));
    const link = document.createElement("a");
    link.href = dataStr;
    link.download = `tax-receipt-${paymentId}.json`;
    link.click();
    toast.success("Receipt downloaded");
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <Header showAuth={true} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 text-center border border-green-200">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Payment Successful!
            </h1>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-8 border border-green-200">
              <p className="text-2xl font-bold text-green-800 mb-2">
                Transaction ID: <span className="font-mono bg-white px-3 py-1 rounded-lg">{paymentId}</span>
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 mt-4">
                <div><span className="font-medium">Property ID:</span> {taxData?.propertyId}</div>
                <div><span className="font-medium">Amount:</span> ₹{(partialAmount || taxData?.breakdown.total)?.toLocaleString()}</div>
                <div><span className="font-medium">Method:</span> {paymentMethod}</div>
                <div><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={downloadReceipt}
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all"
              >
                <Download className="w-5 h-5" />
                Download Receipt
              </button>
              <Link
                to="/municipal"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all"
              >
                Pay Another Property
              </Link>
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-gray-800 hover:bg-gray-900 text-white rounded-2xl font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
        <AIChatbot />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header showAuth={true} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/municipal" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Municipal Services
        </Link>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                Property Tax Payment Portal
              </h1>
              <p className="text-gray-600 mb-8">Greater Chennai Corporation</p>

              {!taxData ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      Search Property ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={propertyId}
                        onChange={(e) => setPropertyId(e.target.value.toUpperCase())}
                        placeholder="PTN00123456"
                        maxLength={12}
                        className="w-full pl-12 pr-32 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all shadow-sm"
                      />
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                      <button
                        onClick={handleFetchTax}
                        disabled={loading || propertyId.length < 8}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed"
                      >
                        {loading ? "Searching..." : "Fetch Details"}
                      </button>
                    </div>
                    <div className="mt-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                      <p className="text-sm font-medium text-gray-800">
                        💡 Sample IDs: <span className="font-mono bg-white px-2 py-1 rounded text-xs">PTN00123456</span>, 
                        <span className="font-mono bg-white px-2 py-1 rounded text-xs ml-1">PTN00785678</span>, 
                        <span className="font-mono bg-white px-2 py-1 rounded text-xs ml-1">PTN00344567</span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Property Details */}
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-8 shadow-xl border border-indigo-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Property Information</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2 p-4 bg-white/50 rounded-2xl backdrop-blur-sm">
                        <label className="text-sm font-semibold text-indigo-700">Property ID</label>
                        <p className="text-xl font-bold text-indigo-900">{taxData.propertyId}</p>
                      </div>
                      <div className="space-y-2 p-4 bg-white/50 rounded-2xl backdrop-blur-sm">
                        <label className="text-sm font-semibold text-indigo-700">Owner Name</label>
                        <p className="font-semibold text-gray-900">{taxData.ownerName}</p>
                      </div>
                      <div className="space-y-2 p-4 bg-white/50 rounded-2xl backdrop-blur-sm">
                        <label className="text-sm font-semibold text-indigo-700">Type</label>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800">
                          {taxData.propertyType}
                        </span>
                      </div>
                      <div className="md:col-span-2 space-y-2 p-4 bg-white/50 rounded-2xl backdrop-blur-sm">
                        <label className="text-sm font-semibold text-indigo-700">Address</label>
                        <p className="font-semibold text-gray-900">{taxData.address}</p>
                      </div>
                      <div className="space-y-2 p-4 bg-white/50 rounded-2xl backdrop-blur-sm">
                        <label className="text-sm font-semibold text-indigo-700">Area</label>
                        <p className="font-semibold text-gray-900">{taxData.area}</p>
                      </div>
                      <div className="space-y-2 p-4 bg-white/50 rounded-2xl backdrop-blur-sm">
                        <label className="text-sm font-semibold text-indigo-700">Assessment Value</label>
                        <p className="font-semibold text-gray-900">₹{taxData.assessmentValue?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tax Breakdown */}
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 shadow-xl border border-emerald-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Tax Breakdown</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 bg-white rounded-2xl border border-gray-200 text-center">
                          <p className="text-sm text-gray-600 font-medium">Base Tax</p>
                          <p className="text-2xl font-bold text-gray-900">₹{taxData.breakdown.baseTax.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-gray-200 text-center">
                          <p className="text-sm text-gray-600 font-medium">Water Tax</p>
                          <p className="text-2xl font-bold text-blue-600">₹{taxData.breakdown.waterTax.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-gray-200 text-center">
                          <p className="text-sm text-gray-600 font-medium">Sewage Tax</p>
                          <p className="text-2xl font-bold text-green-600">₹{taxData.breakdown.sewageTax.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-gray-200 text-center">
                          <p className="text-sm text-gray-600 font-medium">Penalty</p>
                          <p className={`text-2xl font-bold ${taxData.breakdown.penalty > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                            ₹{taxData.breakdown.penalty.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-end">
                          <h4 className="text-xl font-bold text-gray-900">Total Amount Due</h4>
                          <div className="text-right">
                            <p className="text-4xl font-black text-emerald-700">₹{taxData.breakdown.total.toLocaleString()}</p>
                            <p className="text-lg text-gray-600 mt-1">
                              Due Date: <span className={`font-semibold ${taxData.status === 'overdue' ? 'text-red-600' : ''}`}>
                                {taxData.dueDate}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Section */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-8 shadow-xl border border-orange-200">
                    <div className="flex items-center gap-3 mb-6">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                      <h3 className="text-2xl font-bold text-gray-900">
                        Payment Options
                      </h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-2xl hover:border-blue-300 transition-all cursor-pointer group">
                        <input
                          type="radio"
                          name="method"
                          value="UPI"
                          checked={paymentMethod === 'UPI'}
                          onChange={(e) => setPaymentMethod('UPI' as any)}
                          className="sr-only"
                        />
                        <CreditCard className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform mr-3" />
                        <div>
                          <p className="font-semibold text-gray-900">UPI</p>
                          <p className="text-sm text-gray-600">PhonePe, GPay, Paytm</p>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-2xl hover:border-green-300 transition-all cursor-pointer group">
                        <input
                          type="radio"
                          name="method"
                          value="Card"
                          checked={paymentMethod === 'Card'}
                          onChange={(e) => setPaymentMethod('Card' as any)}
                          className="sr-only"
                        />
                        <CreditCard className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform mr-3" />
                        <div>
                          <p className="font-semibold text-gray-900">Card</p>
                          <p className="text-sm text-gray-600">Visa, Master, RuPay</p>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-2xl hover:border-purple-300 transition-all cursor-pointer group">
                        <input
                          type="radio"
                          name="method"
                          value="Net Banking"
                          checked={paymentMethod === 'Net Banking'}
                          onChange={(e) => setPaymentMethod('Net Banking' as any)}
                          className="sr-only"
                        />
                        <CreditCard className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform mr-3" />
                        <div>
                          <p className="font-semibold text-gray-900">Net Banking</p>
                          <p className="text-sm text-gray-600">All major banks</p>
                        </div>
                      </label>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-lg font-semibold text-gray-900 mb-2">
                        Amount (₹)
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="number"
                          value={partialAmount}
                          onChange={(e) => setPartialAmount(Number(e.target.value) || 0)}
                          placeholder={`0`}
                          className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all"
                          min="0"
                          max={taxData.breakdown.total}
                        />
                        <button
                          type="button"
                          onClick={() => setPartialAmount(taxData.breakdown.total)}
                          className="px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-lg whitespace-nowrap"
                        >
                          Pay Full (₹{taxData.breakdown.total.toLocaleString()})
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        You can pay full amount or partial payment. Balance will carry forward.
                      </p>
                    </div>

                    <button
                      onClick={handlePayment}
                      disabled={paymentLoading || partialAmount <= 0 || taxData.status === 'paid'}
                      className="w-full mt-8 px-8 py-5 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white text-xl font-black rounded-3xl shadow-2xl hover:shadow-3xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {paymentLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-7 h-7" />
                          Pay ₹{partialAmount.toLocaleString()} Now
                        </>
                      )}
                    </button>
                  </div>

                  {/* Correction Request */}
                  <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl border border-purple-200">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Edit3 className="w-6 h-6" />
                      Need Correction?
                    </h4>
                    <p className="text-gray-700 mb-4">
                      Wrong details? Request update for property information or tax assessment.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowCorrectionForm(true)}
                        className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-semibold transition-all shadow-md hover:shadow-lg"
                      >
                        Request Correction
                      </button>
                      <Link
                        to="/municipal"
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-semibold border border-gray-200 transition-all"
                      >
                        Check Another
                      </Link>
                    </div>
                  </div>
                </>
              )}

              {showHistory && taxData && (
                <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl border border-gray-200">
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <History className="w-8 h-8" />
                      Payment History
                    </h4>
                    <button
                      onClick={() => setShowHistory(false)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-colors"
                    >
                      Close
                    </button>
                  </div>
                  {taxData.paymentHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-xl text-gray-600 font-semibold mb-2">No payments yet</p>
                      <p className="text-gray-500">Payment history will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {taxData.paymentHistory.map((payment, index) => (
                        <div key={index} className="group flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm border hover:shadow-md transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              {payment.method}
                            </div>
                            <div>
                              <p className="font-bold text-xl text-gray-900">₹{payment.amount.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">{new Date(payment.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <code className="bg-gray-100 px-3 py-2 rounded-xl font-mono text-sm text-gray-700 group-hover:bg-gray-200 transition-colors">
                            {payment.transactionId}
                          </code>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {showCorrectionForm && taxData && (
                <div className="p-8 bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl border border-rose-200">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <Edit3 className="w-8 h-8 text-rose-600" />
                      Request Property Correction
                    </h4>
                    <button
                      onClick={() => setShowCorrectionForm(false)}
                      className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-700 mb-3">
                        Please describe the correction needed (wrong address, area, ownership, etc.):
                      </p>
                      <textarea
                        value={correctionDetails}
                        onChange={(e) => setCorrectionDetails(e.target.value)}
                        rows={4}
                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 resize-vertical text-lg"
                        placeholder="Example: Property area is 1500 sq ft not 1200 sq ft. Ownership changed to joint name with wife..."
                      />
                    </div>
                    <button
                      onClick={handleCorrectionRequest}
                      className="w-full px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all"
                    >
                      Submit Correction Request
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Reminders Sidebar */}
            {reminders.length > 0 && (
              <div className="lg:col-span-1 p-6 bg-gradient-to-b from-yellow-50 to-orange-50 rounded-3xl border border-yellow-200">
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="w-6 h-6 text-yellow-600 animate-pulse" />
                  <h3 className="text-lg font-bold text-gray-900">Payment Reminders</h3>
                </div>
                <div className="space-y-3">
                  {reminders.map((reminder, index) => (
                    <div key={index} className="p-4 bg-white rounded-2xl border-l-4 border-yellow-400 shadow-sm">
                      <p className="font-semibold text-gray-900">{reminder.message}</p>
                      <p className="text-sm text-gray-600">{new Date(reminder.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <AIChatbot />
    </div>
  );
}

