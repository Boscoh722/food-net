// src/pages/Products.jsx
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  PlusCircle, Upload, X, MapPin, Package, CheckCircle2, AlertCircle, Search
} from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const KENYA_CENTER = [-1.2921, 36.8219];
const DEFAULT_ZOOM = 6;

const units = ['kg', 'g', 'L', 'mL', 'bunch', 'piece', 'dozen', 'pack', 'box'];

// Location marker component
function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (typeof lat === 'number' && !isNaN(lat) && typeof lng === 'number' && !isNaN(lng)) {
        setPosition([lat, lng]);
        map.flyTo([lat, lng], 14);
      }
    },
  });

  if (!position || !Array.isArray(position) || position.length !== 2 || position.some(c => typeof c !== 'number' || isNaN(c))) {
    return null;
  }

  return (
    <Marker position={position}>
      <Popup>
        <div className="text-center font-bold text-green-700">
          Your Farm<br /><small>Click to move</small>
        </div>
      </Popup>
    </Marker>
  );
}

export default function Products() {
  const { user } = useAuth();
  const isSeller = user?.role === 'seller';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);
  const debounceRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [form, setForm] = useState({
    name: '', description: '',
    category: '',
    price: '', unit: 'kg',
    quantityInStock: '', isNegotiable: false, location: '', coordinates: null,
    harvestDate: '', images: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadProducts();

    const fetchCategories = async () => {
      setCategoryLoading(true);
      try {
        const { data } = await api.get('/categories');
        setCategories(data.data);
      } catch (err) {
        console.error('Failed to fetch categories for form:', err);
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Load products with search
  const loadProducts = async () => {
    try {
      setLoading(true);
      const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
      const res = await api.get(`/products?approved=true${searchParam}`);
      let data = [];
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data?.products && Array.isArray(res.data.products)) {
        data = res.data.products;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        data = res.data.data;
      }
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadProducts();
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const uploaded = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'Unsigned');
        const res = await fetch('https://api.cloudinary.com/v1_1/dlkakdkm8/image/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.secure_url) {
          uploaded.push({
            url: data.secure_url,
            publicId: data.public_id,
            isPrimary: form.images.length === 0
          });
        }
      }
      setForm(prev => ({ ...prev, images: [...prev.images, ...uploaded] }));
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (i) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== i)
    }));
  };

  const validateForm = () => {
    const err = {};
    if (!form.name.trim()) err.name = 'Required';
    if (!form.description.trim() || form.description.length < 20) err.description = 'Min 20 chars';
    if (!form.price || form.price <= 0) err.price = 'Valid price';
    if (!form.quantityInStock || form.quantityInStock < 0) err.quantityInStock = 'Valid stock';
    if (!form.location.trim()) err.location = 'Required';
    if (form.images.length === 0) err.images = 'Upload 1+ photo';
    if (!form.unit || !units.includes(form.unit)) err.unit = 'Unit required';
    if (!form.category) err.category = 'Category is required';

    const validCoords = Array.isArray(form.coordinates) && form.coordinates.length === 2 && form.coordinates.every(c => typeof c === 'number' && !isNaN(c));
    if (!validCoords) err.coordinates = 'Pin farm on map';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const validCoords = Array.isArray(form.coordinates) && form.coordinates.length === 2 && form.coordinates.every(c => typeof c === 'number' && !isNaN(c));
      
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price: parseFloat(form.price),
        unit: form.unit,
        quantityInStock: parseInt(form.quantityInStock, 10),
        isNegotiable: form.isNegotiable,
        location: form.location.trim(),
        coordinates: validCoords ? { type: 'Point', coordinates: form.coordinates } : undefined,
        harvestDate: form.harvestDate || undefined,
        images: form.images
      };
      
      await api.post('/products/my-products', payload);
      alert('Submitted! Awaiting approval.');
      setShowForm(false);
      setForm({
        name: '', description: '',
        category: '',
        price: '', unit: 'kg',
        quantityInStock: '', isNegotiable: false, location: '', coordinates: null,
        harvestDate: '', images: []
      });
      setErrors({});
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
        (err.response?.data?.errors?.map(e => e.msg || e.message).join(', ')) ||
        'Failed to submit product';
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Render map safely
  const renderMap = () => {
    if (!showForm) return null;

    const isValidCoords = Array.isArray(form.coordinates) && form.coordinates.length === 2 && form.coordinates.every(c => typeof c === 'number' && !isNaN(c));
    const mapCenter = isValidCoords ? form.coordinates : KENYA_CENTER;
    const mapZoom = isValidCoords ? 14 : DEFAULT_ZOOM;
    const mapKey = mapCenter.join(',') + '-' + mapZoom;

    if (!Array.isArray(mapCenter) || mapCenter.length !== 2 || mapCenter.some(c => typeof c !== 'number' || isNaN(c))) {
      return null;
    }

    return (
      <div className="h-80 rounded-2xl overflow-hidden shadow-lg">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          key={mapKey}
          className="leaflet-container"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker
            position={isValidCoords ? form.coordinates : null}
            setPosition={pos => {
              if (Array.isArray(pos) && pos.length === 2 && pos.every(c => typeof c === 'number' && !isNaN(c))) {
                setForm(prev => ({ ...prev, coordinates: pos }));
              }
            }}
          />
        </MapContainer>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        body {
            box-sizing: border-box;
        }
       
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
       
        .glass-effect {
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
       
        .hover-lift {
            transition: all 0.3s ease;
        }
       
        .hover-lift:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
       
        .category-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
       
        .category-card:hover {
            transform: scale(1.05);
        }
       
        .product-card {
            transition: all 0.3s ease;
            border: 1px solid rgba(229, 231, 235, 0.5);
        }
       
        .product-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
            border-color: #667eea;
        }
       
        .animate-fade-in {
            animation: fadeIn 0.6s ease-out;
        }
       
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
       
        .animate-slide-in {
            animation: slideIn 0.8s ease-out;
        }
       
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
        }
       
        .search-glow:focus {
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
       
        .leaflet-container {
            border-radius: 16px;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Products</h1>
          {isSeller && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {showForm ? 'Cancel' : 'List Product'}
            </button>
          )}
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products, locations, or categories..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-14 text-gray-800 bg-white rounded-2xl shadow-2xl focus:outline-none search-glow transition-all duration-300"
            />
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Form */}
        {isSeller && showForm && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">List Your Produce</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                  <input 
                    type="text" 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition"
                    placeholder="e.g., Fresh Tomatoes"
                  />
                  {errors.name && <p className="mt-1 text-red-600 text-sm">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select 
                    value={form.category} 
                    onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition"
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-red-600 text-sm">{errors.category}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition"
                  placeholder="Describe your product..."
                />
                {errors.description && <p className="mt-1 text-red-600 text-sm">{errors.description}</p>}
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (KSh)</label>
                  <input 
                    type="number" 
                    value={form.price} 
                    onChange={e => setForm({...form, price: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition"
                    placeholder="e.g., 150"
                  />
                  {errors.price && <p className="mt-1 text-red-600 text-sm">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
                  <select 
                    value={form.unit} 
                    onChange={e => setForm({...form, unit: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition"
                  >
                    {units.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                  {errors.unit && <p className="mt-1 text-red-600 text-sm">{errors.unit}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity in Stock</label>
                  <input 
                    type="number" 
                    value={form.quantityInStock} 
                    onChange={e => setForm({...form, quantityInStock: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition"
                    placeholder="e.g., 100"
                  />
                  {errors.quantityInStock && <p className="mt-1 text-red-600 text-sm">{errors.quantityInStock}</p>}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={form.isNegotiable} 
                    onChange={e => setForm({...form, isNegotiable: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-600"
                  />
                  <span className="text-sm font-semibold text-gray-700">Price Negotiable</span>
                </label>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Harvest Date (optional)</label>
                  <input 
                    type="date" 
                    value={form.harvestDate} 
                    onChange={e => setForm({...form, harvestDate: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Farm Location</label>
                <input 
                  type="text" 
                  value={form.location} 
                  onChange={e => setForm({...form, location: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition mb-4"
                  placeholder="e.g., Nairobi"
                />
                {errors.location && <p className="mt-1 text-red-600 text-sm">{errors.location}</p>}
                {renderMap()}
                {errors.coordinates && <p className="mt-1 text-red-600 text-sm">{errors.coordinates}</p>}
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  Click on the map to pin your farm location
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Images</label>
                <div className="border border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50">
                  <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="img" />
                  <label htmlFor="img" className="cursor-pointer block">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="font-semibold text-gray-700">Click to upload images</p>
                    <p className="text-sm text-gray-500">PNG, JPG (max. 5MB each)</p>
                  </label>
                  {uploading && <p className="mt-2 text-blue-600">Uploading...</p>}
                </div>
                {form.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={img.url} alt="" className="w-full h-32 object-cover rounded-xl shadow-md" />
                        <button 
                          type="button" 
                          onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 bg-white p-1 rounded-full shadow text-gray-600 hover:text-red-600 opacity-75 group-hover:opacity-100 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.images && <p className="mt-1 text-red-600 text-sm">{errors.images}</p>}
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-transparent border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Product'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No products found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((p, i) => (
              <div key={p._id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}

        {/* FAB for mobile */}
        {isSeller && !showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 lg:hidden"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}