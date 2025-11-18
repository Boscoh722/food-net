import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Lock, Phone, IdCard, MapPin, AlertCircle
} from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'buyer', phone: '', idNumber: '', location: '', reach: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await register(form);
      if (user.role === 'admin') navigate('/dashboard/admin');
      else if (user.role === 'seller') navigate('/dashboard/seller');
      else if (user.role === 'buyer') navigate('/dashboard/buyer');
      else if (user.role === 'logistics') navigate('/dashboard/logistics');
      else navigate('/');
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Registration failed. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'buyer', label: 'Buyer', icon: '🛒', desc: 'Purchase agricultural products' },
    { value: 'seller', label: 'Seller', icon: '🏪', desc: 'Sell your products' },
    { value: 'logistics', label: 'Logistics', icon: '🚚', desc: 'Handle deliveries' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white p-8 text-center">
          <div className="w-16 h-16 bg-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🌱</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Food-Net</h1>
          <p className="text-blue-100">Create your account</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Select Role</label>
              <div className="grid grid-cols-3 gap-3">
                {roleOptions.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: role.value })}
                    className={`p-3 rounded-xl border transition-colors text-center ${
                      form.role === role.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{role.icon}</div>
                    <div className="font-medium text-gray-900 text-sm">{role.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{role.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {form.role !== 'admin' && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="Enter your phone"
                      required
                    />
                  </div>
                </div>

                {(form.role === 'seller' || form.role === 'buyer') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">National ID</label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={form.idNumber}
                        onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                        placeholder="Enter ID number"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {form.role === 'logistics' && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="Enter location"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Reach</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={form.reach}
                      onChange={(e) => setForm({ ...form, reach: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="e.g., Nationwide"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}