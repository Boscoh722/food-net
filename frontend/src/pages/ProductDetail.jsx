import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { 
  ShoppingCart, 
  Package, 
  MapPin, 
  User, 
  Tag, 
  AlertCircle,
  ArrowLeft,
  Truck,
  Star,
  ShieldCheck
} from 'lucide-react';

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
      setProduct(found || null);
    } catch (err) {
      console.error(err);
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

    if (!confirm(`Confirm order for "${product.name}" at KSh ${product.price.toLocaleString()}?`)) {
      return;
    }

    setOrdering(true);
    try {
      const sellerId = product.seller?._id || product.seller || product.sellerId;
      
      await api.post('/orders', {
        product: product._id,
        seller: sellerId
      });
      
      alert('Order placed successfully! Redirecting to your orders...');
      navigate('/orders');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to place order. Please try again.';
      alert(errorMsg);
    } finally {
      setOrdering(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-amber-600 border-t-transparent mb-6"></div>
          <p className="text-2xl font-bold text-gray-700">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center bg-white p-16 rounded-3xl shadow-2xl border border-gray-100 max-w-md">
          <AlertCircle className="w-24 h-24 text-red-400 mx-auto mb-6" />
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-amber-600 text-white font-bold rounded-xl shadow-lg hover:bg-amber-700 transform hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-6 h-6" />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-10">
        {/* Back Button + Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-amber-600 font-bold hover:text-amber-700 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </button>

        {/* Main Product Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 p-12 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-200/30 rounded-3xl blur-3xl -z-10 animate-pulse"></div>
                <div className="bg-gray-200 border-2 border-dashed border-amber-300 rounded-3xl w-96 h-96 flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover rounded-3xl" />
                  ) : (
                    <Package className="w-32 h-32 text-amber-400" />
                  )}
                </div>
                <div className="absolute -top-4 -right-4 bg-amber-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  NEW
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-10 lg:p-12">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-800 mb-4">
                  {product.name}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-gray-600">
                  <span className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-amber-600" />
                    {product.category || 'Uncategorized'}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    {product.location || 'Location not specified'}
                  </span>
                  {product.unit && (
                    <span className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-purple-600" />
                      {product.unit}
                    </span>
                  )}
                  {product.quantityInStock !== undefined && (
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                      {product.quantityInStock} in stock
                    </span>
                  )}
                  {product.isNegotiable && (
                    <span className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500" />
                      Negotiable
                    </span>
                  )}
                  {product.harvestDate && (
                    <span className="flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-green-700" />
                      Harvest: {new Date(product.harvestDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Seller Info */}
              <div className="bg-amber-50 rounded-2xl p-6 mb-8 border border-amber-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-200 rounded-full">
                      <User className="w-8 h-8 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider">Seller</p>
                      <p className="text-xl font-extrabold text-gray-800">
                        {product.seller?.name || 'Unknown Seller'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < 4 ? 'text-amber-500 fill-current' : 'text-gray-300'}`} />
                    ))}
                    <span className="ml-2 font-bold text-amber-600">4.8</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-end gap-3">
                  <p className="text-5xl font-extrabold text-amber-600">
                    KSh {product.price?.toLocaleString() || '0'}
                  </p>
                  {product.price && (
                    <p className="text-xl text-gray-500 line-through">KSh {(product.price * 1.3).toLocaleString()}</p>
                  )}
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold text-sm">
                    23% OFF
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-10">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                  Product Description
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {product.description || 'No description available for this product.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {user?.role === 'buyer' ? (
                  <button
                    onClick={handleOrder}
                    disabled={ordering}
                    className="w-full px-8 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-xl rounded-2xl shadow-xl hover:from-amber-600 hover:to-orange-700 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                  >
                    {ordering ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent"></div>
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-7 h-7 group-hover:scale-110 transition-transform" />
                        Place Order Now
                        <Truck className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </button>
                ) : user?.role === 'seller' ? (
                  <div className="text-center py-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                    <p className="text-xl font-bold text-gray-600">You are the seller</p>
                    <p className="text-gray-500 mt-2">You cannot order your own product</p>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-extrabold text-xl rounded-2xl shadow-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <User className="w-7 h-7" />
                    Login to Place Order
                  </button>
                )}

                <button
                  onClick={() => navigate('/products')}
                  className="w-full px-8 py-4 border-2 border-amber-600 text-amber-600 font-bold rounded-2xl hover:bg-amber-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 pt-8 border-t border-gray-200 flex flex-wrap gap-8 justify-around text-center">
                <div>
                  <Truck className="w-10 h-10 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-700">Fast Delivery</p>
                </div>
                <div>
                  <ShieldCheck className="w-10 h-10 text-amber-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-700">Verified Seller</p>
                </div>
                <div>
                  <Package className="w-10 h-10 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-700">Quality Assured</p>
                </div>
                {product.coordinates && Array.isArray(product.coordinates) && product.coordinates.length === 2 && (
                  <div>
                    <MapPin className="w-10 h-10 text-green-700 mx-auto mb-2" />
                    <p className="text-sm font-bold text-gray-700">Lat: {product.coordinates[0]}, Lng: {product.coordinates[1]}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Floating Action Button (Mobile) */}
        {user?.role === 'buyer' && (
          <button
            onClick={handleOrder}
            disabled={ordering}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-amber-500 to-orange-600 text-white p-5 rounded-full shadow-2xl hover:shadow-amber-500/50 transform hover:scale-110 transition-all duration-300 flex items-center justify-center lg:hidden"
            aria-label="Place Order"
          >
            <ShoppingCart className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
}