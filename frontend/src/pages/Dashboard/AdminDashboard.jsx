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
    <div className="min-h-screen bg-gray-50">
      <style>{`
        body {
            box-sizing: border-box;
        }
       
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
       
        .glass-effect {
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
       
        .hover-lift {
            transition: all 0.3s ease;
        }
       
        .hover-lift:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
       
        .category-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
       
        .category-card:hover {
            transform: scale(1.05);
        }
       
        .product-card {
            transition: all 0.3s ease;
            border: 1px solid rgba(229, 231, 235, 0.5);
        }
       
        .product-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
            border-color: #667eea;
        }
       
        .animate-fade-in {
            animation: fadeIn 0.6s ease-out;
        }
       
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
       
        .animate-slide-in {
            animation: slideIn 0.8s ease-out;
        }
       
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
        }
       
        .search-glow:focus {
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
       
        .leaflet-container {
            border-radius: 16px;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Administrator Dashboard
          </h1>
          <Link 
            to="/admin/settings"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            System Settings
          </Link>
        </div>

        {/* Quick Navigation Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              to="/AdminUsers" 
              className="product-card bg-white rounded-2xl shadow-lg transition-all duration-300 border border-gray-100 text-center group"
            >
              <div className="bg-blue-500 rounded-xl w-12 h-12 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">User Management</h3>
              <p className="text-sm text-gray-600 mt-2">Manage all users and permissions</p>
              <div className="mt-4 text-2xl font-bold text-blue-600">Manage</div>
            </Link>
            
            <Link 
              to="/AdminProducts" 
              className="product-card bg-white rounded-2xl shadow-lg transition-all duration-300 border border-gray-100 text-center group"
            >
              <div className="bg-green-500 rounded-xl w-12 h-12 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <PackageIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">Product Catalog</h3>
              <p className="text-sm text-gray-600 mt-2">Manage products and inventory</p>
              <div className="mt-4 text-2xl font-bold text-green-600">Manage</div>
            </Link>
            
            <Link 
              to="/AdminOrders" 
              className="product-card bg-white rounded-2xl shadow-lg transition-all duration-300 border border-gray-100 text-center group"
            >
              <div className="bg-purple-500 rounded-xl w-12 h-12 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">Order Management</h3>
              <p className="text-sm text-gray-600 mt-2">Process and track orders</p>
              <div className="mt-4 text-2xl font-bold text-purple-600">Manage</div>
            </Link>
            
            <Link 
              to="/AdminComplaints" 
              className="product-card bg-white rounded-2xl shadow-lg transition-all duration-300 border border-gray-100 text-center group"
            >
              <div className="bg-red-500 rounded-xl w-12 h-12 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">Complaints & Support</h3>
              <p className="text-sm text-gray-600 mt-2">Handle customer complaints</p>
              <div className="mt-4 text-2xl font-bold text-red-600">Manage</div>
            </Link>
          </div>
        </div>

        {/* --- Main Content Area (Placeholder for Charts/Tables) --- */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Activity</h2>
          <div className="bg-white p-8 rounded-2xl shadow-2xl min-h-[300px] flex items-center justify-center text-gray-600 italic">
            Dashboard content area for charts, recent logs, or management tables.
          </div>
        </div>

      </div>
    </div>
  );
}