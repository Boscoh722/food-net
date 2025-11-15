import { useState, useEffect } from 'react';
import { 
  DollarSign, Package, PlusCircle, Clock, 
  Leaf, Star, AlertTriangle, CheckCircle2, Image, MapPin, 
  ShoppingBag, RefreshCw, TrendingUp, Truck, Home, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

// Custom Stat Card - Updated visuals only
const SellerStatCard = ({ title, value, icon: Icon, valueColor = 'text-green-400', description, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-gray-800 p-6 rounded-2xl shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-700 hover:border-blue-500 text-center cursor-pointer"
    >
      <div className="bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-900 transition-colors">
        <Icon className={`w-8 h-8 ${valueColor} group-hover:scale-110 transition-transform`} />
      </div>
      <h3 className="font-semibold text-gray-200 text-lg">{title}</h3>
      {description && <p className="text-sm text-gray-400 mt-2">{description}</p>}
      <div className={`mt-4 text-2xl font-bold ${valueColor} bg-gray-900 rounded-lg py-2 px-3 border border-gray-600`}>
        {value}
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
    avgRating: 0,
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

      // Fetch seller products from /api/seller/products
      const productsRes = await api.get('/seller/products');
      const myProducts = productsRes.data?.products || [];
      setProducts(myProducts);

      // Fetch seller orders from /api/seller/orders
      let ordersArray = [];
      try {
        const ordersRes = await api.get('/seller/orders');
        ordersArray = ordersRes.data?.orders || [];
        setRecentOrders(ordersArray.slice(0, 5));
      } catch (orderErr) {
        console.warn('Could not load orders:', orderErr);
      }

      // Calculate product stats
      const approvedProducts = myProducts.filter(p => p.approved === true).length;
      const pendingApproval = myProducts.filter(p => p.approved === false).length;

      // Calculate order stats
      const pendingOrders = ordersArray.filter(o => o.status === 'pending').length;
      const confirmedOrders = ordersArray.filter(o => o.status === 'confirmed').length;
      const shippedOrders = ordersArray.filter(o => o.status === 'shipped').length;
      const deliveredOrders = ordersArray.filter(o => o.status === 'delivered').length;

      // Calculate revenue from delivered orders
      const totalRevenue = ordersArray
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + (o.total || 0), 0);

      setStats({
        totalProducts: myProducts.length,
        approvedProducts,
        pendingApproval,
        avgRating: 0, // Not available in current schema
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

  const formatPrice = (price) => {
    return `KSh ${price?.toLocaleString() || 0}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-900 text-yellow-200 border border-yellow-700',
      confirmed: 'bg-blue-900 text-blue-200 border border-blue-700',
      shipped: 'bg-purple-900 text-purple-200 border border-purple-700',
      delivered: 'bg-green-900 text-green-200 border border-green-700',
      cancelled: 'bg-red-900 text-red-200 border border-red-700',
      refunded: 'bg-gray-700 text-gray-200 border border-gray-600'
    };
    return colors[status] || 'bg-gray-700 text-gray-200 border border-gray-600';
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

  const handleHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="text-center bg-gray-800 p-8 rounded-2xl shadow-2xl border-2 border-gray-700">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4 mx-auto"></div>
          <p className="text-xl font-bold text-white">Loading your seller dashboard...</p>
          <p className="text-gray-300 mt-2">Getting your business insights</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="text-center bg-gray-800 p-8 rounded-2xl shadow-2xl border-2 border-gray-700 max-w-md">
          <div className="bg-red-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-700">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-300 mb-6 bg-gray-700 rounded-lg p-3 border border-gray-600">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={loadDashboard}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold border border-blue-500"
            >
              Try Again
            </button>
            <button
              onClick={handleHome}
              className="px-4 py-3 bg-gray-700 border-2 border-gray-600 text-gray-200 rounded-xl hover:bg-gray-600 hover:border-gray-500 transition-all duration-300 shadow-lg flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border-2 border-gray-700">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <div className="bg-blue-900 p-2 rounded-lg border border-blue-700">
                <Leaf className="w-8 h-8 text-blue-400" />
              </div>
              Seller Dashboard
            </h1>
            <p className="text-gray-300 mt-2 text-lg">Welcome back, {user?.name || 'Seller'}!</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-3">
              <button
                onClick={handleHome}
                className="px-4 py-3 bg-gray-700 border-2 border-gray-600 text-gray-200 rounded-xl hover:bg-gray-600 hover:border-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 group"
                title="Go to Home"
              >
                <Home className="w-5 h-5 group-hover:text-white" />
                <span className="hidden sm:inline">Home</span>
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-4 py-3 bg-red-900 border-2 border-red-700 text-red-200 rounded-xl hover:bg-red-800 hover:border-red-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 group disabled:opacity-50"
                title="Logout"
              >
                <LogOut className={`w-5 h-5 group-hover:text-white ${isLoggingOut ? 'animate-pulse' : ''}`} />
                <span className="hidden sm:inline">
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </span>
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadDashboard}
                disabled={loading}
                className="px-6 py-3 bg-gray-700 border-2 border-gray-600 text-gray-200 rounded-xl font-semibold hover:bg-gray-600 hover:border-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => navigate('/seller/product/new')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold border border-blue-500"
              >
                <PlusCircle className="w-5 h-5" />
                Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Product Stats */}
        <div className="mb-16">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border-2 border-gray-700 mb-8">
            <h2 className="text-3xl font-bold text-white">Product Overview</h2>
            <p className="text-gray-300 mt-2">Manage your product catalog and approvals</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SellerStatCard 
              title="Total Products" 
              value={stats.totalProducts} 
              icon={Package} 
              valueColor="text-blue-400" 
              description="All your products"
              onClick={() => navigate('/seller/products')}
            />
            <SellerStatCard 
              title="Approved Products" 
              value={stats.approvedProducts} 
              icon={CheckCircle2} 
              valueColor="text-green-400" 
              description="Ready for sale"
              onClick={() => navigate('/seller/products?approved=true')}
            />
            <SellerStatCard 
              title="Pending Approval" 
              value={stats.pendingApproval} 
              icon={Clock} 
              valueColor="text-yellow-400" 
              description="Awaiting review"
              onClick={() => navigate('/seller/products?approved=false')}
            />
            <SellerStatCard 
              title="Revenue" 
              value={formatPrice(stats.revenue)} 
              icon={DollarSign} 
              valueColor="text-green-400" 
              description="Total earnings"
            />
          </div>
        </div>

        {/* Order Stats */}
        <div className="mb-16">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border-2 border-gray-700 mb-8">
            <h2 className="text-3xl font-bold text-white">Order Overview</h2>
            <p className="text-gray-300 mt-2">Track your order fulfillment progress</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <SellerStatCard 
              title="Total Orders" 
              value={stats.totalOrders} 
              icon={ShoppingBag} 
              valueColor="text-blue-400" 
              onClick={() => navigate('/seller/orders')}
            />
            <SellerStatCard 
              title="Pending" 
              value={stats.pendingOrders} 
              icon={Clock} 
              valueColor="text-yellow-400" 
              onClick={() => navigate('/seller/orders?status=pending')}
            />
            <SellerStatCard 
              title="Confirmed" 
              value={stats.confirmedOrders} 
              icon={CheckCircle2} 
              valueColor="text-blue-400" 
              onClick={() => navigate('/seller/orders?status=confirmed')}
            />
            <SellerStatCard 
              title="Shipped" 
              value={stats.shippedOrders} 
              icon={Truck} 
              valueColor="text-purple-400" 
              onClick={() => navigate('/seller/orders?status=shipped')}
            />
            <SellerStatCard 
              title="Delivered" 
              value={stats.deliveredOrders} 
              icon={CheckCircle2} 
              valueColor="text-green-400" 
              onClick={() => navigate('/seller/orders?status=delivered')}
            />
          </div>
        </div>

        {/* Recent Products */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Recent Products</h2>
            <button
              onClick={() => navigate('/seller/products')}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              View All →
            </button>
          </div>
        
          {products.length === 0 ? (
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border-2 border-gray-700 text-center">
              <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Products Yet</h3>
              <p className="text-gray-300 mb-6">Start by listing your first product</p>
              <button
                onClick={() => navigate('/seller/product/new')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Add Product
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.slice(0, 6).map(product => {
                const productImage = product.images?.[0]?.url || product.images?.[0];
                
                return (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/seller/products/${product._id}`)}
                    className="product-card bg-gray-800 rounded-2xl shadow-2xl overflow-hidden cursor-pointer border-2 border-gray-700 hover:border-blue-500 transition-all duration-300"
                  >
                    <div className="relative h-48 bg-gray-700">
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">
                          📦
                        </div>
                      )}
                      {!product.approved && (
                        <span className="absolute top-3 left-3 px-3 py-1 bg-yellow-900 text-yellow-200 text-xs font-bold rounded-full flex items-center gap-1 border border-yellow-700">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                      {product.approved && (
                        <span className="absolute top-3 left-3 px-3 py-1 bg-green-900 text-green-200 text-xs font-bold rounded-full flex items-center gap-1 border border-green-700">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-green-400 font-bold text-lg mb-3">
                        {formatPrice(product.price)}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">
                          {product.category?.name || product.category || 'Uncategorized'}
                        </span>
                        {product.location && (
                          <span className="text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {product.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Recent Orders</h2>
            <button
              onClick={() => navigate('/seller/orders')}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              View All →
            </button>
          </div>
          
          {recentOrders.length === 0 ? (
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border-2 border-gray-700 text-center">
              <ShoppingBag className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Orders Yet</h3>
              <p className="text-gray-300">Orders will appear here once customers start purchasing</p>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-max">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {recentOrders.map(order => (
                      <tr 
                        key={order._id}
                        onClick={() => navigate(`/seller/orders/${order._id}`)}
                        className="hover:bg-gray-700 cursor-pointer transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-semibold">
                          {formatPrice(order.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
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

        {/* Footer Navigation */}
        <div className="fixed bottom-6 right-6 flex gap-3">
          <button
            onClick={handleHome}
            className="p-3 bg-gray-800 border-2 border-gray-700 text-gray-300 rounded-xl hover:bg-gray-700 hover:border-gray-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl group"
            title="Go to Home"
          >
            <Home className="w-6 h-6" />
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="p-3 bg-red-900 border-2 border-red-700 text-red-300 rounded-xl hover:bg-red-800 hover:border-red-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl group disabled:opacity-50"
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