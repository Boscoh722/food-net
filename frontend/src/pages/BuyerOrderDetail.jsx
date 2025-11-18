// src/pages/BuyerOrderDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  DollarSign,
  MapPin,
  ListOrdered,
  RefreshCw,
  Tag,
  ShoppingBag,
  Home,
  ShoppingCart
} from 'lucide-react';
import api from '../lib/api';
import { format } from 'date-fns';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    shipped: { color: 'bg-purple-100 text-purple-800', icon: Truck },
    delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
    returned: { color: 'bg-orange-100 text-orange-800', icon: RefreshCw },
  };

  const config = statusConfig[status.toLowerCase()] || {
    color: 'bg-gray-100 text-gray-800',
    icon: Package,
  };
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wider ${config.color}`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {status}
    </div>
  );
};

const BuyerOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${id}`);
        const orderData = res.data.data || res.data;
        setOrder(orderData);
        setError(null);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Order not found or you do not have permission to view it.');
        } else {
          setError('Failed to fetch order details. Please try again.');
        }
        console.error('Fetch Order Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <RefreshCw className="w-8 h-8 mx-auto animate-spin text-green-600" />
        <p className="mt-4 text-gray-600">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button
          onClick={() => navigate('/dashboard/buyer')}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p>No order data available.</p>
        <button
          onClick={() => navigate('/dashboard/buyer')}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const deliveryAddress = order.shippingAddress || {};
  const orderItems = order.items || order.orderItems || [];
  const orderTotal = order.total || order.totalPrice || 0;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <ListOrdered className="w-8 h-8 text-green-600" />
          Order Details #{order.orderNumber || order._id.slice(-6).toUpperCase()}
        </h1>
        <button
          onClick={() => navigate('/dashboard/buyer')}
          className="text-green-600 hover:text-green-700 font-medium flex items-center"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <StatusBadge status={order.status} />
              <div className="text-gray-500 text-sm">
                Placed on {format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Order ID</p>
                <p className="font-semibold text-gray-800 text-sm">
                  {order._id.slice(0, 8)}...
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Payment</p>
                <p className="font-semibold text-gray-800 capitalize">
                  {order.paymentMethod || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="font-semibold text-green-600">
                  KSh {orderTotal.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Items</p>
                <p className="font-semibold text-gray-800">
                  {orderItems.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-green-600" />
              Products ({orderItems.length})
            </h2>
            <div className="space-y-4">
              {orderItems.map((item, index) => (
                <div
                  key={item._id || index}
                  className="flex items-center border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-xl mr-4 flex-shrink-0 overflow-hidden">
                    {item.product?.images?.[0]?.url ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-10 h-10 text-gray-400 m-3" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-800">
                      {item.product?.name || 'Product Name'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      KSh {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      @ KSh {(item.price || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Shipping Address
            </h2>
            {deliveryAddress.fullName && (
              <p className="font-medium text-gray-800">{deliveryAddress.fullName}</p>
            )}
            {deliveryAddress.street && (
              <p className="text-gray-600">{deliveryAddress.street}</p>
            )}
            {deliveryAddress.city && (
              <p className="text-gray-600">{deliveryAddress.city}</p>
            )}
            {deliveryAddress.state && (
              <p className="text-gray-600">{deliveryAddress.state}</p>
            )}
            {deliveryAddress.zipCode && (
              <p className="text-gray-600">{deliveryAddress.zipCode}</p>
            )}
            {deliveryAddress.country && (
              <p className="text-gray-600">{deliveryAddress.country}</p>
            )}
            {!deliveryAddress.fullName && (
              <p className="text-gray-500 italic">No shipping address provided</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>KSh {orderTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>KSh {(order.deliveryFee || 0).toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    Discount
                  </span>
                  <span>-KSh {(order.discount || 0).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-4 border-t border-gray-200 font-bold text-lg">
                <span>Total Amount</span>
                <span className="text-green-600">
                  KSh {orderTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-green-600" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/products')}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/dashboard/buyer')}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerOrderDetail;