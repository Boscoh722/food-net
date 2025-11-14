import React, { useState, useEffect } from 'react';
import { 
  Truck, MapPin, CheckCircle, Clock, Package, AlertTriangle, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

// Reusable Stat Card
const LogisticsStatCard = ({ title, value, icon: Icon, valueColor = 'text-green-600', description, onClick }) => (
  <div 
    onClick={onClick}
    className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 text-center cursor-pointer"
  >
    <Icon className={`w-12 h-12 ${valueColor} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
    <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
    {description && <p className="text-sm text-gray-600 mt-2">{description}</p>}
    <div className={`mt-4 text-2xl font-bold ${valueColor}`}>{value}</div>
  </div>
);

// Delivery Item in Task List
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
      className={`p-4 border-l-4 ${getStatusColor(order.status)} shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl flex justify-between items-center border border-gray-100 cursor-pointer`}
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
  const navigate = useNavigate();

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

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      // --- FIX IMPLEMENTED HERE ---
      // 1. Calling the new, authorized backend route /logistics/my-orders
      const ordersRes = await api.get('/orders/logistics/my-orders');
      let allOrders = ordersRes.data?.orders || [];
      
      // 2. Client-side filtering is REMOVED because the backend now returns only assigned orders (allOrders is equivalent to myOrders)
      setOrders(allOrders);

      // Calculate stats using the already filtered list (allOrders)
      const shipped = allOrders.filter(o => o.status === 'shipped').length;
      const delivered = allOrders.filter(o => o.status === 'delivered').length;
      const pending = allOrders.filter(o => ['pending', 'confirmed'].includes(o.status)).length;

      setStats({
        totalAssigned: allOrders.length,
        shipped,
        delivered,
        pending,
      });
      // --- END FIX ---

    } catch (err) {
      console.error('Logistics dashboard error:', err);
      // Displaying the generic error message on failure
      setError(err.response?.data?.message || 'Failed to load logistics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mb-4 mx-auto"></div>
          <p className="text-xl font-bold text-gray-700">Loading logistics dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-2xl border border-gray-100 max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDashboard}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
            <Truck className="w-8 h-8 text-green-600" />
            Logistics Dashboard
          </h1>
          <div className="flex gap-3">
            <button
              onClick={loadDashboard}
              disabled={loading}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg shadow-md hover:bg-gray-200 transition flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => navigate('/logistics/map')}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition duration-300 flex items-center gap-3"
            >
              <MapPin className="w-6 h-6" />
              Map View
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-5">Delivery Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Main Layout: Active Deliveries */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-5 flex items-center gap-3">
            <Clock className="w-6 h-6 text-orange-600" />
            Active Deliveries
          </h2>
          
          {orders.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100 text-center">
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Deliveries Assigned</h3>
              <p className="text-gray-500">Deliveries will appear here once assigned to you</p>
            </div>
          ) : (
            <div className="space-y-4">
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
            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/logistics/orders')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                View All Deliveries
                <Package className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Location Info */}
        <div className="mt-10 bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-700 mb-5 flex items-center gap-3">
            <MapPin className="w-6 h-6 text-green-600" />
            Your Service Area
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Location</p>
              <p className="text-lg font-semibold text-gray-800">{user?.location || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Service Reach</p>
              <p className="text-lg font-semibold text-gray-800">{user?.reach || 'Not specified'}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}