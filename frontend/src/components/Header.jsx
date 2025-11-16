import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Header() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <Link 
          to="/" 
          className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          FoodNet
        </Link>

        {/* RIGHT SIDE BUTTONS */}
        <div className="flex items-center gap-4">

          {/* If NO USER IS LOGGED IN */}
          {!user ? (
            <>
              {/* PRODUCTS BUTTON — MATCHED */}
              <Link
                to="/products"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg 
                hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Products
              </Link>

              {/* LOGIN BUTTON — MATCHED */}
              <Link
                to="/login"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg 
                hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Login
              </Link>

              {/* GET STARTED BUTTON WITH DROPDOWN */}
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg 
                  hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Get Started
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50">
                    <Link 
                      to="/register?role=seller"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Seller
                    </Link>
                    <Link 
                      to="/register?role=buyer"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Buyer
                    </Link>
                    <Link 
                      to="/register?role=logistics"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Logistics
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            
            /* IF USER IS LOGGED IN */
            <>
              {/* DASHBOARD */}
              <Link 
                to="/dashboard"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg 
                hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Dashboard
              </Link>

              {/* LOGOUT */}
              <button
                onClick={logout}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg 
                hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </nav>
    </header>
  );
}
