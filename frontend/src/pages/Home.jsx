// src/pages/Home.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, ArrowRight, ShoppingBag, Users, Truck } from 'lucide-react';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const categoryColorMap = {
  fruits: { color: 'from-red-500 to-pink-500' },
  vegetables: { color: 'from-green-500 to-emerald-500' },
  grains: { color: 'from-yellow-500 to-orange-500' },
  dairy: { color: 'from-blue-400 to-blue-600' },
  meats: { color: 'from-red-600 to-red-800' },
  fish: { color: 'from-cyan-400 to-blue-500' },
  spices: { color: 'from-orange-500 to-red-500' },
  herbs: { color: 'from-green-400 to-green-600' },
  nuts: { color: 'from-amber-500 to-yellow-600' },
  tubers: { color: 'from-yellow-600 to-amber-700' },
  other: { color: 'from-gray-400 to-gray-600' },
};

const features = [
  { icon: ShoppingBag, title: 'Fresh Products', desc: 'Direct from local farmers' },
  { icon: Users, title: 'Trusted Network', desc: 'Verified sellers and buyers' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Efficient logistics across Kenya' },
];

const featureIconColors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500'];

export default function Home() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const debounceRef = useRef(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
        const { data } = await api.get(`/products?limit=50&approved=true${searchParam}`);
        setProducts(Array.isArray(data) ? data : data?.products || []);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadProducts();
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoryLoading(true);
      try {
        const { data } = await api.get('/categories');
        const list = Array.isArray(data) ? data : data?.data || [];
        setCategories(
          list.map(cat => ({
            name: cat.name,
            path: cat.slug,
            icon: cat.icon || '📦',
            color: categoryColorMap[cat.slug]?.color || 'from-gray-400 to-gray-500',
          }))
        );
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter(cat => cat.name.toLowerCase().includes(q));
  }, [categories, searchQuery]);

  const filteredProducts = products;

  const mapCenter = useMemo(() => {
    const withCoords = filteredProducts
      .map(p => {
        if (Array.isArray(p.coordinates)) return p.coordinates;
        if (Array.isArray(p.coordinates?.coordinates)) return p.coordinates.coordinates;
        return null;
      })
      .filter(c => Array.isArray(c) && c.length === 2);
    if (!withCoords.length) return [-1.2921, 36.8219];
    const avgLat = withCoords.reduce((sum, c) => sum + c[0], 0) / withCoords.length;
    const avgLng = withCoords.reduce((sum, c) => sum + c[1], 0) / withCoords.length;
    return [avgLat, avgLng];
  }, [filteredProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Fresh Food <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Direct from Kenyan Farms</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto">
              Connect directly with producers. Buy fresh, sell fair, deliver fast.
            </p>

            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products, locations, or categories..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-14 text-gray-800 bg-white rounded-2xl shadow-2xl focus:outline-none focus:ring-3 focus:ring-primary-200 transition-all duration-300"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-16">
              {features.map((f,i) => (
                <div key={i} className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20 transition-all duration-300 hover:-translate-y-2 text-white">
                  <div className={`${featureIconColors[i]} rounded-xl w-12 h-12 flex items-center justify-center mb-4 mx-auto`}>
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                  <p className="text-gray-200">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of fresh produce and agricultural products
            </p>
          </div>
          {categoryLoading ? (
            <div className="text-center py-10 text-gray-500">Loading categories...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredCategories.map(cat => (
                <Link
                  key={cat.path}
                  to={`/products/category/${cat.path}`}
                  className={`group p-6 rounded-2xl bg-gradient-to-br ${cat.color} text-white cursor-pointer shadow-lg transition-all duration-300 hover:scale-105`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{cat.icon}</div>
                    <h3 className="font-semibold text-lg">{cat.name}</h3>
                  </div>
                  <ArrowRight className="absolute bottom-3 right-3 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"/>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600">Fresh from our trusted farmers</p>
          </div>
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading products...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map(product => {
                const categoryName = product.category?.name || product.category || '';
                const icon = categories.find(cat => cat.name === categoryName)?.icon || '📦';
                return (
                  <div key={product._id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary-300">
                    <div className="p-6">
                      <div className="text-center mb-4">
                        <div className="text-6xl mb-2">{icon}</div>
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{categoryName}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-500 text-sm mb-4">📍 {product.location}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-green-600">KSh {product.price}</span>
                          <span className="text-gray-500 text-sm">/kg</span>
                        </div>
                      </div>
                      <Link
                        to={`/product/${product._id}`}
                        className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:from-primary-700 hover:to-accent-700 transition-all duration-300 block text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:from-primary-700 hover:to-accent-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Products Near You</h2>
            <p className="text-xl text-gray-600">Discover local farmers and fresh produce in your area</p>
          </div>
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="h-96 w-full rounded-2xl">
              {loading ? (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <MapContainer
                  center={mapCenter}
                  zoom={filteredProducts.length === 1 ? 10 : 6}
                  style={{ height: "100%", width: "100%" }}
                  key={mapCenter.join(',')}
                  className="rounded-2xl"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {filteredProducts
                    .filter(p => p.coordinates && p.coordinates.lat && p.coordinates.lng)
                    .map(p => (
                      <Marker key={p._id} position={[p.coordinates.lat, p.coordinates.lng]}>
                        <Popup>
                          <div className="text-center p-2">
                            <div className="text-2xl mb-2">{categories.find(cat => cat.name === (p.category?.name || p.category))?.icon || '📦'}</div>
                            <h3 className="font-bold">{p.name}</h3>
                            <p className="text-green-600 font-bold">KSh {p.price}/kg</p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                </MapContainer>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}