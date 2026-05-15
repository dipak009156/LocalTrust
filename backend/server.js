const http   = require('http');
const app    = require('./app');
const prisma = require('./lib/prisma'); // re-use the singleton — don't create a second client
const logger = require('./utils/logger');

const PORT   = process.env.PORT || 4000;
const server = http.createServer(app);

async function startServer() {
    try {
        await prisma.$connect();
        logger.info('✅  Database connected successfully');

        server.listen(PORT, () => {
            logger.info(`🚀  Server running on port ${PORT}`);
        });
    } catch (error) {
        logger.error('❌  Failed to connect to the database:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received — shutting down gracefully');
    await prisma.$disconnect();
    server.close(() => process.exit(0));
});

startServer();