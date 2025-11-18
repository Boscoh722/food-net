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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Food-Net</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leading the agricultural revolution through technology, connecting farmers directly with consumers, 
            and building a self-sufficient food ecosystem for Kenya.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <Target className="w-12 h-12 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              To revolutionize Kenya's agricultural sector by providing farmers with direct market access, 
              consumers with fresh quality produce, and creating sustainable employment opportunities through 
              an integrated technology platform.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <Leaf className="w-12 h-12 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600">
              To be East Africa's leading agri-tech platform, ensuring food self-sufficiency while 
              empowering farming communities and providing convenient access to fresh agricultural 
              products for every household.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
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
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <feature.icon className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
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