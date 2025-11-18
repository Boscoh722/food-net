import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  PlusCircle, Upload, X, MapPin, Package, CheckCircle2, AlertCircle, Search, Leaf
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
        <div className="text-center font-bold text-green-600">
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
      <div className="h-80 rounded-xl overflow-hidden border border-gray-300">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-3 rounded-xl">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Fresh Marketplace
                </h1>
                <p className="text-gray-600">Discover fresh farm products</p>
              </div>
            </div>
          </div>
          {isSeller && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              {showForm ? 'Cancel' : 'List Product'}
            </button>
          )}
        </div>

        <div className="relative max-w-xl mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          />
        </div>

        {isSeller && showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <Package className="w-6 h-6 text-green-600" />
              List Your Produce
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input 
                    type="text" 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500" 
                    placeholder="Fresh Sukuma Wiki" 
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select 
                    value={form.category} 
                    onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
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
                  {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})}
                  rows="4" 
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 resize-none"
                  placeholder="Describe your produce..." 
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (KSh)</label>
                  <input 
                    type="number" 
                    value={form.price} 
                    onChange={e => setForm({...form, price: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900" 
                    placeholder="500" 
                  />
                  {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <select 
                    value={form.unit} 
                    onChange={e => setForm({...form, unit: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  >
                    {units.map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
                  </select>
                  {errors.unit && <p className="text-red-600 text-sm mt-1">{errors.unit}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input 
                    type="number" 
                    value={form.quantityInStock} 
                    onChange={e => setForm({...form, quantityInStock: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900" 
                    placeholder="50" 
                  />
                  {errors.quantityInStock && <p className="text-red-600 text-sm mt-1">{errors.quantityInStock}</p>}
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={form.isNegotiable} 
                    onChange={e => setForm({...form, isNegotiable: e.target.checked})}
                    className="w-5 h-5 text-green-600" 
                  />
                  <span className="text-sm font-medium text-gray-700">Negotiable</span>
                </label>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Harvest Date</label>
                  <input 
                    type="date" 
                    value={form.harvestDate} 
                    onChange={e => setForm({...form, harvestDate: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Farm Location</span>
                </label>
                <input 
                  type="text" 
                  value={form.location} 
                  onChange={e => setForm({...form, location: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 mb-4" 
                  placeholder="Kitengela" 
                />
                {errors.location && <p className="text-red-600 text-sm mb-3">{errors.location}</p>}
                {errors.coordinates && <p className="text-red-600 text-sm mb-3">{errors.coordinates}</p>}

                {renderMap()}

                <div className="mt-3 flex items-center space-x-2 text-sm">
                  {form.coordinates ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-600" /> 
                      <span className="text-gray-600">Location set</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-yellow-600" /> 
                      <span className="text-gray-600">Click map to pin</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
                  <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="img" />
                  <label htmlFor="img" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="font-medium text-gray-600">Upload</p>
                  </label>
                  {uploading && <p className="text-green-600 font-medium">Uploading...</p>}
                </div>
                <div className="grid grid-cols-4 gap-4 mt-6">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img.url} alt="" className="w-full h-32 object-cover rounded-xl border border-gray-300" />
                      {img.isPrimary && <span className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">Main</span>}
                      <button 
                        type="button" 
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 bg-red-600 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {errors.images && <p className="text-red-600 text-sm mt-2">{errors.images}</p>}
              </div>

              <div className="flex justify-end space-x-4">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {submitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Submit</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Package className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p, i) => (
              <div key={p._id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}

        {isSeller && !showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="fixed bottom-6 right-6 z-50 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors lg:hidden"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}