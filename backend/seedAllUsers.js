// backend/seedAllUsers.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const users = [
  // ==================== SELLERS ====================
  {
    name: "Fresh Farm Produce",
    email: "freshfarm@foodnet.com",
    password: "password123",
    role: "seller",
    phone: "+254700111111",
    idNumber: "12345678",
    location: "Nairobi",
    approved: true,
    isActive: true
  },
  {
    name: "Green Valley Farmers",
    email: "greenvalley@foodnet.com",
    password: "password123",
    role: "seller",
    phone: "+254700222222",
    idNumber: "23456789",
    location: "Nakuru",
    approved: true,
    isActive: true
  },
  {
    name: "Organic Harvest Co.",
    email: "organicharvest@foodnet.com",
    password: "password123",
    role: "seller",
    phone: "+254700333333",
    idNumber: "34567890",
    location: "Eldoret",
    approved: true,
    isActive: true
  },
  {
    name: "Farm Fresh Direct",
    email: "farmfresh@foodnet.com",
    password: "password123",
    role: "seller",
    phone: "+254700444444",
    idNumber: "45678901",
    location: "Kisumu",
    approved: true,
    isActive: true
  },
  {
    name: "Agri-Produce Kenya",
    email: "agriproduce@foodnet.com",
    password: "password123",
    role: "seller",
    phone: "+254700555555",
    idNumber: "56789012",
    location: "Mombasa",
    approved: true,
    isActive: true
  },

  // ==================== BUYERS ====================
  {
    name: "John Kamau",
    email: "john.kamau@foodnet.com",
    password: "password123",
    role: "buyer",
    phone: "+254711111111",
    idNumber: "11111111",
    location: "Nairobi",
    approved: true,
    isActive: true
  },
  {
    name: "Mary Wanjiku",
    email: "mary.wanjiku@foodnet.com",
    password: "password123",
    role: "buyer",
    phone: "+254711222222",
    idNumber: "22222222",
    location: "Nakuru",
    approved: true,
    isActive: true
  },
  {
    name: "David Ochieng",
    email: "david.ochieng@foodnet.com",
    password: "password123",
    role: "buyer",
    phone: "+254711333333",
    idNumber: "33333333",
    location: "Kisumu",
    approved: true,
    isActive: true
  },
  {
    name: "Sarah Mwende",
    email: "sarah.mwende@foodnet.com",
    password: "password123",
    role: "buyer",
    phone: "+254711444444",
    idNumber: "44444444",
    location: "Eldoret",
    approved: true,
    isActive: true
  },
  {
    name: "James Kipchoge",
    email: "james.kipchoge@foodnet.com",
    password: "password123",
    role: "buyer",
    phone: "+254711555555",
    idNumber: "55555555",
    location: "Mombasa",
    approved: true,
    isActive: true
  },

  // ==================== LOGISTICS ====================
  {
    name: "Kenya Logistics Express",
    email: "logistics.express@foodnet.com",
    password: "password123",
    role: "logistics",
    phone: "+254722111111",
    location: "Nairobi",
    reach: "Nationwide",
    vehicleType: "Refrigerated Truck",
    capacity: "5 tons",
    isAvailable: true,
    approved: true,
    isActive: true,
    services: ["refrigerated", "express"]
  },
  {
    name: "Farm Fresh Transport",
    email: "farmfresh.transport@foodnet.com",
    password: "password123",
    role: "logistics",
    phone: "+254722222222",
    location: "Nakuru",
    reach: "Regional",
    vehicleType: "Pickup Truck",
    capacity: "2 tons",
    isAvailable: true,
    approved: true,
    isActive: true,
    services: ["general", "bulk"]
  },
  {
    name: "Agri-Logistics Kenya",
    email: "agri.logistics@foodnet.com",
    password: "password123",
    role: "logistics",
    phone: "+254722333333",
    location: "Mombasa",
    reach: "Coastal Region",
    vehicleType: "Delivery Van",
    capacity: "1 ton",
    isAvailable: true,
    approved: true,
    isActive: true,
    services: ["express", "general"]
  },
  {
    name: "Swift Delivery Services",
    email: "swift.delivery@foodnet.com",
    password: "password123",
    role: "logistics",
    phone: "+254722444444",
    location: "Eldoret",
    reach: "Rift Valley",
    vehicleType: "Box Truck",
    capacity: "3 tons",
    isAvailable: true,
    approved: true,
    isActive: true,
    services: ["general", "express"]
  },
  {
    name: "Coastal Cargo Movers",
    email: "coastal.cargo@foodnet.com",
    password: "password123",
    role: "logistics",
    phone: "+254722555555",
    location: "Mombasa",
    reach: "Coastal & Eastern",
    vehicleType: "Refrigerated Van",
    capacity: "1.5 tons",
    isAvailable: true,
    approved: true,
    isActive: true,
    services: ["refrigerated", "general"]
  }
];



const seedAllUsers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI_PROD;
    if (!mongoUri) throw new Error('MONGODB_URI is missing in .env');

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    console.log('🗑 Clearing existing users...');
    await User.deleteMany({});

    const results = { sellers: { created: 0, skipped: 0 }, buyers: { created: 0, skipped: 0 }, logistics: { created: 0, skipped: 0 } };

    for (const userData of users) {
      const roleKeyMap = {
  seller: 'sellers',
  buyer: 'buyers',
  logistics: 'logistics'
};
      const roleKey = roleKeyMap[userData.role];
      if (!results[roleKey]) results[roleKey] = { created: 0, skipped: 0 };

      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        results[roleKey].skipped++;
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 12);
      await new User({ ...userData, password: hashedPassword }).save();
      results[roleKey].created++;
    }

    console.log('🎉 SEEDING SUMMARY:', results);

    await mongoose.disconnect();
    console.log('✨ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedAllUsers();
