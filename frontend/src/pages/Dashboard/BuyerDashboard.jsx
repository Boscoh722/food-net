import { useState, useEffect } from 'react';
import { ShoppingCart, Package, Truck, DollarSign, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

// Buyer Stat Card
const BuyerStatCard = ({ title, value, icon: Icon, valueColor = 'text-green-600', onClick }) => (
  <div
    onClick={onClick}
    className="product-card group bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 border border-gray-100 text-center cursor-pointer"
  >
    <Icon className={`w-12 h-12 ${valueColor} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
    <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
    <div className={`mt-4 text-2xl font-bold ${valueColor}`}>{value}</div>
  </div>
);

// Order Item Component
const OrderItem = ({ order, onClick }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div
      onClick={onClick}
      className="product-card bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="font-bold text-gray-800 text-lg">Order #{order.orderNumber}</p>
          <p className="text-sm text-gray-600 mt-1">
            {new Date(order.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
          {order.status.toUpperCase()}
        </span>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-xl font-bold text-green-600">KSh {order.total?.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Items</p>
            <p className="text-lg font-semibold text-gray-800">{order.items?.length || 0}</p>
          </div>
        </div>
        
        {order.trackingNumber && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Tracking: {order.trackingNumber}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function BuyerDashboard() {
  const { user } = useAuth();
  
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
      console.error('Buyer dashboard error:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4 mx-auto"></div>
          <p className="text-xl font-bold text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadDashboard}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            Welcome back, {user?.name || 'User'}!
          </h1>
          <div className="flex gap-4">
            <button
              onClick={loadDashboard}
              disabled={loading}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Browse Products
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Overview</h2>

          {stats.totalOrders > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <BuyerStatCard 
                title="Total Orders" 
                value={stats.totalOrders} 
                icon={Package} 
                valueColor="text-blue-600" 
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
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
              <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
              <p className="text-gray-600 mb-6">Start shopping to see your order history!</p>
              <button
                onClick={() => navigate('/products')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Browse Products
              </button>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Truck className="w-6 h-6 text-blue-600" />
              Recent Orders
            </h2>
            {recentOrders.length > 0 && (
              <button
                onClick={() => navigate('/orders')}
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                View All →
              </button>
            )}
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
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No recent orders</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}