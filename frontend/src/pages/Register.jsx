import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Lock, Phone, IdCard, MapPin, Globe, 
  UserPlus, AlertCircle, Leaf 
} from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'buyer', phone: '', idNumber: '', location: '', reach: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const PRIMARY_COLOR = 'emerald-600';
  const SECONDARY_COLOR = 'amber-500';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-inter relative overflow-hidden">
      {/* === Background Gradient Effect === */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className={`w-96 h-96 bg-${PRIMARY_COLOR} rounded-full absolute top-10 left-10 blur-3xl mix-blend-multiply animate-blob`}></div>
        <div className={`w-96 h-96 bg-${SECONDARY_COLOR} rounded-full absolute bottom-10 right-10 blur-3xl mix-blend-multiply animation-delay-2000 animate-blob`}></div>
      </div>

      {/* === Register Card === */}
      <div className="max-w-2xl w-full relative z-10 animate-fade-in-up">
        <div className={`bg-white dark:bg-gray-800 rounded-3xl shadow-2xl shadow-gray-400/30 dark:shadow-gray-900/50 overflow-hidden border-t-4 border-${PRIMARY_COLOR}`}>
          {/* === Header === */}
          <div className={`bg-gradient-to-br from-${PRIMARY_COLOR} to-emerald-800 p-10 text-center`}>
            <div className="w-20 h-20 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white shadow-xl">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Create Your Account</h1>
            <p className="text-white/90 font-light">Join the Food-Net community today</p>
          </div>

          {/* === Form === */}
          <div className="p-8 sm:p-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400 animate-shake shadow-sm font-medium">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* === Name & Email === */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-${PRIMARY_COLOR}/30 focus:border-${PRIMARY_COLOR} dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-inner`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-${PRIMARY_COLOR}/30 focus:border-${PRIMARY_COLOR} dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-inner`}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* === Password === */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-${PRIMARY_COLOR}/30 focus:border-${PRIMARY_COLOR} dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-inner`}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* === Role Selection === */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  I want to join as:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {roleOptions.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setForm({ ...form, role: role.value })}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        form.role === role.value
                          ? `border-${PRIMARY_COLOR} bg-${PRIMARY_COLOR}/10 dark:bg-${PRIMARY_COLOR}/20`
                          : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{role.icon}</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{role.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{role.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* === Conditional Fields === */}
              {(form.role === 'seller' || form.role === 'buyer') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="+254 700 000 000"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-${PRIMARY_COLOR}/30 focus:border-${PRIMARY_COLOR} dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-inner`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      National ID Number
                    </label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="ID Number"
                        value={form.idNumber}
                        onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-${PRIMARY_COLOR}/30 focus:border-${PRIMARY_COLOR} dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-inner`}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {form.role === 'logistics' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Nairobi, Kenya"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-${PRIMARY_COLOR}/30 focus:border-${PRIMARY_COLOR} dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-inner`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Service Reach
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Nationwide / Regional"
                        value={form.reach}
                        onChange={(e) => setForm({ ...form, reach: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-${PRIMARY_COLOR}/30 focus:border-${PRIMARY_COLOR} dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-inner`}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* === Submit Button === */}
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full 
                  bg-gradient-to-br from-emerald-600 via-green-600 to-amber-500 
                  text-white py-3 px-6 rounded-xl font-semibold text-lg 
                  shadow-lg shadow-emerald-500/30 
                  hover:shadow-emerald-500/50 hover:scale-[1.03] 
                  transition-all duration-300 ease-out 
                  flex items-center justify-center gap-3 group 
                  disabled:opacity-70 disabled:cursor-not-allowed
                `}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            {/* === Footer Link === */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className={`text-${PRIMARY_COLOR} font-bold hover:text-emerald-500 transition-colors duration-200`}
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* === Animations === */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite cubic-bezier(0.77, 0, 0.175, 1);
        }
        @keyframes fadeInMoveUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInMoveUp 0.6s ease-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
