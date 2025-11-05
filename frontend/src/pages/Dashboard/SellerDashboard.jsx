import { useState, useEffect } from 'react';
import { DollarSign, BarChart3, Package, Users, PlusCircle, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Custom Card Component for Seller Metrics
const SellerStatCard = ({ title, value, icon: Icon, valueColor = 'text-indigo-600', linkTo = '#' }) => (
  <Link 
    to={linkTo} 
    className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-indigo-100 flex flex-col items-start hover:border-indigo-300"
  >
    <div className="flex items-center justify-between w-full mb-3">
        <Icon className={`w-7 h-7 ${valueColor} group-hover:scale-105 transition-transform`} />
        <TrendingUp className="w-5 h-5 text-gray-400" /> 
    </div>
    <p className={`text-3xl font-extrabold ${valueColor}`}>{value}</p>
    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-1">{title}</p>
  </Link>
);

export default function SellerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [hasProducts, setHasProducts] = useState(false);

  useEffect(() => {
    // TODO: Fetch stats and product count from API
    // loadStats();
    // loadProductCount();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-10">
        
        {/* Header and Main CTA */}
        <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
            {user?.storeName || user?.name || 'Seller'} Panel
          </h1>
          <Link 
            to="/seller/product/new"
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-xl shadow-indigo-400/40 hover:bg-indigo-700 transition duration-300 transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-5 h-5" />
            Post New Product
          </Link>
        </div>

        {/* --- Key Metrics Grid --- */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-5">Performance Snapshot</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <SellerStatCard 
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              valueColor={stat.valueColor}
              linkTo={stat.linkTo}
            />
          ))}
        </div>

        {/* --- Main Content Area: Listing Overview and Actions --- */}
        <div className="mt-12 grid lg:grid-cols-3 gap-8">
          
          {/* Sales Analytics Chart Placeholder */}
          <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-2xl border border-gray-100 min-h-[400px]">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" /> Sales Trend
            </h3>
            <div className="h-full flex items-center justify-center">
                <p className="text-gray-500 italic py-10">
                    [Placeholder for Monthly Revenue/Sales Chart]
                </p>
            </div>
          </div>

          {/* Quick Management Links */}
          <div className="bg-white p-6 rounded-xl shadow-2xl border border-indigo-300/50">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" /> Quick Management
            </h3>
            <div className="space-y-4">
                <Link to="/seller/products" className="block p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg font-medium text-indigo-700 transition duration-300 flex justify-between items-center">
                    Manage Inventory &rarr;
                </Link>
                <Link to="/seller/orders" className="block p-4 bg-amber-50 hover:bg-amber-100 rounded-lg font-medium text-amber-700 transition duration-300 flex justify-between items-center">
                    Process Orders &rarr;
                </Link>
                <Link to="/seller/payouts" className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg font-medium text-green-700 transition duration-300 flex justify-between items-center">
                    View Payout History &rarr;
                </Link>
            </div>
          </div>
        </div>

        {/* --- Empty State / Call to Action for new sellers --- */}
        {!hasProducts && (
            <div className="mt-12 bg-white p-10 rounded-xl shadow-xl border-l-4 border-indigo-500">
                <h3 className="text-2xl font-bold text-indigo-700 mb-3">Ready to sell?</h3>
                <p className="text-gray-600 mb-6">Your store is set up! Start generating revenue by listing your first product today.</p>
                <Link 
                    to="/seller/product/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
                >
                    <PlusCircle className="w-5 h-5" />
                    List Product Now
                </Link>
            </div>
        )}

      </div>
    </div>
  );
}
