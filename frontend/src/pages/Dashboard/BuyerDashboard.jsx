import { useState, useEffect } from 'react';
import { ShoppingCart, Package, Truck, DollarSign, AlertTriangle, RefreshCw, Clock, CheckCircle, MapPin, Home, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

// Buyer Stat Card
const BuyerStatCard = ({ title, value, icon: Icon, valueColor = 'text-green-400', onClick }) => (
  <div
    onClick={onClick}
    className="product-card group bg-gray-800 p-6 rounded-2xl shadow-2xl transition-all duration-300 border-2 border-gray-700 hover:border-blue-500 text-center cursor-pointer hover:shadow-2xl hover:scale-105"
  >
    <div className="bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-900 transition-colors">
      <Icon className={`w-8 h-8 ${valueColor} group-hover:scale-110 transition-transform`} />
    </div>
    <h3 className="font-semibold text-gray-200 text-lg mb-2">{title}</h3>
    <div className={`mt-2 text-2xl font-bold ${valueColor} bg-gray-900 rounded-lg py-2 px-3 border border-gray-600`}>
      {value}
    </div>
  </div>
);

// Order Item Component
const OrderItem = ({ order, onClick }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-900 text-yellow-200 border border-yellow-600',
      confirmed: 'bg-blue-900 text-blue-200 border border-blue-600',
      shipped: 'bg-purple-900 text-purple-200 border border-purple-600',
      delivered: 'bg-green-900 text-green-200 border border-green-600',
      cancelled: 'bg-red-900 text-red-200 border border-red-600',
      refunded: 'bg-gray-700 text-gray-200 border border-gray-500'
    };
    return colors[status] || 'bg-gray-700 text-gray-200 border border-gray-500';
  };

  return (
    <div
      onClick={onClick}
      className="product-card bg-gray-800 p-6 rounded-2xl shadow-2xl transition-all duration-300 border-2 border-gray-700 hover:border-blue-500 cursor-pointer hover:shadow-2xl hover:scale-105"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="font-bold text-white text-lg">Order #{order.orderNumber}</p>
          <p className="text-sm text-gray-300 mt-1 bg-gray-700 rounded-lg py-1 px-2 inline-block border border-gray-600">
            {new Date(order.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)} shadow-lg`}>
          {order.status.toUpperCase()}
        </span>
      </div>
      
      <div className="border-t-2 border-gray-700 pt-4">
        <div className="flex justify-between items-center gap-3">
          <div className="bg-green-900 rounded-lg p-3 flex-1 border border-green-700">
            <p className="text-sm text-green-200 font-medium">Total Amount</p>
            <p className="text-xl font-bold text-green-300">KSh {order.total?.toLocaleString()}</p>
          </div>
          <div className="bg-blue-900 rounded-lg p-3 flex-1 border border-blue-700">
            <p className="text-sm text-blue-200 font-medium">Items</p>
            <p className="text-lg font-semibold text-blue-300">{order.items?.length || 0}</p>
          </div>
        </div>
        
        {order.trackingNumber && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-200 bg-gray-700 rounded-lg p-3 border border-gray-600">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span className="font-medium">Tracking: <span className="text-blue-400">{order.trackingNumber}</span></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function BuyerDashboard() {
  const { user, logout } = useAuth();
  
  const [stats, setStats] = useState({
    totalOrders: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
    totalSpent: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      const ordersRes = await api.get('/orders');
      const orders = Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data?.orders || [];

      setRecentOrders(orders.slice(0, 5));

      const totalOrders = orders.length;
      const pending = orders.filter(o => o.status === 'pending').length;
      const inTransit = orders.filter(o => ['confirmed', 'shipped'].includes(o.status)).length;
      const delivered = orders.filter(o => o.status === 'delivered').length;
      const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

      setStats({
        totalOrders,
        pending,
        inTransit,
        delivered,
        totalSpent
      });

    } catch (err) {
      console.error('Buyer dashboard error:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      // Logout will redirect via the auth context
    } catch (err) {
      console.error('Logout error:', err);
      setIsLoggingOut(false);
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="text-center bg-gray-800 p-8 rounded-2xl shadow-2xl border-2 border-gray-700">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4 mx-auto"></div>
          <p className="text-xl font-bold text-white">Loading your dashboard...</p>
          <p className="text-gray-300 mt-2">Getting your latest shopping data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="text-center bg-gray-800 p-8 rounded-2xl shadow-2xl border-2 border-gray-700 max-w-md">
          <div className="bg-red-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-700">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-300 mb-6 bg-gray-700 rounded-lg p-3 border border-gray-600">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={loadDashboard}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold border border-blue-500"
            >
              Try Again
            </button>
            <button
              onClick={handleHome}
              className="px-4 py-3 bg-gray-700 border-2 border-gray-600 text-gray-200 rounded-xl hover:bg-gray-600 hover:border-gray-500 transition-all duration-300 shadow-lg flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Header with Navigation */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border-2 border-gray-700">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <div className="bg-blue-900 p-2 rounded-lg border border-blue-700">
                <ShoppingCart className="w-8 h-8 text-blue-400" />
              </div>
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-gray-300 mt-2 text-lg">Here's your shopping overview</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleHome}
                className="px-4 py-3 bg-gray-700 border-2 border-gray-600 text-gray-200 rounded-xl hover:bg-gray-600 hover:border-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 group"
                title="Go to Home"
              >
                <Home className="w-5 h-5 group-hover:text-white" />
                <span className="hidden sm:inline">Home</span>
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-4 py-3 bg-red-900 border-2 border-red-700 text-red-200 rounded-xl hover:bg-red-800 hover:border-red-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 group disabled:opacity-50"
                title="Logout"
              >
                <LogOut className={`w-5 h-5 group-hover:text-white ${isLoggingOut ? 'animate-pulse' : ''}`} />
                <span className="hidden sm:inline">
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </span>
              </button>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={loadDashboard}
                disabled={loading}
                className="px-6 py-3 bg-gray-700 border-2 border-gray-600 text-gray-200 rounded-xl font-semibold hover:bg-gray-600 hover:border-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => navigate('/products')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold border border-blue-500"
              >
                <ShoppingCart className="w-5 h-5" />
                Browse Products
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-16">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border-2 border-gray-700 mb-8">
            <h2 className="text-3xl font-bold text-white">Your Shopping Overview</h2>
            <p className="text-gray-300 mt-2">Track your orders and spending</p>
          </div>

          {stats.totalOrders > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <BuyerStatCard 
                title="Total Orders" 
                value={stats.totalOrders} 
                icon={Package} 
                valueColor="text-blue-400" 
                onClick={() => navigate('/orders')}
              />
              <BuyerStatCard 
                title="Pending" 
                value={stats.pending} 
                icon={Clock} 
                valueColor="text-yellow-400" 
                onClick={() => navigate('/orders?status=pending')}
              />
              <BuyerStatCard 
                title="In Transit" 
                value={stats.inTransit} 
                icon={Truck} 
                valueColor="text-purple-400" 
                onClick={() => navigate('/orders?status=shipped')}
              />
              <BuyerStatCard 
                title="Delivered" 
                value={stats.delivered} 
                icon={CheckCircle} 
                valueColor="text-green-400" 
                onClick={() => navigate('/orders?status=delivered')}
              />
              <BuyerStatCard 
                title="Total Spent" 
                value={`KSh ${stats.totalSpent.toLocaleString()}`} 
                icon={DollarSign} 
                valueColor="text-green-400" 
              />
            </div>
          ) : (
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border-2 border-gray-700 text-center">
              <div className="bg-gray-700 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Orders Yet</h3>
              <p className="text-gray-300 mb-6">Start shopping to see your order history and statistics!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/products')}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold border border-blue-500"
                >
                  Browse Products
                </button>
                <button
                  onClick={handleHome}
                  className="px-8 py-3 bg-gray-700 border-2 border-gray-600 text-gray-200 rounded-xl hover:bg-gray-600 hover:border-gray-500 transition-all duration-300 shadow-lg flex items-center gap-2 justify-center"
                >
                  <Home className="w-5 h-5" />
                  Go to Home
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="mb-16">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border-2 border-gray-700 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <div className="bg-blue-900 p-2 rounded-lg border border-blue-700">
                  <Truck className="w-6 h-6 text-blue-400" />
                </div>
                Recent Orders
              </h2>
              {recentOrders.length > 0 && (
                <button
                  onClick={() => navigate('/orders')}
                  className="px-6 py-2 bg-blue-900 text-blue-300 hover:bg-blue-800 font-semibold rounded-xl transition-colors border-2 border-blue-700 hover:border-blue-600"
                >
                  View All Orders →
                </button>
              )}
            </div>
          </div>
          
          {recentOrders.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {recentOrders.map((order) => (
                <OrderItem 
                  key={order._id} 
                  order={order}
                  onClick={() => navigate(`/orders/${order._id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border-2 border-gray-700 text-center">
              <div className="bg-gray-700 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-xl text-gray-300 font-semibold">No recent orders</p>
              <p className="text-gray-400 mt-2">Your recent orders will appear here</p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="fixed bottom-6 right-6 flex gap-3">
          <button
            onClick={handleHome}
            className="p-3 bg-gray-800 border-2 border-gray-700 text-gray-300 rounded-xl hover:bg-gray-700 hover:border-gray-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl group"
            title="Go to Home"
          >
            <Home className="w-6 h-6" />
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="p-3 bg-red-900 border-2 border-red-700 text-red-300 rounded-xl hover:bg-red-800 hover:border-red-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl group disabled:opacity-50"
            title="Logout"
          >
            <LogOut className={`w-6 h-6 ${isLoggingOut ? 'animate-pulse' : ''}`} />
          </button>
        </div>

      </div>
    </div>
  );
}