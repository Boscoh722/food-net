import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, RefreshCw, Trash2, AlertTriangle, Eye, CheckCircle2, MapPin, User } from 'lucide-react';
import api from '../../lib/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/products/all/products');
      setProducts(data.data || data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await api.patch(`/products/${id}/approve`);
      setProducts(prev =>
        prev.map(p => p._id === id ? { ...p, approved: true } : p)
      );
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product? This action cannot be undone.')) return;
    try {
      setActionLoading(id);
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBackToAdmin = () => {
    navigate('/dashboard/admin');
  };

  const formatPrice = (price) => {
    return `KSh ${price?.toLocaleString() || 0}`;
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToAdmin}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Product Management
                  </h1>
                  <p className="text-gray-600">Manage all platform products</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={load}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading && 'animate-spin'}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertTriangle className="w-4 h-4" />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Package className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600">Products will appear here once sellers start listing</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Seller & Location
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center">
                              {product.images?.[0]?.url ? (
                                <img
                                  src={product.images[0].url}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-gray-900 truncate">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-500 capitalize">
                                {product.category}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="bg-gray-50 rounded-xl p-2 border border-gray-200">
                              <p className="text-blue-600 font-semibold text-lg">
                                {formatPrice(product.price)}
                              </p>
                              <p className="text-sm text-gray-500">
                                per {product.unit}
                              </p>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                product.isNegotiable 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {product.isNegotiable ? 'Negotiable' : 'Fixed Price'}
                              </span>
                              <span className="text-gray-500">
                                Stock: <span className="font-medium text-gray-900">{product.quantityInStock}</span>
                              </span>
                            </div>
                            {product.harvestDate && (
                              <p className="text-xs text-gray-500">
                                Harvest: {formatDate(product.harvestDate)}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <User className="w-4 h-4 text-blue-500" />
                              <span className="text-gray-900 font-medium">
                                {product.seller?.name || product.seller?.storeName || 'Unknown Seller'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-green-500" />
                              <span className="text-gray-500 truncate">
                                {product.location}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.approved
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {product.approved ? 'APPROVED' : 'PENDING'}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/product/${product._id}`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-blue-200 hover:border-blue-300"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {!product.approved && (
                              <button
                                onClick={() => handleApprove(product._id)}
                                disabled={actionLoading === product._id}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors border border-green-200 hover:border-green-300 disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(product._id)}
                              disabled={actionLoading === product._id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200 hover:border-red-300 disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{products.length}</span> products • 
              Approved: <span className="font-semibold text-green-600">
                {products.filter(p => p.approved).length}
              </span> • 
              Pending: <span className="font-semibold text-yellow-600">
                {products.filter(p => !p.approved).length}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}