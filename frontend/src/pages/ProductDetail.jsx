import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Package, Truck,
  CheckCircle, AlertTriangle, ShoppingCart,
  User, Shield, TruckIcon, Loader
} from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [selectedLogistics, setSelectedLogistics] = useState('');
  const [logisticsProviders, setLogisticsProviders] = useState([]);
  const [loadingLogistics, setLoadingLogistics] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    loadProductDetails();

    if (location.state?.showOrderForm) {
      setShowOrderForm(true);
    }
  }, [id, location]);

  useEffect(() => {
    if (showOrderForm) {
      loadLogisticsProviders();
    }
  }, [showOrderForm]);

  const loadProductDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const loadLogisticsProviders = async () => {
    try {
      setLoadingLogistics(true);
      const { data } = await api.get('/users/logistics');
      setLogisticsProviders(data.data || []);

      // Auto-select first provider if available
      if (data.data && data.data.length > 0) {
        setSelectedLogistics(data.data[0]._id);
      }
    } catch (err) {
      console.error('Failed to load logistics providers:', err);
      setError('Failed to load logistics providers. Please try again.');
    } finally {
      setLoadingLogistics(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (!selectedLogistics) {
      alert('Please select a logistics provider');
      return;
    }

    try {
      setPlacingOrder(true);

      const selectedProvider = logisticsProviders.find(p => p._id === selectedLogistics);

      const orderData = {
        items: [{
          product: product._id,
          quantity: orderQuantity,
          price: product.price
        }],
        total: product.price * orderQuantity,
        shippingAddress: user.shippingAddress || user.location,
        logisticsProvider: selectedLogistics,
        logisticsProviderName: selectedProvider?.name,
        paymentMethod: 'mpesa'
      };

      const { data } = await api.post('/orders', orderData);

      alert('Order placed successfully!');
      navigate('/orders');

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleOrderNow = () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setShowOrderForm(true);
  };

  const getProviderBadge = (provider) => {
    if (!provider.isAvailable) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Unavailable</span>;
    }
    return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Available</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-xl font-bold text-gray-900">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error && !showOrderForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Product not found</p>
        </div>
      </div>
    );
  }

  const totalPrice = product.price * orderQuantity;
  const availableStock = product.quantityInStock || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Product Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                  <p className="text-gray-600 capitalize mt-1">{product.category}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.approved
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {product.approved ? 'Verified' : 'Pending Approval'}
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <p className="text-3xl font-bold text-green-800">KSh {product.price?.toLocaleString()}</p>
                  <p className="text-green-600">per {product.unit}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium">Available Stock</p>
                    <p className="text-xl font-bold text-blue-800">{availableStock} {product.unit}</p>
                  </div>
                  <div className={`rounded-xl p-4 border ${product.isNegotiable
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-gray-50 border-gray-200'
                    }`}>
                    <p className="text-sm font-medium">Price Type</p>
                    <p className="text-xl font-bold">
                      {product.isNegotiable ? 'Negotiable' : 'Fixed Price'}
                    </p>
                  </div>
                </div>

                {product.harvestDate && (
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                    <p className="text-sm text-orange-700 font-medium">Harvest Date</p>
                    <p className="text-orange-800">
                      {new Date(product.harvestDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-700">{product.description}</p>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Seller Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{product.seller?.name}</p>
                    <p className="text-sm text-gray-600">Verified Seller</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{product.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Section */}
          <div className="space-y-6">
            {showOrderForm ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Place Your Order</h3>

                <div className="space-y-6">
                  {/* Quantity Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity ({product.unit})
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                        disabled={orderQuantity <= 1}
                        className="w-10 h-10 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center disabled:opacity-50 hover:bg-gray-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-lg font-semibold w-12 text-center">{orderQuantity}</span>
                      <button
                        onClick={() => setOrderQuantity(Math.min(availableStock, orderQuantity + 1))}
                        disabled={orderQuantity >= availableStock}
                        className="w-10 h-10 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center disabled:opacity-50 hover:bg-gray-200 transition-colors"
                      >
                        +
                      </button>
                      <span className="text-sm text-gray-500 ml-auto">
                        Max: {availableStock}
                      </span>
                    </div>
                  </div>

                  {/* Logistics Provider */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Logistics Provider
                    </label>
                    {loadingLogistics ? (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Loader className="w-4 h-4 animate-spin" />
                        Loading providers...
                      </div>
                    ) : logisticsProviders.length > 0 ? (
                      <div className="space-y-3">
                        <select
                          value={selectedLogistics}
                          onChange={(e) => setSelectedLogistics(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Choose a logistics provider</option>
                          {logisticsProviders.map((provider) => (
                            <option
                              key={provider._id}
                              value={provider._id}
                              disabled={!provider.isAvailable}
                            >
                              {provider.name} - {provider.location}
                              {provider.vehicleType ? ` (${provider.vehicleType})` : ''}
                              {!provider.isAvailable ? ' - Currently Unavailable' : ''}
                            </option>
                          ))}
                        </select>

                        {/* Provider Details */}
                        {selectedLogistics && (
                          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                            <h4 className="font-semibold text-blue-900 mb-2">Selected Provider</h4>
                            {logisticsProviders.map(provider =>
                              provider._id === selectedLogistics && (
                                <div key={provider._id} className="text-sm text-blue-800">
                                  <p><strong>Name:</strong> {provider.name}</p>
                                  <p><strong>Location:</strong> {provider.location}</p>
                                  <p><strong>Reach:</strong> {provider.reach || 'Nationwide'}</p>
                                  {provider.vehicleType && (
                                    <p><strong>Vehicle:</strong> {provider.vehicleType}</p>
                                  )}
                                  {provider.capacity && (
                                    <p><strong>Capacity:</strong> {provider.capacity}</p>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <p className="text-yellow-800 text-sm">
                          No logistics providers available at the moment. Please try again later.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Price per {product.unit}</span>
                        <span>KSh {product.price?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Quantity</span>
                        <span>{orderQuantity} {product.unit}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total Amount</span>
                        <span className="text-green-600">KSh {totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowOrderForm(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={placingOrder || !selectedLogistics || orderQuantity > availableStock || orderQuantity < 1}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      {placingOrder ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          Place Order
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Order?</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <p className="text-lg font-semibold text-green-800">
                      KSh {product.price?.toLocaleString()} / {product.unit}
                    </p>
                    <p className="text-green-600 text-sm">Current price</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Verified seller</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TruckIcon className="w-4 h-4 text-blue-500" />
                    <span>Multiple logistics providers available</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-purple-500" />
                    <span>Secure payment</span>
                  </div>

                  <button
                    onClick={handleOrderNow}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Order Now
                  </button>

                  <button
                    onClick={() => navigate('/products')}
                    className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}

            {/* Product Images */}
            {product.images && product.images.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                      <img
                        src={image.url}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}