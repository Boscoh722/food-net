import { useState, useEffect } from 'react';
import {
  Users, Search, Filter, UserCheck, UserX, Edit, Trash2,
  ChevronLeft, ChevronRight, CheckCircle2, XCircle, Eye,
  Mail, Phone, MapPin, Calendar, AlertTriangle, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../lib/api';

export default function AdminUsersDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
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

  // Filters
  const [filters, setFilters] = useState({
    role: searchParams.get('role') || '',
    approved: searchParams.get('approved') || '',
    search: searchParams.get('search') || ''
  });

  // Modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Load users
  useEffect(() => {
    loadUsers();
  }, [filters, pagination.page]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.role && { role: filters.role }),
        ...(filters.approved && { approved: filters.approved }),
        ...(filters.search && { search: filters.search })
      });

      // Update URL params
      setSearchParams(params);

      // CORRECT ROUTE: GET /api/users (from userRoutes.js)
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

  // Approve seller
  const handleApproveSeller = async (userId) => {
    if (!window.confirm('Approve this seller?')) return;

    try {
      setActionLoading(userId);
      // CORRECT ROUTE: PATCH /api/users/:id/approve-seller
      await api.patch(`/users/${userId}/approve-seller`);
      
      // Update local state
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

  // Reject seller
  const handleRejectSeller = async (userId) => {
    if (!window.confirm('Reject this seller? This action cannot be undone.')) return;

    try {
      setActionLoading(userId);
      // CORRECT ROUTE: PATCH /api/users/:id/reject-seller
      await api.patch(`/users/${userId}/reject-seller`);
      
      // Update local state
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

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user? This action cannot be undone.')) return;

    try {
      setActionLoading(userId);
      // CORRECT ROUTE: DELETE /api/users/:id
      await api.delete(`/users/${userId}`);
      
      // Remove from local state
      setUsers(users.filter(u => u._id !== userId));
      
      alert('User deleted successfully!');
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  // View user details
  const handleViewUser = async (userId) => {
    try {
      // CORRECT ROUTE: GET /api/users/:id
      const response = await api.get(`/users/${userId}`);
      setSelectedUser(response.data?.user || response.data);
      setShowModal(true);
    } catch (err) {
      console.error('Failed to load user details:', err);
      alert(err.response?.data?.message || 'Failed to load user details');
    }
  };

  // Filter handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({ role: '', approved: '', search: '' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get role badge color
  const getRoleBadge = (role) => {
    const badges = {
      admin: 'bg-purple-100 text-purple-700',
      seller: 'bg-green-100 text-green-700',
      buyer: 'bg-blue-100 text-blue-700',
      logistics: 'bg-orange-100 text-orange-700'
    };
    return badges[role] || 'bg-gray-100 text-gray-700';
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
                <Users className="w-10 h-10 text-green-600" />
                User Management
              </h1>
              <p className="text-gray-600 mt-1">Manage all platform users</p>
            </div>
            <button
              onClick={loadUsers}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All Roles</option>
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="logistics">Logistics</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Approved Filter */}
              <div>
                <select
                  value={filters.approved}
                  onChange={(e) => handleFilterChange('approved', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="true">Approved</option>
                  <option value="false">Pending</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {(filters.role || filters.approved || filters.search) && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Users Found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          /* Users Table */
          <>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-700 font-bold">
                                {u.name?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{u.name || 'Unknown'}</p>
                              <p className="text-sm text-gray-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(u.role)}`}>
                            {u.role?.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {u.role === 'seller' ? (
                            u.approved ? (
                              <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                <CheckCircle2 className="w-4 h-4" />
                                Approved
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-orange-600 text-sm font-medium">
                                <XCircle className="w-4 h-4" />
                                Pending
                              </span>
                            )
                          ) : (
                            <span className="text-gray-500 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(u.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {/* View Button */}
                            <button
                              onClick={() => handleViewUser(u._id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>

                            {/* Approve/Reject for Sellers */}
                            {u.role === 'seller' && !u.approved && (
                              <button
                                onClick={() => handleApproveSeller(u._id)}
                                disabled={actionLoading === u._id}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                                title="Approve Seller"
                              >
                                <UserCheck className="w-5 h-5" />
                              </button>
                            )}

                            {u.role === 'seller' && u.approved && (
                              <button
                                onClick={() => handleRejectSeller(u._id)}
                                disabled={actionLoading === u._id}
                                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition disabled:opacity-50"
                                title="Revoke Approval"
                              >
                                <UserX className="w-5 h-5" />
                              </button>
                            )}

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              disabled={actionLoading === u._id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
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

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-6 flex items-center justify-between bg-white rounded-xl shadow-lg px-6 py-4">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                  <span className="font-semibold">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span> of{' '}
                  <span className="font-semibold">{pagination.total}</span> users
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <XCircle className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Name:</span>
                    <span className="font-semibold text-gray-800">{selectedUser.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold text-gray-800">{selectedUser.email}</span>
                  </div>
                  {selectedUser.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-semibold text-gray-800">{selectedUser.phone}</span>
                    </div>
                  )}
                  {selectedUser.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Location:</span>
                      <span className="font-semibold text-gray-800">{selectedUser.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Joined:</span>
                    <span className="font-semibold text-gray-800">{formatDate(selectedUser.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Role & Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Role & Status</h3>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getRoleBadge(selectedUser.role)}`}>
                    {selectedUser.role?.toUpperCase()}
                  </span>
                  {selectedUser.role === 'seller' && (
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      selectedUser.approved
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {selectedUser.approved ? 'Approved' : 'Pending Approval'}
                    </span>
                  )}
                </div>
              </div>

              {/* Seller Specific Info */}
              {selectedUser.role === 'seller' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Seller Information</h3>
                  <div className="space-y-2 text-sm">
                    {selectedUser.storeName && (
                      <p><span className="text-gray-600">Store Name:</span> <span className="font-semibold">{selectedUser.storeName}</span></p>
                    )}
                    {selectedUser.businessRegistration && (
                      <p><span className="text-gray-600">Business Registration:</span> <span className="font-semibold">{selectedUser.businessRegistration}</span></p>
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
