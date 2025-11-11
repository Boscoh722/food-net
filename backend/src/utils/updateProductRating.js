// utils/updateProductRating.js
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const ratingUpdateQueue = new Set();
const DEBOUNCE_DELAY = 1200; // ms

async function updateProductRating(productId) {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    console.warn(`Invalid productId in rating update: ${productId}`);
    return;
  }

  try {
    const Review = mongoose.model('Review');
    const result = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: null,
          average: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]);

    const { average = 0, count = 0 } = result[0] || {};
    const roundedAverage = average ? Math.round(average * 10) / 10 : 0;

    await Product.updateOne(
      { _id: productId },
      {
        $set: {
          'rating.average': roundedAverage,
          'rating.count': count,
        },
      }
    );

    console.log(`Rating updated → Product ${productId}: ${roundedAverage} (${count} reviews)`);
  } catch (error) {
    console.error(`Rating update failed for ${productId}:`, error.message);
  }
}

export function queueRatingUpdate(productId) {
  const id = productId.toString();
  if (ratingUpdateQueue.has(id)) return;

  ratingUpdateQueue.add(id);

  setTimeout(async () => {
    try {
      await updateProductRating(productId);
    } finally {
      ratingUpdateQueue.delete(id);
    }
  }, DEBOUNCE_DELAY);
}

export async function forceUpdateRating(productId) {
  const id = productId.toString();
  ratingUpdateQueue.delete(id);
  await updateProductRating(productId);
}
