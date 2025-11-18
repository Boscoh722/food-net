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
      const res = await api.get(`/orders/${id}`); 
      setOrder(res.data.order);
      setError(null);
    } catch (err) {
      setError('Could not load order details. Check network or permissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to change the status to: ${newStatus.toUpperCase()}?`)) {
      return;
    }

    setIsUpdating(true);
    try {
      const res = await api.patch(`/orders/${id}`, { status: newStatus });
      setOrder(res.data.order);
    } catch (err) {
      alert(`Failed to update status: ${err.response?.data?.message || 'Server error'}`);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'shipped': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'delivered': return 'text-green-600 bg-green-100 border-green-200';
      case 'confirmed':
      case 'pending': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'cancelled': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Order not found.</p>
        </div>
      </div>
    );
  }

  const currentStatus = order.status;
  const isFinalStatus = ['delivered', 'cancelled', 'refunded'].includes(currentStatus);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/logistics/orders')} 
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Assigned Orders
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-6 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <Truck className="w-6 h-6 text-blue-600" />
                Delivery #{order.orderNumber}
              </h1>
              <span className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentStatus)}`}>
                {currentStatus.toUpperCase()}
              </span>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <p className="text-xl font-bold text-green-600 flex items-center justify-end space-x-1">
                <DollarSign className="w-5 h-5" /> 
                <span>KSh {order.total?.toLocaleString()}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">Total Value</p>
            </div>
          </div>

          <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Update Delivery Status:</h2>
            <div className="flex flex-wrap gap-3">
              {!isFinalStatus && currentStatus !== 'shipped' && (
                <button 
                  onClick={() => handleStatusUpdate('shipped')} 
                  disabled={isUpdating}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isUpdating ? <Loader className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                  <span>Mark as In Transit</span>
                </button>
              )}
              {!isFinalStatus && currentStatus === 'shipped' && (
                <button 
                  onClick={() => handleStatusUpdate('delivered')} 
                  disabled={isUpdating}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {isUpdating ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  <span>Mark as Delivered</span>
                </button>
              )}
              {isFinalStatus && (
                <p className="text-sm text-gray-500">This order is complete and cannot be updated.</p>
              )}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-500" /> 
                <span>Shipping Information</span>
              </h3>
              <p className="text-gray-600 mb-1 font-medium">Destination:</p>
              <p className="text-lg font-semibold text-gray-900">{order.shippingAddress || 'N/A'}</p>
              
              <p className="text-gray-600 mt-4 mb-1 font-medium">Tracking Number:</p>
              <p className="text-lg font-mono text-gray-700">{order.trackingNumber || 'Not assigned yet'}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                <Package className="w-5 h-5 text-gray-500" /> 
                <span>Item Details</span>
              </h3>
              <ul className="space-y-3">
                {order.items?.map((item, index) => (
                  <li key={index} className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-gray-700">{item.productName}</span>
                    <span className="text-sm font-medium text-gray-500">
                      {item.quantity} x KSh {item.unitPrice?.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-gray-500">
                Order placed on: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsOrderDetail;