import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Home, Package } from 'lucide-react';
import { useState } from 'react';

// Map string icons to Lucide components for MobileNavLink
const iconMap = {
  Home: Home,
  Products: Package,
  Orders: ShoppingCart,
};

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  // Improved to use a hypothetical 'primary' color (green-600) for context.
  // Add ring-offset for visibility on the glass header.
  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-red-600 ring-red-400 ring-offset-green-800', // Offset color matches the dark mobile menu background
      seller: 'bg-indigo-600 ring-indigo-400 ring-offset-green-800',
      buyer: 'bg-amber-600 ring-amber-400 ring-offset-green-800',
      logistics: 'bg-purple-600 ring-purple-400 ring-offset-green-800',
    };
    return colors[role] || 'bg-gray-600 ring-gray-400 ring-offset-green-800';
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

  // --- Visual Improvements ---
  return (
    <>
      <style>{`
        @layer components {
          .animate-slide-in {
            animation: slideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0.5; } /* Slight opacity change */
            to { transform: translateX(0); opacity: 1; }
          }
          /* Adjusted Glass Header for a slightly deeper, more refined look */
          .glass-header {
            backdrop-filter: blur(18px); /* Increased blur */
            -webkit-backdrop-filter: blur(18px);
            /* Slightly darker, more prominent green gradient for better contrast */
            background: linear-gradient(to right, rgba(27,94,32,0.98), rgba(67,160,71,0.95)); 
            border-bottom: 2px solid rgba(255,255,255,0.15); /* Thicker, lighter border */
          }
          /* Custom primary button class (assumes Tailwind config uses 'primary' for a prominent green) */
          .btn-primary {
            background-color: #38a169; /* Example primary green (green-600) */
            &:hover {
              background-color: #276749; /* Darker green-700 */
            }
          }
        }
      `}</style>

      <header className="glass-header text-white shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4"> {/* Increased padding for better spacing */}
          <div className="flex justify-between items-center">
            {/* Logo - Enhanced visual impact */}
            <Link
              to="/"
              className="group flex items-center gap-3 text-3xl font-extrabold transition-transform duration-300 hover:scale-[1.02]" // Subtle scale
            >
              <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-md border border-white/30 shadow-lg group-hover:bg-white/25 transition-all duration-300 group-hover:rotate-6"> {/* Added rotate effect */}
                <ShoppingCart className="w-8 h-8 text-white drop-shadow-lg" /> {/* Stronger shadow */}
              </div>
              <span className="text-white drop-shadow-xl tracking-wider">Food-Net</span>
            </Link>

            {/* Desktop nav - Refined hover states */}
            <nav className="hidden md:flex items-center gap-2">
              {['Home', 'Products'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="px-4 py-2 rounded-lg font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/15 shadow-sm hover:shadow-md"
                >
                  {item}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    to={getDashboardRoute()}
                    className="group flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white/90 hover:text-white bg-white/5 hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/15 shadow-sm hover:shadow-md"
                  >
                    <User className="w-5 h-5 text-white drop-shadow-sm group-hover:scale-110 transition-transform" />
                    <span>Dashboard</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white shadow ring-2 ring-white/30 ${getRoleBadgeColor(user.role)}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </Link>

                  <Link
                    to="/orders"
                    className="px-4 py-2 rounded-lg font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/15 shadow-sm hover:shadow-md"
                  >
                    Orders
                  </Link>

                  <button
                    onClick={handleLogout}
                    // Improved Logout Button
                    className="ml-3 flex items-center gap-2 px-5 py-2 btn-primary bg-red-700 hover:bg-red-800 text-white rounded-lg font-semibold shadow-lg hover:shadow-red-600/50 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    // Main CTA - prominent shadow and scale
                    className="px-5 py-2 btn-primary bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-xl shadow-green-500/40 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    // Secondary CTA - high contrast
                    className="px-5 py-2 bg-white/95 hover:bg-white text-green-700 font-bold rounded-lg shadow-lg hover:shadow-white/50 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2.5 rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20 backdrop-blur-md shadow-md"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-white drop-shadow" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" // Darker backdrop
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Adjusted Mobile Menu background and width */}
            <div className="fixed right-0 top-0 h-full w-64 md:w-80 bg-gradient-to-b from-green-800 via-green-900 to-black/90 shadow-2xl z-50 md:hidden animate-slide-in border-l border-green-700/50">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                  <h2 className="text-2xl font-extrabold text-white tracking-wider">Food-Net</h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-white/15 border border-white/20 transition-all duration-300 shadow-md"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>

                <nav className="flex-1 p-6 space-y-2 overflow-y-auto"> {/* Added overflow for content */}
                  <MobileNavLink to="/" icon="Home" onClick={() => setMobileMenuOpen(false)} />
                  <MobileNavLink to="/products" icon="Products" onClick={() => setMobileMenuOpen(false)} />

                  {user ? (
                    <>
                      <MobileNavLink
                        to={getDashboardRoute()}
                        icon={User} // Pass the component itself
                        label={
                          <div className="flex items-center gap-2">
                            Dashboard
                            <span
                              // Removed ring-offset-2 since the background is dark
                              className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ring-2 ${getRoleBadgeColor(user.role)} ring-offset-0`}
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
                        // Mobile Logout button style
                        className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white shadow-lg transition-all duration-300 mt-4"
                      >
                        <LogOut className="w-5 h-5" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="pt-4 space-y-3">
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full text-center px-4 py-3 btn-primary bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-xl transition-all duration-300"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full text-center px-4 py-3 bg-white hover:bg-gray-100 text-green-700 font-bold rounded-lg shadow-lg transition-all duration-300"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </nav>

                <div className="p-6 border-t border-white/10 text-center text-white/50 text-xs">
                  &copy; {new Date().getFullYear()} Food-Net. All rights reserved.
                </div>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}

// Helper component for mobile navigation links
function MobileNavLink({ to, icon, label, onClick }) {
  // Determine if the icon is a Lucide component or a string name
  const LucideIcon = typeof icon === 'string' ? iconMap[icon] : icon;
  const displayLabel = label || (typeof icon === 'string' ? icon : '');

  return (
    <Link
      to={to}
      onClick={onClick}
      // Enhanced Link styling for mobile menu
      className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-300 font-semibold text-white/95 hover:text-white border border-white/5 hover:border-white/15 shadow-md"
    >
      {LucideIcon && (
        <span className="p-1.5 rounded-full bg-white/10 drop-shadow-lg flex items-center justify-center">
          <LucideIcon className="w-5 h-5 text-white" />
        </span>
      )}
      <span className="drop-shadow-sm">{displayLabel}</span>
    </Link>
  );
}
