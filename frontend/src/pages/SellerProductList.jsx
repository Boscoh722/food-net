import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle2, AlertTriangle, PlusCircle, RefreshCw } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

function SellerProductList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = new URLSearchParams(location.search);
  const approvedFilter = query.get('approved');
  
  const getFilterTitle = () => {
    if (approvedFilter === 'true') return 'Approved Products';
    if (approvedFilter === 'false') return 'Pending Products';
    return 'All Seller Products';
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let apiUrl = '/seller/products';
      if (approvedFilter !== null) {
        apiUrl += `?approved=${approvedFilter}`;
      }

      const productsRes = await api.get(apiUrl);
      setProducts(productsRes.data?.products || []);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load product data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [approvedFilter]);

  const getStatusIcon = (isApproved) => {
    return isApproved ? (
      <CheckCircle2 className="w-5 h-5 text-green-600" />
    ) : (
      <Clock className="w-5 h-5 text-yellow-600" />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {getFilterTitle()} ({products.length})
                </h1>
                <p className="text-gray-600">Manage your product catalog</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadProducts}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={() => navigate('/products/new')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Product
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No products match this filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div 
                  key={product._id} 
                  onClick={() => navigate(`/seller/products/${product._id}`)}
                  className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer hover:border-blue-300 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-gray-600">KSh {product.price?.toLocaleString() || 'N/A'}</p>
                  </div>
                  {getStatusIcon(product.approved)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SellerProductList;