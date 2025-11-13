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
        <div className="text-center bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl font-bold text-gray-700 mb-4">Please login to view your orders</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition"
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
        <div className="text-center bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
          <p className="text-xl font-bold text-gray-700">Only buyers can access this page</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mb-4"></div>
          <p className="text-xl font-bold text-gray-700">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-green-600" />
            My Orders
          </h1>
          <button
            onClick={() => navigate('/products')}
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition flex items-center gap-3"
          >
            <ShoppingBag className="w-6 h-6" />
            Continue Shopping
          </button>
        </div>

        {orders.length === 0 ? (
          /* Empty State */
          <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100 text-center">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No orders yet!</h3>
            <p className="text-gray-500 mb-6">Start shopping now and your orders will appear here with full tracking.</p>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <ShoppingBag className="w-5 h-5" />
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
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 cursor-pointer"
                  onClick={() => navigate(`/orders/${order._id}`)}
                >
                  <div className="p-6">
                    {/* Header: Product + Status */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800">
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

                      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${status.color} font-bold text-sm`}>
                        <StatusIcon className="w-5 h-5" />
                        {status.label}
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Calendar className="w-5 h-5 text-green-600" />
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
                        <div className="p-2 bg-gray-100 rounded-lg">
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
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Truck className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Tracking</p>
                            <p className="font-bold text-green-600">{order.trackingNumber}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-end">
                        <div
                          className="flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors group"
                        >
                          View Details
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
