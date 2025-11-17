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
    <div className="min-h-screen bg-gradient-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full card-premium">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center mb-4 shadow-glow">
              <LogIn className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gradient-premium">Admin Login</h2>
            <p className="text-sm text-gray-500 mt-2">Sign in with admin credentials</p>
          </div>

          {error && (
            <div className="alert alert-error mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="input-premium pl-12 pr-4"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="input-premium pl-12 pr-4"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-4 text-lg"
            >
              {loading ? 'Signing in...' : 'Sign in as Admin'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="footer-link text-base font-medium">
              Regular login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
