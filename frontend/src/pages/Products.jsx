// src/pages/Products.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'fruits',
    price: '',
    location: ''
  });
  const { user } = useAuth();
  const isSeller = user?.role === 'seller';

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(() => alert('Failed to load products'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', form);
      alert('Product created! Waiting for admin approval.');
      setForm({ name: '', description: '', category: 'fruits', price: '', location: '' });
      setShowForm(false);
      loadProducts();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create product';
      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              Available Products
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Browse fresh agricultural products from local sellers
            </p>
          </div>
          {isSeller && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              {showForm ? (
                <>
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <span>+</span>
                  <span>Add Product</span>
                </>
              )}
            </button>
          )}
        </div>

        {isSeller && showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8 animate-slide-up border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  placeholder="e.g., Fresh Tomatoes"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 resize-none"
                  rows="4"
                  placeholder="Describe your product in detail..."
                  required
                  minLength={10}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    required
                  >
                    <option value="fruits">Fruits</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="grains">Grains</option>
                    <option value="dairy">Dairy</option>
                    <option value="meats">Meats</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price (KES)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  placeholder="e.g., Nairobi, Kenya"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Create Product
              </button>
            </form>
          </div>
        )}

        {products.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📦</span>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">No products available yet.</p>
            <p className="text-gray-500 dark:text-gray-500">Check back soon for fresh products!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p, idx) => (
              <div key={p._id} className="animate-scale-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
