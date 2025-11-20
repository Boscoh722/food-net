import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag, AlertTriangle } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-gray-800 p-8 rounded-2xl shadow-2xl border-2 border-gray-700">
        <div className="mb-8">
          <div className="bg-yellow-900 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-700">
            <AlertTriangle className="w-12 h-12 text-yellow-400" />
          </div>
          <h1 className="text-6xl font-bold text-white mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
          <p className="text-gray-400 mb-8">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl border border-blue-500"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
          
          <Link
            to="/products"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-700 border-2 border-gray-600 text-gray-200 rounded-xl hover:bg-gray-600 hover:border-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;