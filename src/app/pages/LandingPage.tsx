import { Header } from "../components/Header";
import { Link } from "react-router";
import { Zap, Droplet, Building2, Bot, Eye, Shield } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Access All Public Services
            <span className="block text-blue-600 mt-2">in One Place</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Manage electricity, water, and municipal services seamlessly. 
            Pay bills, raise complaints, and track applications with complete transparency.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Available Services
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Link
            to="/electricity"
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Electricity ⚡</h3>
            <p className="text-gray-600 mb-4">
              Pay bills, apply for new connections, and track your electricity services
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Bill Payment</li>
              <li>✓ New Connection</li>
              <li>✓ Raise Complaints</li>
              <li>✓ Track Applications</li>
            </ul>
          </Link>

          <Link
            to="/water"
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Droplet className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Water 💧</h3>
            <p className="text-gray-600 mb-4">
              Manage water connections, pay taxes, and report supply issues
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Water Tax Payment</li>
              <li>✓ New Connection</li>
              <li>✓ Report Leakage</li>
              <li>✓ Supply Issues</li>
            </ul>
          </Link>

          <Link
            to="/municipal"
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <Building2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Municipal 🗑️</h3>
            <p className="text-gray-600 mb-4">
              Handle property tax, garbage collection, and civic complaints
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Property Tax</li>
              <li>✓ Garbage Complaints</li>
              <li>✓ Streetlight Issues</li>
              <li>✓ Road Damage</li>
            </ul>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Us?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Assistance</h3>
            <p className="text-gray-600">
              Get instant help with our AI chatbot. Voice and text support in Tamil and English.
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Full Transparency</h3>
            <p className="text-gray-600">
              Track every step of your application with our transparency tracker. Know exactly what's happening.
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Easy</h3>
            <p className="text-gray-600">
              Simple interface designed for everyone. OTP-based secure login with role-based access.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
                <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link to="/admin" className="hover:text-white">Admin</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/electricity" className="hover:text-white">Electricity</Link></li>
                <li><Link to="/water" className="hover:text-white">Water</Link></li>
                <li><Link to="/municipal" className="hover:text-white">Municipal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Accessibility</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2026 Smart Public Services - Government of Tamil Nadu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
