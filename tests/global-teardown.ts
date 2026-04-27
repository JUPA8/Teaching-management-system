import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function globalTeardown() {
  // Clean up E2E test data
  await prisma.booking.deleteMany({
    where: {
      OR: [
        { course: { id: 'e2e-test-course-id' } },
        { student: { user: { email: 'e2e-student@test.com' } } },
      ],
    },
  });
  await prisma.user.deleteMany({
    where: {
      email: { in: ['e2e-admin@test.com', 'e2e-teacher@test.com', 'e2e-student@test.com'] },
    },
  });
  await prisma.course.deleteMany({ where: { id: 'e2e-test-course-id' } });
  await prisma.$disconnect();
}

export default globalTeardown;
