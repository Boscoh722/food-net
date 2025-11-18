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
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
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
      admin: 'bg-purple-100 text-purple-800 border-purple-200',
      seller: 'bg-green-100 text-green-800 border-green-200',
      buyer: 'bg-blue-100 text-blue-800 border-blue-200',
      logistics: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return badges[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-md">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard/admin')}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    User Management
                  </h1>
                  <p className="text-gray-600">Manage all platform users</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={loadUsers}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading && 'animate-spin'}`} />
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-4 h-4 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="">All Roles</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="logistics">Logistics</option>
              <option value="admin">Admin</option>
            </select>

            <select
              value={filters.approved}
              onChange={(e) => handleFilterChange('approved', e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="">All Status</option>
              <option value="true">Approved</option>
              <option value="false">Pending</option>
            </select>
          </div>

          {(filters.role || filters.approved || filters.search) && (
            <button
              onClick={handleClearFilters}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertTriangle className="w-4 h-4" />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Users className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                              <span className="text-blue-800 font-bold">
                                {u.name?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{u.name || 'Unknown'}</p>
                              <p className="text-sm text-gray-500">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadge(u.role)}`}>
                            {u.role?.toUpperCase()}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {u.role === 'seller' ? (
                            u.approved ? (
                              <span className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                                <CheckCircle2 className="w-4 h-4" />
                                Approved
                              </span>
                            ) : (
                              <span className="flex items-center space-x-1 text-yellow-600 text-sm font-medium">
                                <XCircle className="w-4 h-4" />
                                Pending
                              </span>
                            )
                          ) : (
                            <span className="text-gray-500 text-sm">-</span>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(u.createdAt)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewUser(u._id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {u.role === 'seller' && !u.approved && (
                              <button
                                onClick={() => handleApproveSeller(u._id)}
                                disabled={actionLoading === u._id}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50 transition-colors"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                            )}

                            {u.role === 'seller' && u.approved && (
                              <button
                                onClick={() => handleRejectSeller(u._id)}
                                disabled={actionLoading === u._id}
                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg disabled:opacity-50 transition-colors"
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              disabled={actionLoading === u._id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors"
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

            {pagination.pages > 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                  <span className="font-semibold text-gray-900">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span> of{' '}
                  <span className="font-semibold text-gray-900">{pagination.total}</span> users
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-sm font-medium text-gray-600">
                    Page <span className="text-gray-900">{pagination.page}</span> of <span className="text-gray-900">{pagination.pages}</span>
                  </span>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-600">Name:</span>
                      <span className="font-semibold text-gray-900">{selectedUser.name || 'N/A'}</span>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-600">Email:</span>
                      <span className="font-semibold text-gray-900">{selectedUser.email}</span>
                    </div>

                    {selectedUser.phone && (
                      <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <Phone className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-semibold text-gray-900">{selectedUser.phone}</span>
                      </div>
                    )}

                    {selectedUser.location && (
                      <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-600">Location:</span>
                        <span className="font-semibold text-gray-900">{selectedUser.location}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-600">Joined:</span>
                      <span className="font-semibold text-gray-900">{formatDate(selectedUser.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Role & Status</h3>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getRoleBadge(selectedUser.role)}`}>
                      {selectedUser.role?.toUpperCase()}
                    </span>

                    {selectedUser.role === 'seller' && (
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${
                        selectedUser.approved ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}>
                        {selectedUser.approved ? 'Approved' : 'Pending Approval'}
                      </span>
                    )}
                  </div>
                </div>

                {selectedUser.role === 'seller' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
                    <div className="space-y-2 text-sm bg-gray-50 rounded-lg p-4 border border-gray-200">
                      {selectedUser.storeName && (
                        <p className="text-gray-600">
                          <span className="text-gray-500">Store Name:</span>{' '}
                          <span className="font-semibold text-gray-900">{selectedUser.storeName}</span>
                        </p>
                      )}

                      {selectedUser.businessRegistration && (
                        <p className="text-gray-600">
                          <span className="text-gray-500">Business Registration:</span>{' '}
                          <span className="font-semibold text-gray-900">{selectedUser.businessRegistration}</span>
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
    </div>
  );
}