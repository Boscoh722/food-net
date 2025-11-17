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
      open: 'badge-warning',
      in_progress: 'badge-accent',
      resolved: 'badge-success',
      closed: 'badge-primary'
    };
    return styles[status] || 'badge-primary';
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
    <div className="admin-complaints-page">
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-left">
            <button
              onClick={() => navigate('/dashboard/admin')}
              className="btn-secondary"
            >
              <ArrowLeft className="icon-sm" />
            </button>

            <div className="page-title-card">
              <h1 className="page-title">
                <div className="icon-container">
                  <MessageSquare className="icon-lg text-white" />
                </div>
                Complaints & Support
              </h1>
              <p className="page-subtitle">
                Manage customer complaints and support tickets
              </p>
            </div>
          </div>

          <button
            onClick={load}
            disabled={loading}
            className="btn-primary"
          >
            <RefreshCw className={`icon-sm ${loading && 'spinning'}`} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="alert-error">
            <AlertTriangle className="icon-sm" />
            <p>{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="loading-card">
            <div className="spinner-large"></div>
            <p>Loading complaints...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <MessageSquare className="icon-xl text-primary" />
            </div>
            <h3>No Complaints Found</h3>
            <p>Everything looks good!</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="table-card">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      {['User & Complaint', 'Message', 'Date', 'Status', 'Actions'].map(h => (
                        <th key={h}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {items.map(c => (
                      <tr key={c._id}>
                        <td>
                          <div className="user-info">
                            <div className="user-avatar">
                              <MessageSquare className="icon-sm text-primary" />
                            </div>
                            <div>
                              <p className="user-name">
                                {c.user?.name || 'Unknown User'}
                              </p>
                              <p className="user-email">
                                {c.user?.email || 'No email'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td>
                          <p className="complaint-subject">
                            {c.subject || 'No Subject'}
                          </p>
                          <p className="complaint-message">
                            {truncate(c.message)}
                          </p>
                        </td>

                        <td className="date-cell">
                          {formatDate(c.createdAt)}
                        </td>

                        <td>
                          <span className={`badge ${getStatusBadge(c.status)}`}>
                            {c.status?.toUpperCase()}
                          </span>
                        </td>

                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => navigate(`/admin/complaints/${c._id}`)}
                              className="btn-icon"
                            >
                              <Eye className="icon-sm text-primary" />
                            </button>

                            {(c.status !== 'resolved' && c.status !== 'closed') && (
                              <button
                                onClick={() => handleStatus(c._id, 'resolved')}
                                disabled={actionLoading === c._id}
                                className="btn-icon success"
                              >
                                <CheckCircle2 className="icon-sm" />
                              </button>
                            )}

                            {(c.status === 'resolved' || c.status === 'closed') && (
                              <button
                                onClick={() => handleStatus(c._id, 'open')}
                                disabled={actionLoading === c._id}
                                className="btn-icon warning"
                              >
                                <Archive className="icon-sm" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(c._id)}
                              disabled={actionLoading === c._id}
                              className="btn-icon danger"
                            >
                              <Trash2 className="icon-sm" />
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
            <div className="summary-card">
              Showing <span className="count">{items.length}</span> complaints • 
              Open: <span className="count warning">
                {items.filter(c => c.status === 'open').length}
              </span> • 
              Resolved: <span className="count success">
                {items.filter(c => c.status === 'resolved').length}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}