import { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Users as UsersIcon, Package as PackageIcon, ShoppingCart, MessageSquare } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    // TODO: Fetch stats from API
    // loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-10">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-green-600" />
            Administrator Dashboard
          </h1>
          <Link 
            to="/admin/settings"
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition duration-300"
          >
            System Settings
          </Link>
        </div>

        {/* Quick Navigation Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-5">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              to="/AdminUsers" 
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 text-center group"
            >
              <UsersIcon className="w-12 h-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-800 text-lg">User Management</h3>
              <p className="text-sm text-gray-600 mt-2">Manage all users and permissions</p>
              <div className="mt-4 text-2xl font-bold text-blue-600">Manage</div>
            </Link>
            
            <Link 
              to="/AdminProducts" 
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 text-center group"
            >
              <PackageIcon className="w-12 h-12 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-800 text-lg">Product Catalog</h3>
              <p className="text-sm text-gray-600 mt-2">Manage products and inventory</p>
              <div className="mt-4 text-2xl font-bold text-green-600">Manage</div>
            </Link>
            
            <Link 
              to="/AdminOrders" 
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 text-center group"
            >
              <ShoppingCart className="w-12 h-12 text-orange-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-800 text-lg">Order Management</h3>
              <p className="text-sm text-gray-600 mt-2">Process and track orders</p>
              <div className="mt-4 text-2xl font-bold text-orange-600">Manage</div>
            </Link>
            
            <Link 
              to="/AdminComplaints" 
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 text-center group"
            >
              <MessageSquare className="w-12 h-12 text-red-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-800 text-lg">Complaints & Support</h3>
              <p className="text-sm text-gray-600 mt-2">Handle customer complaints</p>
              <div className="mt-4 text-2xl font-bold text-red-600">Manage</div>
            </Link>
          </div>
        </div>

        {/* --- Main Content Area (Placeholder for Charts/Tables) --- */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-5">Recent Activity</h2>
          <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100 min-h-[300px] flex items-center justify-center">
            <p className="text-gray-500 italic">
              Dashboard content area for charts, recent logs, or management tables.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}