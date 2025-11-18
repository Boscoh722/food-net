import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { type } from 'os';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^\S+@\S+\.\S+$/ },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['admin', 'seller', 'buyer', 'logistics'], required: true, default: 'buyer' },
    idNumber: { type: String, required: function () { return ['seller', 'buyer'].includes(this.role); }, match: /^\d{8,12}$/, select: 'false' },
    phone: { type: String, required: function () { return this.role !== 'admin'; }, match: /^\+?\d{10,15}$/, unique: true, sparse: true },
    location: { type: String, required: function () { return this.role === 'logistics'; } },
    reach: { type: String, required: function () { return this.role === 'logistics'; } },
    approved: { type: Boolean, default: function () { return this.role !== 'seller'; } },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    lastLogin: { type: Date },
    isActive: { type: Boolean, default: true },
    lastActive:{type:Date, default:Date.now},
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.index({ role: 1, approved: 1 });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});


UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.idNumber;
    delete ret.__v;
    delete ret.emailVerificationToken;
    delete ret.emailVerificationExpires;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    return ret;
  }
});

UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Generate and set an email verification token (hashed in DB), return raw token
UserSchema.methods.createEmailVerificationToken = function () {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');

  this.emailVerificationToken = hashed;
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return rawToken;
};

// Generate and set a password reset token (hashed in DB), return raw token
UserSchema.methods.createPasswordResetToken = function () {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');

  this.passwordResetToken = hashed;
  this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);

  return rawToken;
};

UserSchema.virtual('profileComplete').get(function () {
  const required = ['name', 'email', 'phone'];
  if (['seller', 'buyer'].includes(this.role)) required.push('idNumber');
  if (this.role === 'logistics') required.push('location', 'reach');
  return required.every(field => this[field]);
});

export default mongoose.model('User', UserSchema);