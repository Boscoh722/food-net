import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Package, ShoppingCart, TrendingUp, DollarSign, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState({
    overview: [],
    charts: [],
    topProducts: [],
    userActivity: {}
  });

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoints = [
        `/analytics?range=${timeRange}`,
        `/orders/admin/analytics?range=${timeRange}`,
        `/api/analytics?range=${timeRange}`
      ];
      
      let data;
      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint);
          data = response.data;
          break;
        } catch (err) {
          console.log(`Endpoint ${endpoint} failed:`, err.message);
          continue;
        }
      }
      
      if (data) {
        setAnalyticsData(data);
      } else {
        throw new Error('No analytics endpoints available');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch analytics');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  const formatCurrency = (amount) => {
    return `KSh ${amount?.toLocaleString() || '0'}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard/admin" 
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
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
              className="px-4 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button 
              onClick={fetchAnalytics}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center justify-between p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <p>{error}</p>
            <button 
              onClick={fetchAnalytics}
              className="text-red-700 underline hover:text-red-800"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsData.overview.length > 0 ? (
              analyticsData.overview.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${
                      stat.color === 'primary' ? 'bg-blue-100' :
                      stat.color === 'success' ? 'bg-green-100' :
                      stat.color === 'accent' ? 'bg-purple-100' : 'bg-indigo-100'
                    }`}>
                      {stat.icon === 'Users' && <Users className="w-6 h-6 text-blue-600" />}
                      {stat.icon === 'Package' && <Package className="w-6 h-6 text-green-600" />}
                      {stat.icon === 'ShoppingCart' && <ShoppingCart className="w-6 h-6 text-purple-600" />}
                      {stat.icon === 'DollarSign' && <DollarSign className="w-6 h-6 text-indigo-600" />}
                    </div>
                    <span className={`text-sm font-semibold ${
                      stat.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change > 0 ? '+' : ''}{stat.change}%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.label === 'Revenue' ? formatCurrency(stat.value) : formatNumber(stat.value)}
                  </h3>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500">No overview data available</p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analyticsData.charts && analyticsData.charts.length > 0 ? (
              analyticsData.charts.map((chart, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{chart.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{chart.description}</p>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Chart visualization</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-500">No chart data available</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
            <div className="space-y-3">
              {analyticsData.topProducts && analyticsData.topProducts.length > 0 ? (
                analyticsData.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium truncate">{product.name}</span>
                    <span className="text-blue-600 font-semibold whitespace-nowrap">{formatNumber(product.sales)} sales</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No product data available</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity</h3>
            <div className="space-y-4">
              {analyticsData.userActivity ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">New Registrations</span>
                    <span className="font-semibold text-gray-900">{formatNumber(analyticsData.userActivity.newRegistrations)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Sessions</span>
                    <span className="font-semibold text-gray-900">{formatNumber(analyticsData.userActivity.activeSessions)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Page Views</span>
                    <span className="font-semibold text-gray-900">{formatNumber(analyticsData.userActivity.pageViews)}</span>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-center py-4">No user activity data</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/AdminUsers" className="flex items-center w-full px-4 py-2 text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <Users className="w-4 h-4 mr-2" />
                User Analytics
              </Link>
              <Link to="/AdminProducts" className="flex items-center w-full px-4 py-2 text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <Package className="w-4 h-4 mr-2" />
                Product Reports
              </Link>
              <Link to="/AdminOrders" className="flex items-center w-full px-4 py-2 text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Order Analytics
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}