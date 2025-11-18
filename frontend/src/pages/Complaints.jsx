import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { 
  MessageSquare, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft,
  Shield,
  HeadphonesIcon
} from 'lucide-react';

export default function Complaints() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaint.trim()) {
      setError('Please describe your issue before submitting.');
      return;
    }

    if (!user) {
      alert('Please login to submit a complaint');
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await api.post('/complaints/my', { message: complaint });
      setSubmitted(true);
      setComplaint('');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-6 py-10">
        
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-amber-600 font-bold hover:text-amber-700 transition-all group"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="text-right">
            <p className="text-sm text-gray-500 uppercase tracking-wider">Need Help?</p>
            <p className="text-lg font-bold text-amber-600">We're here 24/7</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          
          {/* Main Complaint Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-white">
              <div className="flex items-center justify-center gap-4">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <MessageSquare className="w-12 h-12" />
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold">Send a Complaint</h1>
                  <p className="text-white/90 mt-2 text-lg">Your voice matters. We'll respond within 24 hours.</p>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-8 lg:p-12">
              
              {/* Success Message */}
              {submitted && (
                <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-2xl flex items-center gap-4 text-green-800">
                  <CheckCircle2 className="w-10 h-10 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-xl">Complaint Submitted Successfully!</p>
                    <p className="text-green-700">Our team is reviewing it. Ticket ID: #CMP-{Math.floor(1000 + Math.random() * 9000)}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center gap-4 text-red-800">
                  <AlertCircle className="w-10 h-10 text-red-600 flex-shrink-0" />
                  <p className="font-bold">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Textarea with Floating Label */}
                <div className="relative">
                  <textarea
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    placeholder=" "
                    rows="8"
                    className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-300 resize-none peer bg-gray-50/50"
                    required
                  />
                  <label className="absolute left-6 top-5 text-gray-500 text-lg pointer-events-none transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500 peer-focus:-top-4 peer-focus:text-amber-600 peer-focus:text-sm peer-focus:bg-white peer-focus:px-2">
                    Describe your issue in detail...
                  </label>
                  <p className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    All complaints are confidential and handled by our support team.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || submitted}
                  className="w-full px-8 py-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-xl rounded-2xl shadow-xl hover:from-amber-600 hover:to-orange-700 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-7 w-7 border-4 border-white border-t-transparent"></div>
                      Submitting Complaint...
                    </>
                  ) : (
                    <>
                      <Send className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
                      Submit Complaint
                    </>
                  )}
                </button>
              </form>

              {/* Support Info */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200">
                  <HeadphonesIcon className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                  <p className="font-bold text-gray-800">Live Chat</p>
                  <p className="text-sm text-gray-600">Available 24/7</p>
                </div>
                <div className="p-6 bg-green-50 rounded-2xl border border-green-200">
                  <MessageSquare className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <p className="font-bold text-gray-800">Email Support</p>
                  <p className="text-sm text-gray-600">support@market.com</p>
                </div>
                <div className="p-6 bg-purple-50 rounded-2xl border border-purple-200">
                  <Shield className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                  <p className="font-bold text-gray-800">100% Secure</p>
                  <p className="text-sm text-gray-600">Your data is protected</p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Action Button (Mobile) */}
          <button
            onClick={handleSubmit}
            disabled={loading || !complaint.trim()}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-amber-500 to-orange-600 text-white p-5 rounded-full shadow-2xl hover:shadow-amber-500/50 transform hover:scale-110 transition-all duration-300 flex items-center justify-center lg:hidden disabled:opacity-50"
            aria-label="Submit Complaint"
          >
            <Send className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
}