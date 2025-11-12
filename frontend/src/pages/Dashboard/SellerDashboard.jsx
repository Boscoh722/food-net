import React, { useState, useEffect } from 'react';
import { 
  DollarSign, BarChart3, Package, PlusCircle, Clock, TrendingUp, 
  Leaf, Star, AlertTriangle, CheckCircle2, Image, MapPin, 
  Package as PackageIcon, ShoppingBag 
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
          api.get('/seller/products'),
          api.get('/seller/orders')
        ]);

        // Handle products
        const myProducts = Array.isArray(productsRes.data) ? productsRes.data : productsRes.data?.products || [];
        setProducts(myProducts);

        // Handle orders safely
        const ordersArray = Array.isArray(ordersRes.data)
          ? ordersRes.data
          : ordersRes.data?.orders || [];

        const totalSales = ordersArray.reduce((sum, o) => sum + (o.total || 0), 0);

        // Calculate stats
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
          totalSales: ordersArray.length,
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
          <SellerStatCard title="Total Products" value={stats.totalProducts} icon={PackageIcon} valueColor="text-emerald-600" linkTo="/seller/products" />
          <SellerStatCard title="In Stock" value={stats.inStock} icon={CheckCircle2} valueColor="text-green-600" linkTo="/seller/products?status=instock" />
          <SellerStatCard title="Low Stock" value={stats.lowStock} icon={AlertTriangle} valueColor="text-amber-600" linkTo="/seller/products?stock=low" />
          <SellerStatCard title="Pending Approval" value={stats.pendingApproval} icon={Clock} valueColor="text-orange-600" linkTo="/seller/products?status=pending" />
          <SellerStatCard title="Avg Rating" value={`${stats.avgRating} stars`} icon={Star} valueColor="text-yellow-600" />
          <SellerStatCard title="Total Sales" value={stats.totalSales} icon={ShoppingBag} valueColor="text-blue-600" linkTo="/seller/orders" />
          <SellerStatCard title="Revenue" value={`KSh ${stats.revenue.toLocaleString()}`} icon={DollarSign} valueColor="text-emerald-700" linkTo="/seller/payouts" />
        </div>

        {/* Products Preview */}
        {/* (Your existing product grid code remains unchanged) */}
      </div>
    </div>
  );
}

export default SellerDashboard;
