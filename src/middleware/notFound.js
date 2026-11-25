import { sendError } from '../utils/apiResponse.js';

export const notFound = (req, res, next) => {
  return sendError(
    res,
    404,
    `Route not found: ${req.method} ${req.originalUrl}`,
    'NOT_FOUND'
  );
};
