import { useState, useEffect } from 'react';
import { 
  BarChart3, Users as UsersIcon, Package as PackageIcon, ShoppingCart, MessageSquare,
  TrendingUp, Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    // TODO: Fetch stats from API
    // loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="card p-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-3 rounded-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              Administrator Dashboard
            </h1>
          </div>
          <Link 
            to="/AdminSettings"
            className="btn btn-primary flex items-center gap-2"
          >
            <Settings className="w-5 h-5" />
            System Settings
          </Link>
        </div>

        {/* Quick Navigation Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              to="/AdminUsers" 
              className="card-hover p-6 text-center group"
            >
              <div className="bg-gradient-to-r from-primary-100 to-primary-200 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:from-primary-200 group-hover:to-primary-300 transition-colors">
                <UsersIcon className="w-8 h-8 text-primary-800" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">User Management</h3>
              <p className="text-sm text-gray-600 mb-4">Manage all users and permissions</p>
              <div className="badge-primary">
                Manage Users
              </div>
            </Link>
            
            <Link 
              to="/AdminProducts" 
              className="card-hover p-6 text-center group"
            >
              <div className="bg-gradient-to-r from-success-100 to-success-200 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:from-success-200 group-hover:to-success-300 transition-colors">
                <PackageIcon className="w-8 h-8 text-success-800" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Product Catalog</h3>
              <p className="text-sm text-gray-600 mb-4">Manage products and inventory</p>
              <div className="badge-success">
                Manage Products
              </div>
            </Link>
            
            <Link 
              to="/AdminOrders" 
              className="card-hover p-6 text-center group"
            >
              <div className="bg-gradient-to-r from-accent-100 to-accent-200 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:from-accent-200 group-hover:to-accent-300 transition-colors">
                <ShoppingCart className="w-8 h-8 text-accent-800" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Order Management</h3>
              <p className="text-sm text-gray-600 mb-4">Process and track orders</p>
              <div className="badge-accent">
                Manage Orders
              </div>
            </Link>
            
            <Link 
              to="/AdminComplaints" 
              className="card-hover p-6 text-center group"
            >
              <div className="bg-gradient-to-r from-error-100 to-error-200 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:from-error-200 group-hover:to-error-300 transition-colors">
                <MessageSquare className="w-8 h-8 text-error-800" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Complaints & Support</h3>
              <p className="text-sm text-gray-600 mb-4">Handle customer complaints</p>
              <div className="badge-error">
                Manage Complaints
              </div>
            </Link>
          </div>
        </div>

        {/* Analytics Quick Link */}
        <div className="mb-8">
          <Link 
            to="/AdminAnalytics" 
            className="card-hover p-6 block group"
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
              <div className="text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
                View Analytics →
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="card p-6">
            <div className="text-center py-8">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-600">Recent activity and analytics will appear here</p>
              <Link 
                to="/AdminAnalytics" 
                className="btn btn-ghost mt-4"
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