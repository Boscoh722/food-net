import { createHash } from 'crypto';

export const cacheControl = (req, res, next) => {
  const isPrivate = !!req.user;
  res.set('Cache-Control', isPrivate ? 'private, max-age=30' : 'public, max-age=3600');
  next();
};

export const etagCache = (getDataFn) => async (req, res, next) => {
  try {
    const userKey = req.user?._id?.toString() || 'public';
    const queryKey = JSON.stringify(req.query || {});
    const minute = Math.floor(Date.now() / 60000);
    const etag = createHash('sha1').update(`${userKey}-${queryKey}-${minute}`).digest('hex');

    if (req.get('If-None-Match') === etag) {
      return res.status(304).end();
    }

    res.set('ETag', etag);
    res.set('X-Cache', 'MISS');

    const result = await getDataFn(req, res);

    if (!res.headersSent && result !== undefined) {
      res.set('X-Cache', 'HIT');
      res.json(result);
    }
  } catch (err) {
    next(err);
  }
};
