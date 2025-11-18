import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    minlength: 10
  },
  category: {
    type: String,
    required: true,
    enum: ['fruits', 'vegetables', 'grains', 'dairy', 'meats', 'fish', 'spices', 'tubers', 'nuts', 'herbs', 'other']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
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
    required: false
  },
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
      type: [Number],
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
ProductSchema.index({ category: 1 });
ProductSchema.index({ approved: 1 });

export default mongoose.model('Product', ProductSchema);