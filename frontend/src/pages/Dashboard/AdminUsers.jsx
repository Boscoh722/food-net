import { useState, useEffect } from 'react';
import {
  Users, Search, Filter, UserCheck, UserX, Edit, Trash2,
  ChevronLeft, ChevronRight, CheckCircle2, XCircle, Eye,
  Mail, Phone, MapPin, Calendar, AlertTriangle, RefreshCw, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../lib/api';

export default function AdminUsersDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const [filters, setFilters] = useState({
    role: searchParams.get('role') || '',
    approved: searchParams.get('approved') || '',
    search: searchParams.get('search') || ''
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [filters, pagination.page]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.role && { role: filters.role }),
        ...(filters.approved && { approved: filters.approved }),
        ...(filters.search && { search: filters.search })
      });

      setSearchParams(params);

      const response = await api.get(`/users?${params}`);

      const usersData = response.data?.users || [];
      const paginationData = response.data?.pagination || {};

      setUsers(usersData);
      setPagination(prev => ({
        ...prev,
        total: paginationData.total || usersData.length,
        pages: paginationData.pages || 1
      }));

    } catch (err) {
      console.error('Failed to load users:', err);
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToAdmin = () => {
    navigate('/dashboard/admin');
  };

  const handleApproveSeller = async (userId) => {
    if (!window.confirm('Approve this seller?')) return;

    try {
      setActionLoading(userId);
      await api.patch(`/users/${userId}/approve-seller`);

      setUsers(users.map(u =>
        u._id === userId ? { ...u, approved: true } : u
      ));

      alert('Seller approved successfully!');
    } catch (err) {
      console.error('Failed to approve seller:', err);
      alert(err.response?.data?.message || 'Failed to approve seller');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectSeller = async (userId) => {
    if (!window.confirm('Reject this seller? This action cannot be undone.')) return;

    try {
      setActionLoading(userId);
      await api.patch(`/users/${userId}/reject-seller`);

      setUsers(users.map(u =>
        u._id === userId ? { ...u, approved: false } : u
      ));

      alert('Seller rejected successfully!');
    } catch (err) {
      console.error('Failed to reject seller:', err);
      alert(err.response?.data?.message || 'Failed to reject seller');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user? This action cannot be undone.')) return;

    try {
      setActionLoading(userId);
      await api.delete(`/users/${userId}`);

      setUsers(users.filter(u => u._id !== userId));

      alert('User deleted successfully!');
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      setSelectedUser(response.data?.user || response.data);
      setShowModal(true);
    } catch (err) {
      console.error('Failed to load user details:', err);
      alert(err.response?.data?.message || 'Failed to load user details');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({ role: '', approved: '', search: '' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'bg-purple-900 text-purple-200 border border-purple-700',
      seller: 'bg-green-900 text-green-200 border border-green-700',
      buyer: 'bg-blue-900 text-blue-200 border border-blue-700',
      logistics: 'bg-orange-900 text-orange-200 border border-orange-700'
    };
    return badges[role] || 'bg-gray-700 text-gray-200 border border-gray-600';
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="text-center bg-gray-800 p-8 rounded-2xl shadow-2xl border-2 border-gray-700 max-w-md">
          <div className="bg-red-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-700">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-300">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
            <div className="flex items-center gap-4">

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
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                  User Management
                </h1>
                <p className="text-gray-300 mt-2 text-lg">Manage all platform users</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={loadUsers}
                disabled={loading}
                className="px-6 py-3 bg-gray-700 border-2 border-gray-600 text-gray-200 rounded-xl font-semibold hover:bg-gray-600 hover:border-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-200">Filters</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                >
                  <option value="">All Roles</option>
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="logistics">Logistics</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <select
                  value={filters.approved}
                  onChange={(e) => handleFilterChange('approved', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                >
                  <option value="">All Status</option>
                  <option value="true">Approved</option>
                  <option value="false">Pending</option>
                </select>
              </div>
            </div>

            {(filters.role || filters.approved || filters.search) && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-900 border-2 border-red-700 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-300">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 p-12 text-center">
            <div className="bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Users Found</h3>
            <p className="text-gray-300">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700 border-b border-gray-600">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-700">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-750 transition-all duration-300">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center border border-blue-700">
                              <span className="text-blue-200 font-bold">
                                {u.name?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-white">{u.name || 'Unknown'}</p>
                              <p className="text-sm text-gray-400">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`px-3 py-2 rounded-full text-xs font-semibold ${getRoleBadge(u.role)}`}>
                            {u.role?.toUpperCase()}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {u.role === 'seller' ? (
                            u.approved ? (
                              <span className="flex items-center gap-1 text-green-400 text-sm font-medium">
                                <CheckCircle2 className="w-4 h-4" />
                                Approved
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                                <XCircle className="w-4 h-4" />
                                Pending
                              </span>
                            )
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-300">
                          {formatDate(u.createdAt)}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">

                            <button
                              onClick={() => handleViewUser(u._id)}
                              className="p-2 text-blue-400 hover:bg-blue-900 rounded-lg transition-all duration-300 border border-blue-800 hover:border-blue-600"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>

                            {u.role === 'seller' && !u.approved && (
                              <button
                                onClick={() => handleApproveSeller(u._id)}
                                disabled={actionLoading === u._id}
                                className="p-2 text-green-400 hover:bg-green-900 rounded-lg transition-all duration-300 border border-green-800 hover:border-green-600 disabled:opacity-50"
                                title="Approve Seller"
                              >
                                <UserCheck className="w-5 h-5" />
                              </button>
                            )}

                            {u.role === 'seller' && u.approved && (
                              <button
                                onClick={() => handleRejectSeller(u._id)}
                                disabled={actionLoading === u._id}
                                className="p-2 text-yellow-400 hover:bg-yellow-900 rounded-lg transition-all duration-300 border border-yellow-800 hover:border-yellow-600 disabled:opacity-50"
                                title="Revoke Approval"
                              >
                                <UserX className="w-5 h-5" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              disabled={actionLoading === u._id}
                              className="p-2 text-red-400 hover:bg-red-900 rounded-lg transition-all duration-300 border border-red-800 hover:border-red-600 disabled:opacity-50"
                              title="Delete User"
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

            {pagination.pages > 1 && (
              <div className="mt-6 flex items-center justify-between bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 px-6 py-4">
                <div className="text-sm text-gray-300">
                  Showing <span className="font-semibold text-white">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                  <span className="font-semibold text-white">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span> of{' '}
                  <span className="font-semibold text-white">{pagination.total}</span> users
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 bg-gray-700 border-2 border-gray-600 rounded-xl hover:bg-gray-600 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-gray-300"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <span className="text-sm font-medium text-gray-300">
                    Page <span className="text-white">{pagination.page}</span> of <span className="text-white">{pagination.pages}</span>
                  </span>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="p-2 bg-gray-700 border-2 border-gray-600 rounded-xl hover:bg-gray-600 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-gray-300"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">

            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">User Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-all duration-300 border border-gray-600 hover:border-gray-500"
                >
                  <XCircle className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-gray-700 rounded-xl p-3 border border-gray-600">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">Name:</span>
                    <span className="font-semibold text-white">{selectedUser.name || 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-700 rounded-xl p-3 border border-gray-600">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">Email:</span>
                    <span className="font-semibold text-white">{selectedUser.email}</span>
                  </div>

                  {selectedUser.phone && (
                    <div className="flex items-center gap-3 bg-gray-700 rounded-xl p-3 border border-gray-600">
                      <Phone className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-300">Phone:</span>
                      <span className="font-semibold text-white">{selectedUser.phone}</span>
                    </div>
                  )}

                  {selectedUser.location && (
                    <div className="flex items-center gap-3 bg-gray-700 rounded-xl p-3 border border-gray-600">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-300">Location:</span>
                      <span className="font-semibold text-white">{selectedUser.location}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 bg-gray-700 rounded-xl p-3 border border-gray-600">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">Joined:</span>
                    <span className="font-semibold text-white">{formatDate(selectedUser.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Role & Status</h3>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getRoleBadge(selectedUser.role)}`}>
                    {selectedUser.role?.toUpperCase()}
                  </span>

                  {selectedUser.role === 'seller' && (
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      selectedUser.approved
                        ? 'bg-green-900 text-green-200 border border-green-700'
                        : 'bg-yellow-900 text-yellow-200 border border-yellow-700'
                    }`}>
                      {selectedUser.approved ? 'Approved' : 'Pending Approval'}
                    </span>
                  )}
                </div>
              </div>

              {selectedUser.role === 'seller' && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Seller Information</h3>
                  <div className="space-y-2 text-sm bg-gray-700 rounded-xl p-4 border border-gray-600">

                    {selectedUser.storeName && (
                      <p className="text-gray-300">
                        <span className="text-gray-400">Store Name:</span>{' '}
                        <span className="font-semibold text-white">{selectedUser.storeName}</span>
                      </p>
                    )}

                    {selectedUser.businessRegistration && (
                      <p className="text-gray-300">
                        <span className="text-gray-400">Business Registration:</span>{' '}
                        <span className="font-semibold text-white">{selectedUser.businessRegistration}</span>
                      </p>
                    )}

                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
