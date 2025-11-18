import { useEffect, useState } from 'react';
import { 
  ArrowLeft, MessageSquare, RefreshCw, Trash2, 
  AlertTriangle, Eye, CheckCircle2, Archive 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export default function AdminComplaints() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/complaints');
      setItems(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      setActionLoading(id);
      await api.patch(`/complaints/${id}`, { status });
      setItems(prev => prev.map(c => c._id === id ? { ...c, status } : c));
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this complaint?')) return;
    try {
      setActionLoading(id);
      await api.delete(`/complaints/${id}`);
      setItems(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
      resolved: 'bg-green-100 text-green-800 border-green-200',
      closed: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncate = (msg, len = 100) =>
    !msg ? 'No message' : msg.length > len ? msg.substring(0, len) + '...' : msg;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard/admin')}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-3 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Complaints & Support
                  </h1>
                  <p className="text-gray-600">
                    Manage customer complaints and support tickets
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={load}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading && 'animate-spin'}`} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center space-x-2 p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertTriangle className="w-4 h-4" />
            <p>{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading complaints...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <MessageSquare className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Complaints Found</h3>
            <p className="text-gray-600">Everything looks good!</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['User & Complaint', 'Message', 'Date', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map(c => (
                      <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-xl">
                              <MessageSquare className="w-4 h-4 text-primary-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {c.user?.name || 'Unknown User'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {c.user?.email || 'No email'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">
                            {c.subject || 'No Subject'}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {truncate(c.message)}
                          </p>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(c.createdAt)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(c.status)}`}>
                            {c.status?.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/admin/complaints/${c._id}`)}
                              className="p-2 text-primary-600 hover:bg-blue-50 rounded-xl transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {(c.status !== 'resolved' && c.status !== 'closed') && (
                              <button
                                onClick={() => handleStatus(c._id, 'resolved')}
                                disabled={actionLoading === c._id}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-xl disabled:opacity-50 transition-colors"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}

                            {(c.status === 'resolved' || c.status === 'closed') && (
                              <button
                                onClick={() => handleStatus(c._id, 'open')}
                                disabled={actionLoading === c._id}
                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-xl disabled:opacity-50 transition-colors"
                              >
                                <Archive className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(c._id)}
                              disabled={actionLoading === c._id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl disabled:opacity-50 transition-colors"
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

            {/* Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{items.length}</span> complaints • 
              Open: <span className="font-semibold text-yellow-600">
                {items.filter(c => c.status === 'open').length}
              </span> • 
              Resolved: <span className="font-semibold text-green-600">
                {items.filter(c => c.status === 'resolved').length}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}