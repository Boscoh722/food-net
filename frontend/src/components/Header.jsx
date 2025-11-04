import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const [user] = useState(null); // Replace with auth context later

  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Food-Net</Link>
        <nav className="space-x-6">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/products" className="hover:underline">Products</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <button className="hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
