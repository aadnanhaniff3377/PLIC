import { Router } from 'express';
import employeeRoutes from './employeeRoutes.js';
import { sendSuccess } from '../utils/apiResponse.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  return sendSuccess(res, 200, 'API is healthy and running', {
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Employee routes
router.use('/employees', employeeRoutes);

export default router;
