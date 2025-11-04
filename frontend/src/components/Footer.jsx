import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2025 Food-Net. All rights reserved.</p>
        <div className="space-x-4 mt-2">
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
