import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'seller', 'buyer', 'logistics'],
    required: true
  },
  idNumber: { // Hidden for sellers/buyers
    type: String,
    required: function() { return this.role === 'seller' || this.role === 'buyer'; },
    select: false // Hide by default in queries
  },
  phone: {
    type: String,
    required: function() { return this.role !== 'admin'; },
    match: [/^\+?\d{10,15}$/, 'Please use a valid phone number']
  },
  location: { // For logistics
    type: String,
    required: function() { return this.role === 'logistics'; }
  },
  reach: { // For logistics (e.g., areas covered)
    type: String,
    required: function() { return this.role === 'logistics'; }
  },
  approved: { // For sellers to post items
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', UserSchema);