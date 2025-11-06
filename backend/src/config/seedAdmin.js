import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const adminData = {
  name: 'Admin',
  email: 'admin@foodnet.com',
  password: 'Admin@boscoh.com',
  role: 'admin',
};

async function seedAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const existing = await User.findOne({ email: adminData.email });
  if (existing) {
    console.log('Admin user already exists.');
    process.exit(0);
  }
  const admin = new User(adminData);
  await admin.save();
  console.log('Admin user created:', admin.email);
  process.exit(0);
}

seedAdmin().catch(e => { console.error(e); process.exit(1); });
