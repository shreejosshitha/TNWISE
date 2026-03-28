import { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { AIChatbot } from "../../components/AIChatbot";
import { Link, useSearchParams } from "react-router";
import { ArrowLeft, Search, CreditCard, CheckCircle2, Loader2, Download } from "lucide-react";
import { toast } from "sonner";

interface PreviousBill {
  id: string;
  billMonth: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'unpaid';
}

interface WaterBill {
  propertyId: string;
  consumerNumber: string;
  name: string;
  address: string;
  mobileNumber: string;
  billAmount: number;
  dueDate: string;
  waterConsumption: number;
  billMonth: string;
  billingPeriod: string;
  previousBills: PreviousBill[];
}

interface PaymentResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

// Simulate network delay
const simulateNetworkDelay = (ms: number = 800) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Calculate billing period based on bill month
 */
const getBillingPeriod = (billMonth: string): string => {
  const monthMap: Record<string, string> = {
    'January': 'Oct-Dec',
    'February': 'Nov-Jan',
    'March': 'Dec-Feb',
    'April': 'Jan-Mar',
    'May': 'Feb-Apr',
    'June': 'Mar-May',
    'July': 'Apr-Jun',
    'August': 'May-Jul',
    'September': 'Jun-Aug',
    'October': 'Jul-Sep',
    'November': 'Aug-Oct',
    'December': 'Sep-Nov'
  };

  const year = billMonth.includes('2026') ? '2025' : '2026';
  const month = billMonth.split(' ')[0];

  return `${monthMap[month] || 'Jan-Mar'} ${year}`;
};

/**
 * Get water bill details by property ID (simulated backend call)
 */
const getWaterBill = async (propertyId: string): Promise<PaymentResponse> => {
  await simulateNetworkDelay();

  if (!propertyId || propertyId.length < 8) {
    return {
      success: false,
      message: "Invalid property ID",
      error: "INVALID_PROPERTY_ID",
    };
  }

  // Simulate backend lookup - in real app this would query database
  const billData: WaterBill = {
    propertyId: propertyId,
    consumerNumber: propertyId,
    name: "Rajesh Kumar",
    address: "123, Anna Nagar, Chennai - 600040",
    mobileNumber: "9876543210",
    billAmount: 850,
    dueDate: "2026-04-05",
    waterConsumption: 15000,
    billMonth: "March 2026",
    billingPeriod: getBillingPeriod("March 2026"),
    previousBills: getPreviousBills(propertyId),
  };

  return {
    success: true,
    message: "Bill details retrieved successfully",
    data: billData,
  };
};

/**
 * Process water bill payment (simulated backend call)
 */
const processWaterPayment = async (
  propertyId: string,
  amount: number
): Promise<PaymentResponse> => {
  await simulateNetworkDelay(1500);

  if (!propertyId || propertyId.length < 8) {
    return {
      success: false,
      message: "Invalid property ID",
      error: "INVALID_PROPERTY_ID",
    };
  }

  if (!amount || amount <= 0) {
    return {
      success: false,
      message: "Invalid payment amount",
      error: "INVALID_AMOUNT",
    };
  }

  // Simulate payment processing
  return {
    success: true,
    message: "Payment processed successfully",
    data: {
      transactionId: `TXN_${Date.now()}`,
      amount: amount,
      propertyId: propertyId,
      paymentDate: new Date().toISOString(),
    },
  };
};

/**
 * Get previous bills for a property
 */
const getPreviousBills = (propertyId: string): PreviousBill[] => {
  // Dummy data based on propertyId
  const dummyBills: Record<string, PreviousBill[]> = {
    '12345678': [
      {
        id: 'bill-001',
        billMonth: 'February 2026',
        amount: 780,
        dueDate: '2026-03-05',
        paidDate: '2026-03-01',
        status: 'paid',
      },
      {
        id: 'bill-002',
        billMonth: 'January 2026',
        amount: 720,
        dueDate: '2026-02-05',
        paidDate: '2026-02-03',
        status: 'paid',
      },
      {
        id: 'bill-003',
        billMonth: 'December 2025',
        amount: 800,
        dueDate: '2026-01-05',
        status: 'unpaid',
      },
    ],
    // Add more propertyIds if needed
  };

  return dummyBills[propertyId] || [];
};

export function WaterBillPayment() {
  const [searchParams] = useSearchParams();
  const [propertyId, setPropertyId] = useState(searchParams.get("propertyId") || "");
  const [billData, setBillData] = useState<WaterBill | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    transactionId: string;
    amount: number;
    paymentMethod: string;
    paymentDate: string;
    propertyId: string;
    billMonth: string;
    billingPeriod: string;
    name: string;
    address: string;
    consumerNumber: string;
    mobileNumber: string;
  } | null>(null);

  useEffect(() => {
    if (!billData && propertyId.length >= 8 && !isLoading) {
      handleFetchBill();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  const handleFetchBill = async () => {
    if (propertyId.length < 8) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getWaterBill(propertyId);

      if (response.success) {
        setBillData(response.data);
      } else {
        setError(response.message || "Failed to fetch bill details");
        toast.error(response.message || "Failed to fetch bill details");
      }
    } catch (err) {
      setError("Network error occurred");
      toast.error("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayNow = () => {
    setShowPaymentOptions(true);
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
    setShowConfirmation(true);
    setShowPaymentOptions(false);
  };

  const handleConfirmPayment = async () => {
    if (!billData || !selectedPaymentMethod) return;

    setIsProcessingPayment(true);
    setError(null);

    try {
      const response = await processWaterPayment(billData.propertyId, billData.billAmount);

      if (response.success) {
        // Store payment details for receipt
        setPaymentDetails({
          transactionId: response.data.transactionId,
          amount: billData.billAmount,
          paymentMethod: selectedPaymentMethod,
          paymentDate: new Date().toLocaleString(),
          propertyId: billData.propertyId,
          billMonth: billData.billMonth,
          billingPeriod: billData.billingPeriod,
          name: billData.name,
          address: billData.address,
          consumerNumber: billData.consumerNumber,
          mobileNumber: billData.mobileNumber,
        });

        // Update localStorage for recent actions
        const action = {
          message: `Completed water bill payment for property ${billData.propertyId} via ${selectedPaymentMethod}`,
          timestamp: new Date().toLocaleString(),
        };

        try {
          const storageKey = "waterRecentActions";
          const raw = localStorage.getItem(storageKey);
          const existing = raw ? JSON.parse(raw) : [];
          const updated = [action, ...existing].slice(0, 5);
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch {
          // ignore storage errors
        }

        setPaymentSuccess(true);
        setShowConfirmation(false);
        toast.success("Payment successful!");
      } else {
        setError(response.message || "Payment failed");
        toast.error(response.message || "Payment failed");
      }
    } catch (err) {
      setError("Network error occurred during payment");
      toast.error("Network error occurred during payment");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCancelPayment = () => {
    setShowPaymentOptions(false);
    setShowConfirmation(false);
    setSelectedPaymentMethod("");
  };

  const downloadReceipt = () => {
    if (!paymentDetails) return;

    // Create receipt HTML content
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Water Bill Payment Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            .title {
              font-size: 18px;
              color: #374151;
              margin-bottom: 20px;
            }
            .receipt-details {
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              padding: 5px 0;
            }
            .detail-label {
              font-weight: 600;
              color: #374151;
            }
            .detail-value {
              color: #1f2937;
            }
            .amount {
              font-size: 20px;
              font-weight: bold;
              color: #059669;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 12px;
            }
            .success-icon {
              color: #059669;
              font-size: 48px;
              text-align: center;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">TN WISE</div>
            <div class="title">Chennai Metropolitan Water Supply and Sewerage Board</div>
            <div style="font-size: 14px; color: #6b7280;">Payment Receipt</div>
          </div>

          <div style="text-align: center; margin-bottom: 30px;">
            <div class="success-icon">✓</div>
            <h2 style="color: #059669; margin: 0;">Payment Successful</h2>
          </div>

          <div class="receipt-details">
            <h3 style="margin-bottom: 15px; color: #374151; font-size: 16px;">Customer Details</h3>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">${paymentDetails.name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Mobile Number:</span>
              <span class="detail-value">${paymentDetails.mobileNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Consumer Number:</span>
              <span class="detail-value">${paymentDetails.consumerNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Address:</span>
              <span class="detail-value">${paymentDetails.address}</span>
            </div>

            <div style="border-top: 1px solid #e5e7eb; margin: 20px 0;"></div>

            <h3 style="margin-bottom: 15px; color: #374151; font-size: 16px;">Payment Details</h3>
            <div class="detail-row">
              <span class="detail-label">Transaction ID:</span>
              <span class="detail-value">${paymentDetails.transactionId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Property ID:</span>
              <span class="detail-value">${paymentDetails.propertyId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Bill Month:</span>
              <span class="detail-value">${paymentDetails.billMonth}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Billing Period:</span>
              <span class="detail-value">${paymentDetails.billingPeriod}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Payment Method:</span>
              <span class="detail-value">${paymentDetails.paymentMethod}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Payment Date:</span>
              <span class="detail-value">${paymentDetails.paymentDate}</span>
            </div>
            <div class="detail-row" style="border-top: 1px solid #e5e7eb; margin-top: 15px; padding-top: 15px;">
              <span class="detail-label amount">Total Amount Paid:</span>
              <span class="detail-value amount">₹${paymentDetails.amount}</span>
            </div>
          </div>

          <div class="footer">
            <p>This is a computer-generated receipt and does not require a signature.</p>
            <p>For any queries, contact Chennai Metropolitan Water Supply and Sewerage Board.</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    // Create a blob and download
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Water_Bill_Receipt_${paymentDetails.transactionId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-8">Your water tax has been paid successfully</p>

            {paymentDetails && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold text-gray-900 mb-4 text-center">Payment Details</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Transaction ID</p>
                    <p className="font-mono font-semibold text-gray-900">{paymentDetails.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Amount Paid</p>
                    <p className="font-bold text-green-600 text-lg">₹{paymentDetails.amount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Customer Name</p>
                    <p className="font-semibold text-gray-900">{paymentDetails.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Mobile Number</p>
                    <p className="font-semibold text-gray-900">{paymentDetails.mobileNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Consumer Number</p>
                    <p className="font-semibold text-gray-900">{paymentDetails.consumerNumber}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-600">Address</p>
                    <p className="font-semibold text-gray-900">{paymentDetails.address}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Method</p>
                    <p className="font-semibold text-gray-900">{paymentDetails.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Date</p>
                    <p className="font-semibold text-gray-900">{paymentDetails.paymentDate}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-600">Property & Bill Details</p>
                    <p className="font-semibold text-gray-900">
                      Property ID: {paymentDetails.propertyId} | {paymentDetails.billMonth} ({paymentDetails.billingPeriod})
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={downloadReceipt}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Receipt
              </button>
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors text-center"
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/water" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Water Services
        </Link>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pay Water Tax</h2>
          {!billData ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property ID</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    placeholder="Enter your property ID"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleFetchBill}
                    disabled={propertyId.length < 8 || isLoading}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                    {isLoading ? "Fetching..." : "Fetch Bill"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Bill Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Owner Name</p>
                    <p className="font-semibold text-gray-900">{billData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Property ID</p>
                    <p className="font-semibold text-gray-900">{billData.propertyId}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-semibold text-gray-900">{billData.address}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Bill Amount</h3>
                  <p className="text-3xl font-bold text-gray-900">₹{billData.billAmount}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <p className="text-gray-600">Due Date</p>
                  <p className="font-semibold text-red-600">{billData.dueDate}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <p className="text-gray-600">Billing Period</p>
                  <p className="font-semibold text-gray-700">{billData.billingPeriod}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Previous Bills</h3>
                {billData.previousBills.filter(bill => bill.status === 'paid').length === 0 ? (
                  <p className="text-gray-600">No previous paid bills found.</p>
                ) : (
                  <div className="space-y-3">
                    {billData.previousBills.filter(bill => bill.status === 'paid').map((bill) => (
                      <div key={bill.id} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div>
                          <p className="font-medium">{bill.billMonth}</p>
                          <p className="text-sm text-gray-600">Due: {bill.dueDate}</p>
                          {bill.paidDate && <p className="text-sm text-green-600">Paid: {bill.paidDate}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{bill.amount}</p>
                          <span className="text-sm px-2 py-1 rounded bg-green-100 text-green-700">
                            {bill.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              <div className="flex gap-4">
                <button
                  onClick={handlePayNow}
                  className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <CreditCard className="w-5 h-5" />
                  Pay Now
                </button>
                <button
                  onClick={() => setBillData(null)}
                  className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Options Modal */}
      {showPaymentOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Choose Payment Method</h3>
            <div className="space-y-4">
              <button
                onClick={() => handlePaymentMethodSelect("UPI")}
                className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">UPI</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">UPI</p>
                  <p className="text-sm text-gray-600">Pay using UPI apps</p>
                </div>
              </button>

              <button
                onClick={() => handlePaymentMethodSelect("Credit/Debit Card")}
                className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Credit/Debit Card</p>
                  <p className="text-sm text-gray-600">Visa, Mastercard, RuPay</p>
                </div>
              </button>

              <button
                onClick={() => handlePaymentMethodSelect("Net Banking")}
                className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">🏦</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Net Banking</p>
                  <p className="text-sm text-gray-600">Online banking login</p>
                </div>
              </button>
            </div>

            <button
              onClick={handleCancelPayment}
              className="w-full mt-6 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Payment Confirmation Modal */}
      {showConfirmation && billData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Confirm Payment</h3>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Property ID</span>
                <span className="font-semibold">{billData.propertyId}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Owner Name</span>
                <span className="font-semibold">{billData.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Mobile Number</span>
                <span className="font-semibold">{billData.mobileNumber}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Bill Month</span>
                <span className="font-semibold">{billData.billMonth}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Billing Period</span>
                <span className="font-semibold">{billData.billingPeriod}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold">{selectedPaymentMethod}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                <span className="text-lg font-bold text-gray-900">₹{billData.billAmount}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmPayment}
                disabled={isProcessingPayment}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {isProcessingPayment ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                {isProcessingPayment ? "Processing..." : "Confirm Payment"}
              </button>
              <button
                onClick={handleCancelPayment}
                disabled={isProcessingPayment}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <AIChatbot />
    </div>
  );
}
