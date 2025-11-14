// src/pages/SellerProductEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, Pencil, AlertTriangle, Trash2 } from 'lucide-react';
import api from '../lib/api'; // Ensure this path is correct

function SellerProductEdit() {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/seller/products/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError(err.response?.data?.message || `Product with ID ${id} not found.`);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete product "${product.name}"?`)) {
        try {
            await api.delete(`/seller/products/${id}`);
            alert('Product deleted successfully!');
            navigate('/seller/products'); // Redirect to product list
        } catch (err) {
            alert('Failed to delete product.');
            console.error('Delete error:', err);
        }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading product details...</div>;
  if (error) return (
    <div className="container mx-auto px-6 py-10">
        <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 text-center text-red-500 flex flex-col items-center gap-2">
            <AlertTriangle className="w-8 h-8"/> 
            <h2 className="text-xl font-bold">Error</h2>
            <p>{error}</p>
        </div>
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Pencil className="w-7 h-7 text-green-600" />
          Edit Product: {product.name}
        </h1>
        <button 
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-red-700 transition flex items-center gap-2"
        >
            <Trash2 className="w-5 h-5"/>
            Delete Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <p className="text-xl mb-4 font-semibold">Product ID: <span className="font-normal text-gray-600">{id}</span></p>
        <p className="text-xl mb-4 font-semibold">Price: <span className="font-normal text-green-600">KSh {product.price?.toLocaleString()}</span></p>
        <p className="text-lg mb-4 font-semibold">Status: 
            <span className={`ml-2 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${product.approved ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                {product.approved ? 'Approved' : 'Pending Approval'}
            </span>
        </p>
        
        {/* Placeholder for an actual edit form */}
        <div className="mt-8 p-6 bg-gray-50 border rounded-lg">
            <h3 className="text-xl font-bold mb-3 text-gray-700">Product Details Form (Placeholder)</h3>
            <p className="text-gray-500">Implement your form here to allow the seller to update product name, price, description, etc.</p>
        </div>
      </div>
    </div>
  );
}

export default SellerProductEdit;