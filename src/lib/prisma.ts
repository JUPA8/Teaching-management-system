import { PrismaClient } from '@prisma/client';

// Global prisma client instance for development hot reloading
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Initialize Prisma client  
// During build without DATABASE_URL, create a mock client that won't be used
const createPrismaClient = () => {
  if (process.env.DATABASE_URL) {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  
  // Return a mock client for build time (won't be used at runtime)
  return new PrismaClient() as any;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Helper to check if database is configured
export const isDatabaseConfigured = () => !!process.env.DATABASE_URL;

// For backwards compatibility
export function getPrisma() {
  return prisma;
}
