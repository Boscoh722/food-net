import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { 
  Package, 
  Truck, 
  Calendar, 
  DollarSign, 
  MapPinHouse, 
  ShoppingBag, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';

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
      const res = await api.get('/orders/my');
      const data = Array.isArray(res.data) ? res.data : res.data?.orders || [];
      setOrders(data);
    } catch (err) {
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertCircle, label: 'Pending' };
      case 'confirmed':
        return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Package, label: 'Confirmed' };
      case 'shipped':
        return { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Truck, label: 'Shipped' };
      case 'delivered':
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: Package, label: 'Delivered' };
      case 'cancelled':
        return { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle, label: 'Cancelled' };
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Package, label: 'Unknown' };
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl border border-gray-100">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700 mb-4">Please login to view your orders</p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-amber-600 text-white font-bold rounded-lg shadow-lg hover:bg-amber-700 transition-all duration-300 transform hover:scale-105"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== 'buyer') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Only buyers can access this page</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent mb-4"></div>
          <p className="text-xl font-medium text-gray-700">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
              <ShoppingBag className="w-10 h-10 text-amber-600" />
              My Orders
            </h1>
            <p className="text-gray-600 mt-2">Track and manage all your purchases in one place</p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg shadow-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </button>
        </div>

        {orders.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-2xl shadow-2xl border border-gray-100">
            <div className="inline-flex p-6 bg-amber-50 rounded-full mb-6">
              <Package className="w-20 h-20 text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No orders yet!</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Start shopping now and your orders will appear here with full tracking.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-amber-600 transform hover:scale-105 transition-all duration-300"
            >
              <ShoppingBag className="w-6 h-6" />
              Browse Products Now
            </button>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {orders.map((order) => {
              const primaryItem = order.items?.[0];
              const status = getStatusConfig(order.status);
              const StatusIcon = status.icon;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-amber-200 transition-all duration-300 group"
                >
                  <div className="p-8">
                    {/* Header: Product + Status */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-extrabold text-gray-800 group-hover:text-amber-600 transition-colors">
                          {primaryItem?.productName || primaryItem?.product?.name || 'Product Name Unavailable'}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPinHouse className="w-4 h-4" />
                            Seller: <span className="font-medium">{order.seller?.name || 'Unknown'}</span>
                          </span>
                          {order.logistics && (
                            <span className="flex items-center gap-1">
                              <Truck className="w-4 h-4 text-green-600" />
                              {order.logistics.name}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${status.color} font-bold text-sm`}>
                        <StatusIcon className="w-5 h-5" />
                        {status.label}
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <Calendar className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Order Date</p>
                          <p className="font-bold text-gray-800">
                            {new Date(order.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', day: 'numeric', year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Price</p>
                          <p className="font-bold text-green-600 text-xl">
                            KSh {Number(order.total || primaryItem?.subtotal || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {order.trackingNumber && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Truck className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Tracking</p>
                            <p className="font-bold text-purple-700">{order.trackingNumber}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => navigate(`/orders/${order._id}`)}
                          className="flex items-center gap-2 text-amber-600 font-bold hover:text-amber-700 transition-colors group"
                        >
                          View Details
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Bottom Bar */}
                  <div className="h-2 bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}