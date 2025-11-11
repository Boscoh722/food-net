import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(Array.isArray(data) ? data : data?.users || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/users/${id}/approve-seller`);
      setUsers((prev) => prev.map(u => u._id === id ? { ...u, approved: true } : u));
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user? This action is permanent.')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter(u => u._id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow p-4">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Approved</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-t">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.phone || '-'}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">{user.approved ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3 space-x-2">
                    {user.role === 'seller' && !user.approved && (
                      <button onClick={() => handleApprove(user._id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
                    )}
                    <button onClick={() => handleDelete(user._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
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