import { useEffect, useState } from 'react';
import { 
  ArrowLeft, ShoppingCart, RefreshCw, Trash2, 
  AlertTriangle, Eye, CheckCircle2, XCircle, Package 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/orders/all');
      setOrders(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    load(); 
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this order? This action cannot be undone.')) return;
    try {
      setActionLoading(id);
      await api.delete(`/orders/${id}`);
      setOrders(prev => prev.filter(o => o._id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBackToAdmin = () => {
    navigate('/dashboard/admin');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-900 text-yellow-200 border border-yellow-700',
      confirmed: 'bg-blue-900 text-blue-200 border border-blue-700',
      shipped: 'bg-purple-900 text-purple-200 border border-purple-700',
      delivered: 'bg-green-900 text-green-200 border border-green-700',
      cancelled: 'bg-red-900 text-red-200 border border-red-700'
    };
    return colors[status] || 'bg-gray-700 text-gray-200 border border-gray-600';
  };

  const formatPrice = (price) => {
    return `KSh ${price?.toLocaleString() || 0}`;
  };

  const calculateTotal = (order) => {
    if (order.totalPrice) return order.totalPrice;
    if (order.items && Array.isArray(order.items)) {
      return order.items.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <button
                onClick={handleBackToAdmin}
                className="p-3 bg-gray-700 border-2 border-gray-600 text-gray-200 rounded-xl hover:bg-gray-600 hover:border-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 group"
                title="Back to Admin Dashboard"
              >
                <ArrowLeft className="w-5 h-5 group-hover:text-white" />
              </button>
              
              <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border-2 border-gray-700">
                <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                  <div className="bg-blue-900 p-2 rounded-lg border border-blue-700">
                    <ShoppingCart className="w-8 h-8 text-blue-400" />
                  </div>
                  Order Management
                </h1>
                <p className="text-gray-300 mt-2 text-lg">Manage all platform orders</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={load}
                disabled={loading}
                className="px-6 py-3 bg-gray-700 border-2 border-gray-600 text-gray-200 rounded-xl font-semibold hover:bg-gray-600 hover:border-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900 border-2 border-red-700 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-300">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 p-12 text-center">
            <div className="bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Orders Found</h3>
            <p className="text-gray-300">Orders will appear here once customers start purchasing</p>
          </div>
        ) : (
          /* Orders Table */
          <>
            <div className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700 border-b border-gray-600">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Order Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Buyer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {orders.map(order => (
                      <tr key={order._id} className="hover:bg-gray-750 transition-all duration-300">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center border border-blue-700">
                              <ShoppingCart className="w-5 h-5 text-blue-200" />
                            </div>
                            <div>
                              <p className="font-semibold text-white">Order #{order._id?.slice(-8).toUpperCase()}</p>
                              <p className="text-sm text-gray-400">
                                {order.items?.length || 0} items
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-white">{order.user?.name || order.user || 'Unknown Buyer'}</p>
                            <p className="text-sm text-gray-400">
                              {order.user?.email || 'No email'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                            <p className="text-lg font-bold text-green-400">
                              {formatPrice(calculateTotal(order))}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-2 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status?.toUpperCase() || 'PENDING'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {/* View Button */}
                            <button
                              onClick={() => navigate(`/admin/orders/${order._id}`)}
                              className="p-2 text-blue-400 hover:bg-blue-900 rounded-lg transition-all duration-300 border border-blue-800 hover:border-blue-600"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(order._id)}
                              disabled={actionLoading === order._id}
                              className="p-2 text-red-400 hover:bg-red-900 rounded-lg transition-all duration-300 border border-red-800 hover:border-red-600 disabled:opacity-50"
                              title="Delete Order"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 px-6 py-4">
              <div className="text-sm text-gray-300">
                Showing <span className="font-semibold text-white">{orders.length}</span> orders
                <span className="mx-2">•</span>
                Total Revenue: <span className="font-semibold text-green-400">
                  {formatPrice(orders.reduce((sum, order) => sum + calculateTotal(order), 0))}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}