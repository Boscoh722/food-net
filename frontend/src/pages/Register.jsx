import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, IdCard, MapPin, Globe, UserPlus, AlertCircle } from 'lucide-react';

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
      // Route based on user role
      if (user.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (user.role === 'seller') {
        navigate('/dashboard/seller');
      } else if (user.role === 'buyer') {
        navigate('/dashboard/buyer');
      } else if (user.role === 'logistics') {
        navigate('/dashboard/logistics');
      } else {
        navigate('/');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed';
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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Join Food-Net</h1>
            <p className="text-white/80">Create your account to get started</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400 animate-slide-up">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  I want to join as:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {roleOptions.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setForm({ ...form, role: role.value })}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        form.role === role.value
                          ? 'border-primary bg-primary/10 dark:bg-primary/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{role.icon}</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{role.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{role.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Fields */}
              {(form.role === 'seller' || form.role === 'buyer') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="+254 700 000 000"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      National ID Number
                    </label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="ID Number (hidden)"
                        value={form.idNumber}
                        onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {form.role === 'logistics' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Nairobi, Kenya"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Service Reach
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Nationwide / Regional"
                        value={form.reach}
                        onChange={(e) => setForm({ ...form, reach: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary font-semibold hover:text-secondary transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
