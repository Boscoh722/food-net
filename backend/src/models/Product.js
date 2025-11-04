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
    enum: ['fruits', 'vegetables', 'grains', 'dairy', 'meats', 'other'], // Kenyan food categories
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: { // Seller's relative position for map
    type: String,
    required: true
  },
  approved: {
    type: Boolean,
    default: false // Admin approves to prevent illegal items
  }
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);