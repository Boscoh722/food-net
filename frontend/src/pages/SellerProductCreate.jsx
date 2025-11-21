// src/pages/SellerProductCreate.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Upload, X, MapPin, Package, CheckCircle2, AlertCircle, Leaf
} from 'lucide-react';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const KENYA_CENTER = [-1.2921, 36.8219];
const units = ['kg', 'g', 'lb', 'oz', 'piece', 'bunch', 'bag', 'box', 'crate', 'other'];

function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      map.flyTo([lat, lng], 14);
    },
  });

  if (!position || position.some(isNaN)) return null;

  return (
    <Marker position={position}>
      <Popup>
        <div className="text-center font-bold text-emerald-700">
          Your Farm
          <br /><small>Click to move</small>
        </div>
      </Popup>
    </Marker>
  );
}

export default function SellerProductCreate() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    unit: 'kg',
    quantityInStock: 0,
    minOrderQuantity: 1,
    isNegotiable: false,
    location: '',
    coordinates: [KENYA_CENTER[0], KENYA_CENTER[1]],
    harvestDate: '',
    images: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories'); // your backend endpoint
        if (data.success) {
          const activeCategories = data.data.filter(cat => cat.isActive);
          setCategories(activeCategories);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = 'Product name is required';
    if (!form.description.trim() || form.description.length < 20) err.description = 'Description must be at least 20 characters';
    if (!form.price || form.price <= 0) err.price = 'Valid price is required';
    if (!form.quantityInStock || form.quantityInStock < 0) err.quantityInStock = 'Valid stock quantity is required';
    if (!form.location.trim()) err.location = 'Farm location is required';
    if (!form.category) err.category = 'Please select a category';
    if (form.images.length === 0) err.images = 'At least one product photo is required';
    
    const validCoords = Array.isArray(form.coordinates) && 
                       form.coordinates.length === 2 && 
                       form.coordinates.every(c => typeof c === 'number' && !isNaN(c));
    if (!validCoords) err.coordinates = 'Please set your farm location on the map';
    
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (form.images.length + files.length > 5) {
      alert('Maximum 5 photos allowed');
      return;
    }

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
      setSuccess('Images uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Image upload failed. Please try again.');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const coordinatesData = form.coordinates && form.coordinates.length === 2 ? {
        type: 'Point',
        coordinates: form.coordinates
      } : undefined;

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price: Number(form.price),
        unit: form.unit,
        quantityInStock: Number(form.quantityInStock),
        minOrderQuantity: Number(form.minOrderQuantity || 1),
        isNegotiable: form.isNegotiable,
        location: form.location.trim(),
        coordinates: coordinatesData,
        harvestDate: form.harvestDate || undefined,
        images: form.images
      };

      console.log('Submitting product payload:', payload);

      const response = await api.post('/products', payload);
      setSuccess('Product submitted successfully! Awaiting admin approval.');
      setTimeout(() => navigate('/dashboard/seller'), 2000);
    } catch (err) {
      console.error('Product creation error:', err);
      console.log('Error response:', err.response?.data);
      const msg = err.response?.data?.message ||
        err.response?.data?.error ||
        (err.response?.data?.errors && Array.isArray(err.response.data.errors) 
          ? err.response.data.errors.map(x => x.msg || x.message).join(', ')
          : 'Failed to create product. Please check all fields and try again.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-gray-800 flex items-center justify-center gap-4">
            <Leaf className="w-12 h-12 text-emerald-600" />
            List Your Fresh Produce
          </h1>
          <p className="text-xl text-gray-600 mt-3">Reach thousands of buyers across Kenya</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6" /> 
            {success}
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors"
                  placeholder="e.g., Fresh Sukuma Wiki"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category *
                </label>
                {loadingCategories ? (
                  <p>Loading categories...</p>
                ) : categories.length > 0 ? (
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p>No categories found</p>
                )}
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                {form.category && (
                  <div className="text-xs text-gray-500 mt-1">
                    Selected: {categories.find(c => c._id === form.category)?.name}
                  </div>
                 )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={form.description} 
                onChange={e => setForm({...form, description: e.target.value})}
                rows="4" 
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors"
                placeholder="Describe your product's quality, farming method, freshness, and any special features..."
              />
              <div className="text-xs text-gray-500 mt-1">
                {form.description.length}/20 characters (minimum 20 required)
              </div>
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Price (KSh) *
                </label>
                <input 
                  type="number" 
                  value={form.price} 
                  onChange={e => setForm({...form, price: e.target.value})}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors" 
                  placeholder="500" 
                  min="1"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Unit *
                </label>
                <select 
                  value={form.unit} 
                  onChange={e => setForm({...form, unit: e.target.value})}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors"
                >
                  {units.map(u => (
                    <option key={u} value={u}>
                      {u.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input 
                  type="number" 
                  value={form.quantityInStock} 
                  onChange={e => setForm({...form, quantityInStock: e.target.value})}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors" 
                  placeholder="50" 
                  min="0"
                />
                {errors.quantityInStock && <p className="text-red-500 text-sm mt-1">{errors.quantityInStock}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Min Order Qty *
                </label>
                <input 
                  type="number" 
                  value={form.minOrderQuantity} 
                  onChange={e => setForm({...form, minOrderQuantity: e.target.value})}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors" 
                  placeholder="1" 
                  min="1"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={form.isNegotiable} 
                  onChange={e => setForm({...form, isNegotiable: e.target.checked})}
                  className="w-6 h-6 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-200" 
                />
                <span className="font-bold text-gray-700">Price is negotiable</span>
              </label>
              
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Harvest Date (optional)
                </label>
                <input 
                  type="date" 
                  value={form.harvestDate} 
                  onChange={e => setForm({...form, harvestDate: e.target.value})}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <MapPin className="inline w-5 h-5 mr-2" />
                Farm Location *
              </label>
              <input 
                type="text" 
                value={form.location} 
                onChange={e => setForm({...form, location: e.target.value})}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl mb-4 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors" 
                placeholder="e.g., Kitengela, Kajiado County" 
              />
              {errors.location && <p className="text-red-500 text-sm mb-3">{errors.location}</p>}
              {errors.coordinates && <p className="text-red-500 text-sm mb-3">{errors.coordinates}</p>}

              <div className="h-80 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg">
                <MapContainer 
                  center={form.coordinates} 
                  zoom={form.coordinates ? 14 : 6}
                  style={{ height: '100%', width: '100%' }}
                  key={form.coordinates.join(',')}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker 
                    position={form.coordinates} 
                    setPosition={(pos) => setForm(prev => ({ ...prev, coordinates: pos }))} 
                  />
                </MapContainer>
              </div>
              
              <p className="mt-3 text-sm flex items-center gap-2">
                {form.coordinates ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" /> 
                    Location pinned at: {form.coordinates[0].toFixed(4)}, {form.coordinates[1].toFixed(4)}
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-amber-600" /> 
                    Click on the map to set your farm location
                  </>
                )}
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Product Photos * (max 5)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-emerald-400 transition-colors">
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  id="img-upload" 
                />
                <label htmlFor="img-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="font-bold text-gray-600">Click to upload photos</p>
                  <p className="text-sm text-gray-500">JPG, PNG up to 10MB each</p>
                </label>
                {uploading && (
                  <p className="text-emerald-600 font-bold mt-4">Uploading images...</p>
                )}
              </div>

              {form.images.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Uploaded images ({form.images.length}/5):
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img 
                          src={img.url} 
                          alt={`Product preview ${i + 1}`} 
                          className="w-full h-32 object-cover rounded-xl shadow-md"
                        />
                        {img.isPrimary && (
                          <span className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded text-xs font-bold">
                            Main
                          </span>
                        )}
                        <button 
                          type="button" 
                          onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button 
                type="button" 
                onClick={() => navigate(-1)}
                className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold rounded-2xl shadow-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                disabled={loading || uploading}
                className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-green-700 text-white font-bold rounded-2xl shadow-xl hover:from-emerald-700 hover:to-green-800 disabled:opacity-70 flex items-center gap-3 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-2xl"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Package className="w-6 h-6" />
                    Submit for Approval
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}