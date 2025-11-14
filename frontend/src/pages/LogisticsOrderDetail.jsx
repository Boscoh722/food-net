// src/pages/LogisticsOrderDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Truck, MapPin, CheckCircle, Package, Loader, XCircle, DollarSign
} from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext'; 

const LogisticsOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      // NOTE: Your orderRoutes.js needs a route allowing logistics to fetch single order details. 
      // Assuming a generic protected GET /orders/:id route is available for authorized users.
      const res = await api.get(`/orders/${id}`); 
      setOrder(res.data.order);
      setError(null);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Could not load order details. Check network or permissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Handler for status updates
  const handleStatusUpdate = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to change the status to: ${newStatus.toUpperCase()}?`)) {
      return;
    }

    setIsUpdating(true);
    try {
      const res = await api.patch(`/orders/${id}`, { status: newStatus });
      setOrder(res.data.order);
    } catch (err) {
      console.error('Error updating status:', err);
      alert(`Failed to update status: ${err.response?.data?.message || 'Server error'}`);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Helper to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'shipped': return 'text-blue-500 bg-blue-100';
      case 'delivered': return 'text-green-500 bg-green-100';
      case 'confirmed':
      case 'pending': return 'text-yellow-500 bg-yellow-100';
      case 'cancelled': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-600 font-semibold">{error}</div>;
  }

  if (!order) {
    return <div className="p-8 text-center text-gray-600 font-semibold">Order not found.</div>;
  }

  const currentStatus = order.status;
  const isFinalStatus = ['delivered', 'cancelled', 'refunded'].includes(currentStatus);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <button 
        onClick={() => navigate('/logistics/orders')} 
        className="flex items-center text-green-600 hover:text-green-700 transition mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Assigned Orders
      </button>

      <div className="bg-white p-6 md:p-10 rounded-xl shadow-2xl border border-gray-100">
        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Truck className="w-7 h-7 text-green-600" />
              Delivery #{order.orderNumber}
            </h1>
            <span className={`mt-2 inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(currentStatus)}`}>
              {currentStatus.toUpperCase()}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-green-600 flex items-center gap-1">
              <DollarSign className="w-5 h-5" /> KSh {order.total?.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total Value</p>
          </div>
        </div>

        {/* Status Actions */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Update Delivery Status:</h2>
          <div className="flex flex-wrap gap-3">
            {!isFinalStatus && currentStatus !== 'shipped' && (
              <button 
                onClick={() => handleStatusUpdate('shipped')} 
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition"
              >
                {isUpdating ? <Loader className="w-5 h-5 animate-spin" /> : <Truck className="w-5 h-5" />}
                Mark as In Transit (Shipped)
              </button>
            )}
            {!isFinalStatus && currentStatus === 'shipped' && (
              <button 
                onClick={() => handleStatusUpdate('delivered')} 
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition"
              >
                {isUpdating ? <Loader className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                Mark as Delivered
              </button>
            )}
            {isFinalStatus && (
                <p className="text-sm text-gray-500">This order is complete/final and cannot be updated.</p>
            )}
          </div>
        </div>
        
        {/* Details Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500" /> Shipping Information
            </h3>
            <p className="text-gray-600 mb-1 font-medium">Destination:</p>
            <p className="text-lg font-bold text-gray-800">{order.shippingAddress || 'N/A'}</p>
            
            <p className="text-gray-600 mt-4 mb-1 font-medium">Tracking Number:</p>
            <p className="text-lg font-mono text-gray-700">{order.trackingNumber || 'Not assigned yet'}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-500" /> Item Details
            </h3>
            <ul className="space-y-3">
              {order.items?.map((item, index) => (
                <li key={index} className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-700">{item.productName}</span>
                  <span className="text-sm font-medium text-gray-500">
                    {item.quantity} x KSh {item.unitPrice?.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-gray-500">Order placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsOrderDetail;