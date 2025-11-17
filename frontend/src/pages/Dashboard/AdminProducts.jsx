import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Package, RefreshCw, Trash2, 
  AlertTriangle, Eye, CheckCircle2, XCircle, MapPin, User 
} from 'lucide-react';
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
      const { data } = await api.get('/products/all');
      setProducts(data);
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
      await api.patch(`/products/approve/${id}`);
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
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToAdmin}
                className="p-3 bg-card border border-border text-card-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors duration-200 flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="bg-card p-6 rounded-xl border border-border">
                <h1 className="text-3xl font-bold text-card-foreground flex items-center gap-3">
                  <div className="bg-primary p-2 rounded-lg">
                    <Package className="w-6 h-6 text-primary-foreground" />
                  </div>
                  Product Management
                </h1>
                <p className="text-muted-foreground mt-2">Manage all platform products</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={load}
                disabled={loading}
                className="px-6 py-3 bg-card border border-border text-card-foreground rounded-lg font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-card-foreground mb-2">No Products Found</h3>
            <p className="text-muted-foreground">Products will appear here once sellers start listing</p>
          </div>
        ) : (
          <>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Seller & Location
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-muted/50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-muted rounded-lg border border-border overflow-hidden flex items-center justify-center">
                              {product.images?.[0]?.url ? (
                                <img
                                  src={product.images[0].url}
                                  alt={product.name || product.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-6 h-6 text-muted-foreground" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-card-foreground truncate">
                                {product.name || product.title || 'Untitled Product'}
                              </p>
                              <p className="text-sm text-muted-foreground capitalize">
                                {product.category || 'Uncategorized'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="bg-muted rounded-lg p-2 border border-border">
                              <p className="text-primary font-semibold text-lg">
                                {formatPrice(product.price)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                per {product.unit || 'unit'}
                              </p>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                product.isNegotiable 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                  : 'bg-muted text-muted-foreground'
                              }`}>
                                {product.isNegotiable ? 'Negotiable' : 'Fixed Price'}
                              </span>
                              <span className="text-muted-foreground">
                                Stock: <span className="font-medium text-card-foreground">{product.quantityInStock || 0}</span>
                              </span>
                            </div>
                            {product.harvestDate && (
                              <p className="text-xs text-muted-foreground">
                                Harvest: {formatDate(product.harvestDate)}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <User className="w-4 h-4 text-blue-500" />
                              <span className="text-card-foreground font-medium">
                                {product.seller?.name || product.seller || 'Unknown Seller'}
                              </span>
                            </div>
                            {product.location && (
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-green-500" />
                                <span className="text-muted-foreground truncate">
                                  {product.location}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.approved
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}>
                            {product.approved ? 'APPROVED' : 'PENDING'}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/admin/products/${product._id}`)}
                              className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200 border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {!product.approved && (
                              <button
                                onClick={() => handleApprove(product._id)}
                                disabled={actionLoading === product._id}
                                className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors duration-200 border border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(product._id)}
                              disabled={actionLoading === product._id}
                              className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200 border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 disabled:opacity-50"
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

            <div className="mt-6 bg-card rounded-xl border border-border px-6 py-4">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-card-foreground">{products.length}</span> products
                <span className="mx-2">•</span>
                Approved: <span className="font-medium text-green-600 dark:text-green-400">
                  {products.filter(p => p.approved).length}
                </span>
                <span className="mx-2">•</span>
                Pending: <span className="font-medium text-yellow-600 dark:text-yellow-400">
                  {products.filter(p => !p.approved).length}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}