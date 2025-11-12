// src/pages/Dashboard/BuyerDashboard.jsx
import { useState, useEffect } from 'react';
import { ShoppingCart, Package, Truck, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

// ──────────────────────────────────────────────────────────────
// BUYER STAT CARD (Only uses real data)
// ──────────────────────────────────────────────────────────────
const BuyerStatCard = ({ title, value, icon: Icon, valueColor = 'text-amber-600', linkTo = '#' }) => (
  <Link
    to={linkTo}
    className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-start hover:border-amber-300 dark:bg-gray-800 dark:border-gray-700"
  >
    <div className="p-3 mb-3 bg-amber-100 rounded-full group-hover:bg-amber-200 transition-colors">
      <Icon className={`w-6 h-6 ${valueColor} group-hover:scale-105 transition-transform`} />
    </div>
    <p className={`text-3xl font-extrabold mt-1 ${valueColor}`}>{value}</p>
    <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mt-1 dark:text-gray-400">{title}</p>
  </Link>
);

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [latestOrder, setLatestOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // 1. Fetch Buyer's Orders (REAL)
        const ordersRes = await api.get('/orders');
        const orders = Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data?.orders || [];

        const latest = orders[0];

        setLatestOrder(latest ? {
          orderNumber: latest.orderNumber,
          status: latest.status,
          eta: latest.deliveredAt
            ? new Date(latest.deliveredAt).toLocaleDateString()
            : (latest.shippedAt ? new Date(latest.shippedAt).toLocaleDateString() + ' (Shipped)' : null),
        } : null);

        // 2. Compute Stats from Orders (REAL)
        const totalOrders = orders.length;
        const inTransit = orders.filter(o => o.status === 'shipped').length;
        const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

        setStats([
          { title: 'Total Orders', value: totalOrders, icon: Package, valueColor: 'text-emerald-600', linkTo: '/orders' },
          { title: 'In Transit', value: inTransit, icon: Truck, valueColor: 'text-blue-600', linkTo: '/orders?status=shipped' },
          { title: 'Total Spent', value: `KSh ${totalSpent.toLocaleString()}`, icon: DollarSign, valueColor: 'text-amber-600', linkTo: '/orders' },
        ]);

      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="font-inter min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-10">

        {/* ERROR */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
            Welcome back, <span className="text-amber-600">{user?.name || 'User'}!</span>
          </h1>
          <Link
            to="/products"
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg shadow-md hover:bg-emerald-700 transition transform hover:scale-[1.03]"
          >
            <ShoppingCart className="w-5 h-5" />
            Start Shopping
          </Link>
        </div>

        {/* KEY METRICS */}
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-5 border-b pb-2 border-gray-200 dark:border-gray-700">
          Your Activity Overview
        </h2>

        {stats.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <BuyerStatCard key={i} {...stat} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl text-center text-gray-500 dark:text-gray-400">
            No order history yet. Start shopping!
          </div>
        )}

        {/* LATEST ORDER */}
        <div className="mt-12 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-600" /> Latest Order
          </h3>
          {latestOrder ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <p className="font-semibold text-gray-800 dark:text-white">
                Order #{latestOrder.orderNumber}
              </p>
              <p className="text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                {latestOrder.status.toUpperCase()}
              </p>
              {latestOrder.eta && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Estimated Arrival: {latestOrder.eta}
                </p>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg border border-gray-200 dark:border-gray-600 text-center text-gray-500 dark:text-gray-400">
              No recent orders
            </div>
          )}
          <Link
            to="/orders"
            className="mt-5 inline-block text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
          >
            View All Orders →
          </Link>
        </div>

      </div>
    </div>
  );
}