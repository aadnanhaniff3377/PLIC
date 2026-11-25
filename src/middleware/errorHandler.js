import { sendError } from '../utils/apiResponse.js';
import { config } from '../config/environment.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Error caught by central error handler:', err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorType = err.errorType || 'INTERNAL_SERVER_ERROR';

  // PostgreSQL unique violation error code
  if (err.code === '23505') {
    statusCode = 409;
    message = 'A record with this unique value (such as email) already exists.';
    errorType = 'DUPLICATE_RECORD';
  }

  // PostgreSQL foreign key violation
  else if (err.code === '23503') {
    statusCode = 400;
    message = 'Foreign key constraint violation.';
    errorType = 'FOREIGN_KEY_VIOLATION';
  }

  // PostgreSQL invalid text representation / syntax
  else if (err.code === '22P02') {
    statusCode = 400;
    message = 'Invalid data type or parameter format.';
    errorType = 'INVALID_FORMAT';
  }

  const details = config.env === 'development' ? err.stack : undefined;

  return sendError(res, statusCode, message, errorType, details);
};
