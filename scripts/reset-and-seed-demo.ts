import fs from 'fs';
import path from 'path';
import { PrismaClient, BookingStatus, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Load .env.local before PrismaClient so DATABASE_URL is set correctly.
// PrismaClient reads it at construction time, not at import time, so this works.
function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    // .env.local overrides .env (mirrors Next.js precedence)
    process.env[key] = val;
  }
}

loadEnvLocal();

const prisma = new PrismaClient();

// ─── Print DB info without exposing credentials ───────────────────────────────
function printDbInfo() {
  const url = process.env.DATABASE_URL ?? '';
  if (!url) {
    console.error('❌  DATABASE_URL is not set. Cannot continue.');
    process.exit(1);
  }
  const match = url.match(
    /postgresql:\/\/[^:]+:[^@]+@([^/:]+)(?::\d+)?\/([^?]+)/
  );
  if (match) {
    const host = match[1];
    const db   = match[2];
    const isNeon = host.includes('neon.tech');
    console.log(`  Host:     ${host}`);
    console.log(`  Database: ${db}`);
    console.log(`  Provider: ${isNeon ? 'Neon (cloud PostgreSQL)' : 'Local / other PostgreSQL'}`);
    if (!isNeon) {
      console.warn('\n  ⚠️  WARNING: Not connected to Neon. Verify this is the intended database.\n');
    }
  } else {
    console.log('  ⚠️  Could not parse DATABASE_URL (non-standard format)');
  }
  console.log('');
}

// ─── Safe deletion in FK order ────────────────────────────────────────────────
async function clearData() {
  console.log('🗑️  Clearing existing data in FK-safe order...');

  const deleted = await Promise.all([
    // Leaf tables first (no other table depends on them)
    prisma.grade.deleteMany({}),
    prisma.attendance.deleteMany({}),
    prisma.payment.deleteMany({}),
    prisma.activityLog.deleteMany({}),
    prisma.verificationToken.deleteMany({}),
    prisma.passwordResetToken.deleteMany({}),
    prisma.probestundeRequest.deleteMany({}),
  ]);
  console.log(`   grades=${deleted[0].count}  attendance=${deleted[1].count}  payments=${deleted[2].count}`);

  // Bookings after attendance/grades are gone
  const bDel = await prisma.booking.deleteMany({});
  console.log(`   bookings=${bDel.count}`);

  // Join tables
  await prisma.courseEnrollment.deleteMany({});
  await prisma.courseTeacher.deleteMany({});

  // Child profile tables before user deletion
  const sDel = await prisma.student.deleteMany({});
  const tDel = await prisma.teacher.deleteMany({});
  console.log(`   students=${sDel.count}  teachers=${tDel.count}`);

  // Non-admin users (admin is preserved, password updated via upsert later)
  const uDel = await prisma.user.deleteMany({ where: { role: { not: UserRole.ADMIN } } });
  console.log(`   non-admin users=${uDel.count}`);

  // Top-level content tables
  await prisma.course.deleteMany({});
  await prisma.video.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.siteSettings.deleteMany({});

  console.log('   ✅ All cleared\n');
}

async function main() {
  console.log('');
  console.log('═'.repeat(60));
  console.log('  Salam Institute — Demo Reset & Seed');
  console.log('═'.repeat(60));
  printDbInfo();

  await clearData();

  // Pre-hash password once — all demo accounts share TestPass123!
  const PASS = await bcrypt.hash('TestPass123!', 12);

  // ── Admin ──────────────────────────────────────────────────────────────────
  console.log('👤 Admin...');
  await prisma.user.upsert({
    where: { email: 'admin@salam-institut.com' },
    update: { password: PASS, isVerified: true, name: 'Admin User', role: UserRole.ADMIN },
    create: {
      email: 'admin@salam-institut.com',
      password: PASS,
      name: 'Admin User',
      role: UserRole.ADMIN,
      isVerified: true,
    },
  });
  console.log('   ✅ admin@salam-institut.com\n');

  // ── Teachers ───────────────────────────────────────────────────────────────
  console.log('👨‍🏫 Teachers...');

  // Teacher 1: Sheikh Ahmed — teaches Quran Kids + Arabic for Beginners
  const tusr1 = await prisma.user.create({
    data: {
      email: 'teacher.ahmed@salam-institut.com',
      password: PASS,
      name: 'Sheikh Ahmed Hassan',
      role: UserRole.TEACHER,
      isVerified: true,
      phone: '+49 151 11223344',
    },
  });
  const teacher1 = await prisma.teacher.create({
    data: {
      userId: tusr1.id,
      gender: 'MALE',
      bio: 'Sheikh Ahmed Hassan holds an ijazah in Quran recitation and has been teaching Tajweed and Quranic sciences for over 10 years. Fluent in Arabic, English, and German.',
      specializations: ['Tajweed', 'Quran Recitation', 'Islamic Studies', 'Arabic Language'],
      languages: ['Arabic', 'English', 'German'],
      hourlyRate: 25,
      yearsExperience: 10,
      availability: {
        monday:    ['09:00-13:00', '17:00-21:00'],
        tuesday:   ['09:00-13:00', '17:00-21:00'],
        wednesday: ['17:00-21:00'],
        thursday:  ['09:00-13:00', '17:00-21:00'],
        friday:    ['09:00-12:00', '17:00-21:00'],
        saturday:  ['09:00-12:00'],
      },
    },
  });
  console.log('   ✅ Sheikh Ahmed Hassan  (teacher.ahmed@salam-institut.com)');

  // Teacher 2: Ustazah Maryam — teaches Tajweed + Quran Kids
  const tusr2 = await prisma.user.create({
    data: {
      email: 'teacher.maryam@salam-institut.com',
      password: PASS,
      name: 'Ustazah Maryam Ali',
      role: UserRole.TEACHER,
      isVerified: true,
      phone: '+49 151 55667788',
    },
  });
  const teacher2 = await prisma.teacher.create({
    data: {
      userId: tusr2.id,
      gender: 'FEMALE',
      bio: 'Ustazah Maryam Ali is a certified Arabic language instructor and Quran teacher with 7 years of experience. She specialises in teaching children and adult beginners.',
      specializations: ['Tajweed', 'Quran for Kids', 'Quran Recitation'],
      languages: ['Arabic', 'English'],
      hourlyRate: 22,
      yearsExperience: 7,
      availability: {
        monday:    ['14:00-20:00'],
        tuesday:   ['14:00-20:00'],
        wednesday: ['14:00-20:00'],
        thursday:  ['14:00-20:00'],
        saturday:  ['10:00-14:00'],
      },
    },
  });
  console.log('   ✅ Ustazah Maryam Ali   (teacher.maryam@salam-institut.com)\n');

  // ── Students ───────────────────────────────────────────────────────────────
  console.log('🎓 Students...');

  // Student 1: Omar — Quran Reading for Kids (teacher: Ahmed)
  const susr1 = await prisma.user.create({
    data: {
      email: 'omar.hassan@example.com',
      password: PASS,
      name: 'Omar Hassan',
      role: UserRole.STUDENT,
      isVerified: true,
      phone: '+49 152 22334455',
    },
  });
  const student1 = await prisma.student.create({
    data: {
      userId: susr1.id,
      dateOfBirth: new Date('1995-04-15'),
      city: 'Berlin',
      country: 'Germany',
    },
  });
  console.log('   ✅ Omar Hassan  → Quran Reading for Kids  (Berlin)');

  // Student 2: Aisha — Tajweed Basics (teacher: Maryam)
  const susr2 = await prisma.user.create({
    data: {
      email: 'aisha.khan@example.com',
      password: PASS,
      name: 'Aisha Khan',
      role: UserRole.STUDENT,
      isVerified: true,
      phone: '+49 153 33445566',
    },
  });
  const student2 = await prisma.student.create({
    data: {
      userId: susr2.id,
      dateOfBirth: new Date('1998-09-22'),
      city: 'Munich',
      country: 'Germany',
    },
  });
  console.log('   ✅ Aisha Khan   → Tajweed Basics          (Munich)');

  // Student 3: Yusuf — Arabic for Beginners (teacher: Ahmed)
  const susr3 = await prisma.user.create({
    data: {
      email: 'yusuf.ali@example.com',
      password: PASS,
      name: 'Yusuf Ali',
      role: UserRole.STUDENT,
      isVerified: true,
    },
  });
  const student3 = await prisma.student.create({
    data: {
      userId: susr3.id,
      dateOfBirth: new Date('2017-03-10'),
      city: 'Hamburg',
      country: 'Germany',
      parentName: 'Ali Hassan',
      parentPhone: '+49 154 44556677',
      parentEmail: 'ali.hassan@example.com',
    },
  });
  console.log('   ✅ Yusuf Ali    → Arabic for Beginners    (Hamburg, parent info)\n');

  // ── Courses ────────────────────────────────────────────────────────────────
  console.log('📚 Courses...');

  // Course 1: Quran Reading for Kids — taught by Ahmed + Maryam
  const course1 = await prisma.course.create({
    data: {
      name: 'Quran Reading for Kids',
      nameAr: 'تعليم القرآن للأطفال',
      nameDe: 'Koran lesen für Kinder',
      description:
        'A fun and engaging Quran reading programme designed for children aged 6–12. Students learn to recognise Arabic letters, read simple words, and begin reciting short surahs with correct pronunciation.',
      descriptionAr:
        'برنامج تعليم القرآن الممتع للأطفال من سن 6 إلى 12 عامًا. يتعلم الطلاب التعرف على الحروف العربية وقراءة الكلمات البسيطة والبدء في تلاوة السور القصيرة.',
      descriptionDe:
        'Ein ansprechendes Koran-Leseprogramm für Kinder im Alter von 6–12 Jahren. Die Schüler lernen arabische Buchstaben zu erkennen und kurze Suren zu rezitieren.',
      type: 'QURAN_KIDS',
      price: 99.99,
      duration: 45,
      totalSessions: 12,
      level: 'Beginner',
      ageGroup: 'Kids (6-12)',
      isActive: true,
    },
  });
  console.log('   ✅ Quran Reading for Kids  (45 min, 12 sessions, €99.99)');

  // Course 2: Tajweed Basics — taught by Maryam + Ahmed
  const course2 = await prisma.course.create({
    data: {
      name: 'Tajweed Basics',
      nameAr: 'أساسيات التجويد',
      nameDe: 'Tajweed Grundlagen',
      description:
        'Master the rules of Tajweed and perfect your Quran recitation. Covers makharij al-huruf, sifat (characteristics of letters), and the essential rules of Tajweed with practical application.',
      descriptionAr:
        'أتقن قواعد التجويد وحسّن تلاوتك للقرآن. يغطي مخارج الحروف وصفاتها والقواعد الأساسية للتجويد.',
      descriptionDe:
        'Meistern Sie die Tajweed-Regeln und perfektionieren Sie Ihre Koran-Rezitation. Behandelt Makharij, Sifat und wesentliche Tajweed-Regeln.',
      type: 'QURAN_ADULTS',
      price: 149.99,
      duration: 60,
      totalSessions: 16,
      level: 'Beginner to Intermediate',
      ageGroup: 'Adults (16+)',
      isActive: true,
    },
  });
  console.log('   ✅ Tajweed Basics           (60 min, 16 sessions, €149.99)');

  // Course 3: Arabic for Beginners — taught by Ahmed
  const course3 = await prisma.course.create({
    data: {
      name: 'Arabic for Beginners',
      nameAr: 'العربية للمبتدئين',
      nameDe: 'Arabisch für Anfänger',
      description:
        'Learn Modern Standard Arabic from scratch. Covers the alphabet, basic vocabulary, simple grammar structures, and everyday conversational phrases.',
      descriptionAr:
        'تعلم العربية الفصحى الحديثة من الصفر. يغطي الأبجدية والمفردات الأساسية وهياكل النحو البسيطة.',
      descriptionDe:
        'Arabisch von Grund auf lernen. Behandelt Alphabet, Grundvokabular, einfache Grammatik und alltägliche Gesprächsphrasen.',
      type: 'ARABIC_LANGUAGE',
      price: 129.99,
      duration: 60,
      totalSessions: 20,
      level: 'Beginner',
      ageGroup: 'All Ages',
      isActive: true,
    },
  });
  console.log('   ✅ Arabic for Beginners     (60 min, 20 sessions, €129.99)\n');

  // ── CourseTeacher assignments ──────────────────────────────────────────────
  // Ahmed   → Quran Reading for Kids + Arabic for Beginners
  // Maryam  → Tajweed Basics + Quran Reading for Kids
  console.log('🔗 Assigning teachers to courses...');
  await prisma.courseTeacher.createMany({
    data: [
      { courseId: course1.id, teacherId: teacher1.id }, // Ahmed  → Quran Kids
      { courseId: course3.id, teacherId: teacher1.id }, // Ahmed  → Arabic
      { courseId: course2.id, teacherId: teacher2.id }, // Maryam → Tajweed
      { courseId: course1.id, teacherId: teacher2.id }, // Maryam → Quran Kids
    ],
  });
  console.log('   ✅ Sheikh Ahmed  → Quran Reading for Kids, Arabic for Beginners');
  console.log('   ✅ Ustazah Maryam → Tajweed Basics, Quran Reading for Kids\n');

  // ── CourseEnrollments ──────────────────────────────────────────────────────
  // Omar   → Quran Reading for Kids  (1/12 completed = 8%)
  // Aisha  → Tajweed Basics          (1/16 COMPLETED bookings = 6%, but ABSENT)
  // Yusuf  → Arabic for Beginners    (1/20 completed = 5%)
  console.log('📋 Enrollments...');
  await prisma.courseEnrollment.createMany({
    data: [
      { courseId: course1.id, studentId: student1.id, progress: 8  }, // Omar  → Quran Kids
      { courseId: course2.id, studentId: student2.id, progress: 6  }, // Aisha → Tajweed
      { courseId: course3.id, studentId: student3.id, progress: 5  }, // Yusuf → Arabic
    ],
  });
  console.log('   ✅ Omar  → Quran Reading for Kids  (8% progress)');
  console.log('   ✅ Aisha → Tajweed Basics          (6% progress)');
  console.log('   ✅ Yusuf → Arabic for Beginners    (5% progress)\n');

  // ── Past / completed sessions ──────────────────────────────────────────────
  console.log('📅 Past sessions (COMPLETED)...');

  // Session 1 — Omar + Ahmed + Quran Kids, 3 weeks ago (PRESENT, grade 8/10)
  const b1 = await prisma.booking.create({
    data: {
      courseId: course1.id,
      studentId: student1.id,
      teacherId: teacher1.id,
      scheduledAt: new Date('2026-05-09T09:00:00.000Z'),
      endTime:     new Date('2026-05-09T09:45:00.000Z'),
      status: BookingStatus.COMPLETED,
      meetingLink: 'https://meet.google.com/demo-past-1',
    },
  });
  await prisma.attendance.create({
    data: {
      bookingId: b1.id, studentId: student1.id, teacherId: teacher1.id,
      status: 'PRESENT',
      notes: 'Good recitation of Al-Fatiha. Ready for Al-Ikhlas next session.',
      markedAt: new Date('2026-05-09T09:50:00.000Z'),
    },
  });
  await prisma.grade.create({
    data: {
      studentId: student1.id, teacherId: teacher1.id, courseId: course1.id, bookingId: b1.id,
      score: 8, maxScore: 10,
      label: 'Session 1 — Al-Fatiha Recitation',
      notes: 'Strong pronunciation. Minor tajweed corrections needed on madd letters.',
      gradedAt: new Date('2026-05-09T09:55:00.000Z'),
    },
  });
  console.log('   ✅ Omar  — Quran Kids (May 9,  PRESENT, grade 8/10, teacher: Ahmed)');

  // Session 2 — Aisha + Maryam + Tajweed, 2 weeks ago (ABSENT, no grade)
  const b2 = await prisma.booking.create({
    data: {
      courseId: course2.id,
      studentId: student2.id,
      teacherId: teacher2.id,
      scheduledAt: new Date('2026-05-16T14:00:00.000Z'),
      endTime:     new Date('2026-05-16T15:00:00.000Z'),
      status: BookingStatus.COMPLETED,
      meetingLink: 'https://meet.google.com/demo-past-2',
    },
  });
  await prisma.attendance.create({
    data: {
      bookingId: b2.id, studentId: student2.id, teacherId: teacher2.id,
      status: 'ABSENT',
      notes: 'Student did not attend. No prior notice given.',
      markedAt: new Date('2026-05-16T15:05:00.000Z'),
    },
  });
  // No grade for absent session
  console.log('   ✅ Aisha — Tajweed Basics (May 16, ABSENT, no grade, teacher: Maryam)');

  // Session 3 — Yusuf + Ahmed + Arabic, 1 week ago (PRESENT, grade 9/10)
  const b3 = await prisma.booking.create({
    data: {
      courseId: course3.id,
      studentId: student3.id,
      teacherId: teacher1.id,
      scheduledAt: new Date('2026-05-23T17:00:00.000Z'),
      endTime:     new Date('2026-05-23T18:00:00.000Z'),
      status: BookingStatus.COMPLETED,
      meetingLink: 'https://meet.google.com/demo-past-3',
    },
  });
  await prisma.attendance.create({
    data: {
      bookingId: b3.id, studentId: student3.id, teacherId: teacher1.id,
      status: 'PRESENT',
      notes: 'Excellent progress — memorised all 28 letters and their forms.',
      markedAt: new Date('2026-05-23T18:05:00.000Z'),
    },
  });
  await prisma.grade.create({
    data: {
      studentId: student3.id, teacherId: teacher1.id, courseId: course3.id, bookingId: b3.id,
      score: 9, maxScore: 10,
      label: 'Session 1 — Arabic Alphabet',
      notes: 'Outstanding retention. Ready for basic vocabulary unit.',
      gradedAt: new Date('2026-05-23T18:10:00.000Z'),
    },
  });
  console.log('   ✅ Yusuf — Arabic (May 23, PRESENT, grade 9/10, teacher: Ahmed)\n');

  // ── Upcoming individual sessions (CONFIRMED) ───────────────────────────────
  console.log('📅 Upcoming sessions (CONFIRMED)...');

  await prisma.booking.create({
    data: {
      courseId: course1.id, studentId: student1.id, teacherId: teacher1.id,
      scheduledAt: new Date('2026-06-06T09:00:00.000Z'),
      endTime:     new Date('2026-06-06T09:45:00.000Z'),
      status: BookingStatus.CONFIRMED,
      meetingLink: 'https://meet.google.com/demo-upcoming-1',
    },
  });
  console.log('   ✅ Omar  — Quran Kids (Jun 6,  09:00–09:45, teacher: Ahmed)');

  await prisma.booking.create({
    data: {
      courseId: course2.id, studentId: student2.id, teacherId: teacher2.id,
      scheduledAt: new Date('2026-06-13T14:00:00.000Z'),
      endTime:     new Date('2026-06-13T15:00:00.000Z'),
      status: BookingStatus.CONFIRMED,
      meetingLink: 'https://meet.google.com/demo-upcoming-2',
    },
  });
  console.log('   ✅ Aisha — Tajweed (Jun 13, 14:00–15:00, teacher: Maryam)');

  await prisma.booking.create({
    data: {
      courseId: course3.id, studentId: student3.id, teacherId: teacher1.id,
      scheduledAt: new Date('2026-06-20T17:00:00.000Z'),
      endTime:     new Date('2026-06-20T18:00:00.000Z'),
      status: BookingStatus.CONFIRMED,
      meetingLink: 'https://meet.google.com/demo-upcoming-3',
    },
  });
  console.log('   ✅ Yusuf — Arabic (Jun 20, 17:00–18:00, teacher: Ahmed)\n');

  // ── Recurring booking series ───────────────────────────────────────────────
  // Series A: Omar in Quran Kids with Ahmed (4 Saturdays 10:00-10:45)
  // Series B: Aisha in Tajweed with Maryam  (4 Wednesdays 15:00-16:00)
  // = 8 total recurring bookings
  console.log('🔄 Recurring series...');

  const recurGroupA = `recur-demo-A-${Date.now()}`;
  const saturdays   = ['2026-06-07', '2026-06-14', '2026-06-21', '2026-06-28'];
  await prisma.booking.createMany({
    data: saturdays.map((d) => ({
      courseId: course1.id, studentId: student1.id, teacherId: teacher1.id,
      scheduledAt: new Date(`${d}T10:00:00.000Z`),
      endTime:     new Date(`${d}T10:45:00.000Z`),
      status: BookingStatus.CONFIRMED,
      meetingLink: 'https://meet.google.com/demo-recurring-a',
      recurrenceGroupId: recurGroupA,
    })),
  });
  console.log(`   ✅ Omar  — Quran Kids × 4 Saturdays (Ahmed, group A)`);

  const recurGroupB = `recur-demo-B-${Date.now() + 1}`;
  const wednesdays  = ['2026-06-04', '2026-06-11', '2026-06-18', '2026-06-25'];
  await prisma.booking.createMany({
    data: wednesdays.map((d) => ({
      courseId: course2.id, studentId: student2.id, teacherId: teacher2.id,
      scheduledAt: new Date(`${d}T15:00:00.000Z`),
      endTime:     new Date(`${d}T16:00:00.000Z`),
      status: BookingStatus.CONFIRMED,
      meetingLink: 'https://meet.google.com/demo-recurring-b',
      recurrenceGroupId: recurGroupB,
    })),
  });
  console.log(`   ✅ Aisha — Tajweed × 4 Wednesdays (Maryam, group B)\n`);

  // ── Payments (with typed courseId FK) ──────────────────────────────────────
  console.log('💳 Payments...');
  await prisma.payment.create({
    data: {
      studentId: student1.id,
      courseId:  course1.id,
      amount: 99.99, currency: 'EUR',
      status: 'COMPLETED',
      description: 'Quran Reading for Kids — full course enrollment',
      paidAt: new Date('2026-05-01T09:00:00.000Z'),
      metadata: { course: 'Quran Reading for Kids', sessions: 12 },
    },
  });
  console.log('   ✅ Omar  — €99.99 COMPLETED (May 1, Quran Kids)');

  await prisma.payment.create({
    data: {
      studentId: student2.id,
      courseId:  course2.id,
      amount: 149.99, currency: 'EUR',
      status: 'COMPLETED',
      description: 'Tajweed Basics — full course enrollment',
      paidAt: new Date('2026-05-03T11:00:00.000Z'),
      metadata: { course: 'Tajweed Basics', sessions: 16 },
    },
  });
  console.log('   ✅ Aisha — €149.99 COMPLETED (May 3, Tajweed Basics)\n');

  // ── Videos ─────────────────────────────────────────────────────────────────
  console.log('🎬 Videos...');
  await prisma.video.create({
    data: {
      title: 'Introduction to Tajweed',
      description:
        'A comprehensive introduction to the science of Tajweed — the rules governing correct Quran recitation. Learn basic terminology, the importance of Tajweed, and the foundations you need to start your journey.',
      duration: '18:45',
      views: 1240,
      category: 'tajweed',
      featured: true,
      isActive: true,
      sortOrder: 1,
    },
  });
  console.log('   ✅ Introduction to Tajweed (featured, tajweed)');

  await prisma.video.create({
    data: {
      title: 'Arabic Alphabet for Beginners',
      description:
        'Learn all 28 letters of the Arabic alphabet with correct pronunciation. Covers letter forms, sounds, and how letters connect in words. Perfect for complete beginners.',
      duration: '22:10',
      views: 876,
      category: 'arabic',
      featured: false,
      isActive: true,
      sortOrder: 2,
    },
  });
  console.log('   ✅ Arabic Alphabet for Beginners (arabic)\n');

  // ── Posts ──────────────────────────────────────────────────────────────────
  console.log('📰 Posts...');

  await prisma.post.create({
    data: {
      title: 'Summer Special: 20% Off Your First Month',
      slug: 'summer-special-20-off-first-month',
      excerpt:
        'Start your Quran or Arabic journey this summer with an exclusive 20% discount on your first full month of classes. Limited places available — enrol today.',
      content: [
        'We are delighted to announce our Summer Special offer for new students joining Salam Institute.',
        'From 1 June to 31 August 2026, all new students receive 20% off their first full month of classes across any of our programmes — Quran for Kids, Tajweed Basics, or Arabic for Beginners.',
        'How to claim: Complete your free trial session, enrol in your chosen course, and the discount is applied automatically at checkout.',
        'Places are limited. Our teachers keep a maximum of 12 students each, ensuring personalised attention for every learner.',
        'We look forward to welcoming you to the Salam Institute family this summer. May Allah bless your learning journey.',
      ].join('\n\n'),
      type: 'OFFER',
      featured: true,
      isPublished: true,
      sortOrder: 0,
      publishedAt: new Date('2026-06-01T08:00:00.000Z'),
    },
  });
  console.log('   ✅ Summer Special 20% Off (OFFER, featured, sortOrder 0)');

  await prisma.post.create({
    data: {
      title: 'New Classes Starting June 2026',
      slug: 'new-classes-june-2026',
      excerpt:
        'We are expanding our schedule for June 2026 with new slots for Tajweed Basics and Arabic for Beginners. Book your place now.',
      content: [
        'We are excited to announce the launch of new class cohorts starting June 2026 at Salam Institute.',
        'New cohorts available:\n- Tajweed Basics — Monday and Thursday evenings, 18:00–19:00\n- Arabic for Beginners — Tuesday and Friday afternoons, 14:00–15:00\n- Quran for Kids — Saturday mornings, 09:00–09:45',
        'All classes are delivered online via Google Meet, making it convenient for students across Germany and beyond.',
        'To book your place or arrange a free trial session, contact us via WhatsApp or visit our website.',
      ].join('\n\n'),
      type: 'NEWS',
      featured: false,
      isPublished: true,
      sortOrder: 1,
      publishedAt: new Date('2026-05-20T10:00:00.000Z'),
    },
  });
  console.log('   ✅ New Classes June 2026 (NEWS, sortOrder 1)');

  await prisma.post.create({
    data: {
      title: 'Ramadan & Eid Holiday Schedule',
      slug: 'ramadan-eid-holiday-schedule-2026',
      excerpt:
        'Important: adjusted class schedule during Ramadan and Eid Al-Adha. Evening sessions shift, and make-up classes are provided.',
      content: [
        'Assalamu Alaykum dear students and families,',
        'During Ramadan, evening classes will run from 20:00–21:00 instead of 18:00–19:00 to accommodate tarawih prayers.',
        'Eid Al-Adha: All classes will be suspended for the week of Eid (exact dates confirmed nearer the time). Make-up sessions are offered the following week.',
        'Jazakumullahu Khayran for your understanding. Wishing you and your families a blessed Ramadan and Eid.',
      ].join('\n\n'),
      type: 'ANNOUNCEMENT',
      featured: false,
      isPublished: true,
      sortOrder: 2,
      publishedAt: new Date('2026-05-15T09:00:00.000Z'),
    },
  });
  console.log('   ✅ Ramadan & Eid Holiday Schedule (ANNOUNCEMENT, sortOrder 2)\n');

  // ── Site Settings ───────────────────────────────────────────────────────────
  console.log('⚙️  Site Settings...');
  const settings = [
    { key: 'site_name',          value: 'Salam Institute' },
    { key: 'contact_email',      value: 'info@salam-institut.com' },
    { key: 'contact_phone',      value: '+49 30 12345678' },
    { key: 'whatsapp_number',    value: '+4915112345678' },
    { key: 'social_instagram',   value: 'https://instagram.com/salaminstitut' },
    { key: 'social_facebook',    value: 'https://facebook.com/salaminstitut' },
    { key: 'booking_enabled',    value: 'true' },
    { key: 'trial_class_price',  value: '0' },
  ];
  for (const s of settings) {
    await prisma.siteSettings.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log(`   ✅ ${settings.length} settings upserted\n`);

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('═'.repeat(60));
  console.log('  ✅  DEMO SEED COMPLETE');
  console.log('═'.repeat(60));
  console.log('');
  console.log('🔑 Login credentials (password for all: TestPass123!)');
  console.log('   Admin:    admin@salam-institut.com');
  console.log('   Teacher:  teacher.ahmed@salam-institut.com    (Quran Kids + Arabic)');
  console.log('   Teacher:  teacher.maryam@salam-institut.com   (Tajweed + Quran Kids)');
  console.log('   Student:  omar.hassan@example.com             (Quran Kids)');
  console.log('   Student:  aisha.khan@example.com              (Tajweed)');
  console.log('   Student:  yusuf.ali@example.com               (Arabic)');
  console.log('');
  console.log('📊 Data summary:');
  console.log('   Users:          6  (1 admin, 2 teachers, 3 students)');
  console.log('   Courses:        3');
  console.log('   CourseTeacher:  4  (Ahmed→Kids+Arabic, Maryam→Tajweed+Kids)');
  console.log('   Enrollments:    3  (Omar→Kids 8%, Aisha→Tajweed 6%, Yusuf→Arabic 5%)');
  console.log('   Bookings:      14  (3 COMPLETED + 3 upcoming CONFIRMED + 8 recurring CONFIRMED)');
  console.log('   Attendance:     3  (Omar PRESENT, Aisha ABSENT, Yusuf PRESENT)');
  console.log('   Grades:         2  (Omar 8/10, Yusuf 9/10 — Aisha absent so no grade)');
  console.log('   Payments:       2  (€99.99 Omar, €149.99 Aisha, both COMPLETED with courseId)');
  console.log('   Videos:         2  (1 featured)');
  console.log('   Posts:          3  (1 featured OFFER, 1 NEWS, 1 ANNOUNCEMENT)');
  console.log('   Site Settings:  8');
  console.log('');
  console.log('🌐 Admin dashboard → http://localhost:3000/en/admin');
  console.log('');
}

main()
  .catch((e) => {
    console.error('\n❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
