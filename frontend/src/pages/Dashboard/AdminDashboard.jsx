import { useState, useEffect } from 'react';
import { Users, AlertTriangle, UserCheck, BarChart3, Clock, TrendingUp, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

// Custom reusable Card component for consistent styling
const StatCard = ({ title, value, icon: Icon, valueColor = 'text-green-600', linkTo = '#' }) => (
  <Link 
    to={linkTo} 
    className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex items-center justify-between"
  >
    <div className="flex flex-col items-start">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
      <p className={`text-4xl font-extrabold mt-1 ${valueColor}`}>{value}</p>
    </div>
    <div className="p-3 bg-gray-100 rounded-full group-hover:bg-green-100 transition-colors duration-300">
      <Icon className={`w-8 h-8 ${valueColor} group-hover:scale-110 transition-transform`} />
    </div>
  </Link>
);


export default function AdminDashboard() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    // TODO: Fetch stats from API
    // loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-10">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-green-600" />
            Administrator Dashboard
          </h1>
          <Link 
            to="/admin/settings"
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition duration-300"
          >
            System Settings
          </Link>
        </div>

        {/* --- Key Metrics Grid --- */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-5">Key Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <StatCard 
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              valueColor={stat.valueColor}
              linkTo={stat.linkTo}
            />
          ))}
        </div>

        {/* --- Main Content Area (Placeholder for Charts/Tables) --- */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-5">Recent Activity</h2>
          <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100 min-h-[300px] flex items-center justify-center">
            <p className="text-gray-500 italic">
              Dashboard content area for charts, recent logs, or management tables.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
