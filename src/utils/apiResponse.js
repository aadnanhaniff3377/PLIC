/**
 * Send a success response
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {any} data
 * @param {any} meta
 */
export const sendSuccess = (res, statusCode = 200, message = 'Success', data = null, meta = null) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {string} errorType
 * @param {any} details
 */
export const sendError = (res, statusCode = 500, message = 'Internal Server Error', errorType = 'INTERNAL_ERROR', details = null) => {
  const response = {
    success: false,
    message,
    error: errorType,
  };

  if (details !== null) {
    response.details = details;
  }

  return res.status(statusCode).json(response);
};
