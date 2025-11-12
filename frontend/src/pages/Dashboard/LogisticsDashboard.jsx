// src/pages/Dashboard/LogisticsDashboard.jsx
import React from 'react';
import { 
  Truck, MapPin, CheckCircle, ListPlus, TrendingUp, Clock, Package 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Reusable Stat Card
const LogisticsStatCard = ({ title, value, icon: Icon, valueColor = 'text-emerald-600', linkTo = '#' }) => (
  <Link 
    to={linkTo} 
    className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 hover:border-emerald-500"
  >
    <div className="flex items-center justify-between w-full mb-3">
      <Icon className={`w-9 h-9 ${valueColor} group-hover:scale-110 transition-transform`} />
      <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition" />
    </div>
    <p className={`text-4xl font-extrabold ${valueColor}`}>{value}</p>
    <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mt-1 dark:text-gray-400">{title}</p>
  </Link>
);

// Delivery Item in Task List
const DeliveryItem = ({ orderId, status, route, eta, colorClass }) => (
  <Link 
    to={`/logistics/order/${orderId}`} 
    className={`p-4 border-l-4 ${colorClass} bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all rounded-xl flex justify-between items-center border-t border-gray-100 dark:border-gray-700`}
  >
    <div>
      <p className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
        <Package className="w-4 h-4 text-emerald-600" /> 
        Order: <span className="text-emerald-600">{orderId}</span>
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Route: {route}</p>
    </div>
    <div className="text-right">
      <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${colorClass.replace('border-', 'bg-').split(' ')[0]}`}>
        {status}
      </span>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">ETA: {eta}</p>
    </div>
  </Link>
);

export default function LogisticsDashboard() {
  const { user } = useAuth();

  // MOCK DATA – Perfectly fine for now! (Backend not ready yet)
  const stats = [
    { title: 'Deliveries Today', value: 12, icon: Truck, valueColor: 'text-emerald-600', linkTo: '/logistics/deliveries' },
    { title: 'On-Time Rate', value: '98%', icon: CheckCircle, valueColor: 'text-green-600', linkTo: '/logistics/performance' },
    { title: 'Active Routes', value: 5, icon: MapPin, valueColor: 'text-blue-600', linkTo: '/logistics/routes' },
    { title: 'Pending Tasks', value: 3, icon: ListPlus, valueColor: 'text-red-600', linkTo: '/logistics/tasks' },
  ];

  const deliveries = [
    { orderId: 'ORD123', status: 'In Transit', route: 'Nairobi → Kisumu', eta: '2h 30m', colorClass: 'border-emerald-500 bg-emerald-500' },
    { orderId: 'ORD124', status: 'Pending', route: 'Nakuru → Eldoret', eta: '5h 10m', colorClass: 'border-amber-500 bg-amber-500' },
    { orderId: 'ORD125', status: 'Delivered', route: 'Mombasa → Nairobi', eta: 'Delivered', colorClass: 'border-blue-500 bg-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-inter">
      <div className="container mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white flex items-center gap-4">
            <Truck className="w-12 h-12 text-emerald-600" />
            Logistics Operations Center
          </h1>
          <Link 
            to="/logistics/map-view"
            className="mt-4 sm:mt-0 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-2xl shadow-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all flex items-center gap-3 transform hover:scale-105"
          >
            <MapPin className="w-6 h-6" />
            Live Map View
          </Link>
        </div>

        {/* KPIs */}
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 border-l-8 border-amber-500 pl-4">
          Operational KPIs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <LogisticsStatCard key={i} {...stat} />
          ))}
        </div>

        {/* Main Layout: Map + Tasks */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Live Map Area */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 min-h-96">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
              <MapPin className="w-8 h-8 text-emerald-600" />
              Live Route Tracking
            </h3>
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 flex items-center justify-center text-gray-500">
              <p className="text-xl">Map integration coming soon...</p>
            </div>
          </div>

          {/* Immediate Tasks */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl border border-amber-400">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
              <Clock className="w-8 h-8 text-amber-500" />
              Immediate Tasks
            </h3>
            <div className="space-y-4">
              {deliveries.map((item) => (
                <DeliveryItem key={item.orderId} {...item} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}