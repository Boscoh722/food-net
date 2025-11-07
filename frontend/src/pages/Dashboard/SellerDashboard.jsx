import React, { useState, useEffect } from 'react';
import { 
  DollarSign, BarChart3, Package, PlusCircle, Clock, TrendingUp, 
  Leaf, Star, AlertTriangle, CheckCircle2, Image, MapPin, 
  Calendar, Package as PackageIcon, ShoppingBag 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

// Custom Stat Card
const SellerStatCard = ({ title, value, icon: Icon, valueColor = 'text-gray-800', linkTo = '#' }) => (
  <Link
    to={linkTo}
    className="group bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col items-start hover:border-emerald-300 dark:bg-gray-800 dark:border-gray-700"
  >
    <div className="flex items-center justify-between w-full mb-3">
      <Icon className={`w-9 h-9 ${valueColor} group-hover:scale-110 transition-transform`} />
      <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition" />
    </div>
    <p className={`text-4xl font-extrabold ${valueColor}`}>{value}</p>
    <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mt-1 dark:text-gray-400">{title}</p>
  </Link>
);

function SellerDashboard() {
  const { user } = useAuth();
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

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          api.get('/products/seller'),
          api.get('/orders/seller')
        ]);

        const myProducts = productsRes.data || [];
        setProducts(myProducts);

        const totalSales = ordersRes.data?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

        const inStock = myProducts.filter(p => p.inStock).length;
        const lowStock = myProducts.filter(p => p.quantityInStock > 0 && p.quantityInStock <= 10).length;
        const pendingApproval = myProducts.filter(p => !p.approved).length;
        const avgRating = myProducts.reduce((sum, p) => sum + (p.rating?.average || 0), 0) / (myProducts.length || 1);

        setStats({
          totalProducts: myProducts.length,
          inStock,
          lowStock,
          pendingApproval,
          avgRating: avgRating.toFixed(1),
          totalSales: ordersRes.data?.length || 0,
          revenue: totalSales
        });

      } catch (err) {
        console.error('Failed to load seller data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const formatPrice = (price, unit) => {
    const cleanUnit = unit?.replace('kgs', 'kg').replace('litre', 'L');
    return `KSh ${price?.toLocaleString()} / ${cleanUnit || 'unit'}`;
  };

  const getFreshnessStatus = (harvestDate) => {
    if (!harvestDate) return { text: 'Unknown', color: 'gray' };
    const daysOld = Math.floor((Date.now() - new Date(harvestDate)) / (1000 * 60 * 60 * 24));
    if (daysOld <= 2) return { text: 'Just Harvested', color: 'emerald' };
    if (daysOld <= 5) return { text: 'Fresh', color: 'green' };
    if (daysOld <= 10) return { text: 'Good', color: 'amber' };
    return { text: 'Mature', color: 'red' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent mb-4"></div>
          <p className="text-xl font-bold text-gray-700">Loading your farm dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white flex items-center gap-4">
              <Leaf className="w-12 h-12 text-emerald-600" />
              {user?.storeName || 'My Farm Store'}
            </h1>
            <p className="text-xl text-gray-600 mt-2 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {user?.location || 'Kenya'}
            </p>
          </div>
          <Link
            to="/seller/product/new"
            className="mt-4 sm:mt-0 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:from-emerald-700 hover:to-green-800 transition-all duration-300 flex items-center gap-3 transform hover:scale-105"
          >
            <PlusCircle className="w-7 h-7" />
            List New Product
          </Link>
        </div>

        {/* Stats Grid */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-8 border-amber-500 pl-4">Farm Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <SellerStatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={PackageIcon}
            valueColor="text-emerald-600"
            linkTo="/seller/products"
          />
          <SellerStatCard
            title="In Stock"
            value={stats.inStock}
            icon={CheckCircle2}
            valueColor="text-green-600"
            linkTo="/seller/products?status=instock"
          />
          <SellerStatCard
            title="Low Stock"
            value={stats.lowStock}
            icon={AlertTriangle}
            valueColor="text-amber-600"
            linkTo="/seller/products?stock=low"
          />
          <SellerStatCard
            title="Pending Approval"
            value={stats.pendingApproval}
            icon={Clock}
            valueColor="text-orange-600"
            linkTo="/seller/products?status=pending"
          />
          <SellerStatCard
            title="Avg Rating"
            value={`${stats.avgRating} stars`}
            icon={Star}
            valueColor="text-yellow-600"
          />
          <SellerStatCard
            title="Total Sales"
            value={stats.totalSales}
            icon={ShoppingBag}
            valueColor="text-blue-600"
            linkTo="/seller/orders"
          />
          <SellerStatCard
            title="Revenue"
            value={`KSh ${stats.revenue.toLocaleString()}`}
            icon={DollarSign}
            valueColor="text-emerald-700"
            linkTo="/seller/payouts"
          />
        </div>

        {/* Products Preview */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Package className="w-8 h-8 text-emerald-600" />
              Your Products
            </h2>
            <Link to="/seller/products" className="text-emerald-600 font-bold hover:text-emerald-700">
              View All →
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-2xl border-2 border-dashed border-emerald-300">
              <Leaf className="w-24 h-24 text-emerald-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-gray-800 mb-4">No products listed yet!</h3>
              <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                Start selling fresh produce directly to buyers across Kenya
              </p>
              <Link
                to="/seller/product/new"
                className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:bg-emerald-700 transform hover:scale-105 transition-all"
              >
                <PlusCircle className="w-7 h-7" />
                List Your First Product
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 6).map(product => {
                const freshness = getFreshnessStatus(product.harvestDate);
                const isLowStock = product.quantityInStock <= 10 && product.quantityInStock > 0;
                const isOutOfStock = product.quantityInStock === 0;

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100"
                  >
                    <div className="relative">
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center">
                          <Image className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        {!product.approved && (
                          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            Pending Approval
                          </span>
                        )}
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                          freshness.color === 'emerald' ? 'bg-emerald-500' :
                          freshness.color === 'green' ? 'bg-green-500' :
                          freshness.color === 'amber' ? 'bg-amber-500' : 'bg-red-500'
                        }`}>
                          {freshness.text}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-extrabold text-xl text-gray-800 mb-2">{product.name}</h3>
                      <p className="text-emerald-600 font-bold text-lg mb-2">
                        {formatPrice(product.price, product.unit)}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs mb-2">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">Stock: {product.quantityInStock}</span>
                        {product.isNegotiable && <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded">Negotiable</span>}
                        {product.harvestDate && <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded">Harvest: {new Date(product.harvestDate).toLocaleDateString()}</span>}
                        {product.location && <span className="bg-green-50 text-green-700 px-2 py-1 rounded">{product.location}</span>}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className={`font-bold ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-amber-600' : 'text-green-600'}`}>
                          {isOutOfStock ? 'Out of Stock' : `${product.quantityInStock} ${product.unit} available`}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          {product.rating?.average?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-emerald-600" />
              Sales Analytics
            </h3>
            <div className="h-64 flex items-center justify-center bg-linear-to-br from-emerald-50 to-green-50 rounded-2xl">
              <p className="text-center text-gray-600 text-lg">
                <TrendingUp className="w-16 h-16 mx-auto mb-3 text-emerald-500" />
                Detailed sales charts coming soon
              </p>
            </div>
          </div>

          <div className="bg-linear-to-br from-amber-500 to-orange-600 p-8 rounded-3xl shadow-2xl text-white">
            <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <Link to="/seller/products" className="block p-4 bg-white/20 hover:bg-white/30 rounded-2xl font-bold transition backdrop-blur-sm">
                Manage Products
              </Link>
              <Link to="/seller/orders" className="block p-4 bg-white/20 hover:bg-white/30 rounded-2xl font-bold transition backdrop-blur-sm">
                View Orders ({stats.totalSales})
              </Link>
              <Link to="/seller/payouts" className="block p-4 bg-white/20 hover:bg-white/30 rounded-2xl font-bold transition backdrop-blur-sm">
                Withdraw Earnings
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile FAB */}
        <Link
          to="/seller/product/new"
          className="fixed bottom-6 right-6 z-50 bg-linear-to-br from-emerald-600 to-green-700 text-white p-5 rounded-full shadow-2xl hover:shadow-emerald-500/50 transform hover:scale-110 transition-all duration-300 flex items-center justify-center lg:hidden"
        >
          <PlusCircle className="w-8 h-8" />
        </Link>
      </div>
    </div>
  );
}

export default SellerDashboard;
