// In Header.jsx
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-red-500 ring-red-300',
      seller: 'bg-blue-500 ring-blue-300',
      buyer: 'bg-green-500 ring-green-300',
      logistics: 'bg-purple-500 ring-purple-300',
    };
    return colors[role] || 'bg-gray-500 ring-gray-300';
  };

  const getDashboardRoute = () => {
    if (!user) return '/dashboard';
    const routes = {
      admin: '/dashboard/admin',
      seller: '/dashboard/seller',
      buyer: '/dashboard/buyer',
      logistics: '/dashboard/logistics',
    };
    return routes[user.role] || '/dashboard';
  };

  return (
    <>
      {/* Tailwind Custom Animations */}
      <style jsx>{`
        @layer components {
          .animate-slide-in {
            animation: slideIn 0.3s ease-out forwards;
          }
          .animate-slide-out {
            animation: slideOut 0.3s ease-in forwards;
          }
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
          .glass-header {
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            background: linear-gradient(to right, rgba(46, 139, 87, 0.95), rgba(34, 139, 34, 0.95));
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          @media (prefers-color-scheme: dark) {
            .glass-header {
              background: linear-gradient(to right, rgba(46, 139, 87, 0.98), rgba(34, 139, 34, 0.98));
            }
          }
        }
      `}</style>

      <header className="glass-header text-white shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              to="/"
              className="group flex items-center gap-3 text-3xl font-bold transition-all duration-300 hover:scale-105"
            >
              <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300 shadow-lg border border-white/20">
                <ShoppingCart className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
              <span className="text-white font-extrabold drop-shadow-lg">
                Food-Net
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {['Home', 'Products'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="px-4 py-2.5 rounded-xl font-semibold text-white hover:text-white hover:bg-white/20 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-white/20 backdrop-blur-sm"
                >
                  {item}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    to={getDashboardRoute()}
                    className="group flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white hover:bg-white/20 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-white/20 backdrop-blur-sm"
                  >
                    <User className="w-5 h-5 text-white drop-shadow-md group-hover:scale-110 transition-transform" />
                    <span className="drop-shadow-sm">Dashboard</span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-lg ring-2 ring-white/30 ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role.toUpperCase()}
                    </span>
                  </Link>

                  <Link
                    to="/orders"
                    className="px-4 py-2.5 rounded-xl font-semibold text-white hover:bg-white/20 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-white/20 backdrop-blur-sm"
                  >
                    Orders
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="ml-2 flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:scale-105"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2.5 bg-accent hover:bg-accent/90 text-primary font-bold rounded-xl shadow-lg hover:shadow-accent/30 transition-all duration-300 hover:scale-105"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="ml-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-primary font-bold rounded-xl shadow-lg hover:shadow-gray-200/50 transition-all duration-300 hover:scale-105"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2.5 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 backdrop-blur-sm"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-white drop-shadow-lg" />
            </button>
          </div>
        </div>

        {/* Mobile Slide-In Menu */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <div className="fixed right-0 top-0 h-full w-80 max-w-full bg-gradient-to-b from-primary via-secondary to-primary shadow-2xl z-50 md:hidden animate-slide-in border-l border-white/20">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/20">
                  <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                    Menu
                  </h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6 text-white drop-shadow-lg" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-6 space-y-3">
                  <MobileNavLink to="/" icon="Home" onClick={() => setMobileMenuOpen(false)} />
                  <MobileNavLink to="/products" icon="Products" onClick={() => setMobileMenuOpen(false)} />

                  {user ? (
                    <>
                      <MobileNavLink
                        to={getDashboardRoute()}
                        icon={<User className="w-5 h-5" />}
                        label={
                          <div className="flex items-center gap-2">
                            Dashboard
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold text-white ring-2 ring-offset-2 ring-offset-transparent ${getRoleBadgeColor(
                                user.role
                              )}`}
                            >
                              {user.role.toUpperCase()}
                            </span>
                          </div>
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      />
                      <MobileNavLink to="/orders" icon="Orders" onClick={() => setMobileMenuOpen(false)} />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/30"
                      >
                        <LogOut className="w-5 h-5" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full text-center px-4 py-3 bg-accent hover:bg-accent/90 text-primary font-bold rounded-xl shadow-lg transition-all duration-300"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full text-center px-4 py-3 bg-white hover:bg-gray-50 text-primary font-bold rounded-xl shadow-lg transition-all duration-300"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-white/20">
                  <p className="text-sm text-white/70 text-center">
                    &copy; {new Date().getFullYear()} Food-Net. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}

// Reusable Mobile Nav Link Component
function MobileNavLink({ to, icon, label, onClick }) {
  const isReactIcon = typeof icon === 'object';
  const displayLabel = label || (typeof icon === 'string' ? icon : '');

  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold text-white hover:text-white border border-transparent hover:border-white/20 backdrop-blur-sm shadow-sm hover:shadow-md"
    >
      {isReactIcon ? (
        <span className="drop-shadow-md [&>svg]:text-white [&>svg]:w-5 [&>svg]:h-5">{icon}</span>
      ) : (
        <span className="w-5 h-5" />
      )}
      <span className="drop-shadow-sm">{displayLabel}</span>
    </Link>
  );
}
