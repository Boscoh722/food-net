// src/pages/SellerOrderList.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, AlertTriangle, RefreshCw, Filter } from 'lucide-react';
import api from '../lib/api'; // Ensure this path is correct

function SellerOrderList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract 'status' query parameter from the URL (?status=pending/shipped/etc.)
  const query = new URLSearchParams(location.search);
  const statusFilter = query.get('status');
  
  const getFilterTitle = () => {
    if (!statusFilter) return 'All Seller Orders';
    return `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Orders`;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Construct the API URL with the filter, if present
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
  }, [statusFilter]); // Reloads when the URL query parameter changes

  if (loading) return <div className="p-8 text-center text-gray-500">Loading orders...</div>;
  if (error) return <div className="p-8 text-center text-red-500 flex items-center justify-center gap-2"><AlertTriangle className="w-5 h-5"/> {error}</div>;

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <ShoppingBag className="w-7 h-7 text-blue-600" />
          {getFilterTitle()} ({orders.length})
        </h1>
        <button
            onClick={loadOrders}
            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg shadow-md hover:bg-gray-200 transition flex items-center gap-2"
        >
            <RefreshCw className="w-5 h-5" />
            Reload List
        </button>
      </div>

      {/* Quick Filter Bar */}
      <div className="flex gap-3 mb-6">
        {['all', 'pending', 'confirmed', 'shipped', 'delivered'].map(status => (
            <button
                key={status}
                onClick={() => navigate(status === 'all' ? '/seller/orders' : `/seller/orders?status=${status}`)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                    (statusFilter === status || (status === 'all' && !statusFilter))
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
        ))}
      </div>


      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                    <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No orders found.</td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr 
                    key={order._id}
                    onClick={() => navigate(`/seller/orders/${order._id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderNumber || order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      KSh {order.total?.toLocaleString() || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
  );
}

export default SellerOrderList;