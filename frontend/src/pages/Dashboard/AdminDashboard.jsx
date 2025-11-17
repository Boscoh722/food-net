import { useState, useEffect } from 'react';
import { 
  BarChart3, Users as UsersIcon, Package as PackageIcon, ShoppingCart, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    // TODO: Fetch stats from API
    // loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-950 to-gray-950">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <div className="bg-gradient-to-br from-white to-gray-50/80 rounded-2xl shadow-medium border border-gray-300/30 p-6">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-3 rounded-xl border border-primary-500">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              Administrator Dashboard
            </h1>
          </div>
          <Link 
            to="/AdminSettings"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 focus:ring-primary-300 shadow-lg hover:shadow-xl border border-primary-500 text-lg"
          >
            System Settings
          </Link>
        </div>

        {/* Quick Navigation Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              to="/AdminUsers" 
              className="bg-white rounded-2xl shadow-soft border border-gray-200/60 overflow-hidden group p-6 text-center hover:shadow-large hover:border-primary-200/50 transform hover:scale-105 transition-all duration-300 border-2 border-gray-200 hover:border-primary-500"
            >
              <div className="bg-gradient-to-r from-primary-100 to-primary-200 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-gradient-to-r group-hover:from-primary-200 group-hover:to-primary-300 transition-colors">
                <UsersIcon className="w-8 h-8 text-primary-800 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">User Management</h3>
              <p className="text-sm text-gray-600 mt-2">Manage all users and permissions</p>
              <div className="mt-4 text-2xl font-bold text-primary-700 bg-primary-50 rounded-xl py-2 px-3 border border-primary-200">
                Manage
              </div>
            </Link>
            
            <Link 
              to="/AdminProducts" 
              className="bg-white rounded-2xl shadow-soft border border-gray-200/60 overflow-hidden group p-6 text-center hover:shadow-large hover:border-success-200/50 transform hover:scale-105 transition-all duration-300 border-2 border-gray-200 hover:border-success-500"
            >
              <div className="bg-gradient-to-r from-success-100 to-success-200 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-gradient-to-r group-hover:from-success-200 group-hover:to-success-300 transition-colors">
                <PackageIcon className="w-8 h-8 text-success-800 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">Product Catalog</h3>
              <p className="text-sm text-gray-600 mt-2">Manage products and inventory</p>
              <div className="mt-4 text-2xl font-bold text-success-700 bg-success-50 rounded-xl py-2 px-3 border border-success-200">
                Manage
              </div>
            </Link>
            
            <Link 
              to="/AdminOrders" 
              className="bg-white rounded-2xl shadow-soft border border-gray-200/60 overflow-hidden group p-6 text-center hover:shadow-large hover:border-accent-200/50 transform hover:scale-105 transition-all duration-300 border-2 border-gray-200 hover:border-accent-500"
            >
              <div className="bg-gradient-to-r from-accent-100 to-accent-200 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-gradient-to-r group-hover:from-accent-200 group-hover:to-accent-300 transition-colors">
                <ShoppingCart className="w-8 h-8 text-accent-800 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">Order Management</h3>
              <p className="text-sm text-gray-600 mt-2">Process and track orders</p>
              <div className="mt-4 text-2xl font-bold text-accent-700 bg-accent-50 rounded-xl py-2 px-3 border border-accent-200">
                Manage
              </div>
            </Link>
            
            <Link 
              to="/AdminComplaints" 
              className="bg-white rounded-2xl shadow-soft border border-gray-200/60 overflow-hidden group p-6 text-center hover:shadow-large hover:border-error-200/50 transform hover:scale-105 transition-all duration-300 border-2 border-gray-200 hover:border-error-500"
            >
              <div className="bg-gradient-to-r from-error-100 to-error-200 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-gradient-to-r group-hover:from-error-200 group-hover:to-error-300 transition-colors">
                <MessageSquare className="w-8 h-8 text-error-800 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">Complaints & Support</h3>
              <p className="text-sm text-gray-600 mt-2">Handle customer complaints</p>
              <div className="mt-4 text-2xl font-bold text-error-700 bg-error-50 rounded-xl py-2 px-3 border border-error-200">
                Manage
              </div>
            </Link>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Recent Activity</h2>
          <div className="bg-gradient-to-br from-white to-gray-50/80 rounded-2xl shadow-medium border border-gray-300/30 p-8 min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-300">
                <BarChart3 className="w-10 h-10 text-gray-700" />
              </div>
              <p className="text-xl text-gray-700 italic">Dashboard content area for charts, recent logs, or management tables.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}