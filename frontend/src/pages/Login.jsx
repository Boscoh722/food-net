import React, { useState } from 'react';
import { Mail, Lock, LogIn, AlertCircle, Leaf } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ Real auth context

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const PRIMARY_COLOR = 'emerald-600';
  const SECONDARY_COLOR = 'amber-500';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(form.email, form.password);

      // Redirect based on role
      if (user.role === 'admin') navigate('/dashboard/admin');
      else if (user.role === 'seller') navigate('/dashboard/seller');
      else if (user.role === 'buyer') navigate('/dashboard/buyer');
      else if (user.role === 'logistics') navigate('/dashboard/logistics');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-inter relative overflow-hidden">
      {/* === Background Gradient Effect === */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div
          className={`w-96 h-96 bg-${PRIMARY_COLOR} rounded-full absolute top-10 left-10 blur-3xl mix-blend-multiply animate-blob`}
        ></div>
        <div
          className={`w-96 h-96 bg-${SECONDARY_COLOR} rounded-full absolute bottom-10 right-10 blur-3xl mix-blend-multiply animation-delay-2000 animate-blob`}
        ></div>
      </div>

      {/* === Login Card === */}
      <div className="max-w-md w-full relative z-10 animate-fade-in-up">
        <div
          className={`bg-white dark:bg-gray-800 rounded-3xl shadow-2xl shadow-gray-400/30 dark:shadow-gray-900/50 overflow-hidden border-t-4 border-${PRIMARY_COLOR}`}
        >
          {/* === Header === */}
          <div className={`bg-gradient-to-br from-${PRIMARY_COLOR} to-emerald-800 p-10 text-center`}>
            <div className="w-20 h-20 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white shadow-xl">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Food-Net Login</h1>
            <p className="text-white/90 font-light">Access your Kenyan farm connection platform</p>
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
              {/* === Email Field === */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleFormChange}
                    className={`w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-${PRIMARY_COLOR}/30 focus:border-${PRIMARY_COLOR} dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-inner`}
                    required
                  />
                </div>
              </div>

              {/* === Password Field === */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleFormChange}
                    className={`w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-${PRIMARY_COLOR}/30 focus:border-${PRIMARY_COLOR} dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-inner`}
                    required
                  />
                </div>
              </div>

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
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    <span>Sign In to Food-Net</span>
                  </>
                )}
              </button>
            </form>

            {/* === Footer Links === */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className={`text-${PRIMARY_COLOR} font-bold hover:text-emerald-500 transition-colors duration-200`}
                >
                  Sign up here
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

export default function App() {
  return <Login />;
}
