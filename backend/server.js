const http = require('http');
const app = require('./app');
const prisma = require('./lib/prisma');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

async function startServer() {
  // Attempt primary connection (DATABASE_URL) first
  try {
    await prisma.$connect();
    logger.info('✅  Database connected successfully (using DATABASE_URL)');
  } catch (primaryError) {
    logger.warn('⚠️  Primary DB connection failed, attempting DIRECT_URL fallback');
    // Create a new Prisma client with direct URL (bypasses pooler)
    const { PrismaClient: PrismaClientFallback } = require('@prisma/client');
    const fallbackPrisma = new PrismaClientFallback({
      datasources: { db: { url: process.env.DIRECT_URL } },
    });
    try {
      await fallbackPrisma.$connect();
      logger.info('✅  Database connected successfully (using DIRECT_URL)');
      // Override exported prisma instance for subsequent use
      module.exports = fallbackPrisma;
      // Update local reference
      global.prisma = fallbackPrisma;
    } catch (fallbackError) {
      logger.error('❌  Both primary and fallback DB connections failed:', fallbackError);
      process.exit(1);
    }
  }

  // Start HTTP server
  server.listen(PORT, () => {
    logger.info(`🚀  Server running on port ${PORT}`);
  });
}


// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received — shutting down gracefully');
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});

startServer();