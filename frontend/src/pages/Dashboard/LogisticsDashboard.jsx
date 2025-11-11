import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, CheckCircle, MapPin, ListPlus, Clock, Package, TrendingUp } from 'lucide-react';
import api from '../../lib/api';

const StatCard = ({ title, value, icon: Icon, color, link }) => (
  <Link to={link} className="group bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-emerald-500 dark:bg-gray-800 dark:border-gray-700">
    <div className="flex items-center justify-between w-full mb-3">
      <Icon className={`w-8 h-8 ${color} group-hover:scale-110 transition-transform`} />
      <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-emerald-500" />
    </div>
    <p className={`text-4xl font-extrabold ${color}`}>{value}</p>
    <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mt-1 dark:text-gray-400">{title}</p>
  </Link>
);

const DeliveryItem = ({ orderId, orderNumber, status, shippingAddress, deliveredAt, colorClass }) => (
  <Link to={`/orders/${orderId}`} className={`p-4 border-l-4 ${colorClass} bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl flex justify-between items-center dark:bg-gray-700`}>
    <div>
      <p className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
        <Package className="w-4 h-4 text-emerald-600" /> Order: <span className="text-emerald-600">{orderNumber}</span>
      </p>
      <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">Address: {shippingAddress}</p>
    </div>
    <div className="text-right">
      <span className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${colorClass.replace('border-', 'bg-')}`}>
        {status}
      </span>
      <p className="text-sm text-gray-700 font-medium mt-1 dark:text-gray-300">ETA: {deliveredAt ? new Date(deliveredAt).toLocaleDateString() : '-'}</p>
    </div>
  </Link>
);

export default function LogisticsDashboard() {
  const [stats, setStats] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/orders/logistics');
        const orders = Array.isArray(data) ? data : data?.orders || [];

        const today = new Date();
        const deliveriesToday = orders.filter(o => {
          if (!o.createdAt) return false;
          const created = new Date(o.createdAt);
          return created.toDateString() === today.toDateString();
        }).length;

        const delivered = orders.filter(o => o.status === 'delivered');
        const inTransit = orders.filter(o => ['confirmed', 'shipped'].includes(o.status));

        const onTimeRate = delivered.length
          ? Math.round((delivered.filter(o => o.deliveredAt).length / delivered.length) * 100)
          : 0;

        setStats([
          { title: 'Deliveries Today', value: deliveriesToday, icon: Truck, color: 'text-emerald-600', link: '/orders?view=logistics' },
          { title: 'Active Deliveries', value: inTransit.length, icon: Package, color: 'text-blue-600', link: '/orders?status=shipped' },
          { title: 'Completed', value: delivered.length, icon: CheckCircle, color: 'text-emerald-700', link: '/orders?status=delivered' },
          { title: 'On-Time Rate', value: `${onTimeRate}%`, icon: Clock, color: 'text-amber-500', link: '/orders?view=logistics' },
        ]);

        const colorMap = {
          pending: 'border-amber-500',
          confirmed: 'border-blue-500',
          shipped: 'border-purple-500',
          delivered: 'border-emerald-500',
          cancelled: 'border-red-500',
        };

        setDeliveries(
          orders.slice(0, 5).map(order => ({
            orderId: order._id,
            orderNumber: order.orderNumber,
            status: order.status,
            shippingAddress: order.shippingAddress,
            deliveredAt: order.deliveredAt,
            colorClass: colorMap[order.status] || 'border-gray-400',
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading logistics data...</div>;

  return (
    <div className="font-inter min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white flex items-center gap-3 mb-4 sm:mb-0">
            <Truck className="w-10 h-10 text-emerald-600" />
            Logistics Operations
          </h1>
          <Link to="/orders?view=logistics" className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl shadow-xl hover:bg-emerald-700 transition">
            Manage Deliveries
          </Link>
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6 border-l-4 border-amber-500 pl-3">KPIs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        <div className="mt-12 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gradient-to-br from-emerald-50 to-blue-50 p-8 rounded-2xl shadow-xl min-h-[500px] flex flex-col items-center justify-center">
            <MapPin className="w-16 h-16 text-emerald-600 mb-4" />
            <h3 className="text-2xl font-bold">Live Tracking</h3>
            <p className="text-center text-gray-600 mt-2">Real-time fleet tracking coming soon.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-amber-300 dark:border-amber-700">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
              <Clock className="w-6 h-6 text-amber-500" /> Tasks
            </h3>
            <div className="space-y-4">
              {deliveries.map((d, i) => <DeliveryItem key={i} {...d} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}