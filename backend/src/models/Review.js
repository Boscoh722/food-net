import mongoose from 'mongoose';
import { queueRatingUpdate } from '../utils/updateProductRating.js';

const ReviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 1000 },
    helpful: { type: Number, default: 0, min: 0 },
    reported: { type: Boolean, default: false },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image', validate: [v => v.length <= 3, 'Max 3 images'] }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
ReviewSchema.index({ product: 1, rating: -1 });
ReviewSchema.index({ user: 1, createdAt: -1 });
ReviewSchema.index({ reported: 1 });
ReviewSchema.index({ product: 1, createdAt: -1 });

ReviewSchema.post('save', function (doc) { queueRatingUpdate(doc.product); });
ReviewSchema.post('remove', function (doc) { queueRatingUpdate(doc.product); });
ReviewSchema.post('findOneAndUpdate', function (doc) { if (doc) queueRatingUpdate(doc.product); });

ReviewSchema.methods.markHelpful = async function () { this.helpful += 1; await this.save(); };
ReviewSchema.methods.report = async function () { this.reported = true; await this.save(); };

export default mongoose.model('Review', ReviewSchema);