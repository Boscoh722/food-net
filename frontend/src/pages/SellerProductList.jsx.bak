// src/pages/SellerProductList.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle2, AlertTriangle, PlusCircle, RefreshCw } from 'lucide-react';
import api from '../lib/api'; // Ensure this path is correct
import { useAuth } from '../context/AuthContext'; // Ensure this path is correct

function SellerProductList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract 'approved' query parameter from the URL (?approved=true/false)
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

      // Construct the API URL with the filter, if present
      let apiUrl = '/seller/products';
      if (approvedFilter !== null) {
        apiUrl += `?approved=${approvedFilter}`;
      }

      const productsRes = await api.get(apiUrl);
      setProducts(productsRes.data?.products || []);

    } catch (err) {
      console.error('Failed to load seller products:', err);
      setError(err.response?.data?.message || 'Failed to load product data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [approvedFilter]); // Reloads when the URL query parameter changes

  const getStatusIcon = (isApproved) => {
    return isApproved ? (
      <CheckCircle2 className="w-5 h-5 text-green-600" />
    ) : (
      <Clock className="w-5 h-5 text-orange-600" />
    );
  };
  
  if (loading) return <div className="p-8 text-center text-gray-500">Loading products...</div>;
  if (error) return <div className="p-8 text-center text-red-500 flex items-center justify-center gap-2"><AlertTriangle className="w-5 h-5"/> {error}</div>;

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Package className="w-7 h-7 text-green-600" />
          {getFilterTitle()} ({products.length})
        </h1>
        <div className="flex gap-3">
            <button
              onClick={loadProducts}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg shadow-md hover:bg-gray-200 transition flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Reload List
            </button>
            <button
              onClick={() => navigate('/products/new')}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition flex items-center gap-3"
            >
              <PlusCircle className="w-6 h-6" />
              Add New Product
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        {products.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
                No products match this filter.
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <div 
                        key={product._id} 
                        onClick={() => navigate(`/seller/products/${product._id}`)}
                        className="p-4 border rounded-lg hover:shadow-md transition cursor-pointer flex items-center justify-between"
                    >
                        <div className="flex flex-col">
                            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                            <p className="text-sm text-gray-500">KSh {product.price?.toLocaleString() || 'N/A'}</p>
                        </div>
                        {getStatusIcon(product.approved)}
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}

export default SellerProductList;
