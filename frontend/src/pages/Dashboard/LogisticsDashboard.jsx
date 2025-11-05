import { useState, useEffect } from 'react';
import { Truck, Package, Clock, CheckCircle, MapPin, ListPlus, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

// Custom Card Component for Logistics Metrics
const LogisticsStatCard = ({ title, value, icon: Icon, valueColor = 'text-purple-600', linkTo = '#' }) => (
  <Link 
    to={linkTo} 
    className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-purple-500 flex flex-col items-start"
  >
    <div className="flex items-center justify-between w-full mb-3">
        <Icon className={`w-7 h-7 ${valueColor} group-hover:scale-105 transition-transform`} />
        <TrendingUp className="w-5 h-5 text-gray-400" /> {/* Subtle trending icon */}
    </div>
    <p className={`text-3xl font-extrabold ${valueColor}`}>{value}</p>
    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-1">{title}</p>
  </Link>
);

// Mock Delivery Item Component
const DeliveryItem = ({ orderId, status, route, eta, colorClass }) => (
    <div className={`p-4 border-l-4 ${colorClass} bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg flex justify-between items-center`}>
        <div>
            <p className="font-bold text-gray-800 flex items-center gap-2">
                <Package className="w-4 h-4 text-purple-600" /> Order ID: <span className="text-purple-600">{orderId}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">Route: {route}</p>
        </div>
        <div className="text-right">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${colorClass.replace('border-', 'bg-')}`}>{status}</span>
            <p className="text-sm text-gray-700 font-medium mt-1">ETA: {eta}</p>
        </div>
    </div>
);


export default function LogisticsDashboard() {
  const [stats, setStats] = useState([]);
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    // TODO: Fetch stats and deliveries from API
    // loadStats();
    // loadDeliveries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-10">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
            <MapPin className="w-8 h-8 text-purple-600" />
            Logistics Operations Center
          </h1>
          <Link 
            to="/logistics/map-view"
            className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-700 transition duration-300 flex items-center gap-2 transform hover:scale-[1.02]"
          >
            <MapPin className="w-5 h-5" />
            Live Map View
          </Link>
        </div>

        {/* --- Key Metrics Grid --- */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-5">Operational KPIs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <LogisticsStatCard 
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              valueColor={stat.valueColor}
              linkTo={stat.linkTo}
            />
          ))}
        </div>

        {/* --- Main Content Area: Tracking and Live Updates --- */}
        <div className="mt-12 grid lg:grid-cols-3 gap-8">
            
            {/* Live Tracking Map Placeholder */}
            <div className="lg:col-span-2 bg-gray-200/50 p-8 rounded-xl shadow-2xl border border-gray-300 min-h-[400px]">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-600" /> Live Route Tracking 
                </h3>
                <div className="bg-white rounded-lg p-6 h-full flex items-center justify-center border-2 border-dashed border-gray-400">
                    <p className="text-gray-500 italic">
                        [Placeholder for Interactive Map showing driver locations and routes]
                    </p>
                </div>
            </div>

            {/* Next Deliveries List */}
            <div className="bg-white p-6 rounded-xl shadow-2xl border border-purple-200/50">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-600" /> Immediate Tasks ({deliveries.length})
                </h3>
                <div className="space-y-4">
                    {deliveries.length > 0 ? (
                        deliveries.map((item, index) => (
                            <DeliveryItem 
                                key={index}
                                orderId={item.orderId}
                                status={item.status}
                                route={item.route}
                                eta={item.eta}
                                colorClass={item.colorClass}
                            />
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-8 border border-dashed rounded-lg">
                            <Truck className="w-6 h-6 mx-auto mb-2" />
                            <p>No active deliveries right now.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
