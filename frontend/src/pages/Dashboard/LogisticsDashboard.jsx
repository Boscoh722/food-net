import React, { useState } from 'react';
import { DollarSign, BarChart3, Package, PlusCircle, Clock, TrendingUp, Leaf, Star, Truck, MapPin, ListPlus, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom'; // Replace with real router Link
import { useAuth } from '../../context/AuthContext';

// Use static Tailwind classes for colors
const PRIMARY_COLOR = 'emerald-600';
const SECONDARY_COLOR = 'amber-500';

// --- SELLER DASHBOARD COMPONENTS ---
const SellerStatCard = ({ title, value, icon: Icon, valueColor = 'text-gray-800', linkTo = '#' }) => (
    <Link to={linkTo} className="group bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col items-start hover:border-emerald-300 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between w-full mb-3">
            <Icon className={`w-8 h-8 ${valueColor} group-hover:scale-110 transition-transform`} />
            <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition" /> 
        </div>
        <p className={`text-4xl font-extrabold ${valueColor}`}>{value}</p>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mt-1 dark:text-gray-400">{title}</p>
    </Link>
);

function SellerDashboard({ stats }) {
    const { user } = useAuth();

    return (
        <div className="font-inter">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white flex items-center gap-3 mb-4 sm:mb-0">
                        <Leaf className={`w-10 h-10 text-${PRIMARY_COLOR}`} />
                        {user?.storeName || 'Seller Panel'}
                    </h1>
                    <Link 
                        to="/seller/product/new"
                        className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-${PRIMARY_COLOR} to-emerald-700 text-white font-semibold rounded-xl shadow-xl shadow-emerald-400/50 hover:from-emerald-700 hover:to-emerald-800 transition duration-300 transform hover:scale-[1.02]`}
                    >
                        <PlusCircle className="w-5 h-5" />
                        Post New Product
                    </Link>
                </div>

                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6 border-l-4 border-amber-500 pl-3">Performance Snapshot</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats?.map((stat, index) => (
                        <SellerStatCard 
                            key={index}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            valueColor={stat.valueColor}
                            linkTo={stat.linkTo}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// --- LOGISTICS DASHBOARD COMPONENTS ---
const LogisticsStatCard = ({ title, value, icon: Icon, valueColor = 'text-emerald-600', linkTo = '#' }) => (
    <Link to={linkTo} className="group bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col items-start hover:border-emerald-500 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between w-full mb-3">
            <Icon className={`w-8 h-8 ${valueColor} group-hover:scale-110 transition-transform`} />
            <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition" /> 
        </div>
        <p className={`text-4xl font-extrabold ${valueColor}`}>{value}</p>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mt-1 dark:text-gray-400">{title}</p>
    </Link>
);

const DeliveryItem = ({ orderId, status, route, eta, colorClass }) => (
    <Link to={`/logistics/order/${orderId}`} className={`p-4 border-l-4 ${colorClass} bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl flex justify-between items-center dark:bg-gray-700 dark:shadow-none dark:border-gray-600`}>
        <div>
            <p className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Order ID: <span className="text-emerald-600 dark:text-emerald-400">{orderId}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">Route: {route}</p>
        </div>
        <div className="text-right">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${colorClass}`}>{status}</span>
            <p className="text-sm text-gray-700 font-medium mt-1 dark:text-gray-300">ETA: {eta}</p>
        </div>
    </Link>
);


function LogisticsDashboard(props) {
    // Provide mock data if not passed as props
    const stats = props.stats || [
        { title: 'Deliveries Today', value: 12, icon: Truck, valueColor: 'text-emerald-600', linkTo: '/logistics/deliveries' },
        { title: 'On-Time Rate', value: '98%', icon: CheckCircle, valueColor: 'text-amber-500', linkTo: '/logistics/performance' },
        { title: 'Active Routes', value: 5, icon: MapPin, valueColor: 'text-blue-600', linkTo: '/logistics/routes' },
        { title: 'Pending Tasks', value: 3, icon: ListPlus, valueColor: 'text-red-500', linkTo: '/logistics/tasks' },
    ];
    const deliveries = props.deliveries || [
        { orderId: 'ORD123', status: 'In Transit', route: 'Nairobi → Kisumu', eta: '2h 30m', colorClass: 'bg-emerald-500 border-emerald-500' },
        { orderId: 'ORD124', status: 'Pending', route: 'Nakuru → Eldoret', eta: '5h 10m', colorClass: 'bg-amber-500 border-amber-500' },
        { orderId: 'ORD125', status: 'Delivered', route: 'Mombasa → Nairobi', eta: 'Delivered', colorClass: 'bg-blue-500 border-blue-500' },
    ];

    return (
        <div className="font-inter">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white flex items-center gap-3 mb-4 sm:mb-0">
                        <Truck className="w-10 h-10 text-emerald-600" />
                        Logistics Operations Center
                    </h1>
                    <Link 
                        to="/logistics/map-view"
                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl shadow-xl shadow-emerald-400/50 hover:from-emerald-700 hover:to-emerald-800 transition duration-300 transform hover:scale-[1.02] flex items-center gap-2"
                    >
                        <MapPin className="w-5 h-5 text-emerald-600" />
                        Live Map View
                    </Link>
                </div>

                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6 border-l-4 border-amber-500 pl-3">Operational KPIs</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

                <div className="mt-12 grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-gray-200/50 p-8 rounded-2xl shadow-xl border border-gray-300 min-h-[500px] dark:bg-gray-800 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                            <MapPin className="w-6 h-6 text-emerald-600" /> Live Route Tracking 
                        </h3>
                        {/* You can add a map or live tracking component here */}
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-amber-300 dark:bg-gray-800 dark:border-amber-700">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
                            <Clock className="w-6 h-6 text-amber-500" /> Immediate Tasks
                        </h3>
                        <div className="space-y-4">
                            {deliveries.map((item, index) => (
                                <DeliveryItem 
                                    key={index}
                                    orderId={item.orderId}
                                    status={item.status}
                                    route={item.route}
                                    eta={item.eta}
                                    colorClass={item.colorClass}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LogisticsDashboard;

//
