import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function AdminComplaints() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/complaints');
      setItems(Array.isArray(data) ? data : data?.complaints || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status, note = '') => {
    try {
      await api.patch(`/complaints/${id}`, { status, adminNote: note });
      setItems(prev => prev.map(c => c._id === id ? { ...c, status, adminNote: note, resolvedAt: status === 'resolved' ? new Date() : c.resolvedAt } : c));
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this complaint?')) return;
    try {
      await api.delete(`/complaints/${id}`);
      setItems(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Complaints</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Message</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Resolved At</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(c => (
                <tr key={c._id} className="border-t">
                  <td className="px-4 py-3">{c.user?.name || 'Unknown'}</td>
                  <td className="px-4 py-3">{c.message}</td>
                  <td className="px-4 py-3">{c.status}</td>
                  <td className="px-4 py-3">{c.resolvedAt ? new Date(c.resolvedAt).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3 space-x-2">
                    {c.status === 'open' && (
                      <button onClick={() => handleStatus(c._id, 'in-progress')} className="px-3 py-1 bg-blue-600 text-white rounded">In Progress</button>
                    )}
                    {['open', 'in-progress'].includes(c.status) && (
                      <button onClick={() => {
                        const note = prompt('Admin note (optional):');
                        handleStatus(c._id, 'resolved', note);
                      }} className="px-3 py-1 bg-green-600 text-white rounded">Resolve</button>
                    )}
                    {c.status !== 'closed' && (
                      <button onClick={() => handleStatus(c._id, 'closed')} className="px-3 py-1 bg-gray-600 text-white rounded">Close</button>
                    )}
                    <button onClick={() => handleDelete(c._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
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