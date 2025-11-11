import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/all');
      setOrders(Array.isArray(data) ? data : data?.orders || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this order?')) return;
    try {
      await api.delete(`/orders/${id}`);
      setOrders(prev => prev.filter(o => o._id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2">Order #</th>
                <th className="px-4 py-2">Buyer</th>
                <th className="px-4 py-2">Seller</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id} className="border-t">
                  <td className="px-4 py-3">{o.orderNumber}</td>
                  <td className="px-4 py-3">{o.buyer?.name || 'Unknown'}</td>
                  <td className="px-4 py-3">{o.seller?.name || 'Unknown'}</td>
                  <td className="px-4 py-3">KSh {o.total}</td>
                  <td className="px-4 py-3">{o.status}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(o._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
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