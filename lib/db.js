const { PrismaClient } = require('@prisma/client');

// Next.js dev modunda hot-reload sırasında birden fazla Prisma bağlantısı
// açılmasını önlemek için global cache kullanıyoruz.
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = { prisma };
