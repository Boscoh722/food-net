import React, { useState, useEffect } from 'react';
import { 
  DollarSign, BarChart3, Package, PlusCircle, Clock, 
  Leaf, Star, AlertTriangle, CheckCircle2, Image, MapPin, 
  Package as PackageIcon, ShoppingBag, RefreshCw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

// Custom Stat Card
const SellerStatCard = ({ title, value, icon: Icon, valueColor = 'text-green-600', linkTo = '#', description, onClick }) => {
  const navigate = useNavigate();
  
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else if (linkTo && linkTo !== '#') {
      navigate(linkTo);
    }
  };

  return (
    <div
      onClick={handleClick}
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
    inStock: 0,
    lowStock: 0,
    pendingApproval: 0,
    avgRating: 0,
    totalSales: 0,
    revenue: 0
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // CORRECT ROUTE: /api/seller/products (from sellerRoutes.js)
      const productsRes = await api.get('/seller/products');
      
      // Handle response structure: { success: true, products: [...], pagination: {...} }
      const myProducts = productsRes.data?.products || [];
      setProducts(myProducts);

      // CORRECT ROUTE: /api/seller/orders (from sellerRoutes.js)
      let ordersArray = [];
      try {
        const ordersRes = await api.get('/seller/orders');
        ordersArray = ordersRes.data?.orders || [];
      } catch (orderErr) {
        console.warn('Could not load orders:', orderErr);
      }

      // Calculate revenue from delivered orders only
      const totalSales = ordersArray
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + (o.total || 0), 0);

      // Calculate stats from products
      const inStock = myProducts.filter(p => p.quantityInStock > 0).length;
      const lowStock = myProducts.filter(p => p.quantityInStock > 0 && p.quantityInStock <= 10).length;
      const pendingApproval = myProducts.filter(p => p.approved === false).length;
      
      // Calculate average rating
      const productsWithRatings = myProducts.filter(p => p.rating?.average > 0);
      const avgRating = productsWithRatings.length > 0
        ? productsWithRatings.reduce((sum, p) => sum + (p.rating?.average || 0), 0) / productsWithRatings.length
        : 0;

      setStats({
        totalProducts: myProducts.length,
        inStock,
        lowStock,
        pendingApproval,
        avgRating: avgRating.toFixed(1),
        totalSales: ordersArray.length,
        revenue: totalSales
      });

    } catch (err) {
      console.error('Failed to load seller data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price, unit) => {
    const cleanUnit = unit?.replace('kgs', 'kg').replace('litre', 'L');
    return `KSh ${price?.toLocaleString()} / ${cleanUnit || 'unit'}`;
  };

  const getFreshnessStatus = (harvestDate) => {
    if (!harvestDate) return { text: 'Unknown', color: 'gray' };
    const daysOld = Math.floor((Date.now() - new Date(harvestDate)) / (1000 * 60 * 60 * 24));
    if (daysOld <= 2) return { text: 'Just Harvested', color: 'green' };
    if (daysOld <= 5) return { text: 'Fresh', color: 'green' };
    if (daysOld <= 10) return { text: 'Good', color: 'amber' };
    return { text: 'Mature', color: 'red' };
  };

  // Navigation handlers
  const handleNavigateToProducts = () => navigate('/products');
  const handleNavigateToOrders = () => navigate('/seller/orders');
  const handleNavigateToPayouts = () => navigate('/seller/payouts');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mb-4"></div>
          <p className="text-xl font-bold text-gray-700">Loading your farm dashboard...</p>
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
            {user?.storeName || user?.name || 'My Farm Store'}
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
              onClick={() => navigate('/products')}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition flex items-center gap-3"
            >
              <PlusCircle className="w-6 h-6" />
              List New Product
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-5">Farm Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SellerStatCard 
              title="Total Products" 
              value={stats.totalProducts} 
              icon={PackageIcon} 
              valueColor="text-green-600" 
              onClick={handleNavigateToProducts}
            />
            <SellerStatCard 
              title="In Stock" 
              value={stats.inStock} 
              icon={CheckCircle2} 
              valueColor="text-green-600" 
              onClick={handleNavigateToProducts}
            />
            <SellerStatCard 
              title="Low Stock" 
              value={stats.lowStock} 
              icon={AlertTriangle} 
              valueColor="text-orange-600" 
              onClick={handleNavigateToProducts}
            />
            <SellerStatCard 
              title="Pending Approval" 
              value={stats.pendingApproval} 
              icon={Clock} 
              valueColor="text-red-600" 
              onClick={handleNavigateToProducts}
            />
            <SellerStatCard 
              title="Avg Rating" 
              value={stats.avgRating === '0.0' ? 'N/A' : `${stats.avgRating} ⭐`} 
              icon={Star} 
              valueColor="text-yellow-600" 
            />
            <SellerStatCard 
              title="Total Sales" 
              value={stats.totalSales} 
              icon={ShoppingBag} 
              valueColor="text-blue-600" 
              onClick={handleNavigateToOrders}
            />
            <SellerStatCard 
              title="Revenue" 
              value={`KSh ${stats.revenue.toLocaleString()}`} 
              icon={DollarSign} 
              valueColor="text-green-600" 
              onClick={handleNavigateToPayouts}
            />
          </div>
        </div>

        {/* Recent Products Preview */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-5">Recent Products</h2>
        
          {products.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100 text-center">
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Products Yet</h3>
              <p className="text-gray-500 mb-6">Start by listing your first product</p>
              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <PlusCircle className="w-5 h-5" />
                Add Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 6).map(product => {
                const freshness = getFreshnessStatus(product.harvestDate);
                // Handle image from response: images array contains objects with url property
                const productImage = product.images?.[0]?.url || product.images?.[0];
                
                return (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/products/${product._id}`)}
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
                      <div className={`absolute top-3 right-3 px-3 py-1 bg-${freshness.color}-500 text-white text-xs font-bold rounded-full shadow-lg`}>
                        {freshness.text}
                      </div>
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
                        {formatPrice(product.price, product.unit)}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className={`font-semibold ${
                          product.quantityInStock > 10 
                            ? 'text-green-600' 
                            : product.quantityInStock > 0 
                              ? 'text-amber-600' 
                              : 'text-red-600'
                        }`}>
                          Stock: {product.quantityInStock} {product.unit}
                        </span>
                        {product.category?.name && (
                          <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded">
                            {product.category.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {products.length > 6 && (
            <div className="text-center mt-8">
              <button
                onClick={handleNavigateToProducts}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                View All Products
                <Package className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default SellerDashboard;