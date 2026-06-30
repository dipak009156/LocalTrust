const { PrismaClient } = require('@prisma/client')

// Prisma reads DATABASE_URL and PRISMA_CLIENT_CONNECTION_LIMIT from env
const prisma = new PrismaClient({
  errorFormat: 'pretty',
})

module.exports = prisma