// models/Image.js
import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true, validate: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)/i },
    publicId: { type: String, trim: true, sparse: true },
    alt: { type: String, trim: true, maxlength: 150 },
    width: { type: Number, min: 1 },
    height: { type: Number, min: 1 },
    format: { type: String, enum: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'], lowercase: true },
    size: { type: Number, min: 0 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resourceType: { type: String, enum: ['product', 'user', 'complaint', 'other'], required: true },
    resourceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ImageSchema.index({ resourceType: 1, resourceId: 1 });
ImageSchema.index({ uploadedBy: 1, createdAt: -1 });
ImageSchema.index({ publicId: 1 }, { unique: true, sparse: true });

ImageSchema.virtual('thumbnail').get(function () {
  if (!this.publicId || !this.url.includes('cloudinary.com')) return null;
  return this.url.replace('/upload/', '/upload/c_scale,w_300/');
});

ImageSchema.methods.deleteFromCloud = async function () {
  if (!this.publicId) return;
  try {
    const cloudinary = require('cloudinary').v2;
    await cloudinary.uploader.destroy(this.publicId);
  } catch (err) {
    console.error(`Cloudinary delete failed: ${this.publicId}`, err);
    throw err;
  }
};

// FIXED: Use deleteOne with { document: true }
ImageSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    await this.deleteFromCloud();
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model('Image', ImageSchema);