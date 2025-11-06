import React, { useState, useEffect } from 'react';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Autofill demo admin credentials for convenience during development/testing
    if (process.env.NODE_ENV !== 'production') {
      setForm({ email: 'admin@example.com', password: 'Admin@boscoh.com' });
    }
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(form.email, form.password);
      if (user?.role === 'admin') {
        navigate('/dashboard/admin');
      } else {
             if (user?.role === 'seller') navigate('/dashboard/seller');
        else if (user?.role === 'buyer') navigate('/dashboard/buyer');
        else if (user?.role === 'logistics') navigate('/dashboard/logistics');
        else navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-inter">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-600 rounded-full mx-auto flex items-center justify-center mb-4">
              <LogIn className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Login</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Sign in with admin credentials</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-300 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-300 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in as Admin'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            <Link to="/login" className="text-emerald-600 hover:underline">Regular login</Link>
          </div>

          {process.env.NODE_ENV !== 'production' && (
            <div className="mt-4 text-xs text-gray-500">
              Demo admin: admin@example.com / Admin@boscoh.com
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
