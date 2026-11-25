import app from './app.js';
import { config } from './config/environment.js';
import { testConnection, pool } from './config/database.js';

const startServer = async () => {
  try {
    // Verify database connection before starting server
    await testConnection();

    const server = app.listen(config.port, () => {
      console.log(`Server is running in ${config.env} mode on port ${config.port}`);
      console.log(`API endpoint available at http://localhost:${config.port}/api/v1`);
    });

    // Graceful shutdown handling
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log('HTTP server closed.');

        try {
          await pool.end();
          console.log('Database connection pool closed.');
          process.exit(0);
        } catch (dbErr) {
          console.error('Error closing database connection pool:', dbErr);
          process.exit(1);
        }
      });

      // Force shutdown if graceful shutdown takes too long
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server due to database connection error:', error.message);
    process.exit(1);
  }
};

startServer();
