import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products/all');
      setProducts(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/products/approve/${id}`);
      setProducts(prev => prev.map(p => p._id === id ? { ...p, approved: true } : p));
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Seller</th>
                <th className="px-4 py-2">Approved</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} className="border-t">
                  <td className="px-4 py-3">{p.title || p.name || 'Untitled'}</td>
                  <td className="px-4 py-3">{p.price}</td>
                  <td className="px-4 py-3">{p.seller?.name || p.seller || 'Unknown'}</td>
                  <td className="px-4 py-3">{p.approved ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3 space-x-2">
                    {!p.approved && (
                      <button onClick={() => handleApprove(p._id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
                    )}
                    <button onClick={() => handleDelete(p._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
