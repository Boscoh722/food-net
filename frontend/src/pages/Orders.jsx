import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'buyer') {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="mb-4">Please login to view orders</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== 'buyer') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Only buyers can view orders</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading orders...</div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No orders yet.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">
                    {order.product?.name || 'Product'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Seller: {order.seller?.name || 'Unknown'}
                  </p>
                  {order.logistics && (
                    <p className="text-gray-600 dark:text-gray-400">
                      Logistics: {order.logistics?.name || 'Not assigned'}
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {order.status?.toUpperCase() || 'PENDING'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                  <p className="font-medium text-primary">
                    KSh {order.product?.price || 'N/A'}
                  </p>
                </div>
                {order.trackingInfo && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tracking</p>
                    <p className="font-medium">{order.trackingInfo}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
