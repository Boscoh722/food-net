// src/pages/Home.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Search, ArrowRight, ShoppingBag, Users, Truck, DollarSign
} from 'lucide-react';
import L from 'leaflet';

// ──────────────────────────────────────────────────────────────
// Leaflet icon fix
// ──────────────────────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// ──────────────────────────────────────────────────────────────
// Static Data
// ──────────────────────────────────────────────────────────────
// This map links the visual data (colors) to the category slug
const categoryColorMap = {
  fruits: { color: 'from-red-400 to-pink-500' },
  vegetables: { color: 'from-green-400 to-emerald-500' },
  grains: { color: 'from-yellow-400 to-amber-500' },
  dairy: { color: 'from-blue-400 to-indigo-500' },
  meats: { color: 'from-red-600 to-red-700' },
  fish: { color: 'from-sky-400 to-cyan-500' },
  spices: { color: 'from-orange-400 to-red-500' },
  tubers: { color: 'from-amber-700 to-yellow-800' },
  nuts: { color: 'from-yellow-700 to-yellow-800' },
  herbs: { color: 'from-lime-400 to-green-500' },
  other: { color: 'from-gray-400 to-gray-500' },
};

const features = [
  { icon: ShoppingBag, title: 'Fresh Products', desc: 'Direct from local farmers' },
  { icon: Users,       title: 'Trusted Network', desc: 'Verified sellers and buyers' },
  { icon: Truck,       title: 'Fast Delivery',   desc: 'Efficient logistics across Kenya' },
];

// ──────────────────────────────────────────────────────────────
// Home Component
// ──────────────────────────────────────────────────────────────
function Home() {
  const { user } = useAuth();

  // ── State ─────────────────────────────────────────────────────
  const [products, setProducts] = useState([]);     // Always array
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [categories, setCategories] = useState([]); // State for fetched categories
  const [categoryLoading, setCategoryLoading] = useState(true); // Loading state for categories


  // ── Fetch Products ────────────────────────────────────────────
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/products?limit=50&approved=true');
        setProducts(Array.isArray(data) ? data : data?.products || []);
      } catch (err) {
        console.error('Failed to load products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // ── Fetch Categories ──────────────────────────────────────────
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoryLoading(true);
      try {
        const { data } = await api.get('/categories'); // Fetch from new endpoint

        // Map the fetched data to include frontend visual data
        const list = Array.isArray(data) ? data : data?.data || [];
        const mappedCategories = list.map(cat => ({
          name: cat.name,
          path: cat.slug,
          // ---
          // THE FIX: Use cat.icon directly from the database
          // ---
          icon: cat.icon || '📦', 
          color: categoryColorMap[cat.slug]?.color || 'from-gray-400 to-gray-500',
        }));
        
        setCategories(mappedCategories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ── Filter Products Safely ───────────────────────────────────
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    if (!searchQuery.trim()) return products;

    const q = searchQuery.toLowerCase();
    return products.filter(p => {
      const name = p.name?.toLowerCase() || '';
      const location = p.location?.toLowerCase() || '';
      const category = p.category?.name?.toLowerCase() || p.category?.toLowerCase() || '';
      return name.includes(q) || location.includes(q) || category.includes(q);
    });
  }, [products, searchQuery]);

  // ── Map Center (Dynamic) ─────────────────────────────────────
  const mapCenter = useMemo(() => {
    const withCoords = filteredProducts
      .map(p => {
        if (Array.isArray(p.coordinates)) return p.coordinates;
        if (Array.isArray(p.coordinates?.coordinates)) return p.coordinates.coordinates;
        return null;
      })
      .filter(coords => Array.isArray(coords) && coords.length === 2 && coords.every(c => typeof c === 'number'));

    if (withCoords.length === 0) return [-1.2921, 36.8219]; // Nairobi

    const avgLat = withCoords.reduce((sum, coords) => sum + coords[0], 0) / withCoords.length;
    const avgLng = withCoords.reduce((sum, coords) => sum + coords[1], 0) / withCoords.length;
    return [avgLat, avgLng];
  }, [filteredProducts]);

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-inter">

      {/* ====================== HERO ====================== */}
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
            <Link
              to="/products"
              className="px-10 py-4 bg-amber-400 text-gray-900 font-bold text-lg rounded-xl hover:bg-amber-300 transition-all duration-300 shadow-2xl flex items-center gap-2"
            >
              <ShoppingBag className="w-6 h-6" /> Start Shopping
            </Link>

            {!user && (
              <Link
                to="/register"
                className="px-10 py-4 bg-white/20 text-white font-semibold text-lg rounded-xl border border-white/50 hover:bg-white/30 transition-all duration-300 shadow-lg flex items-center gap-2"
              >
                <DollarSign className="w-5 h-5" /> Sell With Us
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ====================== MAP + CATEGORIES ====================== */}
      <section className="container mx-auto px-6 py-12">
        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products, locations or categories..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              aria-label="Search map markers"
            />
          </div>
        </div>

        {/* Grid: Map | Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Map */}
          <div className="h-96 lg:h-full min-h-96 rounded-xl overflow-hidden shadow-lg order-1 lg:order-1">
            {loading ? (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <MapContainer
                center={mapCenter}
                zoom={filteredProducts.length === 1 ? 10 : 6}
                style={{ height: '100%', width: '100%' }}
                key={mapCenter.join(',')}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {filteredProducts.map(product => (
                  product.coordinates?.lat && product.coordinates?.lng && (
                    <Marker
                      key={product._id}
                      position={[product.coordinates.lat, product.coordinates.lng]}
                    >
                      <Popup>
                        <div className="p-2 max-w-xs">
                          <h3 className="font-bold text-green-700">{product.name}</h3>
                          <p className="text-sm text-gray-600">
                            {product.category?.name || product.category}
                          </p>
                          <p className="text-green-600 font-bold mt-1">KSh {product.price}</p>
                          <p className="text-sm text-gray-500">{product.location}</p>
                        </div>
                      </Popup>
                    </Marker>
                  )
                ))}
              </MapContainer>
            )}
          </div>

          {/* RIGHT: Categories */}
          <div className="order-2 lg:order-2">
            <h2 className="text-3xl font-extrabold mb-4">Shop By Category</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg border-l-4 border-amber-500 pl-3 mb-6">
  Explore our wide range of agricultural products.
</p>

            {/* Render dynamic categories */}
            {categoryLoading ? (
              <div className="text-center py-10 text-gray-500">Loading categories...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map(cat => (
                  <Link
                    key={cat.path}
                    to={`/products/category/${cat.path}`}
                    className={`group relative p-5 rounded-2xl bg-gradient-to-br ${cat.color} text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] shadow-lg flex flex-col items-center justify-center`}
                  >
                    <span className="text-4xl mb-2">{cat.icon}</span>
                    <h3 className="font-bold text-lg">{cat.name}</h3>
                    <ArrowRight className="absolute bottom-2 right-2 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ====================== FEATURES ====================== */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="text-center">
                <f.icon className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
