import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  PlusCircle, Upload, X, MapPin, Package, CheckCircle2, AlertCircle, Leaf, Search
} from 'lucide-react';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const KENYA_CENTER = [-1.2921, 36.8219];
const DEFAULT_ZOOM = 6;
const units = ['kg', 'g', 'L', 'mL', 'bunch', 'piece', 'dozen', 'pack', 'box'];

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
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '', description: '', category: '', price: '', unit: 'kg',
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
        console.error('Failed to fetch categories:', err);
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products?approved=true');
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
    if (!form.category) err.category = 'Category required';

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
        name: '', description: '', category: '', price: '', unit: 'kg',
        quantityInStock: '', isNegotiable: false, location: '', coordinates: null,
        harvestDate: '', images: []
      });
      setErrors({});
      loadProducts();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to submit product';
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
      <div className="h-80 rounded-xl overflow-hidden border-2 border-gray-600">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          key={mapKey}
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 to-gray-800 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border-2 border-gray-700">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <div className="bg-green-900 p-2 rounded-xl border border-green-700">
                <Leaf className="w-8 h-8 text-green-400" />
              </div>
              Fresh Marketplace
            </h1>
            <p className="text-gray-300 mt-2 text-lg">Discover fresh farm products</p>
          </div>
          {isSeller && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium rounded-xl hover:from-green-500 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 border border-green-500"
            >
              {showForm ? 'Cancel' : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  List Product
                </>
              )}
            </button>
          )}
        </div>

        <div className="relative max-w-xl mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition"
          />
        </div>

        {isSeller && showForm && (
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border-2 border-gray-700 mb-10">
            <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
              <Package className="w-6 h-6 text-green-400" />
              List Your Produce
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Product Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400" placeholder="Fresh Sukuma Wiki" />
                  {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <select 
                    value={form.category} 
                    onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-white"
                  >
                    <option value="" disabled>
                      {categoryLoading ? 'Loading...' : 'Select a category'}
                    </option>
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-400 text-sm">{errors.category}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  rows="4" className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 resize-none"
                  placeholder="Describe your produce..." />
                {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Price (KSh)</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-white" placeholder="500" />
                  {errors.price && <p className="text-red-400 text-sm">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Unit</label>
                  <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-white">
                    {units.map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
                  </select>
                  {errors.unit && <p className="text-red-400 text-sm">{errors.unit}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Stock</label>
                  <input type="number" value={form.quantityInStock} onChange={e => setForm({...form, quantityInStock: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-white" placeholder="50" />
                  {errors.quantityInStock && <p className="text-red-400 text-sm">{errors.quantityInStock}</p>}
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isNegotiable} onChange={e => setForm({...form, isNegotiable: e.target.checked})}
                    className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-300">Negotiable</span>
                </label>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Harvest Date</label>
                  <input type="date" value={form.harvestDate} onChange={e => setForm({...form, harvestDate: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-1">
                  <MapPin className="w-5 h-5" />Farm Location
                </label>
                <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-white mb-4" placeholder="Kitengela" />
                {errors.location && <p className="text-red-400 text-sm mb-3">{errors.location}</p>}
                {errors.coordinates && <p className="text-red-400 text-sm mb-3">{errors.coordinates}</p>}

                {renderMap()}

                <div className="mt-3 flex items-center gap-2 text-sm">
                  {form.coordinates ? (
                    <><CheckCircle2 className="w-5 h-5 text-green-400" /> Location set</>
                  ) : (
                    <><AlertCircle className="w-5 h-5 text-yellow-400" /> Click map to pin</>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Photos</label>
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center bg-gray-700">
                  <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="img" />
                  <label htmlFor="img" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="font-medium text-gray-300">Upload</p>
                  </label>
                  {uploading && <p className="text-green-400 font-medium">Uploading...</p>}
                </div>
                <div className="grid grid-cols-4 gap-4 mt-6">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img.url} alt="" className="w-full h-32 object-cover rounded-xl border-2 border-gray-600" />
                      {img.isPrimary && <span className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">Main</span>}
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 bg-red-600 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {errors.images && <p className="text-red-400 text-sm mt-2">{errors.images}</p>}
              </div>

              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-gray-700 border-2 border-gray-600 text-gray-200 rounded-xl font-medium hover:bg-gray-600 hover:border-gray-500 transition-all duration-300">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium rounded-xl hover:from-green-500 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl border border-green-500 disabled:opacity-50 flex items-center gap-3">
                  {submitting ? 'Submitting...' : <><CheckCircle2 className="w-5 h-5" /> Submit</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-xl font-bold text-white">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border-2 border-gray-700 text-center">
            <div className="bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
            <p className="text-gray-300">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p, i) => (
              <div key={p._id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}

        {isSeller && !showForm && (
          <button onClick={() => setShowForm(true)}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:from-green-500 hover:to-blue-500 transition-all duration-300 lg:hidden border border-green-500">
            <PlusCircle className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}