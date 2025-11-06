import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function SellerProductCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', category: 'fruits', price: '', location: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      const res = await api.post('/products', payload);
      // On success, navigate to seller products or dashboard
      navigate('/dashboard/seller');
    } catch (err) {
      const msg = err.response?.data?.message || (err.response?.data?.errors ? err.response.data.errors.map(x=>x.msg).join(', ') : 'Failed to create product');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Post a New Product</h1>
        <p className="text-sm text-gray-500 mb-6">List an item for sale. Admin approval may be required before it appears publicly.</p>

        {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required minLength={10} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white">
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
                <option value="grains">Grains</option>
                <option value="dairy">Dairy</option>
                <option value="meats">Meats</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (KES)</label>
              <input name="price" value={form.price} onChange={handleChange} required type="number" min="0" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input name="location" value={form.location} onChange={handleChange} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading} className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-60">
              {loading ? 'Posting...' : 'Post Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
