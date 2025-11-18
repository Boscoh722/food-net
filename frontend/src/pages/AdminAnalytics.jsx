import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Users, Package, ShoppingCart, MessageSquare, 
  TrendingUp, DollarSign, Eye, ShoppingBag, Calendar,
  Download, Filter, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyticsData, setAnalyticsData] = useState({
    overview: [],
    charts: [],
    topProducts: [],
    userActivity: {}
  });

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [overviewRes, chartsRes, productsRes, activityRes] = await Promise.all([
        api.get(`/analytics/overview?range=${timeRange}`),
        api.get(`/analytics/charts?range=${timeRange}`),
        api.get(`/analytics/top-products?range=${timeRange}`),
        api.get(`/analytics/user-activity?range=${timeRange}`)
      ]);

      setAnalyticsData({
        overview: overviewRes.data.data || [],
        charts: chartsRes.data.data || [],
        topProducts: productsRes.data.data || [],
        userActivity: activityRes.data.data || {}
      });

    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError(err.response?.data?.message || 'Failed to load analytics data');
      
      // Fallback to empty data
      setAnalyticsData({
        overview: [],
        charts: [],
        topProducts: [],
        userActivity: {}
      });
    } finally {
      setLoading(false);
    }
  };

  // Export analytics data
  const handleExport = async (format = 'csv') => {
    try {
      const response = await api.get(`/analytics/export?format=${format}&range=${timeRange}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-${timeRange}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Export failed:', err);
      setError('Failed to export data');
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  // Default overview stats if API returns empty
  const defaultOverview = [
    { label: 'Total Users', value: '0', change: '+0%', icon: Users, color: 'primary' },
    { label: 'Active Products', value: '0', change: '+0%', icon: Package, color: 'success' },
    { label: 'Total Orders', value: '0', change: '+0%', icon: ShoppingCart, color: 'accent' },
    { label: 'Revenue', value: 'KSh 0', change: '+0%', icon: DollarSign, color: 'purple' },
  ];

  const overviewStats = analyticsData.overview.length > 0 ? analyticsData.overview : defaultOverview;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard/admin" 
              className="btn btn-ghost btn-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                Platform Analytics
              </h1>
              <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input input-premium"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button 
              onClick={() => handleExport('csv')}
              className="btn btn-outline flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="alert alert-error mb-6">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Overview Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {overviewStats.map((stat, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    stat.color === 'primary' ? 'bg-primary-100' :
                    stat.color === 'success' ? 'bg-success-100' :
                    stat.color === 'accent' ? 'bg-accent-100' :
                    'bg-purple-100'
                  }`}>
                    <stat.icon className={`w-6 h-6 ${
                      stat.color === 'primary' ? 'text-primary-600' :
                      stat.color === 'success' ? 'text-success-600' :
                      stat.color === 'accent' ? 'text-accent-600' :
                      'text-purple-600'
                    }`} />
                  </div>
                  <span className={`text-sm font-semibold ${
                    stat.change.startsWith('+') ? 'text-success-600' : 'text-error-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analyticsData.charts.length > 0 ? (
              analyticsData.charts.map((chart, index) => (
                <div key={index} className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{chart.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{chart.description}</p>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Chart: {chart.title}</p>
                      <p className="text-gray-400 text-sm">Data loaded from API</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback when no chart data
              <>
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">User Growth</h3>
                  <p className="text-gray-600 text-sm mb-4">New user registrations over time</p>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No chart data available</p>
                    </div>
                  </div>
                </div>
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue Trends</h3>
                  <p className="text-gray-600 text-sm mb-4">Monthly revenue performance</p>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No chart data available</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Additional Analytics Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Top Products */}
          <div className="card p-6 lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
            <div className="space-y-3">
              {analyticsData.topProducts.length > 0 ? (
                analyticsData.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">{product.name}</span>
                    <span className="text-primary-600 font-semibold">{product.sales} sales</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No product data available</p>
                </div>
              )}
            </div>
          </div>

          {/* User Activity */}
          <div className="card p-6 lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity</h3>
            <div className="space-y-4">
              {analyticsData.userActivity.newRegistrations !== undefined ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">New Registrations</span>
                    <span className="font-semibold text-gray-900">{analyticsData.userActivity.newRegistrations}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Sessions</span>
                    <span className="font-semibold text-gray-900">{analyticsData.userActivity.activeSessions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Page Views</span>
                    <span className="font-semibold text-gray-900">{analyticsData.userActivity.pageViews}</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No activity data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6 lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleExport('csv')}
                className="btn btn-ghost w-full justify-start"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
              <button 
                onClick={fetchAnalyticsData}
                className="btn btn-ghost w-full justify-start"
              >
                <Filter className="w-4 h-4" />
                Refresh Data
              </button>
              <Link to="/dashboard/admin" className="btn btn-ghost w-full justify-start">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}