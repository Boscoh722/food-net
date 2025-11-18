import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingBag, Package, MapPin, DollarSign, AlertTriangle } from 'lucide-react';
import api from '../lib/api'; 

function SellerOrderDetail() {
  const { orderId } = useParams(); 
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/seller/orders/${orderId}`);
        setOrder(res.data.order);
      } catch (err) {
        setError(err.response?.data?.message || `Order with ID ${orderId} not found.`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-800 bg-yellow-100',
      confirmed: 'text-blue-800 bg-blue-100',
      shipped: 'text-purple-800 bg-purple-100',
      delivered: 'text-green-800 bg-green-100',
      cancelled: 'text-red-800 bg-red-100'
    };
    return colors[status] || 'text-gray-800 bg-gray-100';
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 text-center text-red-400 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5"/> {error}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-blue-500" />
            Order Detail: #{order.orderNumber || orderId.slice(-6).toUpperCase()}
          </h1>
          <button className="px-4 py-2 bg-gray-700 text-gray-200 font-medium rounded-lg hover:bg-gray-600 transition border border-gray-600">
            Update Status
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2">Order Summary</h2>

            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-300">Status:</span>
              <span className={`px-3 py-1 inline-flex text-lg leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-300">Total Revenue:</span>
              <span className="text-2xl font-bold text-green-400 flex items-center gap-1">
                <DollarSign className="w-5 h-5"/> KSh {order.total?.toLocaleString() || '0'}
              </span>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5"/> Items Sold
              </h3>
              <div className="p-4 bg-gray-750 rounded-lg">
                <p className="text-gray-400">Item list goes here (e.g., product name, quantity, price).</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2">Shipping & Customer</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5"/> Delivery Address
              </h3>
              <p className="text-gray-300">
                {order.shippingAddress?.street || 'N/A'}, {order.shippingAddress?.city || 'N/A'}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Customer Details</h3>
              <p className="text-gray-300">Name: {order.customerName || 'N/A'}</p>
              <p className="text-gray-300">Email: {order.customerEmail || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerOrderDetail;