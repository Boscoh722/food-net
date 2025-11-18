import { Users, Target, Leaf, Truck, ShoppingCart, Heart } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Leaf,
      title: 'Empowering Farmers',
      description: 'Direct market access for farmers to sell their fresh produce at fair prices without intermediaries.'
    },
    {
      icon: ShoppingCart,
      title: 'Convenient Shopping',
      description: 'Fresh, quality agricultural products delivered conveniently to buyers across the region.'
    },
    {
      icon: Truck,
      title: 'Logistical Excellence',
      description: 'Reliable delivery network ensuring fresh produce reaches customers in optimal condition.'
    },
    {
      icon: Users,
      title: 'Job Creation',
      description: 'Creating employment opportunities in logistics, technology, and agricultural sectors.'
    },
    {
      icon: Target,
      title: 'Food Security',
      description: 'Working towards national self-sufficiency by strengthening local agricultural supply chains.'
    },
    {
      icon: Heart,
      title: 'Community Focus',
      description: 'Building sustainable communities through agricultural empowerment and economic growth.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Farmers Empowered' },
    { number: '10,000+', label: 'Happy Customers' },
    { number: '50+', label: 'Logistics Partners' },
    { number: '100+', label: 'Communities Served' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="section-container py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Food-Net</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leading the agricultural revolution through technology, connecting farmers directly with consumers, 
            and building a self-sufficient food ecosystem for Kenya.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card p-6">
            <div className="bg-gradient-to-r from-primary-100 to-primary-200 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              To revolutionize Kenya's agricultural sector by providing farmers with direct market access, 
              consumers with fresh quality produce, and creating sustainable employment opportunities through 
              an integrated technology platform.
            </p>
          </div>
          
          <div className="card p-6">
            <div className="bg-gradient-to-r from-success-100 to-success-200 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6 text-success-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600">
              To be East Africa's leading agri-tech platform, ensuring food self-sufficiency while 
              empowering farming communities and providing convenient access to fresh agricultural 
              products for every household.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="card p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gradient mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">What We Do</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="card-hover p-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  index % 6 === 0 ? 'bg-gradient-to-r from-primary-100 to-primary-200' :
                  index % 6 === 1 ? 'bg-gradient-to-r from-success-100 to-success-200' :
                  index % 6 === 2 ? 'bg-gradient-to-r from-accent-100 to-accent-200' :
                  index % 6 === 3 ? 'bg-gradient-to-r from-purple-100 to-purple-200' :
                  index % 6 === 4 ? 'bg-gradient-to-r from-blue-100 to-blue-200' :
                  'bg-gradient-to-r from-pink-100 to-pink-200'
                }`}>
                  <feature.icon className={`w-6 h-6 ${
                    index % 6 === 0 ? 'text-primary-600' :
                    index % 6 === 1 ? 'text-success-600' :
                    index % 6 === 2 ? 'text-accent-600' :
                    index % 6 === 3 ? 'text-purple-600' :
                    index % 6 === 4 ? 'text-blue-600' :
                    'text-pink-600'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="card p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Food-Net was born from a simple observation: while Kenya has abundant agricultural potential, 
              farmers struggle to reach markets and consumers face challenges accessing fresh, affordable produce. 
              The traditional supply chain was fragmented, inefficient, and often unfair to the hardworking farmers 
              who form the backbone of our economy.
            </p>
            <p>
              We set out to bridge this gap by leveraging technology to create a seamless platform that connects 
              farmers directly with buyers. Our integrated approach includes not just the marketplace, but also 
              logistical support to ensure produce reaches customers in perfect condition, and job creation 
              opportunities throughout the ecosystem.
            </p>
            <p>
              Today, we're proud to be at the forefront of Kenya's agri-tech revolution, working tirelessly 
              towards our vision of a self-sufficient nation where every farmer thrives and every family has 
              access to fresh, quality food.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}