import { useState, useEffect } from 'react';
import { 
  Truck, MapPin, CheckCircle, Clock, Package, AlertTriangle, RefreshCw, Users, DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

const LogisticsStatCard = ({ title, value, icon: Icon, valueColor = 'text-green-600', description, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all duration-200 text-center cursor-pointer hover:shadow-md hover:border-blue-300"
  >
    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon className={`w-8 h-8 ${valueColor}`} />
    </div>
    <h3 className="font-semibold text-gray-700 text-lg">{title}</h3>
    {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
    <div className={`mt-4 text-2xl font-bold ${valueColor} bg-gray-50 rounded-xl py-2 px-3 border border-gray-200`}>
      {value}
    </div>
  </div>
);

const DeliveryItem = ({ order, onClick }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'border-yellow-300 bg-yellow-50',
      confirmed: 'border-blue-300 bg-blue-50',
      shipped: 'border-purple-300 bg-purple-50',
      delivered: 'border-green-300 bg-green-50',
      cancelled: 'border-red-300 bg-red-50',
    };
    return colors[status] || 'border-gray-300 bg-gray-50';
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div 
      onClick={onClick}
      className={`p-6 border-l-4 ${getStatusColor(order.status)} shadow-sm hover:shadow-md transition-all duration-200 rounded-xl flex justify-between items-center bg-white cursor-pointer border border-gray-200 hover:border-blue-300`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <Package className="w-5 h-5 text-green-600" /> 
          <p className="font-bold text-gray-900">
            Order: <span className="text-green-600">{order.orderNumber}</span>
          </p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-2 border border-gray-200">
            <strong>Customer:</strong> {order.user?.name || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-2 border border-gray-200">
            <strong>To:</strong> {order.shippingAddress || 'Address not specified'}
          </p>
          {order.trackingNumber && (
            <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-2 border border-gray-200">
              <strong>Tracking:</strong> <span className="text-primary-600 font-medium">{order.trackingNumber}</span>
            </p>
          )}
        </div>
      </div>
      <div className="text-right ml-4">
        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(order.status)}`}>
          {order.status.toUpperCase()}
        </span>
        <p className="text-lg font-bold text-gray-900 mt-3 bg-gray-50 rounded-xl p-2 border border-gray-200">
          KSh {order.total?.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {new Date(order.createdAt).toLocaleDateString()}
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
    totalRevenue: 0
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

      const ordersRes = await api.get('/orders/logistics/my-orders');
      const allOrders = ordersRes.data.data || ordersRes.data.orders || [];
      
      setOrders(allOrders);

      // Calculate statistics
      const shipped = allOrders.filter(o => o.status === 'shipped').length;
      const delivered = allOrders.filter(o => o.status === 'delivered').length;
      const pending = allOrders.filter(o => ['pending', 'confirmed'].includes(o.status)).length;
      const totalRevenue = allOrders
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + (o.total || 0), 0);

      setStats({
        totalAssigned: allOrders.length,
        shipped,
        delivered,
        pending,
        totalRevenue
      });

    } catch (err) {
      console.error('Dashboard load error:', err);
      setError(err.response?.data?.message || 'Failed to load logistics data');
    } finally {
      setLoading(false);
    }
  };

  // Filter orders for active deliveries (not delivered or cancelled)
  const activeDeliveries = orders.filter(order => 
    !['delivered', 'cancelled'].includes(order.status)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading logistics dashboard...</p>
          <p className="text-gray-500 mt-2">Getting your delivery assignments</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={loadDashboard}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 flex-1">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-3 rounded-xl">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Logistics Dashboard
                </h1>
                <p className="text-gray-600">Welcome back, {user?.name || 'Logistics Partner'}!</p>
                <p className="text-sm text-gray-500 mt-1">
                  Service Area: {user?.location || 'Not specified'} • Reach: {user?.reach || 'Not specified'}
                </p>
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
              onClick={() => navigate('/logistics/map')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Map View
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Delivery Performance</h2>
            <p className="text-gray-600 mt-2">Track your delivery assignments and performance metrics</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <LogisticsStatCard 
              title="Total Assigned" 
              value={stats.totalAssigned} 
              icon={Package} 
              valueColor="text-primary-600" 
              description="All orders assigned to you"
              onClick={() => navigate('/logistics/orders')}
            />
            <LogisticsStatCard 
              title="Pending Pickup" 
              value={stats.pending} 
              icon={Clock} 
              valueColor="text-yellow-600" 
              description="Awaiting pickup/confirmation"
              onClick={() => navigate('/logistics/orders?status=pending')}
            />
            <LogisticsStatCard 
              title="In Transit" 
              value={stats.shipped} 
              icon={Truck} 
              valueColor="text-purple-600" 
              description="Currently in delivery"
              onClick={() => navigate('/logistics/orders?status=shipped')}
            />
            <LogisticsStatCard 
              title="Delivered" 
              value={stats.delivered} 
              icon={CheckCircle} 
              valueColor="text-green-600" 
              description="Successfully completed"
              onClick={() => navigate('/logistics/orders?status=delivered')}
            />
            <LogisticsStatCard 
              title="Total Revenue" 
              value={`KSh ${stats.totalRevenue.toLocaleString()}`} 
              icon={DollarSign} 
              valueColor="text-green-600" 
              description="From completed deliveries"
            />
          </div>
        </div>

        {/* Active Deliveries */}
        <div className="mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-2 rounded-xl">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                Active Deliveries ({activeDeliveries.length})
              </h2>
              {orders.length > 0 && (
                <button
                  onClick={() => navigate('/logistics/orders')}
                  className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:bg-blue-700 font-semibold rounded-xl transition-colors"
                >
                  View All Orders ({orders.length})
                </button>
              )}
            </div>
          </div>
          
          {activeDeliveries.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Deliveries</h3>
              <p className="text-gray-600 mb-6">
                {orders.length === 0 
                  ? "You don't have any delivery assignments yet." 
                  : "All your assigned orders have been completed or cancelled."
                }
              </p>
              <button
                onClick={loadDashboard}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                Check for New Assignments
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeDeliveries.slice(0, 5).map((order) => (
                <DeliveryItem 
                  key={order._id} 
                  order={order}
                  onClick={() => navigate(`/logistics/orders/${order._id}`)}
                />
              ))}
              
              {activeDeliveries.length > 5 && (
                <div className="text-center pt-4">
                  <button
                    onClick={() => navigate('/logistics/orders')}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                  >
                    View All {activeDeliveries.length} Active Deliveries
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-2 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              Customer Service
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Customers Served</span>
                <span className="font-semibold text-gray-900">
                  {new Set(orders.map(o => o.user?._id)).size}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Delivery Success Rate</span>
                <span className="font-semibold text-green-600">
                  {stats.totalAssigned > 0 
                    ? `${Math.round((stats.delivered / stats.totalAssigned) * 100)}%` 
                    : '0%'
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-2 rounded-xl">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              Service Area
            </h3>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-500 mb-2 font-medium">Your Location</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user?.location || 'Not specified'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-500 mb-2 font-medium">Service Coverage</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user?.reach || 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}