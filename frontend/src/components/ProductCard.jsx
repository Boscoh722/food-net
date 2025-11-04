import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer" onClick={() => navigate(`/products/${product._id}`)}>
      <div className="bg-gray-200 dark:bg-gray-700 h-48 flex items-center justify-center rounded-t-lg">
        <span className="text-gray-500 dark:text-gray-400">Product Image</span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.location}</p>
        <p className="text-primary font-bold text-lg mb-3">KSh {product.price}</p>
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
