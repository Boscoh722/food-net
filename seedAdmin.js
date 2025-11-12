import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config({ path: './backend/.env' });

// Define User Schema inline (in case model import fails)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['donor', 'recipient', 'admin'], default: 'donor' },
  phone: String,
  address: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

const seedAdmin = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('URI:', process.env.MONGO_URI ? 'Found' : 'Missing');

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    // Connect with increased timeouts
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ Connected to MongoDB Atlas successfully!');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@foodnet.com' });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      await mongoose.connection.close();
      console.log('🔒 Connection closed');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@boscoh', salt);

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@foodnet.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+254700000000',
      address: 'Nairobi, Kenya'
    });

    console.log('✨ Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: admin123');
    console.log('👤 Role:', admin.role);

    await mongoose.connection.close();
    console.log('🔒 Connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    
    process.exit(1);
  }
};

// Run the seeder
seedAdmin();