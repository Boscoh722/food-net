import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Search, MapPin, ArrowRight, ShoppingBag, Users, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const categories = [
  { name: 'Fruits', icon: '🍎', color: 'from-red-400 to-pink-500' },
  { name: 'Vegetables', icon: '🥬', color: 'from-green-400 to-emerald-500' },
  { name: 'Grains', icon: '🌾', color: 'from-yellow-400 to-orange-500' },
  { name: 'Dairy', icon: '🥛', color: 'from-blue-400 to-cyan-500' },
  { name: 'Meats', icon: '🥩', color: 'from-red-500 to-rose-600' },
  { name: 'Fish', icon: '🐟', color: 'from-blue-500 to-indigo-600' },
  { name: 'Spices', icon: '🌶️', color: 'from-orange-500 to-red-600' },
  { name: 'Tubers', icon: '🥔', color: 'from-amber-400 to-yellow-500' }
];

const features = [
  { icon: ShoppingBag, title: 'Fresh Products', desc: 'Direct from local farmers' },
  { icon: Users, title: 'Trusted Network', desc: 'Verified sellers and buyers' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Efficient logistics across Kenya' }
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-primary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-up">
              Fresh Food from
              <span className="block text-accent"> Kenyan Farms</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 animate-slide-up">
              Connect directly with local producers. Buy fresh, sell fair, deliver fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <Link
                to="/products"
                className="px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Browse Products
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="px-8 py-4 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Why Choose Food-Net?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-center animate-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Map */}
          <div className="h-[500px] lg:h-[600px]">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Search className="w-5 h-5 text-primary" />
                </div>
                <input
                  type="text"
                  placeholder="Search location or item..."
                  className="flex-grow px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                />
              </div>
              <div className="h-[calc(100%-80px)] rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                <MapContainer
                  center={[-1.2921, 36.8219]} // Nairobi
                  zoom={6}
                  className="h-full w-full z-0"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                  />
                  <Marker position={[-1.2921, 36.8219]}>
                    <Popup>Maize - KSh 500/kg<br />Nairobi</Popup>
                  </Marker>
                  <Marker position={[-0.0917, 34.7680]}>
                    <Popup>Sukuma Wiki - KSh 50/bunch<br />Kisumu</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Right: Categories */}
          <div>
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Food Categories
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Explore our wide range of fresh agricultural products from across Kenya
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat, idx) => (
                <Link
                  key={cat.name}
                  to="/products"
                  className={`group relative p-6 rounded-xl bg-gradient-to-br ${cat.color} text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-scale-in`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className="font-bold text-lg">{cat.name}</h3>
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5" />
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
