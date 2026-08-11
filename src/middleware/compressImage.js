// src/middleware/compressImage.js

import sharp from 'sharp';
import createHttpError from 'http-errors';

const MAX_OUTPUT_SIZE = 1 * 1024 * 1024;

export const compressImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const compressionOptions = [
      { width: 1600, quality: 80 },
      { width: 1200, quality: 65 },
      { width: 1000, quality: 50 },
      { width: 800, quality: 35 },
    ];

    for (const { width, quality } of compressionOptions) {
      const buffer = await sharp(req.file.buffer)
        .rotate()
        .resize({
          width,
          height: width,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality, mozjpeg: true })
        .toBuffer();

      if (buffer.length <= MAX_OUTPUT_SIZE) {
        req.file.buffer = buffer;
        req.file.size = buffer.length;
        req.file.mimetype = 'image/jpeg';
        return next();
      }
    }

    throw createHttpError(400, 'Image is too complex to compress below 1 MB');
  } catch (error) {
    next(error);
  }
};
