import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { DollarSign, Package, Clock, TrendingUp, Leaf } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, link }) => (
  <Link
    to={link}
    className="group bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-emerald-300 dark:bg-gray-800 dark:border-gray-700"
  >
    <div className="flex items-center justify-between w-full mb-3">
      <Icon className={`w-8 h-8 ${color} group-hover:scale-110 transition-transform`} />
      <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-emerald-500" />
    </div>
    <p className={`text-4xl font-extrabold ${color}`}>{value}</p>
    <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mt-1 dark:text-gray-400">{title}</p>
  </Link>
);

export default function SellerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingApproval: 0,
    totalSales: 0,
    activeOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          api.get('/products/my'),
          api.get('/orders/seller'), // Assume backend endpoint for seller's orders
        ]);

        const products = Array.isArray(productsRes.data) ? productsRes.data : productsRes.data?.products || [];
        const orders = Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data?.orders || [];

        setStats({
          totalProducts: products.length,
          pendingApproval: products.filter(p => !p.approved).length,
          totalSales: orders
            .filter(o => o.status === 'delivered')
            .reduce((sum, o) => sum + Number(o.total || 0), 0),
          activeOrders: orders.filter(o => ['confirmed', 'shipped'].includes(o.status)).length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statItems = [
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-emerald-600', link: '/seller/products' },
    { title: 'Pending Approval', value: stats.pendingApproval, icon: Clock, color: 'text-amber-500', link: '/seller/products?approved=false' },
    { title: 'Total Sales (KSh)', value: `KSh ${stats.totalSales.toLocaleString()}`, icon: DollarSign, color: 'text-blue-600', link: '/seller/sales' },
    { title: 'Active Orders', value: stats.activeOrders, icon: TrendingUp, color: 'text-purple-600', link: '/seller/orders' },
  ];

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="font-inter min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white flex items-center gap-3 mb-4 sm:mb-0">
            <Leaf className="w-10 h-10 text-emerald-600" />
            {user?.name || 'Seller Panel'}
          </h1>
          <Link
            to="/seller/product/new"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl shadow-xl hover:from-emerald-700 hover:to-emerald-800 transition transform hover:scale-[1.02]"
          >
            Post New Product
          </Link>
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6 border-l-4 border-amber-500 pl-3">
          Performance Snapshot
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
}