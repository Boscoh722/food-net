import React, { useState, useEffect } from 'react';
import { DollarSign, BarChart3, Package, PlusCircle, Clock, TrendingUp, Leaf, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Ensure this exists

// Custom Card Component for Seller Metrics
const SellerStatCard = ({ title, value, icon: Icon, valueColor = 'text-gray-800', linkTo = '#' }) => (
  <Link
    to={linkTo}
    className="group bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col items-start hover:border-emerald-300 dark:bg-gray-800 dark:border-gray-700"
  >
    <div className="flex items-center justify-between w-full mb-3">
      <Icon className={`w-8 h-8 ${valueColor} group-hover:scale-110 transition-transform`} />
      <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition" />
    </div>
    <p className={`text-4xl font-extrabold ${valueColor}`}>{value}</p>
    <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mt-1 dark:text-gray-400">{title}</p>
  </Link>
);

function SellerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState([]); // Real data should be loaded here
  const [hasProducts, setHasProducts] = useState(false); // Controlled by real data

  useEffect(() => {
    // Fetch dashboard data from API/backend here
  }, []);

  // Define colors
  const PRIMARY_COLOR = 'emerald-600';
  const SECONDARY_COLOR = 'amber-500';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-inter">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header and Main CTA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white flex items-center gap-3 mb-4 sm:mb-0">
            <Leaf className={`w-10 h-10 text-${PRIMARY_COLOR}`} />
            {user?.storeName || 'Food-Net Seller'}
          </h1>
          <Link
            to="/seller/product/new"
            className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-${PRIMARY_COLOR} to-emerald-700 text-white font-semibold rounded-xl shadow-xl shadow-emerald-400/50 hover:from-emerald-700 hover:to-emerald-800 transition duration-300 transform hover:scale-[1.02]`}
          >
            <PlusCircle className="w-5 h-5" />
            Post New Product
          </Link>
        </div>

        {/* --- Key Metrics Grid --- */}
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6 border-l-4 border-amber-500 pl-3">Performance Snapshot</h2>
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
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700 min-h-[450px]">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <BarChart3 className={`w-6 h-6 text-${PRIMARY_COLOR}`} /> Monthly Sales Trend
            </h3>
            <div className="h-full flex flex-col items-center justify-center pt-8">
              <div className={`w-40 h-40 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4 border-4 border-emerald-200`}>
                <TrendingUp className="w-12 h-12 text-emerald-500" />
              </div>
              <p className="text-gray-500 italic text-lg dark:text-gray-400">
                Advanced charts and graphs will appear here after more sales data is collected.
              </p>
            </div>
          </div>

          {/* Quick Management Links */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-amber-300 dark:bg-gray-800 dark:border-amber-700">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
              <Package className={`w-6 h-6 text-${SECONDARY_COLOR}`} /> Quick Actions
            </h3>
            <div className="space-y-4">
              <Link to="/seller/products" className="block p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl font-semibold text-emerald-800 transition duration-300 flex justify-between items-center group shadow-md dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-emerald-400">
                Manage Inventory <span className="text-xl group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
              <Link to="/seller/orders" className="block p-4 bg-amber-50 hover:bg-amber-100 rounded-xl font-semibold text-amber-800 transition duration-300 flex justify-between items-center group shadow-md dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-amber-400">
                Process Orders <span className="text-xl group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
              <Link to="/seller/payouts" className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-xl font-semibold text-blue-800 transition duration-300 flex justify-between items-center group shadow-md dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-400">
                View Payout History <span className="text-xl group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* --- Empty State / Call to Action for new sellers --- */}
        {!hasProducts && (
          <div className="mt-12 bg-white p-10 rounded-2xl shadow-xl border-l-8 border-emerald-500 dark:bg-gray-800 dark:border-emerald-700">
            <h3 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-3">Ready to sell?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Your store is set up! Start generating revenue by listing your first product today.</p>
            <Link
              to="/seller/product/new"
              className={`inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:bg-emerald-700 transition duration-300`}
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

export default SellerDashboard;
