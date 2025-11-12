import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './backend/src/config/db.js'; 
import Category from './backend/src/models/Category.js'; 

// Load env vars from a .env file
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

/**
 * @desc Imports sample data into the database
 */
const importData = async () => {
  try {
    console.log('Clearing existing categories...');
    await Category.deleteMany();
    
    console.log('Inserting new categories...');
    await Category.insertMany(categories);

    console.log('✅ Data Imported! Categories seeded successfully.');
    // Exit process after successful import
    process.exit(); 
  } catch (error) {
    console.error(`❌ Error importing data: ${error.message}`);
    console.error('Check your MongoDB connection and environment variables.');
    // Exit process with failure code
    process.exit(1);
  }
};

/**
 * @desc Destroys all category data in the database
 */
const destroyData = async () => {
  try {
    console.log('🗑️ Destroying all Category data...');
    await Category.deleteMany();

    console.log('🔥 Data Successfully Destroyed!');
    // Exit process after successful destroy
    process.exit();
  } catch (error) {
    console.error(`❌ Error destroying data: ${error.message}`);
    process.exit(1);
  }
};


if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
