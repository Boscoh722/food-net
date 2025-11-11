// models/Category.js
import mongoose from 'mongoose';
import slugify from 'slugify';

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
      minlength: [2, 'Name too short'],
      maxlength: [50, 'Name too long'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    icon: {
      type: String,
      default: 'package',
      validate: {
        validator: function (v) {
          const validIcons = [
            'apple', 'carrot', 'wheat', 'milk', 'beef', 'package',
            'leaf', 'sprout', 'tractor', 'store', 'truck', 'shopping-cart'
          ];
          return !v || validIcons.includes(v);
        },
        message: 'Invalid icon name',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CategorySchema.index({ name: 'text' });


CategorySchema.pre('save', async function (next) {
  if (!this.isModified('name')) return next();

  let baseSlug = slugify(this.name, { lower: true, strict: true });
  let candidateSlug = baseSlug;
  let count = 0;

  // Safe loop with incrementing counter
  while (await this.constructor.countDocuments({
    slug: candidateSlug,
    _id: { $ne: this._id },
  }) > 0) {
    count++;
    candidateSlug = `${baseSlug}-${count}`;
  }

  this.slug = candidateSlug;
  next();
});

CategorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true,
});

export default mongoose.model('Category', CategorySchema);