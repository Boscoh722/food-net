import mongoose from 'mongoose';
import dotenv from 'dotenv';

// 🛑 CORRECTION: Removed './src/' from the paths 
// Assuming 'config' and 'models' are direct subfolders of 'backend'
import connectDB from './config/db.js'; 
import Category from './models/Category.js'; 

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

// --- CATEGORY DATA ---
const categories = [
  { name: 'Fruits',     slug: 'fruits',     icon: '🍎' },
  { name: 'Vegetables', slug: 'vegetables', icon: '🥕' },
  { name: 'Grains',     slug: 'grains',     icon: '🌾' },
  { name: 'Dairy',      slug: 'dairy',      icon: '🥛' },
  { name: 'Meats',      slug: 'meats',      icon: '🥩' },
  { name: 'Fish',       slug: 'fish',       icon: '🐟' },
  { name: 'Spices',     slug: 'spices',     icon: '🌶️' },
  { name: 'Tubers',     slug: 'tubers',     icon: '🥔' },
  { name: 'Nuts',       slug: 'nuts',       icon: '🥜' },
  { name: 'Herbs',      slug: 'herbs',      icon: '🌿' },
  { name: 'Other',      slug: 'other',      icon: '📦' },
];

const importData = async () => {
  try {
    console.log('Clearing existing categories...');
    await Category.deleteMany();
    
    console.log('Inserting new categories...');
    await Category.insertMany(categories);

    console.log('✅ Data Imported! Categories seeded successfully.');
    process.exit();
  } catch (error) {
    console.error(`❌ Error importing data: ${error.message}`);
    console.error('Check your MongoDB connection and environment variables.');
    process.exit(1);
  }
};

// ... other code (destroyData function) ...

if (process.argv[2] === '-d') {
  // Call destroyData() here if you have it
} else {
  importData();
}
