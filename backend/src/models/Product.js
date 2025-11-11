// models/Product.js
import mongoose from 'mongoose';
import { queueRatingUpdate } from '../utils/updateProductRating.js';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 2000 },
    price: { type: Number, required: true, min: 0.01 },
    unit: { type: String, required: true, enum: ['kg', 'g', 'L', 'mL', 'bunch', 'piece', 'dozen', 'pack', 'box'] },
    quantityInStock: { type: Number, required: true, min: 0 },
    inStock: { type: Boolean, default: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image', validate: [v => v.length <= 5, 'Max 5 images'] }],
    harvestDate: { type: Date },
    location: { type: String, trim: true },
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], validate: [v => v.length === 2, '[lng, lat]'] },
    },
    isNegotiable: { type: Boolean, default: false },
    approved: { type: Boolean, default: false },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.index({ coordinates: '2dsphere' });
ProductSchema.index({ name: 'text', description: 'text' }, { weights: { name: 10, description: 5 } });
ProductSchema.index({ category: 1, approved: 1, inStock: 1 });
ProductSchema.index({ seller: 1, createdAt: -1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ harvestDate: -1 });
ProductSchema.index({ approved: 1, inStock: 1, createdAt: -1 });

ProductSchema.pre('save', function (next) {
  this.inStock = this.quantityInStock > 0;
  next();
});

ProductSchema.post(['save', 'findOneAndUpdate'], function (doc) {
  if (doc) queueRatingUpdate(doc._id);
});

ProductSchema.virtual('freshness').get(function () {
  if (!this.harvestDate) return null;
  const daysOld = (Date.now() - this.harvestDate) / (1000 * 60 * 60 * 24);
  if (daysOld <= 3) return 'fresh';
  if (daysOld <= 7) return 'good';
  return 'mature';
});

ProductSchema.methods.reduceStock = async function (quantity) {
  if (this.quantityInStock < quantity) {
    throw new Error(`Insufficient stock. Available: ${this.quantityInStock}`);
  }
  this.quantityInStock -= quantity;
  this.inStock = this.quantityInStock > 0;
  await this.save();
};

export default mongoose.model('Product', ProductSchema);