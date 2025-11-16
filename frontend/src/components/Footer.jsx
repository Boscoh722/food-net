import { Link } from 'react-router-dom';
import { Mail, MapPin, Truck, Package, Users, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 py-12 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🌱</span>
              </div>
              <span className="text-xl font-bold text-white">Food-Net</span>
            </div>
            <p className="text-gray-300 text-sm">
              Connecting farmers, buyers, and logistics across Kenya. Fresh produce from farm to table.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-purple-400" /> Quick Links
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link
                to="/products"
                className="hover:text-blue-400 transition-all duration-300"
              >
                Browse Products
              </Link>
              <Link
                to="/register"
                className="hover:text-green-400 transition-all duration-300"
              >
                Become a Seller
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-red-400" /> Legal
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link
                to="/privacy"
                className="hover:text-red-400 transition-all duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-orange-400 transition-all duration-300"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-4 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Food-Net. All rights reserved. | Connecting Kenya's agricultural ecosystem
        </div>
      </div>
    </footer>
  );
}
