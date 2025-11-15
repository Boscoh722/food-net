import { Link } from 'react-router-dom';
import { Mail, MapPin, Truck, Package, Users, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 border-t-2 border-gray-700 py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gray-800 p-3 rounded-xl border-2 border-gray-700">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🌱</span>
                </div>
              </div>
              <span className="text-3xl font-bold text-white">Food-Net</span>
            </div>
            <p className="text-gray-300 mb-6 text-lg">
              Connecting farmers, buyers, and logistics across Kenya. Fresh produce from farm to table.
            </p>
            </div>
           
          {/* Quick Links */}
          <div>
            <div className="bg-gray-800 p-4 rounded-2xl border-2 border-gray-700 mb-4">
              <h4 className="text-xl font-bold text-white flex items-center gap-2">
                <div className="bg-purple-900 p-1 rounded-lg border border-purple-700">
                  <Package className="w-5 h-5 text-purple-400" />
                </div>
                Quick Links
              </h4>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/products" className="text-gray-300 hover:text-blue-400 transition-all duration-300 bg-gray-800 hover:bg-gray-750 rounded-xl p-3 border-2 border-gray-700 hover:border-blue-500">
                Browse Products
              </Link>
              <Link to="/register" className="text-gray-300 hover:text-green-400 transition-all duration-300 bg-gray-800 hover:bg-gray-750 rounded-xl p-3 border-2 border-gray-700 hover:border-green-500">
                Become a Seller
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <div className="bg-gray-800 p-4 rounded-2xl border-2 border-gray-700 mb-4">
              <h4 className="text-xl font-bold text-white flex items-center gap-2">
                <div className="bg-red-900 p-1 rounded-lg border border-red-700">
                  <Shield className="w-5 h-5 text-red-400" />
                </div>
                Legal
              </h4>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/privacy" className="text-gray-300 hover:text-red-400 transition-all duration-300 bg-gray-800 hover:bg-gray-750 rounded-xl p-3 border-2 border-gray-700 hover:border-red-500">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-300 hover:text-orange-400 transition-all duration-300 bg-gray-800 hover:bg-gray-750 rounded-xl p-3 border-2 border-gray-700 hover:border-orange-500">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
    

        {/* Bottom Bar */}
        <div className="border-t-2 border-gray-700 pt-8 text-center">
          <div className="bg-gray-800 rounded-2xl p-4 border-2 border-gray-700">
            <p className="text-gray-300 text-sm">
              &copy; {new Date().getFullYear()} Food-Net. All rights reserved. | Connecting Kenya's agricultural ecosystem
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}