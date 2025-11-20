import mongoose from 'mongoose';
import slugify from 'slugify';

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
      minlength: [2, 'Category name must be at least 2 characters'],
      maxlength: [50, 'Category name cannot exceed 50 characters'],
      validate: {
        validator: function(name) {
          return /^[a-zA-Z0-9\s\-&]+$/.test(name);
        },
        message: 'Category name can only contain letters, numbers, spaces, hyphens, and ampersands'
      }
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      immutable: true, 
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot exceed 200 characters'],
      default: ''
    },
    icon: {
      type: String,
      default: '📦',
      validate: {
        validator: function(icon) {
          return /^[\u{1F300}-\u{1F9FF}]|[\w-]+$/u.test(icon);
        },
        message: 'Invalid icon format'
      }
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
      validate: {
        validator: async function(parentId) {
          if (!parentId) return true; 
          if (this._id && parentId.equals(this._id)) return false; 
          
          const parent = await mongoose.model('Category').findById(parentId);
          return !!parent;
        },
        message: 'Invalid parent category or circular reference'
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    sortOrder: {
      type: Number,
      default: 0,
      min: 0
    },
    seoTitle: {
      type: String,
      maxlength: [60, 'SEO title cannot exceed 60 characters']
    },
    seoDescription: {
      type: String,
      maxlength: [160, 'SEO description cannot exceed 160 characters']
    },
    image: {
      url: String,
      publicId: String,
      altText: {
        type: String,
        maxlength: [100, 'Alt text cannot exceed 100 characters']
      }
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { 
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.__v;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
CategorySchema.index({ slug: 1 });
CategorySchema.index({ name: 'text', description: 'text' });
CategorySchema.index({ parentCategory: 1 });
CategorySchema.index({ isActive: 1, sortOrder: 1 });
CategorySchema.index({ sortOrder: 1, name: 1 });

// Virtual for child categories
CategorySchema.virtual('childCategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory',
  options: { sort: { sortOrder: 1, name: 1 } }
});

// Virtual for product count
CategorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Virtual for active products count
CategorySchema.virtual('activeProductCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true,
  match: { approved: true } // Only count approved products
});

// Virtual to check if category has children
CategorySchema.virtual('hasChildren').get(function() {
  // This will be populated when using .populate('childCategories')
  return this.childCategories && this.childCategories.length > 0;
});

// Pre-save middleware for slug generation
CategorySchema.pre('save', async function (next) {
  if (!this.isModified('name')) return next();

  let baseSlug = slugify(this.name, { 
    lower: true, 
    strict: true,
    trim: true
  });
  
  let candidateSlug = baseSlug;
  let count = 0;
  const maxAttempts = 100; // Safety limit

  while (count < maxAttempts) {
    const existing = await this.constructor.findOne({
      slug: candidateSlug,
      _id: { $ne: this._id }
    });

    if (!existing) break;

    count++;
    candidateSlug = `${baseSlug}-${count}`;
  }

  if (count >= maxAttempts) {
    return next(new Error('Could not generate unique slug'));
  }

  this.slug = candidateSlug;
  
  // Auto-generate SEO fields if not provided
  if (!this.seoTitle) {
    this.seoTitle = `${this.name} | Agricultural Products`;
  }
  
  if (!this.seoDescription && this.description) {
    this.seoDescription = this.description.substring(0, 157) + '...';
  }

  next();
});

// Pre-remove middleware to handle category deletion
CategorySchema.pre('remove', async function (next) {
  const Product = mongoose.model('Product');
  const Category = mongoose.model('Category');
  
  // Check if category has products
  const productCount = await Product.countDocuments({ category: this._id });
  if (productCount > 0) {
    return next(new Error(`Cannot delete category with ${productCount} associated products`));
  }
  
  // Check if category has children
  const childCount = await Category.countDocuments({ parentCategory: this._id });
  if (childCount > 0) {
    return next(new Error(`Cannot delete category with ${childCount} sub-categories`));
  }
  
  next();
});

// Static method to get active categories with product counts
CategorySchema.statics.getActiveCategories = function() {
  return this.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .populate('productCount')
    .populate('childCategories');
};

// Static method to get category tree
CategorySchema.statics.getCategoryTree = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $graphLookup: {
        from: 'categories',
        startWith: '$_id',
        connectFromField: '_id',
        connectToField: 'parentCategory',
        as: 'descendants',
        depthField: 'depth'
      }
    },
    { $sort: { sortOrder: 1, name: 1 } }
  ]);
};

// Instance method to get full category path
CategorySchema.methods.getFullPath = async function() {
  const path = [this];
  let current = this;
  
  while (current.parentCategory) {
    const parent = await mongoose.model('Category')
      .findById(current.parentCategory)
      .select('name slug parentCategory');
    
    if (parent) {
      path.unshift(parent);
      current = parent;
    } else {
      break;
    }
  }
  
  return path;
};

// Query helper for active categories
CategorySchema.query.active = function() {
  return this.where({ isActive: true });
};

// Query helper for root categories (no parent)
CategorySchema.query.root = function() {
  return this.where({ parentCategory: null });
};

export default mongoose.model('Category', CategorySchema);