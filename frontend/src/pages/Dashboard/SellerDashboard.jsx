import { useState, useEffect } from 'react';
import { 
  DollarSign, Package, PlusCircle, Clock,
  Leaf, AlertTriangle, CheckCircle2, MapPin, 
  ShoppingBag, RefreshCw, Truck, Home, LogOut, LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

// Simpler, lighter Stat Card – clean, flat, minimal hover
const SellerStatCard = ({ title, value, icon: Icon, valueColor = 'text-green-400', description, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-gray-800/90 border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg hover:bg-gray-750 transition-all duration-200 cursor-pointer"
    >
      <div className="text-center">
        <Icon className={`w-12 h-12 ${valueColor} mx-auto mb-4`} />
        <h3 className="font-medium text-gray-300 text-sm">{title}</h3>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        <p className={`mt-3 text-3xl font-bold ${valueColor}`}>
          {value}
        </p>
      </div>
    </div>
  );
};

function SellerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    approvedProducts: 0,
    pendingApproval: 0,
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    revenue: 0
  });
  const [products, setProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const productsRes = await api.get('/seller/products');
      const myProducts = productsRes.data?.products || [];
      setProducts(myProducts);

      let ordersArray = [];
      try {
        const ordersRes = await api.get('/seller/orders');
        ordersArray = ordersRes.data?.orders || [];
        setRecentOrders(ordersArray.slice(0, 5));
      } catch (orderErr) {
        console.warn('Could not load orders:', orderErr);
      }

      const approvedProducts = myProducts.filter(p => p.approved === true).length;
      const pendingApproval = myProducts.filter(p => p.approved !== true).length; // includes rejected or null

      const pendingOrders = ordersArray.filter(o => o.status === 'pending').length;
      const confirmedOrders = ordersArray.filter(o => o.status === 'confirmed').length;
      const shippedOrders = ordersArray.filter(o => o.status === 'shipped').length;
      const deliveredOrders = ordersArray.filter(o => o.status === 'delivered').length;

      const totalRevenue = ordersArray
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + (o.total || 0), 0);

      setStats({
        totalProducts: myProducts.length,
        approvedProducts,
        pendingApproval,
        totalOrders: ordersArray.length,
        pendingOrders,
        confirmedOrders,
        shippedOrders,
        deliveredOrders,
        revenue: totalRevenue
      });

    } catch (err) {
      console.error('Failed to load seller data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => `KSh ${price?.toLocaleString() || 0}`;

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-900/50 text-yellow-300 border border-yellow-700',
      confirmed: 'bg-blue-900/50 text-blue-300 border border-blue-700',
      shipped: 'bg-purple-900/50 text-purple-300 border border-purple-700',
      delivered: 'bg-green-900/50 text-green-300 border border-green-700',
      cancelled: 'bg-red-900/50 text-red-300 border border-red-700',
      refunded: 'bg-gray-700 text-gray-300 border border-gray-600'
    };
    return colors[status] || 'bg-gray-700 text-gray-300 border border-gray-600';
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
          <p className="text-2xl font-semibold text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
          <p className="text-gray-400 mb-8">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={loadDashboard}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition duration-200 font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition duration-200"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">

        {/* Simplified Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-4">
              <Leaf className="w-10 h-10 text-blue-400" />
              Seller Dashboard
            </h1>
            <p className="text-gray-400 mt-2 text-lg">Welcome back, {user?.name || 'Seller'}!</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Dashboard button = refresh data (works even if sidebar link is broken) */}
            <button
              onClick={loadDashboard}
              className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition duration-200 font-medium flex items-center gap-2 shadow-md"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>

            <button
              onClick={() => navigate('/seller/product/new')}
              className="px-5 py-3 bg-green-600 text-white rounded-xl hover:bg-green-500 transition duration-200 font-medium flex items-center gap-2 shadow-md"
            >
              <PlusCircle className="w-5 h-5" />
              Add Product
            </button>

            <button
              onClick={loadDashboard}
              className="px-5 py-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition duration-200 flex items-center gap-2"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <button
              onClick={() => navigate('/')}
              className="px-5 py-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition duration-200 flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Home
            </button>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-5 py-3 bg-red-900 text-red-300 rounded-xl hover:bg-red-800 transition duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              <LogOut className={`w-5 h-5 ${isLoggingOut ? 'animate-pulse' : ''}`} />
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>

        {/* Product Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-2">Product Overview</h2>
          <p className="text-gray-400 mb-8">Manage your product catalog and approvals</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            <SellerStatCard title="Total Products" value={stats.totalProducts} icon={Package} valueColor="text-blue-400" description="All products" onClick={() => navigate('/seller/products')} />
            <SellerStatCard title="Approved" value={stats.approvedProducts} icon={CheckCircle2} valueColor="text-green-400" description="Ready for sale" onClick={() => navigate('/seller/products?approved=true')} />
            <SellerStatCard title="Pending" value={stats.pendingApproval} icon={Clock} valueColor="text-yellow-400" description="Awaiting review" onClick={() => navigate('/seller/products?approved=false')} />
            <SellerStatCard title="Revenue" value={formatPrice(stats.revenue)} icon={DollarSign} valueColor="text-green-400" description="Total earnings" />
          </div>
        </div>

        {/* Order Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-2">Order Overview</h2>
          <p className="text-gray-400 mb-8">Track order fulfillment</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            <SellerStatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} valueColor="text-blue-400" onClick={() => navigate('/seller/orders')} />
            <SellerStatCard title="Pending" value={stats.pendingOrders} icon={Clock} valueColor="text-yellow-400" onClick={() => navigate('/seller/orders?status=pending')} />
            <SellerStatCard title="Confirmed" value={stats.confirmedOrders} icon={CheckCircle2} valueColor="text-blue-400" onClick={() => navigate('/seller/orders?status=confirmed')} />
            <SellerStatCard title="Shipped" value={stats.shippedOrders} icon={Truck} valueColor="text-purple-400" onClick={() => navigate('/seller/orders?status=shipped')} />
            <SellerStatCard title="Delivered" value={stats.deliveredOrders} icon={CheckCircle2} valueColor="text-green-400" onClick={() => navigate('/seller/orders?status=delivered')} />
          </div>
        </div>

        {/* Recent Products */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Recent Products</h2>
            <button onClick={() => navigate('/seller/products')} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View All →
            </button>
          </div>

          {products.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center">
              <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-xl text-gray-300">No products yet – add your first one!</p>
              <button onClick={() => navigate('/seller/product/new')} className="mt-6 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-500 transition">
                Add Product
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.slice(0, 8).map(product => {
                const productImage = product.images?.[0]?.url || product.images?.[0];

                return (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/seller/products/${product._id}`)}
                    className="bg-gray-800 rounded-xl shadow-md hover:shadow-lg border border-gray-700 transition duration-200 cursor-pointer overflow-hidden"
                  >
                    <div className="h-48 bg-gray-700 relative">
                      {productImage ? (
                        <img src={productImage} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-6xl text-gray-600">📦</div>
                      )}
                      {product.approved === false && (
                        <span className="absolute top-2 left-2 px-3 py-1 bg-yellow-900/80 text-yellow-300 text-xs font-medium rounded-full">Pending</span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-white line-clamp-2">{product.name}</h3>
                      <p className="text-xl font-bold text-green-400 mt-2">{formatPrice(product.price)}</p>
                      <div className="flex justify-between text-sm text-gray-400 mt-3">
                        <span>{product.category?.name || 'Uncategorized'}</span>
                        {product.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{product.location}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Recent Orders</h2>
            <button onClick={() => navigate('/seller/orders')} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View All →
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-xl text-gray-300">No orders yet</p>
            </div>
          ) : (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Order #</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Total</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {recentOrders.map(order => (
                      <tr 
                        key={order._id}
                        onClick={() => navigate(`/seller/orders/${order._id}`)}
                        className="hover:bg-gray-700/50 cursor-pointer transition"
                      >
                        <td className="px-6 py-4 text-sm text-white">{order.orderNumber}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-white font-medium">{formatPrice(order.total)}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Floating bottom buttons – now includes Dashboard (refresh) */}
        <div className="fixed bottom-6 right-6 flex gap-4">
          <button
            onClick={loadDashboard}
            className="p-4 bg-indigo-900 border border-indigo-700 text-indigo-300 rounded-2xl hover:bg-indigo-800 hover:text-white transition duration-200 shadow-lg"
            title="Dashboard"
          >
            <LayoutDashboard className="w-6 h-6" />
          </button>
          <button
            onClick={() => navigate('/')}
            className="p-4 bg-gray-800 border border-gray-700 text-gray-300 rounded-2xl hover:bg-gray-700 hover:text-white transition duration-200 shadow-lg"
            title="Home"
          >
            <Home className="w-6 h-6" />
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="p-4 bg-red-900 border border-red-700 text-red-300 rounded-2xl hover:bg-red-800 hover:text-white transition duration-200 shadow-lg disabled:opacity-50"
            title="Logout"
          >
            <LogOut className={`w-6 h-6 ${isLoggingOut ? 'animate-pulse' : ''}`} />
          </button>
        </div>

      </div>
    </div>
  );
}

export default SellerDashboard;