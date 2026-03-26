import { useState } from "react";
import { Header } from "../../components/Header";
import { AIChatbot } from "../../components/AIChatbot";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Search, CreditCard, Download, CheckCircle2, AlertCircle, Smartphone, Landmark, History, Calendar, IndianRupee } from "lucide-react";
import { toast } from "sonner";

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
  const [consumerNumber, setConsumerNumber] = useState("");
  const [billData, setBillData] = useState<any>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [consumerVerified, setConsumerVerified] = useState(false);
  const navigate = useNavigate();

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
    }, 2000);
  };

  const handleDownloadReceipt = () => {
    toast.success("Receipt downloaded successfully!");
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Header showAuth={true} />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful! 🎉</h2>
            <p className="text-gray-600 mb-8">
              Your electricity bill has been paid successfully
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
                Download Receipt
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
                Pay Another Bill
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
      <Header showAuth={true} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/electricity"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Electricity Services
        </Link>

        {/* Initial Consumer Number Input */}
        {!consumerVerified && !paymentSuccess && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💳 Pay Electricity Bill</h2>

            <div className="space-y-6">
              {/* Step 1: Consumer Details */}
              <div className="border-l-4 border-blue-600 bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">📋 Step 1: Enter Consumer Details</h3>
                <p className="text-sm text-blue-800">Enter your unique consumer/service number to fetch bill details and view payment history</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Consumer Number (Service Number) <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-600 mb-3">👉 This is the unique ID for each connection. You can find it on your previous electricity bill.</p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={consumerNumber}
                    onChange={(e) => setConsumerNumber(e.target.value)}
                    placeholder="Enter your consumer number (min. 10 digits)"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <button
                    onClick={handleFetchBill}
                    disabled={consumerNumber.length < 10}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Search className="w-5 h-5" />
                    Fetch Bill
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-transparent border-l-4 border-blue-500 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  💡 <strong>Tip:</strong> Your consumer number is a unique identifier for your electricity connection. It typically consists of 10-15 digits and is mentioned on every bill you receive.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation and Content - appears only after consumer is verified */}
        {consumerVerified && !paymentSuccess && (
          <>
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
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">📊 Payment History</h2>
                <p className="text-gray-600 mb-6">View all your electricity bills and payment status for Consumer #: <span className="font-semibold text-blue-600">{consumerNumber}</span></p>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-600">
                    <p className="text-sm text-gray-600 font-semibold">Total Bills</p>
                    <p className="text-3xl font-bold text-blue-600">{PAYMENT_HISTORY.length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-l-4 border-green-600">
                    <p className="text-sm text-gray-600 font-semibold">Paid Bills</p>
                    <p className="text-3xl font-bold text-green-600">{PAYMENT_HISTORY.filter(b => b.paid).length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border-l-4 border-red-600">
                    <p className="text-sm text-gray-600 font-semibold">Pending Bills</p>
                    <p className="text-3xl font-bold text-red-600">{PAYMENT_HISTORY.filter(b => !b.paid).length}</p>
                  </div>
                </div>

                {/* Payment History Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 bg-gray-50">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Bill Month
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          <div className="flex items-center gap-2">
                            <IndianRupee className="w-4 h-4" />
                            Amount
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Units</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PAYMENT_HISTORY.map((bill, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition">
                          <td className="px-4 py-4 text-sm font-semibold text-gray-900">{bill.month}</td>
                          <td className="px-4 py-4 text-sm font-bold text-gray-900">₹{bill.amount}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{new Date(bill.dueDate).toLocaleDateString('en-IN')}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{bill.unitsConsumed} kWh</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                                  bill.paid
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {bill.paid ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Paid
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-4 h-4" />
                                    Pending
                                  </>
                                )}
                              </span>
                              {bill.paid && bill.paidDate && (
                                <span className="text-xs text-gray-500">
                                  ({new Date(bill.paidDate).toLocaleDateString('en-IN')})
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
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
                                  });
                                  setShowHistory(false);
                                  toast.success(`Bill for ${bill.month} loaded. Ready to pay!`);
                                } else {
                                  toast.info(`Bill for ${bill.month} already paid on ${bill.paidDate}`);
                                }
                              }}
                              disabled={bill.paid}
                              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                                bill.paid
                                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                  : "bg-blue-600 hover:bg-blue-700 text-white"
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

                {/* Stats Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                    <p className="text-sm text-gray-600 font-semibold mb-2">Total Paid Amount</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{PAYMENT_HISTORY.filter(b => b.paid).reduce((sum, b) => sum + b.amount, 0)}
                    </p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-600">
                    <p className="text-sm text-gray-600 font-semibold mb-2">Pending Amount</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      ₹{PAYMENT_HISTORY.filter(b => !b.paid).reduce((sum, b) => sum + b.amount, 0)}
                    </p>
                  </div>
                </div>

                {/* Back to Pay Bill Button */}
                <button
                  onClick={() => setShowHistory(false)}
                  className="mt-8 w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  Back to Pay Bill
                </button>
              </div>
            )}

            {/* Pay Bill View */}
            {!showHistory && billData && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">💳 Pay Electricity Bill</h2>
                <div className="space-y-6">
                  {/* Step 2 & 3: Bill Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Step 2-3: Bill & Consumption Details</h3>
                    
                    {/* Consumer Info Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-6 border border-blue-100">
                      <h4 className="font-semibold text-gray-900 mb-4">Consumer Information</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">Consumer Name</p>
                          <p className="font-semibold text-gray-900 text-lg">{billData.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">Consumer Number</p>
                          <p className="font-mono font-semibold text-gray-900">{billData.consumerNumber}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-xs text-gray-600 font-semibold uppercase">Address</p>
                          <p className="font-semibold text-gray-900">{billData.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Consumption Details Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-4">⚡ Consumption Details</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Last Reading</p>
                          <p className="text-2xl font-bold text-blue-600">{billData.lastReading}</p>
                          <p className="text-xs text-gray-600">kWh</p>
                        </div>
                        <div className="bg-cyan-50 rounded-lg p-4">
                          <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Current Reading</p>
                          <p className="text-2xl font-bold text-cyan-600">{billData.currentReading}</p>
                          <p className="text-xs text-gray-600">kWh</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Units Consumed</p>
                          <p className="text-2xl font-bold text-green-600">{billData.unitsConsumed}</p>
                          <p className="text-xs text-gray-600">kWh</p>
                        </div>
                      </div>
                    </div>

                    {/* Bill Amount Summary */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-4">💰 Bill Summary</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Current Bill Amount</span>
                          <span className="font-semibold text-lg">₹{billData.billAmount}</span>
                        </div>
                        {billData.previousDues > 0 && (
                          <div className="flex justify-between items-center pb-3 border-b border-green-200">
                            <span className="text-gray-700">Previous Dues</span>
                            <span className="font-semibold text-lg text-red-600">+ ₹{billData.previousDues}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t-2 border-green-300">
                          <span className="font-bold text-gray-900 text-lg">Total Amount Due</span>
                          <span className="font-bold text-2xl text-green-600">₹{billData.totalAmount}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-2">
                          <span className="text-gray-600">Due Date</span>
                          <span className={`font-semibold ${new Date(billData.dueDate) < new Date() ? 'text-red-600' : 'text-green-600'}`}>
                            {new Date(billData.dueDate).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Payment Method Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">💳 Step 4: Select Payment Method</h3>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      {[
                        {
                          id: "UPI",
                          label: "UPI",
                          icon: <Smartphone className="w-6 h-6" />,
                          description: "Instant payment via UPI apps"
                        },
                        {
                          id: "Credit Card",
                          label: "Credit Card",
                          icon: <CreditCard className="w-6 h-6" />,
                          description: "Pay via Credit/Debit Card"
                        },
                        {
                          id: "Net Banking",
                          label: "Net Banking",
                          icon: <Landmark className="w-6 h-6" />,
                          description: "Pay via your bank account"
                        }
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setSelectedPaymentMethod(method.id)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedPaymentMethod === method.id
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 bg-white hover:border-blue-300"
                          }`}
                        >
                          <div className={`${selectedPaymentMethod === method.id ? "text-blue-600" : "text-gray-600"} mb-2 flex justify-center`}>
                            {method.icon}
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">{method.label}</p>
                          <p className="text-xs text-gray-600 mt-1">{method.description}</p>
                        </button>
                      ))}
                    </div>

                    {selectedPaymentMethod && (
                      <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-900">
                          👉 You've selected <strong>{selectedPaymentMethod}</strong> as your payment method. Click "Pay Now" to proceed.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={handlePayment}
                      disabled={!selectedPaymentMethod || isProcessing}
                      className="flex-1 px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Pay Now (₹{billData.totalAmount})
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setBillData(null);
                        setConsumerNumber("");
                        setSelectedPaymentMethod("");
                      }}
                      className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
          )}
        </div>
        <AIChatbot />
      </div>
  );
}
