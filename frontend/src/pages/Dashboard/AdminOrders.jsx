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

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard/admin')}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Order Management
                  </h1>
                  <p className="text-gray-600">Manage all platform orders</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={load}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading && 'animate-spin'}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertTriangle className="w-4 h-4" />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Package className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600">Orders will appear here once customers start purchasing</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Buyer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map(order => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <ShoppingCart className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                Order #{order._id?.slice(-8).toUpperCase()}
                              </p>
                              <p className="text-sm text-gray-500">
                                {order.items?.length || 0} items
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">
                            {order.user?.name || order.user || 'Unknown Buyer'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.user?.email || 'No email'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <p className="text-lg font-bold text-green-600">
                              {formatPrice(calculateTotal(order))}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                            {order.status?.toUpperCase() || 'PENDING'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/admin/orders/${order._id}`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDelete(order._id)}
                              disabled={actionLoading === order._id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{orders.length}</span> orders • 
              Total Revenue: <span className="font-semibold text-green-600">
                {formatPrice(orders.reduce((sum, order) => sum + calculateTotal(order), 0))}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}