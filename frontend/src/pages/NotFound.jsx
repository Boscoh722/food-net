import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Frown } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-6">
      <div className="text-center max-w-lg">
        {/* 404 Icon */}
        <div className="mb-8">
          <Frown className="w-24 h-24 mx-auto text-amber-500 animate-bounce" />
        </div>

        {/* 404 Text */}
        <h1 className="text-8xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
          404
        </h1>
        <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Oops! Page Not Found
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-white font-bold text-lg rounded-xl hover:bg-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ShoppingBag className="w-5 h-5" />
            Browse Products
          </Link>
        </div>

        {/* Fun Tip */}
        <p className="mt-12 text-sm text-gray-500 dark:text-gray-400">
          Tip: Try searching for fresh fruits or vegetables instead! 🍎🥬
        </p>
      </div>
    </div>
  );
}

export default NotFound;