import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
    index: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [20, 'Description must be at least 20 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    trim: true
  },
  category: {
    type: String,
    enum: [
      'fruits', 'vegetables', 'grains', 'dairy', 'meats',
      'fish', 'spices', 'tubers', 'nuts', 'herbs', 'other'
    ],
    required: [true, 'Category is required'],
    lowercase: true,
    index: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(v) {
        return v > 0 || this.isNegotiable;
      },
      message: 'Price must be greater than 0 if not negotiable'
    }
  },
  unit: {
    type: String,
    enum: [
      'kg', 'gram', 'ton', 'tonne',
      'liter', 'milliliter',
      'piece', 'dozen', 'crate', 'sack',
      'bag', 'bunch', 'basket', 'tray', 'head'
    ],
    required: [true, 'Unit of measurement is required'],
    lowercase: true,
    trim: true
  },
  quantityInStock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  isNegotiable: {
    type: Boolean,
    default: false
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    index: true
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  approved: {
    type: Boolean,
    default: false,
    index: true
  },
  isAvailable: {
    type: Boolean,
    default: true,
    index: true
  },
  harvestDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  totalSales: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// === GEO INDEX (for map queries) ===
ProductSchema.index({ coordinates: '2dsphere' });

// === TEXT SEARCH INDEX ===
ProductSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
  category: 'text',
  location: 'text'
});

// === COMPOUND INDEXES ===
ProductSchema.index({ category: 1, approved: 1, isAvailable: 1 });
ProductSchema.index({ price: 1, isAvailable: 1 });
ProductSchema.index({ seller: 1, createdAt: -1 });

// === VIRTUALS ===

// Formatted price with unit
ProductSchema.virtual('formattedPrice').get(function() {
  const unitMap = {
    'kg': 'kg', 'gram': 'g', 'ton': 'ton', 'liter': 'L',
    'milliliter': 'ml', 'piece': 'pc', 'dozen': 'dozen'
  };
  const displayUnit = unitMap[this.unit] || this.unit;
  return `KSh ${this.price?.toLocaleString()} / ${displayUnit}`;
});

// Primary image URL
ProductSchema.virtual('primaryImageUrl').get(function() {
  const primary = this.images?.find(img => img.isPrimary);
  return primary?.url || this.images?.[0]?.url || '/placeholder.jpg';
});

// Stock status
ProductSchema.virtual('inStock').get(function() {
  return this.isAvailable && this.quantityInStock > 0;
});

ProductSchema.virtual('stockStatus').get(function() {
  if (!this.isAvailable) return 'Unavailable';
  if (this.quantityInStock === 0) return 'Out of Stock';
  if (this.quantityInStock <= 10) return 'Low Stock';
  return 'In Stock';
});

// Freshness level
ProductSchema.virtual('freshness').get(function() {
  if (!this.harvestDate) return 'unknown';
  const daysOld = Math.floor((Date.now() - new Date(this.harvestDate)) / (1000 * 60 * 60 * 24));
  if (daysOld <= 2) return 'just-harvested';
  if (daysOld <= 5) return 'fresh';
  if (daysOld <= 10) return 'good';
  return 'mature';
});

// === MIDDLEWARE ===

// Ensure primary image is set
ProductSchema.pre('save', function(next) {
  if (this.isModified('images') || this.isNew) {
    if (this.images && this.images.length > 0) {
      const hasPrimary = this.images.some(img => img.isPrimary);
      if (!hasPrimary) {
        this.images[0].isPrimary = true;
      }
    }
  }
  next();
});

// Normalize unit
ProductSchema.pre('save', function(next) {
  if (this.unit) {
    const map = {
      'kgs': 'kg', 'kilogram': 'kg', 'kilograms': 'kg',
      'g': 'gram', 'litre': 'liter', 'l': 'liter',
      'ml': 'milliliter', 'pc': 'piece', 'pcs': 'piece',
      'tonne': 'ton'
    };
    this.unit = map[this.unit.toLowerCase()] || this.unit.toLowerCase();
  }
  next();
});

// Auto-set coordinates if location is known (optional enhancement)
// You can expand this with a geocoding service
ProductSchema.pre('save', async function(next) {
  if (this.isModified('location') && !this.coordinates?.coordinates?.length) {
    // Example: Nairobi fallback
    if (this.location.toLowerCase().includes('nairobi')) {
      this.coordinates = {
        type: 'Point',
        coordinates: [36.8219, -1.2921] // [lng, lat]
      };
    }
  }
  next();
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;