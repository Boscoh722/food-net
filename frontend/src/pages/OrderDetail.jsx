import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import {
  Package, Truck, Calendar, DollarSign, MapPin, User, AlertCircle, CheckCircle2, ChevronLeft, XCircle, Tag, TrendingUp
} from 'lucide-react';

const getStatusConfig = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertCircle, label: 'Pending' };
    case 'confirmed':
      return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle2, label: 'Confirmed' };
    case 'shipped':
      return { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Truck, label: 'Shipped' };
    case 'delivered':
      return { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2, label: 'Delivered' };
    case 'cancelled':
      return { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle, label: 'Cancelled' };
    case 'refunded':
      return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: DollarSign, label: 'Refunded' };
    default:
      return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: AlertCircle, label: 'Unknown' };
  }
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/orders/${id}`);
      const fetchedOrder = data?.order || data?.data || data;
      setOrder(fetchedOrder || null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load order details. You may not have permission.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && id) {
      loadOrder();
    }
  }, [id, user]);

  const handleCancel = async () => {
    if (!user || user.role !== 'buyer') return;
    if (!window.confirm('Are you sure you want to cancel this order? This action may not be reversible.')) return;

    setIsCancelling(true);
    try {
      await api.patch(`/orders/my/${id}/cancel`);
      
      setOrder(prev => (prev ? {
        ...prev,
        status: 'cancelled',
        cancelledBy: user._id,
        cancelledReason: 'Cancelled by buyer via detail view',
      } : prev));
      alert('Order cancelled successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 font-bold text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-8">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Order not found.</p>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const canCancel = user?.role === 'buyer' && ['pending', 'confirmed'].includes(order.status);
  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-primary-600 hover:text-primary-700 font-medium mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> 
          Back to Orders
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">
              Order #{order.orderNumber}
            </h1>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
              <statusConfig.icon className="w-4 h-4 mr-2" />
              {statusConfig.label}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <DetailCard icon={Calendar} title="Order Date" value={formattedDate} />
            <DetailCard icon={DollarSign} title="Total Cost" value={`KSh ${Number(order.total || 0).toFixed(2)}`} />
            <DetailCard icon={Truck} title="Tracking Number" value={order.trackingNumber || 'N/A'} />
            <DetailCard icon={MapPin} title="Shipping Address" value={order.shippingAddress} />
            <DetailCard icon={Tag} title="Payment Method" value={order.paymentMethod?.toUpperCase() || 'N/A'} />
            <DetailCard icon={TrendingUp} title="Payment Status" value={order.paymentStatus?.toUpperCase() || 'PENDING'} />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-4">Involved Parties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <UserCard role="Buyer" user={order.buyer} />
            <UserCard role="Seller" user={order.seller} />
            <UserCard role="Logistics" user={order.logistics} />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items ({order.items?.length || 0})</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items?.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={item.productImage || item.product?.images?.[0]?.url || 'https://via.placeholder.com/100'} 
                          alt={item.productName}
                          className="w-10 h-10 object-cover rounded mr-3"
                        />
                        <span className="font-medium text-gray-900">{item.productName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-900">KSh {item.unitPrice.toFixed(2)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-900">{item.quantity}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-right font-medium text-gray-900">KSh {item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {canCancel && (
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                <XCircle className="w-4 h-4 mr-2" />
                {isCancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const DetailCard = ({ icon: Icon, title, value }) => (
  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center">
    <Icon className="w-5 h-5 text-primary-600 mr-3" />
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase">{title}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

const UserCard = ({ role, user }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-200">
    <p className="text-sm font-medium text-primary-600 uppercase mb-2">{role}</p>
    {user ? (
      <>
        <p className="font-semibold text-gray-900">{user.name}</p>
        <p className="text-sm text-gray-600">{user.email}</p>
        <p className="text-sm text-gray-600 mt-1">Phone: {user.phone || 'N/A'}</p>
      </>
    ) : (
      <p className="text-gray-500 italic">Not assigned</p>
    )}
  </div>
);
