// src/pages/OrderDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import {
  Package, Truck, Calendar, DollarSign, MapPin, User, AlertCircle, CheckCircle2, ChevronLeft, XCircle, Tag, TrendingUp
} from 'lucide-react';

// Utility function to determine status styling
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

  // Function to load the specific order
  const loadOrder = async () => {
    setLoading(true);
    try {
      // NOTE: Assuming backend has a protected GET /orders/:id route accessible by all roles involved
      const { data } = await api.get(`/orders/${id}`);
      const fetchedOrder = data?.order || data?.data || data;
      setOrder(fetchedOrder || null);
    } catch (err) {
      console.error(err);
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

  // Function to cancel the order (Buyer only)
  const handleCancel = async () => {
    if (!user || user.role !== 'buyer') return;
    if (!window.confirm('Are you sure you want to cancel this order? This action may not be reversible.')) return;

    setIsCancelling(true);
    try {
      // Correct Buyer Cancel Route: PATCH /orders/my/:id/cancel
      await api.patch(`/orders/my/${id}/cancel`);
      
      // Update local state immediately
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

  if (loading) return <div className="p-8 text-center text-lg">Loading order details...</div>;
  if (error) return <div className="p-8 text-center text-red-600 font-bold">{error}</div>;
  if (!order) return <div className="p-8 text-center text-gray-600">Order not found.</div>;

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
    <div className="container mx-auto p-4 sm:p-8 font-inter">
      <button onClick={() => navigate(-1)} className="flex items-center text-amber-600 hover:text-amber-700 font-medium mb-6">
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Orders
      </button>

      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-100">
        
        {/* Header and Status */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 md:mb-0">
            Order #{order.orderNumber}
          </h1>
          <div className={`px-4 py-2 text-sm font-bold rounded-full border ${statusConfig.color} flex items-center gap-2`}>
            <statusConfig.icon className="w-4 h-4" />
            {statusConfig.label}
          </div>
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <DetailCard icon={Calendar} title="Order Date" value={formattedDate} />
          <DetailCard icon={DollarSign} title="Total Cost" value={`KSh ${Number(order.total || 0).toFixed(2)}`} />
          <DetailCard icon={Truck} title="Tracking Number" value={order.trackingNumber || 'N/A'} />
          <DetailCard icon={MapPin} title="Shipping Address" value={order.shippingAddress} />
          <DetailCard icon={Tag} title="Payment Method" value={order.paymentMethod?.toUpperCase() || 'N/A'} />
          <DetailCard icon={TrendingUp} title="Payment Status" value={order.paymentStatus?.toUpperCase() || 'PENDING'} />
        </div>

        {/* Parties Involved */}
        <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-emerald-500 pl-3 mb-4">Involved Parties</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <UserCard role="Buyer" user={order.buyer} />
          <UserCard role="Seller" user={order.seller} />
          <UserCard role="Logistics" user={order.logistics} />
        </div>

        {/* Order Items */}
        <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-amber-500 pl-3 mb-4">Order Items ({order.items?.length || 0})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-50">
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Unit Price</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items?.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 flex items-center">
                    <img
                      src={item.productImage || item.product?.images?.[0]?.url || 'https://via.placeholder.com/100'} 
                      alt={item.productName}
                      className="w-10 h-10 object-cover rounded-md mr-3"
                    />
                    {item.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">KSh {item.unitPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-bold">KSh {item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Buyer Action: Cancel Button */}
        {canCancel && (
          <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isCancelling ? 'Cancelling...' : <><XCircle className="w-5 h-5" /> Cancel Order</>}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// Reusable Sub-Components
const DetailCard = ({ icon: Icon, title, value }) => (
  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center">
    <Icon className="w-6 h-6 text-amber-500 mr-4" />
    <div>
      <p className="text-xs font-semibold uppercase text-gray-500">{title}</p>
      <p className="font-bold text-gray-800 text-lg">{value}</p>
    </div>
  </div>
);

const UserCard = ({ role, user }) => (
    <div className="bg-white p-5 rounded-xl border-2 border-dashed border-gray-200 hover:border-emerald-300 transition-colors">
        <p className="text-sm font-semibold uppercase text-emerald-600 mb-2">{role}</p>
        {user ? (
            <>
                <p className="text-xl font-bold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-600 mt-1">Phone: {user.phone || 'N/A'}</p>
            </>
        ) : (
            <p className="text-gray-500 italic">Not assigned</p>
        )}
    </div>
);
