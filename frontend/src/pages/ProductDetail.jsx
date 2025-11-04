import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const res = await api.get(`/products`);
      const found = res.data.find(p => p._id === id);
      setProduct(found);
    } catch (err) {
      alert('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!user) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }

    if (user.role !== 'buyer') {
      alert('Only buyers can place orders');
      return;
    }

    if (!confirm(`Place order for ${product.name} at KSh ${product.price}?`)) {
      return;
    }

    setOrdering(true);
    try {
      // Get seller ID - handle both populated and non-populated seller
      const sellerId = product.seller?._id || product.seller || product.sellerId;
      
      await api.post('/orders', {
        product: product._id,
        seller: sellerId
      });
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to place order';
      alert(errorMsg);
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Product not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl h-64 flex items-center justify-center">
            <span className="text-gray-500">Product Image</span>
          </div>
          <div>
            <p className="text-lg mb-2"><strong>Category:</strong> {product.category}</p>
            <p className="text-lg mb-2"><strong>Location:</strong> {product.location}</p>
            <p className="text-lg mb-2"><strong>Seller:</strong> {product.seller?.name || 'Unknown'}</p>
            <p className="text-2xl font-bold text-primary mb-4">KSh {product.price}</p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{product.description}</p>
            {user?.role === 'buyer' ? (
              <button
                onClick={handleOrder}
                disabled={ordering}
                className="bg-primary text-white px-6 py-3 rounded hover:bg-primary/90 w-full disabled:opacity-50"
              >
                {ordering ? 'Placing Order...' : 'Place Order'}
              </button>
            ) : user?.role === 'seller' ? (
              <p className="text-gray-500 text-center py-4">Sellers cannot place orders</p>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-primary text-white px-6 py-3 rounded hover:bg-primary/90 w-full"
              >
                Login to Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
