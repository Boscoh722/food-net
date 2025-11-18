import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, AlertTriangle, RefreshCw, Filter } from 'lucide-react';
import api from '../lib/api';

function SellerOrderList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = new URLSearchParams(location.search);
  const statusFilter = query.get('status');
  
  const getFilterTitle = () => {
    if (!statusFilter) return 'All Seller Orders';
    return `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Orders`;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-900 text-yellow-300 border-yellow-700',
      confirmed: 'bg-blue-900 text-blue-300 border-blue-700',
      shipped: 'bg-purple-900 text-purple-300 border-purple-700',
      delivered: 'bg-green-900 text-green-300 border-green-700',
      cancelled: 'bg-red-900 text-red-300 border-red-700'
    };
    return colors[status] || 'bg-gray-700 text-gray-300 border-gray-600';
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      let apiUrl = '/seller/orders';
      if (statusFilter) {
        apiUrl += `?status=${statusFilter}`;
      }

      const ordersRes = await api.get(apiUrl);
      setOrders(ordersRes.data?.orders || []);

    } catch (err) {
      console.error('Failed to load seller orders:', err);
      setError(err.response?.data?.message || 'Failed to load order data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 to-gray-800 flex items-center justify-center p-8">
        <div className="bg-gray-800 p-8 rounded-2xl border-2 border-gray-700 text-center text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5"/> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 to-gray-800 py-12">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-blue-500" />
            {getFilterTitle()} ({orders.length})
          </h1>
          <button
              onClick={loadOrders}
              className="px-4 py-2 bg-gray-700 text-gray-200 font-medium rounded-xl shadow-md hover:bg-gray-600 transition flex items-center gap-2 border-2 border-gray-600"
          >
              <RefreshCw className="w-5 h-5" />
              Reload List
          </button>
        </div>

        <div className="flex gap-3 mb-6">
          {['all', 'pending', 'confirmed', 'shipped', 'delivered'].map(status => (
              <button
                  key={status}
                  onClick={() => navigate(status === 'all' ? '/seller/orders' : `/seller/orders?status=${status}`)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition border-2 ${
                      (statusFilter === status || (status === 'all' && !statusFilter))
                          ? 'bg-green-600 text-white shadow-md border-green-500'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600'
                  }`}
              >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
          ))}
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {orders.length === 0 ? (
                  <tr>
                      <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-center">No orders found.</td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr 
                      key={order._id}
                      onClick={() => navigate(`/seller/orders/${order._id}`)}
                      className="hover:bg-gray-750 cursor-pointer transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {order.orderNumber || order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border-2 ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-semibold">
                        KSh {order.total?.toLocaleString() || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerOrderList;