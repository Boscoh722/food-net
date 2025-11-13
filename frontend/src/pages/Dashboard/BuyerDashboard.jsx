// src/pages/Dashboard/BuyerDashboard.jsx
import { useState, useEffect } from 'react';
import { ShoppingCart, Package, Truck, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

// ──────────────────────────────────────────────────────────────
// BUYER STAT CARD (Only uses real data)
// ──────────────────────────────────────────────────────────────
const BuyerStatCard = ({ title, value, icon: Icon, valueColor = 'text-green-600', linkTo = '#' }) => (
  <Link
    to={linkTo}
    className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 text-center"
  >
    <Icon className={`w-12 h-12 ${valueColor} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
    <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
    <div className={`mt-4 text-2xl font-bold ${valueColor}`}>{value}</div>
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
          { title: 'Total Orders', value: totalOrders, icon: Package, valueColor: 'text-green-600', linkTo: '/orders' },
          { title: 'In Transit', value: inTransit, icon: Truck, valueColor: 'text-blue-600', linkTo: '/orders?status=shipped' },
          { title: 'Total Spent', value: `KSh ${totalSpent.toLocaleString()}`, icon: DollarSign, valueColor: 'text-green-600', linkTo: '/orders' },
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mb-4"></div>
          <p className="text-xl font-bold text-gray-700">Loading your dashboard...</p>
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
            onClick={() => fetchData()}
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

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-green-600" />
            Welcome back, {user?.name || 'User'}!
          </h1>
          <Link
            to="/products"
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition flex items-center gap-3"
          >
            <ShoppingCart className="w-6 h-6" />
            Start Shopping
          </Link>
        </div>

        {/* KEY METRICS */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-5">Your Activity Overview</h2>

          {stats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <BuyerStatCard key={i} {...stat} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100 text-center text-gray-500">
              No order history yet. Start shopping!
            </div>
          )}
        </div>

        {/* LATEST ORDER */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-5 flex items-center gap-3">
            <Truck className="w-6 h-6 text-green-600" />
            Latest Order
          </h2>
          {latestOrder ? (
            <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
              <p className="font-semibold text-gray-800">
                Order #{latestOrder.orderNumber}
              </p>
              <p className="text-green-600 font-medium mt-1">
                {latestOrder.status.toUpperCase()}
              </p>
              {latestOrder.eta && (
                <p className="text-sm text-gray-600 mt-2">
                  Estimated Arrival: {latestOrder.eta}
                </p>
              )}
              <Link
                to="/orders"
                className="mt-5 inline-block text-green-600 font-medium hover:underline"
              >
                View All Orders →
              </Link>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100 text-center text-gray-500">
              No recent orders
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
