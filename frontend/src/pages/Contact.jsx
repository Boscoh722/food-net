import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: '+254715640443',
      description: 'Mon to Fri 8am to 6pm'
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'boscoh@foodnet.com',
      description: 'Send us your query anytime'
    },
    {
      icon: MapPin,
      title: 'Office',
      details: 'Nairobi, Kenya',
      description: 'Headquarters location'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Monday - Friday',
      description: '8:00 AM - 6:00 PM EAT'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for your message! We will get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with our team. We're here to help farmers, buyers, and logistics partners 
            succeed in the agricultural ecosystem.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <item.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-900 font-medium">{item.details}</p>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Person */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Primary Contact Person</h3>
                <p className="text-gray-900 font-medium">Boscoh Otieno</p>
                <p className="text-gray-600 text-sm">Head of Customer Relations</p>
              </div>
            </div>

            {/* Support Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">How Can We Help You?</h3>
              <div className="space-y-3 text-gray-600">
                <p><strong>For Farmers:</strong> Get assistance with product listing, pricing, and market access</p>
                <p><strong>For Buyers:</strong> Help with orders, delivery, and product inquiries</p>
                <p><strong>For Logistics:</strong> Partnership opportunities and delivery coordination</p>
                <p><strong>General Inquiries:</strong> Platform features, partnerships, and collaborations</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  placeholder="What is this regarding?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 resize-none"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Food-Net?</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Farmers First</h3>
              <p className="text-gray-600">Direct market access and fair pricing for your produce</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Quality Assured</h3>
              <p className="text-gray-600">Fresh, quality products with reliable delivery</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Community Driven</h3>
              <p className="text-gray-600">Building sustainable agricultural communities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}