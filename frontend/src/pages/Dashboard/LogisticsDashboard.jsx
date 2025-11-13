// src/pages/Dashboard/LogisticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Truck, MapPin, CheckCircle, ListPlus, Clock, Package 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Reusable Stat Card
const LogisticsStatCard = ({ title, value, icon: Icon, valueColor = 'text-green-600', linkTo = '#', description }) => (
  <Link 
    to={linkTo} 
    className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 text-center"
  >
    <Icon className={`w-12 h-12 ${valueColor} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
    <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
    {description && <p className="text-sm text-gray-600 mt-2">{description}</p>}
    <div className={`mt-4 text-2xl font-bold ${valueColor}`}>{value}</div>
  </Link>
);

// Delivery Item in Task List
const DeliveryItem = ({ orderId, status, route, eta, colorClass }) => (
  <Link 
    to={`/logistics/order/${orderId}`} 
    className={`p-4 border-l-4 ${colorClass} bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl flex justify-between items-center border border-gray-100`}
  >
    <div>
      <p className="font-bold text-gray-800 flex items-center gap-2">
        <Package className="w-4 h-4 text-green-600" /> 
        Order: <span className="text-green-600">{orderId}</span>
      </p>
      <p className="text-sm text-gray-600 mt-1">Route: {route}</p>
    </div>
    <div className="text-right">
      <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${colorClass.replace('border-', 'bg-')}`}>
        {status}
      </span>
      <p className="text-sm font-medium text-gray-700 mt-1">ETA: {eta}</p>
    </div>
  </Link>
);

export default function LogisticsDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState([]);
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    // TODO: Fetch stats from API
    setStats([
      { title: 'Deliveries Today', value: 12, icon: Truck, valueColor: 'text-green-600', linkTo: '/logistics/deliveries', description: 'Total deliveries scheduled for today' },
      { title: 'On-Time Rate', value: '98%', icon: CheckCircle, valueColor: 'text-green-600', linkTo: '/logistics/performance', description: 'Current on-time delivery rate' },
      { title: 'Active Routes', value: 5, icon: MapPin, valueColor: 'text-blue-600', linkTo: '/logistics/routes', description: 'Routes currently in progress' },
      { title: 'Pending Tasks', value: 3, icon: ListPlus, valueColor: 'text-red-600', linkTo: '/logistics/tasks', description: 'Tasks requiring immediate attention' },
    ]);

    setDeliveries([
      { orderId: 'ORD123', status: 'In Transit', route: 'Nairobi → Kisumu', eta: '2h 30m', colorClass: 'border-green-500' },
      { orderId: 'ORD124', status: 'Pending', route: 'Nakuru → Eldoret', eta: '5h 10m', colorClass: 'border-orange-500' },
      { orderId: 'ORD125', status: 'Delivered', route: 'Mombasa → Nairobi', eta: 'Delivered', colorClass: 'border-blue-500' },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
            <Truck className="w-8 h-8 text-green-600" />
            Logistics Operations Center
          </h1>
          <Link 
            to="/logistics/map-view"
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition duration-300 flex items-center gap-3"
          >
            <MapPin className="w-6 h-6" />
            Live Map View
          </Link>
        </div>

        {/* KPIs */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-5">Operational KPIs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <LogisticsStatCard key={i} {...stat} />
            ))}
          </div>
        </div>

        {/* Main Layout: Map + Tasks */}
        <div className="mt-10 grid lg:grid-cols-3 gap-8">
          {/* Live Map Area */}
          <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-2xl border border-gray-100 min-h-[300px] flex items-center justify-center">
            <p className="text-gray-500 italic text-xl">Map integration coming soon...</p>
          </div>

          {/* Immediate Tasks */}
          <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-700 mb-5 flex items-center gap-3">
              <Clock className="w-6 h-6 text-orange-600" />
              Immediate Tasks
            </h2>
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
