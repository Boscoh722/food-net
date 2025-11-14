import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="gradient-bg text-white py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌱</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Food-Net</span>
            </div>
            <p className="text-gray-200 mb-6">
              Connecting farmers, buyers, and logistics across Kenya. Fresh produce from farm to table.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-200">
                <Mail className="w-5 h-5" />
                <span>boscobrilli8@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-200">
                <MapPin className="w-5 h-5" />
                <span>Private Box, Nairobi-Kenya</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6">Quick Links</h4>
            <div className="flex flex-col gap-4">
              <Link to="/products" className="text-gray-200 hover:text-white transition-colors duration-300">
                Browse Products
              </Link>
              <Link to="/register" className="text-gray-200 hover:text-white transition-colors duration-300">
                Become a Seller
              </Link>
              <Link to="/orders" className="text-gray-200 hover:text-white transition-colors duration-300">
                Track Orders
              </Link>
              <Link to="/complaints" className="text-gray-200 hover:text-white transition-colors duration-300">
                Support
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xl font-bold mb-6">Legal</h4>
            <div className="flex flex-col gap-4">
              <Link to="/privacy" className="text-gray-200 hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-200 hover:text-white transition-colors duration-300">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 text-center text-gray-300 text-sm">
          &copy; {new Date().getFullYear()} Food-Net. All rights reserved.
        </div>
      </div>
    </footer>
  );
}