// src/middleware/errorHandler.js

import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  console.error('Error Middleware:', err);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      status: 400,
      message: 'File is too large. Maximum upload size is 10 MB.',
      data: null,
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message || err.name,
      data: null,
    });
  }

  const isProd = process.env.NODE_ENV === 'production';
  const status = err.statusCode || err.status || 500;

  res.status(status).json({
    status,
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
    data: null,
  });
};
