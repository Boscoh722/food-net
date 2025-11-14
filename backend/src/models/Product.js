import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: 10
  },
  category: {
    type: String,
    // FIX 1: EXPANDED ENUM TO MATCH FRONTEND LIST
    enum: [
      'fruits', 'vegetables', 'grains', 'dairy', 'meats', 'other',
      'fish', 'spices', 'tubers', 'nuts', 'herbs' 
    ], 
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  // FIX 2: ADDED MISSING FIELDS
  unit: {
    type: String,
    required: true,
    trim: true
  },
  quantityInStock: {
    type: Number,
    required: true,
    min: 0
  },
  isNegotiable: {
    type: Boolean,
    default: false
  },
  harvestDate: {
    type: Date,
    required: false // Optional, as per frontend
  },
  // FIX 3: CHANGED IMAGES TO STORE URLS DIRECTLY
  // To match the frontend payload, store the URL/publicId instead of ObjectId ref.
  // NOTE: If you MUST use a separate Image model, your backend controller must create
  // the Image document and retrieve its ObjectId before saving the product.
  images: [{ 
    url: String, 
    publicId: String, 
    isPrimary: Boolean 
  }],

  location: { 
    type: String,
    required: true
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
      validate: {
        validator: function(arr) {
          return Array.isArray(arr) && arr.length === 2 && arr.every(n => typeof n === 'number' && !isNaN(n));
        },
        message: 'Coordinates must be [lng, lat] array.'
      }
    }
  },
  approved: {
    type: Boolean,
    default: false 
  }
}, { timestamps: true });

ProductSchema.index({ coordinates: '2dsphere' });

export default mongoose.model('Product', ProductSchema);