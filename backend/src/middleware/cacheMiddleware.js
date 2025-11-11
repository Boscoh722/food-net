// middleware/cacheMiddleware.js
import { createHash } from 'crypto';

/**
 * Sets Cache-Control headers based on authentication
 */
export const cacheControl = (req, res, next) => {
  if (!res || !res.set) {
    // Safety check: ensure res exists
    console.warn('cacheControl middleware: res is undefined');
    return next();
  }

  const isPrivate = !!req.user;
  res.set('Cache-Control', isPrivate ? 'private, max-age=30' : 'public, max-age=3600');
  next();
};

/**
 * ETag caching middleware
 * @param {Function} getDataFn - async function(req, res) that returns JSON data
 */
export const etagCache = (getDataFn) => async (req, res, next) => {
  if (!res || !res.set) {
    console.warn('etagCache middleware: res is undefined');
    return next();
  }

  try {
    // Generate ETag from user ID + query + rounded timestamp (1 min)
    const userKey = req.user?._id?.toString() || 'public';
    const queryKey = JSON.stringify(req.query || {});
    const minute = Math.floor(Date.now() / 60000);
    const etag = createHash('sha1').update(`${userKey}-${queryKey}-${minute}`).digest('hex');

    // Send 304 if client has same ETag
    if (req.get('If-None-Match') === etag) {
      return res.status(304).end();
    }

    // Attach ETag + X-Cache header
    res.set('ETag', etag);
    res.set('X-Cache', 'MISS');

    // Get actual data
    const result = await getDataFn(req, res);

    // Only send JSON if headers not already sent
    if (!res.headersSent && result !== undefined) {
      res.set('X-Cache', 'HIT');
      res.json(result);
    }
  } catch (err) {
    next(err);
  }
};
