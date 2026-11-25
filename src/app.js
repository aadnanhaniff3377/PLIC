import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/environment.js';
import apiRouter from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security HTTP headers with Helmet
app.use(helmet());

// CORS configuration supporting Oracle APEX frontend origin
const corsOptions = {
  origin: config.corsOrigin === '*' ? '*' : config.corsOrigin.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Request logging with Morgan
if (config.env !== 'test') {
  app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    error: 'TOO_MANY_REQUESTS',
  },
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// API Versioning prefix
app.use('/api/v1', apiRouter);

// Root route welcome
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Employee Management REST API',
    version: '1.0.0',
    documentation: '/api/v1/health',
  });
});

// 404 Not Found middleware
app.use(notFound);

// Centralized error handling middleware
app.use(errorHandler);

export default app;
