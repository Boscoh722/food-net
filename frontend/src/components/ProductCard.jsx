import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  // Get the first image URL, handling both populated objects and ObjectIds
  const getImageUrl = () => {
    if (!product.images || product.images.length === 0) return null;
    
    // If images are populated objects
    const firstImage = product.images[0];
    if (typeof firstImage === 'object' && firstImage !== null && firstImage.url) {
      return firstImage.url;
    }
    
    // If images are just URLs (string array)
    if (typeof firstImage === 'string') {
      return firstImage;
    }
    
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer overflow-hidden" onClick={() => navigate(`/products/${product._id}`)}>
      <div className="bg-gray-200 dark:bg-gray-700 h-48 flex items-center justify-center rounded-t-lg overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={product.name || 'Product'} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`${imageUrl ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
          <span className="text-gray-500 dark:text-gray-400">No Image</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.location || 'Location not specified'}</p>
        <div className="flex items-center justify-between mb-3">
          <p className="text-primary font-bold text-lg">KSh {product.price?.toLocaleString() || '0'}</p>
          {product.unit && (
            <span className="text-xs text-gray-500 dark:text-gray-400">/ {product.unit}</span>
          )}
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/products/${product._id}`);
          }}
          className="bg-primary text-white w-full py-2 rounded hover:bg-primary/90 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
