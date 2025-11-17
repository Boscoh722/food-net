import { Link } from 'react-router-dom';
import { Package, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-primary-950 to-gray-950 py-16 text-gray-300">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-xl">🌱</span>
              </div>
              <span className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">Food-Net</span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              Connecting farmers, buyers, and logistics across Kenya. Fresh produce from farm to table with premium quality and service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-3 mb-6">
              <Package className="w-5 h-5 text-accent-400" /> 
              Quick Links
            </h4>
            <div className="flex flex-col gap-4 text-base">
              <Link
                to="/products"
                className="footer-link hover:text-accent-400 transition-all duration-300 transform hover:translate-x-2"
              >
                Browse Products
              </Link>
              <Link
                to="/register"
                className="footer-link hover:text-success-400 transition-all duration-300 transform hover:translate-x-2"
              >
                Become a Seller
              </Link>
              <Link
                to="/about"
                className="footer-link hover:text-primary-400 transition-all duration-300 transform hover:translate-x-2"
              >
                About Us
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xl font-semibold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-primary-400" /> 
              Legal
            </h4>
            <div className="flex flex-col gap-4 text-base">
              <Link
                to="/privacy"
                className="footer-link hover:text-primary-400 transition-all duration-300 transform hover:translate-x-2"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="footer-link hover:text-warning-400 transition-all duration-300 transform hover:translate-x-2"
              >
                Terms & Conditions
              </Link>
              <Link
                to="/contact"
                className="footer-link hover:text-accent-400 transition-all duration-300 transform hover:translate-x-2"
              >
                Contact Support
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700/50 text-center">
          <div className="text-gradient-premium text-sm font-semibold mb-2">
            &copy; {new Date().getFullYear()} Food-Net. All rights reserved.
          </div>
          <p className="text-gray-400 text-sm">
            Connecting Kenya's agricultural ecosystem with premium technology solutions
          </p>
        </div>
      </div>
    </footer>
  );
}