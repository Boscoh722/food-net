import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Search, ArrowLeft, Grid, List } from 'lucide-react';
import api from '../../lib/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const categoryInfo = {
  fruits: { icon: '🍎', title: 'Fresh Fruits', color: 'text-red-500', bgColor: 'from-red-500 to-pink-500' },
  vegetables: { icon: '🥬', title: 'Fresh Vegetables', color: 'text-green-500', bgColor: 'from-green-500 to-emerald-500' },
  grains: { icon: '🌾', title: 'Grains & Cereals', color: 'text-yellow-500', bgColor: 'from-yellow-500 to-orange-500' },
  dairy: { icon: '🥛', title: 'Dairy Products', color: 'text-blue-500', bgColor: 'from-blue-400 to-blue-600' },
  meats: { icon: '🥩', title: 'Meats', color: 'text-red-600', bgColor: 'from-red-600 to-red-800' },
  fish: { icon: '🐟', title: 'Fish', color: 'text-primary-600', bgColor: 'from-cyan-400 to-blue-500' },
  spices: { icon: '🌶️', title: 'Spices', color: 'text-orange-500', bgColor: 'from-orange-500 to-red-500' },
  tubers: { icon: '🥔', title: 'Tubers', color: 'text-amber-500', bgColor: 'from-yellow-600 to-amber-700' },
  herbs: { icon: '🌿', title: 'Herbs', color: 'text-green-400', bgColor: 'from-green-400 to-green-600' },
  nuts: { icon: '🥜', title: 'Nuts', color: 'text-amber-600', bgColor: 'from-amber-500 to-yellow-600' },
  other: { icon: '📦', title: 'Other Products', color: 'text-gray-500', bgColor: 'from-gray-400 to-gray-600' }
};

export default function CategoryProducts() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const defaultCenter = [-1.2921, 36.8219];

  useEffect(() => {
    const loadCategoryProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/products/category/${category}?search=${encodeURIComponent(searchQuery)}`);
        setProducts(data.data || []);
      } catch (err) {
        console.error('Failed to load category products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadCategoryProducts();
  }, [category, searchQuery]);

  const mapCenter = useMemo(() => {
    const productsWithCoords = products.filter(p => 
      p.coordinates && p.coordinates.coordinates && p.coordinates.coordinates.length === 2
    );
    
    if (productsWithCoords.length === 0) return defaultCenter;
    
    const coords = productsWithCoords.map(p => p.coordinates.coordinates);
    const avgLng = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
    const avgLat = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
    
    return [avgLat, avgLng];
  }, [products]);

  if (!categoryInfo[category]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Category not found</h2>
            <Link to="/" className="text-green-600 hover:text-green-700 mt-4 inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" /> Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentCategory = categoryInfo[category];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className={`bg-gradient-to-r ${currentCategory.bgColor} text-white py-12`}>
        <div className="container mx-auto px-6">
          <Link to="/" className="text-white hover:text-white/80 inline-flex items-center mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{currentCategory.icon}</span>
              <div>
                <h1 className="text-4xl font-bold">{currentCategory.title}</h1>
                <p className="text-white/80 mt-2">
                  {products.length} {products.length === 1 ? 'product' : 'products'} available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products in this category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              {products.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow">
                  <div className="text-6xl mb-4">{currentCategory.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery ? 'No products match your search in this category.' : 'No products available in this category yet.'}
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Browse All Categories
                  </Link>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map(product => (
                    <ProductGridCard key={product._id} product={product} category={currentCategory} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map(product => (
                    <ProductListCard key={product._id} product={product} category={currentCategory} />
                  ))}
                </div>
              )}
            </div>

            <div className="h-[600px] bg-white rounded-xl shadow-lg overflow-hidden">
              <MapContainer 
                center={mapCenter} 
                zoom={products.length === 1 ? 10 : 6} 
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {products
                  .filter(product => product.coordinates && product.coordinates.coordinates)
                  .map(product => (
                    <Marker key={product._id} position={[product.coordinates.coordinates[1], product.coordinates.coordinates[0]]}>
                      <Popup>
                        <ProductPopup product={product} category={currentCategory} />
                      </Popup>
                    </Marker>
                  ))}
              </MapContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const ProductGridCard = ({ product, category }) => (
  <Link
    to={`/product/${product._id}`}
    className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200/50"
  >
    <div className="p-6">
      <div className="text-center mb-4">
        <div className="text-4xl mb-2">{category.icon}</div>
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
          {product.category}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
      
      <div className="flex items-center text-gray-500 mb-4">
        <MapPin className="w-4 h-4 mr-1" />
        <span className="text-sm">{product.location}</span>
      </div>
      
      {product.images?.[0]?.url && (
        <img 
          src={product.images[0].url} 
          alt={product.name}
          className="w-full h-32 object-cover rounded-lg mb-4"
        />
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-green-600">KSh {product.price}</span>
          <span className="text-gray-500 text-sm">/{product.unit}</span>
        </div>
        <div className="text-right text-sm text-gray-500">
          Stock: {product.quantityInStock}
        </div>
      </div>
    </div>
  </Link>
);

const ProductListCard = ({ product, category }) => (
  <Link
    to={`/product/${product._id}`}
    className="block bg-white rounded-xl shadow hover:shadow-md transition-shadow p-6"
  >
    <div className="flex gap-4">
      {product.images?.[0]?.url && (
        <img 
          src={product.images[0].url} 
          alt={product.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
      )}
      
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
          <span className="text-2xl font-bold text-green-600">KSh {product.price}</span>
        </div>
        
        <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{product.location}</span>
          </div>
          <span>Stock: {product.quantityInStock} {product.unit}</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs">{product.unit}</span>
          {product.isNegotiable && <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs">Negotiable</span>}
          {product.harvestDate && (
            <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs">
              Harvest: {new Date(product.harvestDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  </Link>
);

const ProductPopup = ({ product, category }) => (
  <div className="p-2 min-w-[200px]">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-2xl">{category.icon}</span>
      <h3 className="font-semibold text-lg">{product.name}</h3>
    </div>
    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
    <p className="text-green-600 font-bold text-lg mb-1">KSh {product.price} / {product.unit}</p>
    <p className="text-sm text-gray-500 mb-2">{product.location}</p>
    
    {product.images?.[0]?.url && (
      <img 
        src={product.images[0].url} 
        alt={product.name}
        className="w-full h-20 object-cover rounded mb-2"
      />
    )}
    
    <div className="flex flex-wrap gap-1 text-xs">
      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">Stock: {product.quantityInStock}</span>
      {product.isNegotiable && <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded">Negotiable</span>}
    </div>
  </div>
);