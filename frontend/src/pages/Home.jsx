import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Search, MapPin, ArrowRight, ShoppingBag, Users, Truck,
  DollarSign, Feather, Zap
} from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const categories = [
  { name: 'Fruits', icon: '🍎', color: 'from-red-400 to-pink-500' },
  { name: 'Vegetables', icon: '🥬', color: 'from-green-400 to-emerald-500' },
  { name: 'Grains', icon: '🌾', color: 'from-yellow-400 to-orange-500' },
  { name: 'Dairy', icon: '🥛', color: 'from-blue-400 to-cyan-500' },
  { name: 'Meats', icon: '🥩', color: 'from-red-500 to-rose-600' },
  { name: 'Fish', icon: '🐟', color: 'from-blue-500 to-indigo-600' },
  { name: 'Spices', icon: '🌶️', color: 'from-orange-500 to-red-600' },
  { name: 'Tubers', icon: '🥔', color: 'from-amber-400 to-yellow-500' },
];

const features = [
  { icon: ShoppingBag, title: 'Fresh Products', desc: 'Direct from local farmers' },
  { icon: Users, title: 'Trusted Network', desc: 'Verified sellers and buyers' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Efficient logistics across Kenya' },
];


function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-inter">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-emerald-700 to-green-800 text-white py-24 md:py-36 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Fresh Food <span className="text-amber-300">Direct</span> from
            <span className="block text-white/90"> Kenyan Farms</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-white/90 font-light">
            Connect directly with local producers. Buy fresh, sell fair, deliver fast.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link to="/products" className="px-10 py-4 bg-amber-400 text-gray-900 font-bold text-lg rounded-xl hover:bg-amber-300 transition-all duration-300 shadow-2xl flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" /> Start Shopping
            </Link>
            {!user && (
              <Link to="/register" className="px-10 py-4 bg-white/20 text-white font-semibold text-lg rounded-xl border border-white/50 hover:bg-white/30 transition-all duration-300 shadow-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5" /> Sell With Us
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="h-[500px] lg:h-[650px]">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 h-full border border-gray-200 dark:border-gray-700">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-green-600" /> Discover Nearby Farms
              </h2>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Search className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                </div>
                <input
                  type="text"
                  placeholder="Search location or item..."
                  className="grow px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-green-500/30 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="h-[calc(100%-140px)] rounded-xl overflow-hidden border-2 border-green-500/50">
                <MapContainer center={[-1.2921, 36.8219]} zoom={6} className="h-full w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[-1.2921, 36.8219]}>
                    <Popup>Mock Farm Location</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h2 className="text-4xl font-extrabold mb-4">Shop By Category</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg border-l-4 border-amber-500 pl-3 mb-6">
              Explore our wide range of agricultural products.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat) => (
                <Link key={cat.name} to="/products"
                  className={`group relative p-6 rounded-2xl bg-gradient-to-br ${cat.color} text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] shadow-lg`}
                >
                  <div className="text-5xl mb-2">{cat.icon}</div>
                  <h3 className="font-bold text-xl">{cat.name}</h3>
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}

export default Home;
