import { sendError } from '../utils/apiResponse.js';

export const validateEmployee = (req, res, next) => {
  const { full_name, email, salary, status, joining_date } = req.body;
  const errors = {};

  if (!full_name || typeof full_name !== 'string' || full_name.trim() === '') {
    errors.full_name = 'Full name is required and must be a non-empty string.';
  }

  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.email = 'Email is required and must be a valid email string.';
  } else {
    // Simple email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = 'Invalid email format.';
    }
  }

  if (salary !== undefined && salary !== null) {
    const numSalary = Number(salary);
    if (isNaN(numSalary) || numSalary < 0) {
      errors.salary = 'Salary must be a valid non-negative number.';
    }
  }

  if (status !== undefined && status !== null) {
    if (!['Active', 'Inactive'].includes(status)) {
      errors.status = "Status must be either 'Active' or 'Inactive'.";
    }
  }

  if (joining_date !== undefined && joining_date !== null && joining_date !== '') {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(joining_date) || isNaN(Date.parse(joining_date))) {
      errors.joining_date = 'Joining date must be a valid date in YYYY-MM-DD format.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return sendError(
      res,
      400,
      'Validation failed',
      'VALIDATION_ERROR',
      errors
    );
  }

  next();
};

export const validateEmployeeUpdate = (req, res, next) => {
  const { full_name, email, salary, status, joining_date } = req.body;
  const errors = {};

  if (full_name !== undefined) {
    if (typeof full_name !== 'string' || full_name.trim() === '') {
      errors.full_name = 'Full name must be a non-empty string.';
    }
  }

  if (email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== 'string' || !emailRegex.test(email)) {
      errors.email = 'Invalid email format.';
    }
  }

  if (salary !== undefined && salary !== null) {
    const numSalary = Number(salary);
    if (isNaN(numSalary) || numSalary < 0) {
      errors.salary = 'Salary must be a valid non-negative number.';
    }
  }

  if (status !== undefined && status !== null) {
    if (!['Active', 'Inactive'].includes(status)) {
      errors.status = "Status must be either 'Active' or 'Inactive'.";
    }
  }

  if (joining_date !== undefined && joining_date !== null && joining_date !== '') {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(joining_date) || isNaN(Date.parse(joining_date))) {
      errors.joining_date = 'Joining date must be a valid date in YYYY-MM-DD format.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return sendError(
      res,
      400,
      'Validation failed',
      'VALIDATION_ERROR',
      errors
    );
  }

  next();
};
