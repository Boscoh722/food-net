// src/pages/SellerOrderDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Package, MapPin, DollarSign, AlertTriangle } from 'lucide-react';
import api from '../lib/api'; // Ensure this path is correct

function SellerOrderDetail() {
  const { orderId } = useParams(); // Get the order ID from the URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        // Assuming your API endpoint is structured like this
        const res = await api.get(`/seller/orders/${orderId}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError(err.response?.data?.message || `Order with ID ${orderId} not found.`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading order details...</div>;
  if (error) return (
    <div className="container mx-auto px-6 py-10">
        <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 text-center text-red-500 flex flex-col items-center gap-2">
            <AlertTriangle className="w-8 h-8"/> 
            <h2 className="text-xl font-bold">Error</h2>
            <p>{error}</p>
        </div>
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <ShoppingBag className="w-7 h-7 text-blue-600" />
          Order Detail: #{order.orderNumber || orderId.slice(-6).toUpperCase()}
        </h1>
        {/* Placeholder for order action buttons (e.g., Update Status) */}
        <button 
            // onClick={handleUpdateStatus} 
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
        >
            Update Status
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Order Summary</h2>

          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium text-gray-600">Status:</span>
            <span className={`px-3 py-1 inline-flex text-lg leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium text-gray-600">Total Revenue:</span>
            <span className="text-2xl font-bold text-green-600 flex items-center gap-1">
              <DollarSign className="w-5 h-5"/> KSh {order.total?.toLocaleString() || '0'}
            </span>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2"><Package className="w-5 h-5"/> Items Sold</h3>
            {/* You would map through order.items here */}
            <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Item list goes here (e.g., product name, quantity, price).</p>
            </div>
          </div>
        </div>

        {/* Shipping & Customer Details */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Shipping & Customer</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2"><MapPin className="w-5 h-5"/> Delivery Address</h3>
            <p className="text-gray-600">
                {/* Placeholder for customer address */}
                {order.shippingAddress?.street || 'N/A'}, {order.shippingAddress?.city || 'N/A'}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Customer Details</h3>
            <p className="text-gray-600">Name: {order.customerName || 'N/A'}</p>
            <p className="text-gray-600">Email: {order.customerEmail || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerOrderDetail;