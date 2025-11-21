// seedCategories.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import slugify from 'slugify';
import Category from './src/models/Category.js';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://boscoh:Boscoh@foodnet.2padhe1.mongodb.net/foodnet_db?retryWrites=true&w=majority";
const ADMIN_USER_ID = "691eb0856a269a4b0560fd3f"

console.log('🚀 Starting category seeder...');

// Function to generate unique slug manually
const generateUniqueSlug = async (name, existingSlugs = new Set()) => {
  let baseSlug = slugify(name, { 
    lower: true, 
    strict: true,
    trim: true
  });
  
  let candidateSlug = baseSlug;
  let count = 0;
  const maxAttempts = 100;

  while (count < maxAttempts) {
    // Check if this slug already exists in our current batch
    if (!existingSlugs.has(candidateSlug)) {
      // Check if it exists in the database
      const existing = await Category.findOne({ slug: candidateSlug });
      if (!existing) {
        return candidateSlug;
      }
    }

    count++;
    candidateSlug = `${baseSlug}-${count}`;
  }

  throw new Error(`Could not generate unique slug for: ${name}`);
};

// Kenyan Agricultural Categories Data - Only Parent Categories
const categories = [
  {
    name: 'Fresh Fruits',
    icon: '🍍',
    description: 'Seasonal fresh fruits from Kenyan farms',
    sortOrder: 1
  },
  {
    name: 'Vegetables',
    icon: '🥬',
    description: 'Fresh leafy and traditional vegetables',
    sortOrder: 2
  },
  {
    name: 'Cereals & Grains',
    icon: '🌾',
    description: 'Maize, wheat, rice and other staple grains',
    sortOrder: 3
  },
  {
    name: 'Legumes & Pulses',
    icon: '🫘',
    description: 'Beans, peas, lentils and other pulses',
    sortOrder: 4
  },
  {
    name: 'Dairy Products',
    icon: '🥛',
    description: 'Fresh milk, yogurt, mursik and dairy products',
    sortOrder: 5
  },
  {
    name: 'Meat & Poultry',
    icon: '🍗',
    description: 'Fresh beef, chicken, goat and other meats',
    sortOrder: 6
  },
  {
    name: 'Fish & Seafood',
    icon: '🐟',
    description: 'Fresh fish from lakes and seafood',
    sortOrder: 7
  },
  {
    name: 'Roots & Tubers',
    icon: '🥔',
    description: 'Potatoes, sweet potatoes, cassava, yams',
    sortOrder: 8
  },
  {
    name: 'Spices & Herbs',
    icon: '🌿',
    description: 'Traditional spices, herbs and seasonings',
    sortOrder: 9
  },
  {
    name: 'Nuts & Seeds',
    icon: '🥜',
    description: 'Groundnuts, sunflower seeds, macadamia nuts',
    sortOrder: 10
  }
];

const seedCategories = async () => {
  try {
    console.log('\n🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing categories
    console.log('🗑️ Deleting all existing categories...');
    const deleteResult = await Category.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} existing categories`);

    const usedSlugs = new Set();
    const results = {
      categories: 0,
      errors: []
    };

    // Seed categories
    console.log('\n🌱 Seeding categories...');
    for (const categoryData of categories) {
      try {
        // Generate slug manually
        const slug = await generateUniqueSlug(categoryData.name, usedSlugs);
        usedSlugs.add(slug);

        const category = new Category({
          ...categoryData,
          slug: slug,
          createdBy: new mongoose.Types.ObjectId(ADMIN_USER_ID)
        });

        const savedCategory = await category.save();
        results.categories++;
        console.log(`✅ Created: ${savedCategory.name} (slug: ${savedCategory.slug})`);
      } catch (error) {
        results.errors.push(`Category: ${categoryData.name} - ${error.message}`);
        console.error(`❌ Failed to create "${categoryData.name}":`, error.message);
      }
    }

    // Display final results
    console.log('\n🎉 SEEDING COMPLETED!');
    console.log('=' .repeat(50));
    console.log('📊 RESULTS:');
    console.log(`   ✅ Categories created: ${results.categories}`);
    console.log(`   ❌ Errors: ${results.errors.length}`);
    
    if (results.errors.length > 0) {
      console.log('\n⚠️ ERRORS:');
      results.errors.forEach(error => console.log(`   - ${error}`));
    }

    // Display the created categories
    console.log('\n📋 ALL CATEGORIES:');
    const allCategories = await Category.find().sort({ sortOrder: 1 });
    
    allCategories.forEach(category => {
      console.log(`   ${category.icon} ${category.name}`);
    });

  } catch (error) {
    console.error('❌ FATAL ERROR:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔗 Database connection closed');
  }
};

// Run the seeder
seedCategories();