import { useState, useEffect } from 'react';
import { 
  Truck, MapPin, CheckCircle, Clock, Package, AlertTriangle, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

// Reusable Stat Card
const LogisticsStatCard = ({ title, value, icon: Icon, valueColor = 'text-green-600', description, onClick }) => (
  <div 
    onClick={onClick}
    className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:translateY(-4px) border border-gray-100 text-center cursor-pointer"
  >
    <Icon className={`w-12 h-12 ${valueColor} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
    <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
    {description && <p className="text-sm text-gray-600 mt-2">{description}</p>}
    <div className={`mt-4 text-2xl font-bold ${valueColor}`}>{value}</div>
  </div>
);

// Delivery Item
const DeliveryItem = ({ order, onClick }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'border-yellow-500 bg-yellow-50',
      confirmed: 'border-blue-500 bg-blue-50',
      shipped: 'border-purple-500 bg-purple-50',
      delivered: 'border-green-500 bg-green-50',
      cancelled: 'border-red-500 bg-red-50',
    };
    return colors[status] || 'border-gray-500 bg-gray-50';
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-blue-500',
      shipped: 'bg-purple-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div 
      onClick={onClick}
      className={`product-card p-4 border-l-4 ${getStatusColor(order.status)} shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:translateY(-4px) rounded-2xl flex justify-between items-center bg-white cursor-pointer`}
    >
      <div>
        <p className="font-bold text-gray-800 flex items-center gap-2">
          <Package className="w-4 h-4 text-green-600" /> 
          Order: <span className="text-green-600">{order.orderNumber}</span>
        </p>
        <p className="text-sm text-gray-600 mt-1">
          To: {order.shippingAddress}
        </p>
        {order.trackingNumber && (
          <p className="text-xs text-gray-500 mt-1">
            Tracking: {order.trackingNumber}
          </p>
        )}
      </div>
      <div className="text-right">
        <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${getStatusBadgeColor(order.status)}`}>
          {order.status}
        </span>
        <p className="text-sm font-medium text-gray-700 mt-1">
          KSh {order.total?.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default function LogisticsDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalAssigned: 0,
    shipped: 0,
    delivered: 0,
    pending: 0,
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, [user]);

  // Load dashboard data
  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      const ordersRes = await api.get('/orders/logistics/my-orders');
      let allOrders = ordersRes.data?.orders || [];
      
      setOrders(allOrders);

      const shipped = allOrders.filter(o => o.status === 'shipped').length;
      const delivered = allOrders.filter(o => o.status === 'delivered').length;
      const pending = allOrders.filter(o => ['pending', 'confirmed'].includes(o.status)).length;

      setStats({
        totalAssigned: allOrders.length,
        shipped,
        delivered,
        pending,
      });

    } catch (err) {
      console.error('Logistics dashboard error:', err);
      setError(err.response?.data?.message || 'Failed to load logistics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4 mx-auto"></div>
          <p className="text-xl font-bold text-gray-700">Loading logistics dashboard...</p>
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
            <Truck className="w-8 h-8 text-blue-600" />
            Logistics Dashboard
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
              onClick={() => navigate('/logistics/map')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              Map View
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Delivery Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <LogisticsStatCard 
              title="Total Assigned" 
              value={stats.totalAssigned} 
              icon={Package} 
              valueColor="text-blue-600" 
              description="Orders assigned to you"
              onClick={() => navigate('/logistics/orders')}
            />
            <LogisticsStatCard 
              title="Pending Pickup" 
              value={stats.pending} 
              icon={Clock} 
              valueColor="text-orange-600" 
              description="Awaiting pickup"
              onClick={() => navigate('/logistics/orders?status=pending')}
            />
            <LogisticsStatCard 
              title="In Transit" 
              value={stats.shipped} 
              icon={Truck} 
              valueColor="text-purple-600" 
              description="Currently shipping"
              onClick={() => navigate('/logistics/orders?status=shipped')}
            />
            <LogisticsStatCard 
              title="Delivered" 
              value={stats.delivered} 
              icon={CheckCircle} 
              valueColor="text-green-600" 
              description="Successfully delivered"
              onClick={() => navigate('/logistics/orders?status=delivered')}
            />
          </div>
        </div>

        {/* Active Deliveries */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Clock className="w-6 h-6 text-orange-600" />
            Active Deliveries
          </h2>
          
          {orders.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Deliveries Assigned</h3>
              <p className="text-gray-600">Deliveries will appear here once assigned to you</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.slice(0, 10).map((order) => (
                <DeliveryItem 
                  key={order._id} 
                  order={order}
                  onClick={() => navigate(`/logistics/orders/${order._id}`)}
                />
              ))}
            </div>
          )}

          {orders.length > 10 && (
            <div className="text-center mt-12">
              <button
                onClick={() => navigate('/logistics/orders')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View All Deliveries
              </button>
            </div>
          )}
        </div>

        {/* Service Area */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <MapPin className="w-6 h-6 text-blue-600" />
            Your Service Area
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-gray-600 mb-2 font-semibold">Location</p>
              <p className="text-xl font-bold text-gray-900">{user?.location || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2 font-semibold">Service Reach</p>
              <p className="text-xl font-bold text-gray-900">{user?.reach || 'Not specified'}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}