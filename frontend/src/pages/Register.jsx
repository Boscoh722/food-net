import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'buyer', phone: '', idNumber: ''
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto card">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Name" required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2 border rounded" />
          <input type="email" placeholder="Email" required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2 border rounded" />
          <input type="password" placeholder="Password" required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2 border rounded" />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="logistics">Logistics</option>
          </select>
          {(form.role === 'seller' || form.role === 'buyer') && (
            <>
              <input type="text" placeholder="Phone" required
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded" />
              <input type="text" placeholder="ID Number (hidden)" required
                onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                className="w-full px-4 py-2 border rounded" />
            </>
          )}
          {form.role === 'logistics' && (
            <>
              <input type="text" placeholder="Location" required
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-2 border rounded" />
              <input type="text" placeholder="Reach (e.g. Nationwide)" required
                onChange={(e) => setForm({ ...form, reach: e.target.value })}
                className="w-full px-4 py-2 border rounded" />
            </>
          )}
          <button type="submit" className="btn-primary w-full">Register</button>
        </form>
      </div>
    </div>
  );
}
