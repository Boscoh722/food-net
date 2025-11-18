import { BarChart3, Users, Package, ShoppingCart, MessageSquare, TrendingUp, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex justify-between items-center mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-200/60">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              Administrator Dashboard
            </h1>
          </div>
          <Link 
            to="/AdminSettings"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Settings className="w-5 h-5" />
            System Settings
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              to="/AdminUsers" 
              className="bg-white p-6 rounded-2xl shadow-soft border border-gray-200/60 text-center group hover:shadow-large hover:border-blue-200/60 transition-all"
            >
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
                <Users className="w-8 h-8 text-blue-800" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">User Management</h3>
              <p className="text-sm text-gray-600 mb-4">Manage all users and permissions</p>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold inline-block">
                Manage Users
              </div>
            </Link>
            
            <Link 
              to="/AdminProducts" 
              className="bg-white p-6 rounded-2xl shadow-soft border border-gray-200/60 text-center group hover:shadow-large hover:border-green-200/60 transition-all"
            >
              <div className="bg-gradient-to-r from-green-100 to-green-200 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:from-green-200 group-hover:to-green-300 transition-colors">
                <Package className="w-8 h-8 text-green-800" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Product Catalog</h3>
              <p className="text-sm text-gray-600 mb-4">Manage products and inventory</p>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold inline-block">
                Manage Products
              </div>
            </Link>
            
            <Link 
              to="/AdminOrders" 
              className="bg-white p-6 rounded-2xl shadow-soft border border-gray-200/60 text-center group hover:shadow-large hover:border-purple-200/60 transition-all"
            >
              <div className="bg-gradient-to-r from-purple-100 to-purple-200 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:from-purple-200 group-hover:to-purple-300 transition-colors">
                <ShoppingCart className="w-8 h-8 text-purple-800" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Order Management</h3>
              <p className="text-sm text-gray-600 mb-4">Process and track orders</p>
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold inline-block">
                Manage Orders
              </div>
            </Link>
            
            <Link 
              to="/AdminComplaints" 
              className="bg-white p-6 rounded-2xl shadow-soft border border-gray-200/60 text-center group hover:shadow-large hover:border-red-200/60 transition-all"
            >
              <div className="bg-gradient-to-r from-red-100 to-red-200 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:from-red-200 group-hover:to-red-300 transition-colors">
                <MessageSquare className="w-8 h-8 text-red-800" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Complaints & Support</h3>
              <p className="text-sm text-gray-600 mb-4">Handle customer complaints</p>
              <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold inline-block">
                Manage Complaints
              </div>
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <Link 
            to="/AdminAnalytics" 
            className="bg-white p-6 rounded-2xl shadow-soft border border-gray-200/60 block group hover:shadow-large hover:border-purple-200/60 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-purple-100 to-purple-200 w-12 h-12 rounded-xl flex items-center justify-center group-hover:from-purple-200 group-hover:to-purple-300 transition-colors">
                  <TrendingUp className="w-6 h-6 text-purple-700" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Platform Analytics</h3>
                  <p className="text-gray-600">View detailed platform statistics and performance metrics</p>
                </div>
              </div>
              <div className="text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                View Analytics →
              </div>
            </div>
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-200/60">
            <div className="text-center py-8">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-600">Recent activity and analytics will appear here</p>
              <Link 
                to="/AdminAnalytics" 
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-semibold mt-4 inline-block hover:bg-gray-200 transition-colors"
              >
                View Detailed Analytics
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}