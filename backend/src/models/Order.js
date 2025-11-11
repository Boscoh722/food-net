// models/Order.js
import mongoose from 'mongoose';
import Counter from './Counter.js'; // ← Add this model (below)

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true, min: 0 },
  productName: { type: String, required: true },
  productImage: { type: String },
}, { _id: false });

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    logistics: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    items: { type: [OrderItemSchema], validate: [v => v.length > 0, 'Order must have items'] },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
    },
    shippingAddress: { type: String, required: true, trim: true },
    paymentMethod: { type: String, enum: ['mpesa', 'card', 'cash', 'wallet'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    logistics: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    trackingNumber: { type: String },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
    confirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    shippedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deliveredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cancelledReason: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

OrderSchema.index({ buyer: 1, createdAt: -1 });
OrderSchema.index({ seller: 1, status: 1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ logistics: 1, status: 1 });
OrderSchema.index({ trackingNumber: 1 });


function arrayMinLength(val) { return val.length > 0; }

OrderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderNumber) {
    const counter = await Counter.findOneAndUpdate(
      { _id: 'orderNumber' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.orderNumber = `ORD-${String(counter.seq).padStart(6, '0')}`;
  }

  // Validate subtotals
  this.items.forEach(item => {
    const expected = item.quantity * item.unitPrice;
    if (Math.abs(item.subtotal - expected) > 0.01) {
      throw new Error(`Subtotal mismatch for ${item.productName}`);
    }
  });

  const totalFromItems = this.items.reduce((sum, i) => sum + i.subtotal, 0);
  if (Math.abs(this.total - totalFromItems) > 0.01) {
    throw new Error('Order total does not match items sum');
  }

  if (this.isModified('status')) {
    const now = new Date();
    if (this.status === 'shipped' && !this.shippedAt) this.shippedAt = now;
    if (this.status === 'delivered' && !this.deliveredAt) this.deliveredAt = now;
  }

  next();
});

OrderSchema.virtual('deliveryTime').get(function () {
  if (!this.deliveredAt || !this.createdAt) return null;
  return Math.ceil((this.deliveredAt - this.createdAt) / (1000 * 60 * 60 * 24));
});

OrderSchema.methods.cancel = async function (userId, reason = '') {
  if (!['pending', 'confirmed'].includes(this.status)) {
    throw new Error('Cannot cancel order in current status');
  }
  this.status = 'cancelled';
  this.cancelledBy = userId;
  this.cancelledReason = reason;
  await this.save();
};

export default mongoose.model('Order', OrderSchema);