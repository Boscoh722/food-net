import { useNavigate } from 'react-router-dom';
import { MapPin, Package, Eye } from 'lucide-react';

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
      className="card card-hover group cursor-pointer overflow-hidden h-full flex flex-col"
      onClick={() => navigate(`/products/${product._id}`)}
    >
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center rounded-t-2xl overflow-hidden relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={product.name || 'Product'} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`${imageUrl ? 'hidden' : 'flex'} items-center justify-center w-full h-full bg-gradient-to-br from-gray-200 to-gray-300`}>
          <div className="bg-white/80 w-16 h-16 rounded-2xl flex items-center justify-center border border-gray-300/50 shadow-sm">
            <Package className="w-8 h-8 text-gray-500" />
          </div>
        </div>
        
        <div className="absolute top-4 right-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-glow border border-primary-500/30">
          KSh {product.price?.toLocaleString() || '0'}
        </div>
        
        {product.unit && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-300/50 shadow-sm">
            / {product.unit}
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-700 transition-colors duration-300 font-['Plus_Jakarta_Sans']">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin className="w-4 h-4 text-primary-500" />
          <span className="text-sm font-medium">{product.location || 'Location not specified'}</span>
        </div>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          {product.isNegotiable && (
            <span className="badge badge-warning font-semibold">
              💬 Negotiable
            </span>
          )}
          
          {product.quantityInStock > 0 ? (
            <span className="badge badge-success font-semibold">
              ✅ {product.quantityInStock} in stock
            </span>
          ) : (
            <span className="badge badge-error font-semibold">
              ❌ Out of stock
            </span>
          )}
        </div>

        <div className="mt-auto">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${product._id}`);
            }}
            className="btn btn-primary w-full font-semibold group-hover:scale-105 transform transition-all duration-300"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}