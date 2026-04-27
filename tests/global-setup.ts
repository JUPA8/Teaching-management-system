import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function globalSetup() {
  const password = await bcrypt.hash('TestPass123!', 12);

  // Upsert admin test user
  const adminUser = await prisma.user.upsert({
    where: { email: 'e2e-admin@test.com' },
    update: {},
    create: {
      email: 'e2e-admin@test.com',
      name: 'E2E Admin',
      password,
      role: 'ADMIN',
      isVerified: true,
    },
  });

  // Upsert teacher test user
  const teacherUser = await prisma.user.upsert({
    where: { email: 'e2e-teacher@test.com' },
    update: {},
    create: {
      email: 'e2e-teacher@test.com',
      name: 'E2E Teacher',
      password,
      role: 'TEACHER',
      isVerified: true,
    },
  });

  // Ensure teacher profile exists
  await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: {},
    create: {
      userId: teacherUser.id,
      gender: 'MALE',
      specializations: ['Tajweed'],
      languages: ['English'],
      isActive: true,
    },
  });

  // Upsert student test user
  const studentUser = await prisma.user.upsert({
    where: { email: 'e2e-student@test.com' },
    update: {},
    create: {
      email: 'e2e-student@test.com',
      name: 'E2E Student',
      password,
      role: 'STUDENT',
      isVerified: true,
    },
  });

  // Ensure student profile exists
  await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: { userId: studentUser.id },
  });

  // Ensure a test course exists
  await prisma.course.upsert({
    where: { id: 'e2e-test-course-id' },
    update: {},
    create: {
      id: 'e2e-test-course-id',
      name: 'E2E Test Course',
      description: 'Test course for E2E testing',
      type: 'QURAN_KIDS',
      price: 50,
      duration: 60,
      totalSessions: 10,
      isActive: true,
    },
  });
}

export default globalSetup;
