// src/pages/SellerProductCreate.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Upload, X, MapPin, Package, CheckCircle2, AlertCircle, Leaf, Loader2, DollarSign, Info
} from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const KENYA_CENTER = [-1.2921, 36.8219];
// Units matching backend enum exactly
const UNITS = ['kg', 'g', 'ton', 'L', 'ml', 'piece', 'dozen', 'crate', 'sack', 'bag', 'bunch', 'basket', 'tray', 'head'];

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
          Selected Location
          <br /><small>Click map to move</small>
        </div>
      </Popup>
    </Marker>
  );
}

export default function SellerProductCreate() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // State
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    unit: 'kg',
    quantityInStock: '',
    minOrderQuantity: 1,
    isNegotiable: false,
    location: '',
    coordinates: [KENYA_CENTER[0], KENYA_CENTER[1]],
    harvestDate: '',
    images: []
  });

  // Fetch Categories on Mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        if (data.success) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please refresh the page.');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Validation Logic
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Product name is required';
    if (!form.description.trim() || form.description.length < 20) newErrors.description = 'Description must be at least 20 characters';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.price || Number(form.price) <= 0) newErrors.price = 'Price must be greater than 0';
    if (!form.quantityInStock || Number(form.quantityInStock) < 0) newErrors.quantityInStock = 'Valid stock quantity is required';
    if (!form.location.trim()) newErrors.location = 'Location name is required';
    if (form.images.length === 0) newErrors.images = 'At least one image is required';

    const validCoords = Array.isArray(form.coordinates) &&
      form.coordinates.length === 2 &&
      form.coordinates.every(c => typeof c === 'number' && !isNaN(c));
    if (!validCoords) newErrors.coordinates = 'Please select a location on the map';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Image Upload Handler
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (form.images.length + files.length > 5) {
      alert('Maximum 5 photos allowed');
      return;
    }

    setUploading(true);
    const newImages = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'Unsigned');

        const res = await fetch('https://api.cloudinary.com/v1_1/dlkakdkm8/image/upload', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) throw new Error('Upload failed');

        const data = await res.json();
        newImages.push({
          url: data.secure_url,
          publicId: data.public_id,
          isPrimary: form.images.length === 0 && newImages.length === 0
        });
      }

      setForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
      setSuccess('Images uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare Payload
      const selectedCategory = categories.find(c => c._id === form.category);


      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        categoryName,
        categorySlug,
        price: Number(form.price),
        unit: form.unit,
        quantityInStock: Number(form.quantityInStock),
        minOrderQuantity: Number(form.minOrderQuantity),
        isNegotiable: form.isNegotiable,
        location: form.location.trim(),
        coordinates: {
          type: 'Point',
          coordinates: [form.coordinates[1], form.coordinates[0]]
        },
        harvestDate: form.harvestDate || undefined,
        images: form.images
      };

      console.log('Submitting Payload:', payload);

      const response = await api.post('/products', payload);

      if (response.data.success) {
        setSuccess('Product listed successfully! Redirecting...');
        setTimeout(() => navigate('/dashboard/seller'), 2000);
      }
    } catch (err) {
      console.error('Submission Error:', err);
      const msg = err.response?.data?.message ||
        (err.response?.data?.errors ? err.response.data.errors.map(e => e.msg).join(', ') : 'Failed to create product');
      setError(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center justify-center gap-3">
            <Leaf className="w-10 h-10 text-emerald-600" />
            List New Product
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Share your fresh produce with thousands of buyers.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-md bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
            <p className="text-emerald-700 font-medium">{success}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">

            {/* Basic Info Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className={`w-full rounded-lg border ${errors.name ? 'border-red-300' : 'border-gray-300'} px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                    placeholder="e.g. Organic Tomatoes"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className={`w-full rounded-lg border ${errors.category ? 'border-red-300' : 'border-gray-300'} px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                    disabled={loadingCategories}
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className={`w-full rounded-lg border ${errors.description ? 'border-red-300' : 'border-gray-300'} px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                  placeholder="Describe the quality, origin, and features of your produce..."
                />
                <div className="flex justify-between mt-1">
                  {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                  <span className="text-xs text-gray-500 ml-auto">{form.description.length} chars</span>
                </div>
              </div>
            </div>

            {/* Pricing & Stock Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Pricing & Inventory</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES) *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">KSh</span>
                    </div>
                    <input
                      type="number"
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      className={`w-full pl-12 rounded-lg border ${errors.price ? 'border-red-300' : 'border-gray-300'} px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                      placeholder="0.00"
                      min="0"
                    />
                  </div>
                  {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                  <select
                    value={form.unit}
                    onChange={e => setForm({ ...form, unit: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  >
                    {UNITS.map(u => (
                      <option key={u} value={u}>{u.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Stock *</label>
                  <input
                    type="number"
                    value={form.quantityInStock}
                    onChange={e => setForm({ ...form, quantityInStock: e.target.value })}
                    className={`w-full rounded-lg border ${errors.quantityInStock ? 'border-red-300' : 'border-gray-300'} px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                    placeholder="0"
                    min="0"
                  />
                  {errors.quantityInStock && <p className="mt-1 text-sm text-red-500">{errors.quantityInStock}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Quantity</label>
                  <input
                    type="number"
                    value={form.minOrderQuantity}
                    onChange={e => setForm({ ...form, minOrderQuantity: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    min="1"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="negotiable"
                    checked={form.isNegotiable}
                    onChange={e => setForm({ ...form, isNegotiable: e.target.checked })}
                    className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="negotiable" className="ml-2 block text-sm text-gray-900">
                    Price is negotiable
                  </label>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Location</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Name *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    className={`w-full pl-10 rounded-lg border ${errors.location ? 'border-red-300' : 'border-gray-300'} px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                    placeholder="e.g. Naivasha, Nakuru County"
                  />
                </div>
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Pin Location on Map *</label>
                <div className="h-80 w-full rounded-xl overflow-hidden border border-gray-300 shadow-inner">
                  <MapContainer
                    center={form.coordinates}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker
                      position={form.coordinates}
                      setPosition={pos => setForm({ ...form, coordinates: pos })}
                    />
                  </MapContainer>
                </div>
                {errors.coordinates && <p className="text-sm text-red-500">{errors.coordinates}</p>}
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Click on the map to set the exact location of your farm/store.
                </p>
              </div>
            </div>

            {/* Images Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Product Images</h2>

              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${errors.images ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-emerald-400 bg-gray-50'}`}>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={uploading}
                />
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                  {uploading ? (
                    <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-3" />
                  ) : (
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  )}
                  <span className="text-lg font-medium text-gray-700">
                    {uploading ? 'Uploading...' : 'Click to upload images'}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    Max 5 images. JPG, PNG supported.
                  </span>
                </label>
              </div>
              {errors.images && <p className="text-sm text-red-500 text-center">{errors.images}</p>}

              {/* Image Preview Grid */}
              {form.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden shadow-sm border border-gray-200">
                      <img
                        src={img.url}
                        alt={`Preview ${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {idx === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1 text-center">
                          Main Image
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="px-8 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md transition-all hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Package className="w-5 h-5" />
                    Publish Product
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