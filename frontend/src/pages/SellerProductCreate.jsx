// src/pages/SellerProductCreate.jsx
import { useState, useRef, useEffect } from 'react'; // --- MODIFICATION --- Added useEffect
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Upload, X, MapPin, Package, CheckCircle2, AlertCircle, Leaf
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
// --- MODIFICATION --- Removed hardcoded 'categories' array
const units = ['kg', 'g', 'L', 'mL', 'bunch', 'piece', 'dozen', 'pack', 'box'];

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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // --- MODIFICATION ---
  const [categories, setCategories] = useState([]); // State for fetched categories
  const [categoryLoading, setCategoryLoading] = useState(true); // Loading state for categories

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '', // --- MODIFICATION --- Default to empty string
    price: '',
    unit: 'kg',
    quantityInStock: '',
    isNegotiable: false,
    location: '',
    coordinates: null,
    harvestDate: '',
    images: []
  });

  const [errors, setErrors] = useState({});

  // --- MODIFICATION --- Added useEffect to fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoryLoading(true);
      try {
        const { data } = await api.get('/categories');
        setCategories(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        console.error('Failed to fetch categories for form:', err);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = 'Required';
    if (!form.description.trim() || form.description.length < 20) err.description = 'Min 20 characters';
    if (!form.price || form.price <= 0) err.price = 'Valid price required';
    if (!form.quantityInStock || form.quantityInStock < 0) err.quantityInStock = 'Valid stock';
    if (!form.location.trim()) err.location = 'Required';
    if (form.images.length === 0) err.images = 'Upload at least 1 photo';
    if (!form.unit || typeof form.unit !== 'string' || !units.includes(form.unit)) err.unit = 'Unit of measurement is required';
    
    // --- MODIFICATION --- Validate category ID
    if (!form.category) err.category = 'Category is required';

    const validCoords = Array.isArray(form.coordinates) && form.coordinates.length === 2 && form.coordinates.every(c => typeof c === 'number' && !isNaN(c));
    if (!validCoords) err.coordinates = 'Farm location (map pin) is required';
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
        formData.append('upload_preset', 'Unsigned'); // Change if needed

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
      setSuccess('Images uploaded!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Image upload failed');
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

  // --- MODIFICATION --- Completed function and fixed API path
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price: Number(form.price),
        unit: form.unit,
        quantityInStock: Number(form.quantityInStock),
        isNegotiable: form.isNegotiable,
        location: form.location.trim(),
        coordinates: form.coordinates ? { type: 'Point', coordinates: form.coordinates } : undefined,
        harvestDate: form.harvestDate || undefined,
        images: form.images,
      };

      // Use correct seller route: /products/my
      await api.post('/products/my', payload); 
      
      setSuccess('Product submitted! Awaiting admin approval.');
      setTimeout(() => navigate('/dashboard/seller'), 2000); // Redirect to seller dashboard
    } catch (err) {
      const msg = err.response?.data?.message ||
        (err.response?.data?.errors?.map(x => x.msg).join(', ')) ||
        'Failed to create product';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-gray-800 flex items-center justify-center gap-4">
            <Leaf className="w-12 h-12 text-emerald-600" />
            List Your Fresh Produce
          </h1>
          <p className="text-xl text-gray-600 mt-3">Reach thousands of buyers across Kenya</p>
        </div>

        {/* Success/Error */}
        {success && <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6" /> {success}
        </div>}
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl">{error}</div>}

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Name & Category */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                <input
                  type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-500"
                  placeholder="e.g., Fresh Sukuma Wiki"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                {/* --- MODIFICATION --- Dynamic Category Select */}
                <select 
                  value={form.category} 
                  onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl"
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
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea
                value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                rows="4" className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl resize-none"
                placeholder="Describe quality, farming method, freshness..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Price, Unit, Stock */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Price (KSh)</label>
                <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl" placeholder="500" />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Unit</label>
                <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl">
                  {units.map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
                </select>
                {/* Note: This error message is misplaced in the original file, but keeping it */}
                {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Stock Quantity</label>
                <input type="number" value={form.quantityInStock} onChange={e => setForm({...form, quantityInStock: e.target.value})}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl" placeholder="50" />
                {errors.quantityInStock && <p className="text-red-500 text-sm mt-1">{errors.quantityInStock}</p>}
              </div>
            </div>

            {/* Negotiable & Harvest */}
            <div className="flex gap-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isNegotiable} onChange={e => setForm({...form, isNegotiable: e.target.checked})}
                  className="w-6 h-6 text-emerald-600 rounded" />
                <span className="font-bold">Price is negotiable</span>
              </label>
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Harvest Date (optional)</label>
                <input type="date" value={form.harvestDate} onChange={e => setForm({...form, harvestDate: e.target.value})}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl" />
              </div>
            </div>

            {/* Location + Map */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <MapPin className="inline w-5 h-5 mr-2" />Farm Location
              </label>
              <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl mb-4" placeholder="e.g., Kitengela, Kajiado" />
              {errors.location && <p className="text-red-500 text-sm mb-3">{errors.location}</p>}
              {errors.coordinates && <p className="text-red-500 text-sm mb-3">{errors.coordinates}</p>}

              <div className="h-80 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg">
                <MapContainer center={form.coordinates || KENYA_CENTER} zoom={form.coordinates ? 14 : 6}
                  style={{ height: '100%', width: '100%' }}
                  key={form.coordinates ? form.coordinates.join(',') : 'default'}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker position={form.coordinates} setPosition={(pos) => setForm(prev => ({ ...prev, coordinates: pos }))} />
                </MapContainer>
              </div>
              <p className="mt-3 text-sm flex items-center gap-2">
                {form.coordinates ? (
                  <><CheckCircle2 className="w-5 h-5 text-emerald-600" /> Location pinned</>
                ) : (
                  <><AlertCircle className="w-5 h-5 text-amber-600" /> Click map to set location</>
                )}
              </p>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Product Photos (max 5)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="img-upload" />
                <label htmlFor="img-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="font-bold text-gray-600">Click to upload</p>
                  <p className="text-sm text-gray-500">JPG, PNG up to 10MB</p>
                </label>
                {uploading && <p className="text-emerald-600 font-bold mt-4">Uploading...</p>}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img.url} alt="" className="w-full h-32 object-cover rounded-xl shadow-md" />
                    {img.isPrimary && <span className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded text-xs font-bold">Main</span>}
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4 pt-6">
              <button type="button" onClick={() => navigate(-1)}
                className="px-8 py-4 border-2 border-gray-300 rounded-2xl font-bold hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={loading || uploading}
                className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-green-700 text-white font-bold rounded-2xl shadow-xl hover:from-emerald-700 hover:to-green-800 disabled:opacity-70 flex items-center gap-3">
                {loading ? 'Submitting...' : (
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
