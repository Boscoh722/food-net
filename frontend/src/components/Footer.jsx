import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary mb-4">Food-Net</h3>
            <p className="text-gray-300 leading-relaxed">
              Connecting food buyers, sellers, and logistics across Kenya. 
              Bringing fresh produce directly from farms to your table.
            </p>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span className="text-sm">boscobrilli8@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Private Box, Nairobi-Kenya</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-3">
              <Link 
                to="/products" 
                className="text-gray-300 hover:text-primary transition-colors duration-200 w-fit"
              >
                Browse Products
              </Link>
              <Link 
                to="/register" 
                className="text-gray-300 hover:text-primary transition-colors duration-200 w-fit"
              >
                Become a Seller
              </Link>
              <Link 
                to="/orders" 
                className="text-gray-300 hover:text-primary transition-colors duration-200 w-fit"
              >
                Track Orders
              </Link>
              <Link 
                to="/complaints" 
                className="text-gray-300 hover:text-primary transition-colors duration-200 w-fit"
              >
                Support
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold mb-4">Legal</h4>
            <div className="flex flex-col gap-3">
              <Link 
                to="/privacy" 
                className="text-gray-300 hover:text-primary transition-colors duration-200 w-fit"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-gray-300 hover:text-primary transition-colors duration-200 w-fit"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Food-Net. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              Made with ❤️ for Kenya's agricultural community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
