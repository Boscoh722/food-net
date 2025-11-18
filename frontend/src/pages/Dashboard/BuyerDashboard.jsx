import { useState, useEffect } from 'react';
import { ShoppingCart, Package, Truck, DollarSign, AlertTriangle, RefreshCw, Clock, CheckCircle, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

const BuyerStatCard = ({ title, value, icon: Icon, valueColor = 'text-green-600', onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all duration-300 text-center cursor-pointer hover:shadow-md hover:border-blue-300"
  >
    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon className={`w-8 h-8 ${valueColor}`} />
    </div>
    <h3 className="font-semibold text-gray-700 text-lg mb-2">{title}</h3>
    <div className={`mt-2 text-2xl font-bold ${valueColor} bg-gray-50 rounded-xl py-2 px-3 border border-gray-200`}>
      {value}
    </div>
  </div>
);

const OrderItem = ({ order, onClick }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all duration-300 cursor-pointer hover:shadow-md hover:border-blue-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="font-bold text-gray-900 text-lg">Order #{order.orderNumber}</p>
          <p className="text-sm text-gray-600 mt-1 bg-gray-50 rounded-xl py-1 px-2 inline-block border border-gray-200">
            {new Date(order.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
          {order.status.toUpperCase()}
        </span>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center gap-3">
          <div className="bg-green-50 rounded-xl p-3 flex-1 border border-green-200">
            <p className="text-sm text-green-700 font-medium">Total Amount</p>
            <p className="text-xl font-bold text-green-800">KSh {order.total?.toLocaleString()}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 flex-1 border border-blue-200">
            <p className="text-sm text-blue-700 font-medium">Items</p>
            <p className="text-lg font-semibold text-blue-800">{order.items?.length || 0}</p>
          </div>
        </div>
        
        {order.trackingNumber && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl p-3 border border-gray-200">
            <MapPin className="w-4 h-4 text-primary-600" />
            <span className="font-medium">Tracking: <span className="text-primary-600">{order.trackingNumber}</span></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function BuyerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-xl font-bold text-gray-900">Loading your dashboard...</p>
          <p className="text-gray-600 mt-2">Getting your latest shopping data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6 bg-gray-50 rounded-xl p-3 border border-gray-200">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={loadDashboard}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-3 rounded-xl">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.name || 'User'}!
                </h1>
                <p className="text-gray-600">Here's your shopping overview</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadDashboard}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading && 'animate-spin'}`} />
              Refresh
            </button>
            <button
              onClick={() => navigate('/products')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Browse Products
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Shopping Overview</h2>
            <p className="text-gray-600 mt-2">Track your orders and spending</p>
          </div>

          {stats.totalOrders > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <BuyerStatCard 
                title="Total Orders" 
                value={stats.totalOrders} 
                icon={Package} 
                valueColor="text-primary-600" 
                onClick={() => navigate('/orders')}
              />
              <BuyerStatCard 
                title="Pending" 
                value={stats.pending} 
                icon={Clock} 
                valueColor="text-yellow-600" 
                onClick={() => navigate('/orders?status=pending')}
              />
              <BuyerStatCard 
                title="In Transit" 
                value={stats.inTransit} 
                icon={Truck} 
                valueColor="text-purple-600" 
                onClick={() => navigate('/orders?status=shipped')}
              />
              <BuyerStatCard 
                title="Delivered" 
                value={stats.delivered} 
                icon={CheckCircle} 
                valueColor="text-green-600" 
                onClick={() => navigate('/orders?status=delivered')}
              />
              <BuyerStatCard 
                title="Total Spent" 
                value={`KSh ${stats.totalSpent.toLocaleString()}`} 
                icon={DollarSign} 
                valueColor="text-green-600" 
              />
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
              <p className="text-gray-600 mb-6">Start shopping to see your order history and statistics!</p>
              <button
                onClick={() => navigate('/products')}
                className="px-8 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                Browse Products
              </button>
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-2 rounded-xl">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                Recent Orders
              </h2>
              {recentOrders.length > 0 && (
                <button
                  onClick={() => navigate('/orders')}
                  className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:bg-blue-700 font-semibold rounded-xl transition-colors"
                >
                  View All Orders →
                </button>
              )}
            </div>
          </div>
          
          {recentOrders.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentOrders.map((order) => (
                <OrderItem 
                  key={order._id} 
                  order={order}
                  onClick={() => navigate(`/orders/${order._id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-12 h-12 text-gray-600" />
              </div>
              <p className="text-xl text-gray-600 font-semibold">No recent orders</p>
              <p className="text-gray-500 mt-2">Your recent orders will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}