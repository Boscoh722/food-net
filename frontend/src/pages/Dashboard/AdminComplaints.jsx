import { useEffect, useState } from 'react';
import { 
  ArrowLeft, MessageSquare, RefreshCw, Trash2, 
  AlertTriangle, Eye, CheckCircle2, XCircle, Archive
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
    if (!confirm('Delete this complaint? This action cannot be undone.')) return;
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

  const handleBackToAdmin = () => {
    navigate('/dashboard/admin');
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-yellow-900 text-yellow-200 border border-yellow-700',
      in_progress: 'bg-blue-900 text-blue-200 border border-blue-700',
      resolved: 'bg-green-900 text-green-200 border border-green-700',
      closed: 'bg-gray-700 text-gray-200 border border-gray-600'
    };
    return colors[status] || 'bg-gray-700 text-gray-200 border border-gray-600';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateMessage = (message, length = 100) => {
    if (!message) return 'No message';
    return message.length > length ? message.substring(0, length) + '...' : message;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <button
                onClick={handleBackToAdmin}
                className="p-3 bg-gray-700 border-2 border-gray-600 text-gray-200 rounded-xl hover:bg-gray-600 hover:border-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 group"
                title="Back to Admin Dashboard"
              >
                <ArrowLeft className="w-5 h-5 group-hover:text-white" />
              </button>
              
              <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border-2 border-gray-700">
                <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                  <div className="bg-blue-900 p-2 rounded-lg border border-blue-700">
                    <MessageSquare className="w-8 h-8 text-blue-400" />
                  </div>
                  Complaints & Support
                </h1>
                <p className="text-gray-300 mt-2 text-lg">Manage customer complaints and support requests</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={load}
                disabled={loading}
                className="px-6 py-3 bg-gray-700 border-2 border-gray-600 text-gray-200 rounded-xl font-semibold hover:bg-gray-600 hover:border-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900 border-2 border-red-700 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-300">Loading complaints...</p>
          </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <div className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 p-12 text-center">
            <div className="bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Complaints Found</h3>
            <p className="text-gray-300">All customer issues are resolved!</p>
          </div>
        ) : (
          /* Complaints Table */
          <>
            <div className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700 border-b border-gray-600">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        User & Complaint
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {items.map(complaint => (
                      <tr key={complaint._id} className="hover:bg-gray-750 transition-all duration-300">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center border border-blue-700">
                              <MessageSquare className="w-5 h-5 text-blue-200" />
                            </div>
                            <div>
                              <p className="font-semibold text-white">{complaint.user?.name || complaint.user || 'Unknown User'}</p>
                              <p className="text-sm text-gray-400">
                                {complaint.user?.email || 'No email'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-md">
                            <p className="text-white font-medium mb-1">
                              {complaint.subject || 'No Subject'}
                            </p>
                            <p className="text-gray-300 text-sm">
                              {truncateMessage(complaint.message)}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-300">
                            {formatDate(complaint.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-2 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                            {complaint.status?.toUpperCase() || 'OPEN'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {/* View Button */}
                            <button
                              onClick={() => navigate(`/admin/complaints/${complaint._id}`)}
                              className="p-2 text-blue-400 hover:bg-blue-900 rounded-lg transition-all duration-300 border border-blue-800 hover:border-blue-600"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>

                            {/* Resolve Button - Show only for non-resolved complaints */}
                            {(complaint.status !== 'resolved' && complaint.status !== 'closed') && (
                              <button
                                onClick={() => handleStatus(complaint._id, 'resolved')}
                                disabled={actionLoading === complaint._id}
                                className="p-2 text-green-400 hover:bg-green-900 rounded-lg transition-all duration-300 border border-green-800 hover:border-green-600 disabled:opacity-50"
                                title="Mark as Resolved"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </button>
                            )}

                            {/* Reopen Button - Show only for resolved/closed complaints */}
                            {(complaint.status === 'resolved' || complaint.status === 'closed') && (
                              <button
                                onClick={() => handleStatus(complaint._id, 'open')}
                                disabled={actionLoading === complaint._id}
                                className="p-2 text-yellow-400 hover:bg-yellow-900 rounded-lg transition-all duration-300 border border-yellow-800 hover:border-yellow-600 disabled:opacity-50"
                                title="Reopen Complaint"
                              >
                                <Archive className="w-5 h-5" />
                              </button>
                            )}

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(complaint._id)}
                              disabled={actionLoading === complaint._id}
                              className="p-2 text-red-400 hover:bg-red-900 rounded-lg transition-all duration-300 border border-red-800 hover:border-red-600 disabled:opacity-50"
                              title="Delete Complaint"
                            >
                              <Trash2 className="w-5 h-5" />
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
            <div className="mt-6 bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 px-6 py-4">
              <div className="text-sm text-gray-300">
                Showing <span className="font-semibold text-white">{items.length}</span> complaints
                <span className="mx-2">•</span>
                Open: <span className="font-semibold text-yellow-400">
                  {items.filter(c => c.status === 'open').length}
                </span>
                <span className="mx-2">•</span>
                Resolved: <span className="font-semibold text-green-400">
                  {items.filter(c => c.status === 'resolved').length}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}