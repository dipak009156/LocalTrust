const http = require('http');
const app = require('./app');
const { PrismaClient } = require('@prisma/client');
const logger = require('./utils/logger');

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);


async function startServer() {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');

    server.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    logger.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}

startServer();