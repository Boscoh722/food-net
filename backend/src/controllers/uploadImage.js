import cloudinary from '../config/cloudinary.js';
import Image from '../models/Image.js';
import fs from 'fs/promises'; 

export const uploadToCloudinary = async (file, userId, resourceType, resourceId) => {
  try {
    if (!file) throw new Error('No file provided');
    if (!file.mimetype.startsWith('image/')) throw new Error('Invalid image type');

    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'marketplace',
      resource_type: 'image',
    });

    const image = new Image({
      url: result.secure_url,
      publicId: result.public_id,
      alt: file.originalname,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
      uploadedBy: userId,
      resourceType,
      resourceId,
    });

    await image.save();
    await fs.unlink(file.path);

    return image; 
  } catch (err) {
    if (file?.path) await fs.unlink(file.path).catch(() => {});
    throw err;
  }
};
