import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dashboardPath = user ? `/dashboard/${user.role}` : "/dashboard";

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
  };

  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setShowDropdown(false);
  };

  return (
    <header className="bg-white shadow-soft border-b border-gray-200/60 sticky top-0 z-50 backdrop-blur-lg bg-white/95">
      <nav className="container-custom py-4 flex justify-between items-center">
        
        <Link 
          to="/" 
          className="text-3xl font-extrabold text-gradient-premium font-['Plus_Jakarta_Sans'] tracking-tight hover:scale-105 transform transition-all duration-300"
        >
          FoodNet
        </Link>

        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link
                to="/products"
                className="btn btn-ghost font-semibold text-gray-700 hover:text-primary-700"
              >
                Products
              </Link>

              <Link
                to="/login"
                className="btn btn-primary font-semibold"
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="btn btn-accent font-semibold group"
                >
                  Get Started
                  <svg 
                    className={`w-4 h-4 ml-2 transform transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-large border border-gray-200/60 z-50 overflow-hidden">
                    <Link 
                      to="/register?role=seller"
                      className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 font-medium transition-all duration-200 border-b border-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      🚜 Seller
                    </Link>
                    <Link 
                      to="/register?role=buyer"
                      className="block px-4 py-3 text-gray-700 hover:bg-success-50 hover:text-success-700 font-medium transition-all duration-200 border-b border-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      🛒 Buyer
                    </Link>
                    <Link 
                      to="/register?role=logistics"
                      className="block px-4 py-3 text-gray-700 hover:bg-accent-50 hover:text-accent-700 font-medium transition-all duration-200"
                      onClick={() => setShowDropdown(false)}
                    >
                      🚚 Logistics
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/products"
                className="btn btn-ghost font-semibold text-gray-700 hover:text-primary-700"
              >
                Products
              </Link>

              <Link 
                to={dashboardPath}
                className="btn btn-primary font-semibold"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="btn btn-secondary font-semibold"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </>
          )}
        </div>

        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost p-2 rounded-xl"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-large border-b border-gray-200/60 flex flex-col gap-3 p-6 md:hidden z-40">
            {!user ? (
              <>
                <Link
                  to="/products"
                  className="btn btn-ghost justify-start text-lg font-semibold py-4 rounded-xl"
                  onClick={closeAllMenus}
                >
                  Browse Products
                </Link>

                <Link
                  to="/login"
                  className="btn btn-primary justify-center text-lg font-semibold py-4 rounded-xl"
                  onClick={closeAllMenus}
                >
                  <User className="w-5 h-5 mr-2" />
                  Login
                </Link>

                <div ref={dropdownRef} className="flex flex-col gap-3">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="btn btn-accent justify-center text-lg font-semibold py-4 rounded-xl"
                  >
                    Get Started
                    <svg 
                      className={`w-5 h-5 ml-2 transform transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="bg-gray-50 rounded-2xl p-3 flex flex-col gap-2 border border-gray-200/60">
                      <Link
                        to="/register?role=seller"
                        className="px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl font-medium transition-all duration-200 border border-transparent hover:border-primary-200/30"
                        onClick={closeAllMenus}
                      >
                        🚜 Become a Seller
                      </Link>
                      <Link
                        to="/register?role=buyer"
                        className="px-4 py-3 text-gray-700 hover:bg-success-50 hover:text-success-700 rounded-xl font-medium transition-all duration-200 border border-transparent hover:border-success-200/30"
                        onClick={closeAllMenus}
                      >
                        🛒 Join as Buyer
                      </Link>
                      <Link
                        to="/register?role=logistics"
                        className="px-4 py-3 text-gray-700 hover:bg-accent-50 hover:text-accent-700 rounded-xl font-medium transition-all duration-200 border border-transparent hover:border-accent-200/30"
                        onClick={closeAllMenus}
                      >
                        🚚 Logistics Partner
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/products"
                  className="btn btn-ghost justify-start text-lg font-semibold py-4 rounded-xl"
                  onClick={closeAllMenus}
                >
                  Products
                </Link>

                <Link
                  to={dashboardPath}
                  className="btn btn-primary justify-center text-lg font-semibold py-4 rounded-xl"
                  onClick={closeAllMenus}
                >
                  <LayoutDashboard className="w-5 h-5 mr-2" />
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn btn-secondary justify-center text-lg font-semibold py-4 rounded-xl"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}