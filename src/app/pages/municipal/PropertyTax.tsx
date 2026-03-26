import { useState } from "react";
import { Header } from "../../components/Header";
import { AIChatbot } from "../../components/AIChatbot";
import { Link } from "react-router";
import { ArrowLeft, Search, CreditCard, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function PropertyTax() {
  const [propertyId, setPropertyId] = useState("");
  const [taxData, setTaxData] = useState<any>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleFetchTax = () => {
    if (propertyId.length >= 8) {
      setTaxData({
        propertyId: propertyId,
        ownerName: "Rajesh Kumar",
        address: "123, Anna Nagar, Chennai - 600040",
        taxAmount: 5500,
        dueDate: "2026-04-30",
        propertyType: "Residential",
        area: "1200 sq ft",
      });
    }
  };

  const handlePayment = () => {
    setTimeout(() => {
      setPaymentSuccess(true);
      toast.success("Payment successful!");
    }, 1500);
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
            <p className="text-gray-600 mb-8">Your property tax has been paid successfully</p>
            <Link
              to="/dashboard"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Back to Dashboard
            </Link>
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
        <Link to="/municipal" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Municipal Services
        </Link>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pay Property Tax</h2>
          {!taxData ? (
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
                    onClick={handleFetchTax}
                    disabled={propertyId.length < 8}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Search className="w-5 h-5" />
                    Fetch Tax
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Property Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Owner Name</p>
                    <p className="font-semibold text-gray-900">{taxData.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Property ID</p>
                    <p className="font-semibold text-gray-900">{taxData.propertyId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Property Type</p>
                    <p className="font-semibold text-gray-900">{taxData.propertyType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Area</p>
                    <p className="font-semibold text-gray-900">{taxData.area}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-semibold text-gray-900">{taxData.address}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Tax Amount (Annual)</h3>
                  <p className="text-3xl font-bold text-gray-900">₹{taxData.taxAmount}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <p className="text-gray-600">Due Date</p>
                  <p className="font-semibold text-red-600">{taxData.dueDate}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handlePayment}
                  className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <CreditCard className="w-5 h-5" />
                  Pay Now
                </button>
                <button
                  onClick={() => setTaxData(null)}
                  className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <AIChatbot />
    </div>
  );
}
