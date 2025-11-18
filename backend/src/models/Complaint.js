import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
    status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    resolvedAt: { type: Date, default: null },
    closedAt: { type: Date, default: null },
    adminNote: { type: String, default: '', maxlength: 500 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ComplaintSchema.index({ status: 1, createdAt: -1 });
ComplaintSchema.index({ user: 1, createdAt: -1 });

ComplaintSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'resolved' && !this.resolvedAt) this.resolvedAt = new Date();
    else if (this.status === 'closed' && !this.closedAt) this.closedAt = new Date();
    else if (['open', 'in-progress'].includes(this.status)) {
      this.resolvedAt = null;
      this.closedAt = null;
      this.resolvedBy = null;
    }
  }
  next();
});

ComplaintSchema.virtual('resolutionTime').get(function () {
  if (!this.resolvedAt || !this.createdAt) return null;
  return Math.round((this.resolvedAt - this.createdAt) / (1000 * 60 * 60));
});

ComplaintSchema.methods.resolve = async function (adminId, note = '') {
  this.status = 'resolved';
  this.resolvedBy = adminId;
  this.adminNote = note;
  await this.save();
};

ComplaintSchema.methods.close = async function () {
  this.status = 'closed';
  await this.save();
};

export default mongoose.model('Complaint', ComplaintSchema);
