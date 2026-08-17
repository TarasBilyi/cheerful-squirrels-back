import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  console.error('Error Middleware:', err);

  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File is too large. Maximum upload size is 10 MB.';
    return res.status(400).json({
      status: 400,
      message,
      error: message,
      data: null,
    });
  }

  if (err instanceof HttpError) {
    const message = err.message || err.name;
    return res.status(err.status).json({
      status: err.status,
      message,
      error: message,
      data: null,
    });
  }

  const isProd = process.env.NODE_ENV === 'production';
  const status = err.statusCode || err.status || 500;
  const message = isProd
    ? 'Something went wrong. Please try again later.'
    : err.message;

  res.status(status).json({
    status,
    message,
    // `error` mirrors `message` for now: most of the frontend already reads
    // `response.data.error`, while this handler only ever sent `message`.
    // Sending both keeps every existing consumer working without a
    // coordinated multi-file frontend change.
    error: message,
    data: null,
  });
};

