import { useNavigate } from 'react-router-dom';
import { MapPin, Package } from 'lucide-react';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const getImageUrl = () => {
    if (!product.images || product.images.length === 0) return null;
    
    const firstImage = product.images[0];
    if (typeof firstImage === 'object' && firstImage !== null && firstImage.url) {
      return firstImage.url;
    }
    
    if (typeof firstImage === 'string') {
      return firstImage;
    }
    
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <div 
      className="bg-gray-800 rounded-2xl shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-700 hover:border-blue-500 cursor-pointer overflow-hidden group"
      onClick={() => navigate(`/products/${product._id}`)}
    >
      <div className="bg-gray-700 h-48 flex items-center justify-center rounded-t-2xl overflow-hidden relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={product.name || 'Product'} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`${imageUrl ? 'hidden' : 'flex'} items-center justify-center w-full h-full bg-gray-600`}>
          <div className="bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center border border-gray-600">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold border border-green-500">
          KSh {product.price?.toLocaleString() || '0'}
        </div>
        
        {/* Unit Badge */}
        {product.unit && (
          <div className="absolute top-3 left-3 bg-gray-900 text-gray-300 px-2 py-1 rounded-full text-xs font-medium border border-gray-700">
            / {product.unit}
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-xl text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 text-gray-400 mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{product.location || 'Location not specified'}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          {product.isNegotiable && (
            <span className="bg-yellow-900 text-yellow-200 px-3 py-1 rounded-full text-xs font-semibold border border-yellow-700">
              Negotiable
            </span>
          )}
          
          {product.quantityInStock > 0 && (
            <span className="text-green-400 text-sm font-medium">
              {product.quantityInStock} in stock
            </span>
          )}
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/products/${product._id}`);
          }}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold border border-blue-500 group-hover:scale-105"
        >
          View Details
        </button>
      </div>
    </div>
  );
}