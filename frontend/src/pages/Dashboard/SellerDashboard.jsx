import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Package, PlusCircle, Clock, 
  Leaf, Star, AlertTriangle, CheckCircle2, Image, MapPin, 
  ShoppingBag, RefreshCw, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

// Custom Stat Card
const SellerStatCard = ({ title, value, icon: Icon, valueColor = 'text-green-600', description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 text-center cursor-pointer"
    >
      <Icon className={`w-12 h-12 ${valueColor} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
      <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
      {description && <p className="text-sm text-gray-600 mt-2">{description}</p>}
      <div className={`mt-4 text-2xl font-bold ${valueColor}`}>{value}</div>
    </div>
  );
};

function SellerDashboard() {
  const { user } = useAuth();
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
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mb-4 mx-auto"></div>
          <p className="text-xl font-bold text-gray-700">Loading your seller dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-2xl border border-gray-100 max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDashboard}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Retry
          </button>
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
            <Leaf className="w-8 h-8 text-green-600" />
            Seller Dashboard
          </h1>
          <div className="flex gap-3">
            <button
              onClick={loadDashboard}
              disabled={loading}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg shadow-md hover:bg-gray-200 transition flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => navigate('/products/new')}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition flex items-center gap-3"
            >
              <PlusCircle className="w-6 h-6" />
              Add Product
            </button>
          </div>
        </div>

        {/* Product Stats */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-5">Product Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SellerStatCard 
              title="Total Products" 
              value={stats.totalProducts} 
              icon={Package} 
              valueColor="text-green-600" 
              onClick={() => navigate('/seller/products')}
            />
            <SellerStatCard 
              title="Approved Products" 
              value={stats.approvedProducts} 
              icon={CheckCircle2} 
              valueColor="text-green-600" 
              onClick={() => navigate('/seller/products?approved=true')}
            />
            <SellerStatCard 
              title="Pending Approval" 
              value={stats.pendingApproval} 
              icon={Clock} 
              valueColor="text-orange-600" 
              onClick={() => navigate('/seller/products?approved=false')}
            />
            <SellerStatCard 
              title="Revenue" 
              value={formatPrice(stats.revenue)} 
              icon={DollarSign} 
              valueColor="text-green-600" 
            />
          </div>
        </div>

        {/* Order Stats */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-5">Order Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <SellerStatCard 
              title="Total Orders" 
              value={stats.totalOrders} 
              icon={ShoppingBag} 
              valueColor="text-blue-600" 
              onClick={() => navigate('/seller/orders')}
            />
            <SellerStatCard 
              title="Pending" 
              value={stats.pendingOrders} 
              icon={Clock} 
              valueColor="text-yellow-600" 
              onClick={() => navigate('/seller/orders?status=pending')}
            />
            <SellerStatCard 
              title="Confirmed" 
              value={stats.confirmedOrders} 
              icon={CheckCircle2} 
              valueColor="text-blue-600" 
              onClick={() => navigate('/seller/orders?status=confirmed')}
            />
            <SellerStatCard 
              title="Shipped" 
              value={stats.shippedOrders} 
              icon={TrendingUp} 
              valueColor="text-purple-600" 
              onClick={() => navigate('/seller/orders?status=shipped')}
            />
            <SellerStatCard 
              title="Delivered" 
              value={stats.deliveredOrders} 
              icon={CheckCircle2} 
              valueColor="text-green-600" 
              onClick={() => navigate('/seller/orders?status=delivered')}
            />
          </div>
        </div>

        {/* Recent Products */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-semibold text-gray-700">Recent Products</h2>
            <button
              onClick={() => navigate('/seller/products')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              View All →
            </button>
          </div>
        
          {products.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100 text-center">
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Products Yet</h3>
              <p className="text-gray-500 mb-6">Start by listing your first product</p>
              <button
                onClick={() => navigate('/products/new')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <PlusCircle className="w-5 h-5" />
                Add Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 6).map(product => {
                const productImage = product.images?.[0]?.url || product.images?.[0];
                
                return (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/seller/products/${product._id}`)}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 cursor-pointer overflow-hidden"
                  >
                    <div className="relative h-48 bg-gray-100">
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      {!product.approved && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                          <Clock className="w-3 h-3" />
                          Pending
                        </div>
                      )}
                      {product.approved && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-green-600 font-bold text-lg mb-3">
                        {formatPrice(product.price)}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {product.category?.name || product.category || 'Uncategorized'}
                        </span>
                        {product.location && (
                          <span className="text-gray-500 flex items-center gap-1">
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
        <div className="mt-10">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-semibold text-gray-700">Recent Orders</h2>
            <button
              onClick={() => navigate('/seller/orders')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              View All →
            </button>
          </div>
          
          {recentOrders.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100 text-center">
              <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Orders Yet</h3>
              <p className="text-gray-500">Orders will appear here once customers start purchasing</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map(order => (
                      <tr 
                        key={order._id}
                        onClick={() => navigate(`/seller/orders/${order._id}`)}
                        className="hover:bg-gray-50 cursor-pointer transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                          {formatPrice(order.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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

      </div>
    </div>
  );
}

export default SellerDashboard;