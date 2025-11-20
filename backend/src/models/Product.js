import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Product name must be at least 2 characters'],
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required'],
    validate: {
      validator: async function(categoryId) {
        if (!mongoose.Types.ObjectId.isValid(categoryId)) return false;
        const category = await mongoose.model('Category').findOne({ 
          _id: categoryId, 
          isActive: true 
        });
        return !!category;
      },
      message: 'Invalid or inactive category'
    }
  },
  categoryName: {
    type: String,
    required: true,
    trim: true
  },
  categorySlug: {
    type: String,
    required: true,
    lowercase: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(price) {
        return price === 0 || price > 0; 
      },
      message: 'Price must be a positive number or zero'
    }
  },
  unit: {
    type: String,
    required: [true, 'Product unit is required'],
    trim: true,
    enum: {
      values: ['kg', 'g', 'lb', 'oz', 'piece', 'bunch', 'bag', 'box', 'crate', 'other'],
      message: 'Invalid unit type'
    }
  },
  quantityInStock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock quantity cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Stock quantity must be an integer'
    }
  },
  minOrderQuantity: {
    type: Number,
    default: 1,
    min: [1, 'Minimum order quantity must be at least 1'],
    validate: {
      validator: Number.isInteger,
      message: 'Minimum order quantity must be an integer'
    }
  },
  maxOrderQuantity: {
    type: Number,
    validate: {
      validator: function(value) {
        if (value === undefined || value === null) return true;
        return Number.isInteger(value) && value >= this.minOrderQuantity;
      },
      message: 'Maximum order quantity must be an integer and greater than minimum order quantity'
    }
  },
  isNegotiable: {
    type: Boolean,
    default: false
  },
  isOrganic: {
    type: Boolean,
    default: false
  },
  harvestDate: {
    type: Date,
    validate: {
      validator: function(date) {
        if (!date) return true; 
        return date <= new Date();
      },
      message: 'Harvest date cannot be in the future'
    }
  },
  expiryDate: {
    type: Date,
    validate: {
      validator: function(date) {
        if (!date) return true; 
        return date > new Date();
      },
      message: 'Expiry date must be in the future'
    }
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
    altText: {
      type: String,
      maxlength: [100, 'Alt text cannot exceed 100 characters'],
      default: ''
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  location: { 
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(arr) {
          return Array.isArray(arr) && 
                 arr.length === 2 && 
                 arr.every(n => typeof n === 'number' && !isNaN(n)) &&
                 arr[0] >= -180 && arr[0] <= 180 && // longitude
                 arr[1] >= -90 && arr[1] <= 90;     // latitude
        },
        message: 'Coordinates must be valid [longitude, latitude] array'
      }
    }
  },
  approved: {
    type: Boolean,
    default: false,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5']
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    },
    distribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  orderCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
ProductSchema.index({ coordinates: '2dsphere' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ approved: 1, isActive: 1 });
ProductSchema.index({ seller: 1, approved: 1 });
ProductSchema.index({ 'rating.average': -1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ quantityInStock: 1 });
ProductSchema.index({ categorySlug: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ harvestDate: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for low stock alert
ProductSchema.virtual('isLowStock').get(function() {
  return this.quantityInStock < 10; // Adjust threshold as needed
});

// Virtual for available quantity (considering pending orders)
ProductSchema.virtual('availableQuantity').get(function() {
  // This would need to be calculated based on pending orders
  return this.quantityInStock;
});

// Pre-save middleware to sync category name and slug
ProductSchema.pre('save', async function(next) {
  if (this.isModified('category') || !this.categoryName || !this.categorySlug) {
    try {
      const category = await mongoose.model('Category').findById(this.category);
      if (category) {
        this.categoryName = category.name;
        this.categorySlug = category.slug;
      } else {
        throw new Error('Referenced category not found');
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Pre-validate middleware to ensure category exists
ProductSchema.pre('validate', async function(next) {
  if (this.isModified('category') && this.category) {
    const category = await mongoose.model('Category').findOne({ 
      _id: this.category, 
      isActive: true 
    });
    if (!category) {
      return next(new Error('Invalid or inactive category'));
    }
  }
  next();
});

// Static method to find products by category slug
ProductSchema.statics.findByCategorySlug = function(categorySlug, options = {}) {
  const query = { 
    categorySlug, 
    approved: true, 
    isActive: true,
    quantityInStock: { $gt: 0 }
  };
  
  return this.find(query)
    .populate('seller', 'name rating avatar')
    .populate('category', 'name slug icon')
    .sort(options.sort || { createdAt: -1 })
    .limit(options.limit || 100)
    .skip(options.skip || 0);
};

// Static method to find nearby products
ProductSchema.statics.findNearby = function(coordinates, maxDistance = 50000, options = {}) {
  return this.find({
    coordinates: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance 
      }
    },
    approved: true,
    isActive: true,
    quantityInStock: { $gt: 0 },
    ...options
  });
};

// Instance method to update stock
ProductSchema.methods.updateStock = async function(quantityChange) {
  const newQuantity = this.quantityInStock + quantityChange;
  
  if (newQuantity < 0) {
    throw new Error('Insufficient stock');
  }
  
  this.quantityInStock = newQuantity;
  return await this.save();
};

// Instance method to update rating
ProductSchema.methods.updateRating = async function(newRating, oldRating = null) {
  const rating = this.rating;
  
  if (oldRating) {
    // Update existing rating
    rating.distribution[oldRating]--;
    rating.count--;
    rating.average = ((rating.average * rating.count) - oldRating) / (rating.count || 1);
  }
  
  // Add new rating
  rating.distribution[newRating]++;
  rating.count++;
  rating.average = ((rating.average * (rating.count - 1)) + newRating) / rating.count;
  
  return await this.save();
};

// Query helper for active products
ProductSchema.query.active = function() {
  return this.where({ 
    approved: true, 
    isActive: true,
    quantityInStock: { $gt: 0 }
  });
};

// Query helper for seller's products
ProductSchema.query.bySeller = function(sellerId) {
  return this.where({ seller: sellerId });
};

// Query helper for category
ProductSchema.query.byCategory = function(categoryId) {
  return this.where({ category: categoryId });
};

export default mongoose.model('Product', ProductSchema);