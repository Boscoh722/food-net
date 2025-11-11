// src/pages/Products.jsx
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  PlusCircle, Upload, X, MapPin, Package, CheckCircle2, AlertCircle, Leaf
} from 'lucide-react';
import L from 'leaflet';

// === LEAFLET ICON FIX ===
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const KENYA_CENTER = [-1.2921, 36.8219];
const DEFAULT_ZOOM = 6;

// --- MODIFICATION --- Removed hardcoded 'categories' array
// Units must match backend enum: ['kg', 'g', 'L', 'mL', 'bunch', 'piece', 'dozen', 'pack', 'box']
const units = ['kg', 'g', 'L', 'mL', 'bunch', 'piece', 'dozen', 'pack', 'box'];

// SAFE MARKER – NEVER PASSES NaN
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
        <div className="text-center font-bold text-emerald-700">
          Your Farm<br /><small>Click to move</small>
        </div>
      </Popup>
    </Marker>
  );
}

export default function Products() {
  const { user } = useAuth();
  const isSeller = user?.role === 'seller';
  const [products, setProducts] = useState([]);     // Always array
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // --- MODIFICATION ---
  const [categories, setCategories] = useState([]); // State for fetched categories
  const [categoryLoading, setCategoryLoading] = useState(true); // Loading state for categories

  const [form, setForm] = useState({
    name: '', description: '', 
    category: '', // --- MODIFICATION --- Default to empty string, not 'vegetables'
    price: '', unit: 'kg',
    quantityInStock: '', isNegotiable: false, location: '', coordinates: null,
    harvestDate: '', images: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadProducts();
    
    // --- MODIFICATION --- Fetch categories when component mounts
    const fetchCategories = async () => {
      setCategoryLoading(true);
      try {
        const { data } = await api.get('/categories');
        setCategories(data.data); // Store the full category objects
      } catch (err) {
        console.error('Failed to fetch categories for form:', err);
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
      // Handle different response structures
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
        formData.append('upload_preset', 'Unsigned'); // NOTE: Consider using a signed preset for security
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
    
    // --- MODIFICATION --- Validate category (it's now an ID)
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
      
      // Prepare payload with correct data types
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
        images: form.images // Array of objects with { url, publicId, isPrimary }
      };
      
      // --- MODIFICATION --- Use correct seller route: /products/my
      await api.post('/products/my', payload);
      alert('Submitted! Awaiting approval.');
      setShowForm(false);
      setForm({
        name: '', description: '', 
        category: '', // --- MODIFICATION --- Reset category to empty string
        price: '', unit: 'kg',
        quantityInStock: '', isNegotiable: false, location: '', coordinates: null,
        harvestDate: '', images: []
      });
      setErrors({});
      // Note: loadProducts() won't show this new product until it's approved
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
        (err.response?.data?.errors?.map(e => e.msg || e.message).join(', ')) ||
        'Failed to submit product';
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // RENDER MAP SAFELY
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
      <div className="h-80 rounded-2xl overflow-hidden border-2 border-gray-200">
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-extrabold flex items-center gap-4">
              <Leaf className="w-12 h-12 text-emerald-600" />
              Fresh Marketplace
            </h1>
            <p className="text-xl text-gray-600">{products.length} products</p>
          </div>
          {isSeller && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl hover:bg-emerald-700 flex items-center gap-3"
            >
              {showForm ? 'Cancel' : (
                <>
                  <PlusCircle className="w-7 h-7" />
                  List Product
                </>
              )}
            </button>
          )}
        </div>

        {/* FORM */}
        {isSeller && showForm && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12">
            <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
              <Package className="w-9 h-9 text-emerald-600" />
              List Your Produce
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* NAME & CATEGORY */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold mb-2">Product Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full px-5 py-4 border-2 rounded-2xl" placeholder="Fresh Sukuma Wiki" />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div>
                  <label className="block font-bold mb-2">Category</label>
                  {/* --- MODIFICATION --- Dynamic Category Select */}
                  <select 
                    value={form.category} 
                    onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full px-5 py-4 border-2 rounded-2xl"
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
                  {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block font-bold mb-2">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  rows="4" className="w-full px-5 py-4 border-2 rounded-2xl resize-none"
                  placeholder="Describe your produce..." />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>

              {/* PRICE, UNIT, STOCK */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block font-bold mb-2">Price (KSh)</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                    className="w-full px-5 py-4 border-2 rounded-2xl" placeholder="500" />
                  {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                </div>
                <div>
                  <label className="block font-bold mb-2">Unit</label>
                  <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}
                    className="w-full px-5 py-4 border-2 rounded-2xl">
                    {units.map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
                  </select>
                  {errors.unit && <p className="text-red-500 text-sm">{errors.unit}</p>}
                </div>
                <div>
                  <label className="block font-bold mb-2">Stock</label>
                  <input type="number" value={form.quantityInStock} onChange={e => setForm({...form, quantityInStock: e.target.value})}
                    className="w-full px-5 py-4 border-2 rounded-2xl" placeholder="50" />
                  {errors.quantityInStock && <p className="text-red-500 text-sm">{errors.quantityInStock}</p>}
                </div>
              </div>

              {/* NEGOTIABLE & HARVEST */}
              <div className="flex gap-6">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={form.isNegotiable} onChange={e => setForm({...form, isNegotiable: e.target.checked})}
                    className="w-6 h-6 text-emerald-600" />
                  <span className="font-bold">Negotiable</span>
                </label>
                <div className="flex-1">
                  <label className="block font-bold mb-2">Harvest Date</label>
                  <input type="date" value={form.harvestDate} onChange={e => setForm({...form, harvestDate: e.target.value})}
                    className="w-full px-5 py-4 border-2 rounded-2xl" />
                </div>
              </div>

              {/* LOCATION + MAP */}
              <div>
                <label className="block font-bold mb-2">
                  <MapPin className="inline w-5 h-5 mr-2" />Farm Location
                </label>
                <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                  className="w-full px-5 py-4 border-2 rounded-2xl mb-4" placeholder="Kitengela" />
                {errors.location && <p className="text-red-500 text-sm mb-3">{errors.location}</p>}
                {errors.coordinates && <p className="text-red-500 text-sm mb-3">{errors.coordinates}</p>}

                {renderMap()}

                <div className="mt-3 flex items-center gap-2 text-sm">
                  {form.coordinates ? (
                    <><CheckCircle2 className="w-5 h-5 text-emerald-600" /> Location set</>
                  ) : (
                    <><AlertCircle className="w-5 h-5 text-amber-600" /> Click map to pin</>
                  )}
                </div>
              </div>

              {/* IMAGES */}
              <div>
                <label className="block font-bold mb-2">Photos</label>
                <div className="border-2 border-dashed rounded-2xl p-8 text-center">
                  <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="img" />
                  <label htmlFor="img" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="font-bold">Upload</p>
                  </label>
                  {uploading && <p className="text-emerald-600 font-bold">Uploading...</p>}
                </div>
                <div className="grid grid-cols-4 gap-4 mt-6">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img.url} alt="" className="w-full h-32 object-cover rounded-xl" />
                      {img.isPrimary && <span className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded text-xs font-bold">Main</span>}
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 bg-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
              </div>

              {/* SUBMIT */}
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-8 py-4 border-2 rounded-2xl font-bold">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="px-10 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl flex items-center gap-3">
                  {submitting ? 'Submitting...' : <><CheckCircle2 className="w-6 h-6" /> Submit</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PRODUCTS */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-2xl">
            <Package className="w-24 h-24 text-emerald-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold">No products yet</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((p, i) => (
              <div key={p._id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}

        {/* FAB */}
        {isSeller && !showForm && (
          <button onClick={() => setShowForm(true)}
            className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white p-5 rounded-full shadow-2xl lg:hidden">
            <PlusCircle className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
}
