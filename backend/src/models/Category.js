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
          const emojiRegex = /^\p{Emoji_Presentation}+$/u; 
          const stringRegex = /^[\w-]+$/; 
          return emojiRegex.test(icon) || stringRegex.test(icon);
        },
        message: 'Invalid icon format'
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
CategorySchema.index({ name: 'text', description: 'text' });
CategorySchema.index({ isActive: 1, sortOrder: 1 });
CategorySchema.index({ sortOrder: 1, name: 1 });

// Virtuals - Removed child-related virtuals
CategorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

CategorySchema.virtual('activeProductCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true,
  match: { approved: true }
});

CategorySchema.pre('save', async function (next) {

  if (!this.isNew && !this.isModified('name')) return next();

  let baseSlug = slugify(this.name, { 
    lower: true, 
    strict: true,
    trim: true
  });
  
  let candidateSlug = baseSlug;
  let count = 0;
  const maxAttempts = 100;

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

// Statics and Query Helpers
CategorySchema.statics.getActiveCategories = function() {
  return this.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .populate('productCount');
};

CategorySchema.query.active = function() {
  return this.where({ isActive: true });
};

export default mongoose.model('Category', CategorySchema);
