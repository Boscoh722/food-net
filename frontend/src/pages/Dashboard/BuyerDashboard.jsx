import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, DollarSign, Truck, Package, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Custom Card Component for Buyer Metrics
const BuyerStatCard = ({ title, value, icon: Icon, valueColor = 'text-amber-600', linkTo = '#' }) => (
  <Link 
    to={linkTo} 
    className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-start hover:border-amber-300"
  >
    <div className="p-3 mb-3 bg-amber-100 rounded-full group-hover:bg-amber-200 transition-colors duration-300">
      <Icon className={`w-6 h-6 ${valueColor} group-hover:scale-105 transition-transform`} />
    </div>
    <p className={`text-3xl font-extrabold mt-1 ${valueColor}`}>{value}</p>
    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-1">{title}</p>
  </Link>
);


export default function BuyerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [latestOrder, setLatestOrder] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    // TODO: Fetch stats, latest order, and wallet balance from API
    // loadStats();
    // loadLatestOrder();
    // loadWalletBalance();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-10">
        
        {/* Personalized Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Welcome back, <span className="text-amber-600">{user?.name || 'User'}!</span>
          </h1>
          <Link 
            to="/products"
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition duration-300 flex items-center gap-2 transform hover:scale-[1.03]"
          >
            <ShoppingCart className="w-5 h-5" />
            Start Shopping
          </Link>
        </div>
        
        {/* --- Key Metrics Grid --- */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-5 border-b pb-2 border-gray-200">Your Activity Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <BuyerStatCard 
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              valueColor={stat.valueColor}
              linkTo={stat.linkTo}
            />
          ))}
        </div>

        {/* --- Quick Actions and Recommendations Section --- */}
        <div className="mt-12 grid lg:grid-cols-3 gap-6">
          
          {/* Recent Orders / Tracking Status */}
          <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-green-600" /> Latest Order Status
            </h3>
            {latestOrder ? (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="font-semibold text-gray-700">Order #{latestOrder.orderId}</p>
                <p className="text-green-600 font-medium">Status: {latestOrder.status}</p>
                {latestOrder.eta && (
                  <p className="text-sm text-gray-500 mt-2">Estimated Arrival: {latestOrder.eta}</p>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center text-gray-500">
                No active orders
              </div>
            )}
            <Link 
              to="/orders"
              className="mt-4 inline-block text-amber-600 font-medium hover:text-amber-700 transition duration-300"
            >
              View All Orders &rarr;
            </Link>
          </div>

          {/* Wallet/Loyalty Section */}
          <div className="bg-white p-8 rounded-xl shadow-2xl border border-amber-300/50">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-600" /> My Wallet
            </h3>
            <p className="text-3xl font-extrabold text-amber-600 mb-2">${walletBalance.toFixed(2)}</p>
            <p className="text-gray-500 text-sm mb-4">
              {walletBalance > 0 ? 'You have earned credits from your purchases.' : 'No credits available.'}
            </p>
            <Link 
              to="/wallet"
              className="w-full text-center px-4 py-2 bg-amber-500 text-white font-medium rounded-lg shadow-md hover:bg-amber-600 transition duration-300"
            >
              Redeem Credits
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}