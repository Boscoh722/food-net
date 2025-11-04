import { useState } from 'react';

export default function Register() {
  const [role, setRole] = useState('buyer');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto card">
        <h1 className="text-2xl font-bold text-centre mb-6">Create Account</h1>
        <form className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full px-4 py-2 border rounded" />
          <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded" />
          <input type="password" placeholder="Password" className="w-full px-4 py-2 border rounded" />
          
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="logistics">Logistics</option>
          </select>

          <button type="submit" className="btn-primary w-full">Register</button>
        </form>
      </div>
    </div>
  );
}
