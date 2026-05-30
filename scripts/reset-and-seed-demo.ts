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

  const tusr1 = await prisma.user.create({
    data: {
      email: 'sheikh.ahmed@salam-institut.com',
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
      specializations: ['Tajweed', 'Quran Recitation', 'Islamic Studies', 'Fiqh'],
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
  console.log('   ✅ Sheikh Ahmed Hassan (MALE, Tajweed/Quran)');

  const tusr2 = await prisma.user.create({
    data: {
      email: 'ustazah.maryam@salam-institut.com',
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
      specializations: ['Arabic Language', 'Quran for Kids', 'Quran Recitation'],
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
  console.log('   ✅ Ustazah Maryam Ali (FEMALE, Arabic/Quran Kids)\n');

  // ── Students ───────────────────────────────────────────────────────────────
  console.log('🎓 Students...');

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
  console.log('   ✅ Omar Hassan (adult, Berlin)');

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
  console.log('   ✅ Aisha Khan (adult, Munich)');

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
  console.log('   ✅ Yusuf Ali (child, Hamburg, with parent info)\n');

  // ── Courses ────────────────────────────────────────────────────────────────
  console.log('📚 Courses...');

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
  console.log('🔗 Assigning teachers to courses...');
  await prisma.courseTeacher.createMany({
    data: [
      { courseId: course1.id, teacherId: teacher1.id }, // Sheikh Ahmed → Quran Kids
      { courseId: course2.id, teacherId: teacher1.id }, // Sheikh Ahmed → Tajweed
      { courseId: course1.id, teacherId: teacher2.id }, // Ustazah Maryam → Quran Kids
      { courseId: course3.id, teacherId: teacher2.id }, // Ustazah Maryam → Arabic
    ],
  });
  console.log('   ✅ Sheikh Ahmed  → Quran Reading for Kids, Tajweed Basics');
  console.log('   ✅ Ustazah Maryam → Quran Reading for Kids, Arabic for Beginners\n');

  // ── CourseEnrollments ──────────────────────────────────────────────────────
  console.log('📋 Enrollments...');
  await prisma.courseEnrollment.createMany({
    data: [
      { courseId: course2.id, studentId: student1.id, progress: 30 }, // Omar → Tajweed
      { courseId: course3.id, studentId: student2.id, progress: 20 }, // Aisha → Arabic
      { courseId: course1.id, studentId: student3.id, progress: 50 }, // Yusuf → Quran Kids
    ],
  });
  console.log('   ✅ Omar  → Tajweed Basics           (30% progress)');
  console.log('   ✅ Aisha → Arabic for Beginners     (20% progress)');
  console.log('   ✅ Yusuf → Quran Reading for Kids   (50% progress)\n');

  // ── Past / completed sessions ──────────────────────────────────────────────
  console.log('📅 Past sessions (COMPLETED)...');

  // Session 1 — Omar + Sheikh Ahmed + Tajweed, 3 weeks ago
  const b1 = await prisma.booking.create({
    data: {
      courseId: course2.id,
      studentId: student1.id,
      teacherId: teacher1.id,
      scheduledAt: new Date('2026-05-09T10:00:00.000Z'),
      endTime:     new Date('2026-05-09T11:00:00.000Z'),
      status: BookingStatus.COMPLETED,
      meetingLink: 'https://meet.google.com/demo-past-1',
    },
  });
  await prisma.attendance.create({
    data: {
      bookingId: b1.id, studentId: student1.id, teacherId: teacher1.id,
      status: 'PRESENT',
      notes: 'Great progress with makharij al-huruf.',
      markedAt: new Date('2026-05-09T11:05:00.000Z'),
    },
  });
  await prisma.grade.create({
    data: {
      studentId: student1.id, teacherId: teacher1.id, courseId: course2.id, bookingId: b1.id,
      score: 78, maxScore: 100,
      label: 'Session 1 — Tajweed Assessment',
      notes: 'Good understanding of nun sakinah rules. Needs more work on qalqalah.',
      gradedAt: new Date('2026-05-09T11:10:00.000Z'),
    },
  });
  console.log('   ✅ Omar  — Tajweed Basics (May 9,  PRESENT, grade 78/100)');

  // Session 2 — Aisha + Ustazah Maryam + Arabic, 2 weeks ago
  const b2 = await prisma.booking.create({
    data: {
      courseId: course3.id,
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
      status: 'PRESENT',
      notes: 'Excellent retention of vocabulary from last session.',
      markedAt: new Date('2026-05-16T15:05:00.000Z'),
    },
  });
  await prisma.grade.create({
    data: {
      studentId: student2.id, teacherId: teacher2.id, courseId: course3.id, bookingId: b2.id,
      score: 85, maxScore: 100,
      label: 'Session 1 — Alphabet & Basic Vocabulary',
      notes: 'Strong grasp of the alphabet. Ready to move to basic vocabulary unit.',
      gradedAt: new Date('2026-05-16T15:10:00.000Z'),
    },
  });
  console.log('   ✅ Aisha — Arabic for Beginners (May 16, PRESENT, grade 85/100)');

  // Session 3 — Yusuf + Sheikh Ahmed + Quran Kids, 1 week ago
  const b3 = await prisma.booking.create({
    data: {
      courseId: course1.id,
      studentId: student3.id,
      teacherId: teacher1.id,
      scheduledAt: new Date('2026-05-23T11:00:00.000Z'),
      endTime:     new Date('2026-05-23T11:45:00.000Z'),
      status: BookingStatus.COMPLETED,
      meetingLink: 'https://meet.google.com/demo-past-3',
    },
  });
  await prisma.attendance.create({
    data: {
      bookingId: b3.id, studentId: student3.id, teacherId: teacher1.id,
      status: 'PRESENT',
      notes: 'Yusuf recited Surah Al-Fatiha perfectly. Mashallah.',
      markedAt: new Date('2026-05-23T11:50:00.000Z'),
    },
  });
  await prisma.grade.create({
    data: {
      studentId: student3.id, teacherId: teacher1.id, courseId: course1.id, bookingId: b3.id,
      score: 92, maxScore: 100,
      label: 'Surah Al-Fatiha Recitation',
      notes: 'Excellent pronunciation and memory. Ready for Surah Al-Ikhlas next session.',
      gradedAt: new Date('2026-05-23T11:55:00.000Z'),
    },
  });
  console.log('   ✅ Yusuf — Quran Reading for Kids (May 23, PRESENT, grade 92/100)\n');

  // ── Upcoming individual sessions (CONFIRMED) ───────────────────────────────
  console.log('📅 Upcoming sessions (CONFIRMED)...');

  await prisma.booking.create({
    data: {
      courseId: course2.id, studentId: student1.id, teacherId: teacher1.id,
      scheduledAt: new Date('2026-06-06T10:00:00.000Z'),
      endTime:     new Date('2026-06-06T11:00:00.000Z'),
      status: BookingStatus.CONFIRMED,
      meetingLink: 'https://meet.google.com/demo-upcoming-1',
    },
  });
  console.log('   ✅ Omar  — Tajweed Basics (Jun 6,  10:00–11:00)');

  await prisma.booking.create({
    data: {
      courseId: course3.id, studentId: student2.id, teacherId: teacher2.id,
      scheduledAt: new Date('2026-06-13T14:00:00.000Z'),
      endTime:     new Date('2026-06-13T15:00:00.000Z'),
      status: BookingStatus.CONFIRMED,
      meetingLink: 'https://meet.google.com/demo-upcoming-2',
    },
  });
  console.log('   ✅ Aisha — Arabic for Beginners (Jun 13, 14:00–15:00)');

  await prisma.booking.create({
    data: {
      courseId: course1.id, studentId: student3.id, teacherId: teacher1.id,
      scheduledAt: new Date('2026-06-20T11:00:00.000Z'),
      endTime:     new Date('2026-06-20T11:45:00.000Z'),
      status: BookingStatus.CONFIRMED,
      meetingLink: 'https://meet.google.com/demo-upcoming-3',
    },
  });
  console.log('   ✅ Yusuf — Quran Reading for Kids (Jun 20, 11:00–11:45)\n');

  // ── Recurring booking series (4 Fridays × 2 students = 8 rows) ────────────
  console.log('🔄 Recurring series (4 Fridays, Omar + Aisha, Tajweed with Sheikh Ahmed)...');
  const recurGroupId = `recur-demo-${Date.now()}`;

  const fridays = ['2026-06-05', '2026-06-12', '2026-06-19', '2026-06-26'];
  await prisma.booking.createMany({
    data: fridays.flatMap((d) => [
      {
        courseId: course2.id, studentId: student1.id, teacherId: teacher1.id,
        scheduledAt: new Date(`${d}T17:00:00.000Z`),
        endTime:     new Date(`${d}T18:00:00.000Z`),
        status: BookingStatus.CONFIRMED,
        meetingLink: 'https://meet.google.com/demo-recurring',
        recurrenceGroupId: recurGroupId,
      },
      {
        courseId: course2.id, studentId: student2.id, teacherId: teacher1.id,
        scheduledAt: new Date(`${d}T18:00:00.000Z`),
        endTime:     new Date(`${d}T19:00:00.000Z`),
        status: BookingStatus.CONFIRMED,
        meetingLink: 'https://meet.google.com/demo-recurring',
        recurrenceGroupId: recurGroupId,
      },
    ]),
  });
  console.log(`   ✅ 8 bookings created (group: ${recurGroupId})\n`);

  // ── Payments ───────────────────────────────────────────────────────────────
  console.log('💳 Payments...');
  await prisma.payment.create({
    data: {
      studentId: student1.id,
      amount: 149.99, currency: 'EUR',
      status: 'COMPLETED',
      description: 'Tajweed Basics — full course enrollment',
      paidAt: new Date('2026-05-01T09:00:00.000Z'),
      metadata: { course: 'Tajweed Basics', sessions: 16 },
    },
  });
  console.log('   ✅ Omar  — €149.99 COMPLETED (May 1)');

  await prisma.payment.create({
    data: {
      studentId: student2.id,
      amount: 129.99, currency: 'EUR',
      status: 'COMPLETED',
      description: 'Arabic for Beginners — full course enrollment',
      paidAt: new Date('2026-05-03T11:00:00.000Z'),
      metadata: { course: 'Arabic for Beginners', sessions: 20 },
    },
  });
  console.log('   ✅ Aisha — €129.99 COMPLETED (May 3)\n');

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
  console.log('   Teacher:  sheikh.ahmed@salam-institut.com');
  console.log('   Teacher:  ustazah.maryam@salam-institut.com');
  console.log('   Student:  omar.hassan@example.com');
  console.log('   Student:  aisha.khan@example.com');
  console.log('   Student:  yusuf.ali@example.com');
  console.log('');
  console.log('📊 Data summary:');
  console.log('   Users:          6  (1 admin, 2 teachers, 3 students)');
  console.log('   Courses:        3');
  console.log('   Bookings:      14  (3 past COMPLETED + 3 upcoming CONFIRMED + 8 recurring CONFIRMED)');
  console.log('   Attendance:     3  (one per completed session, all PRESENT)');
  console.log('   Grades:         3  (78, 85, 92 out of 100)');
  console.log('   Payments:       2  (€149.99 + €129.99, COMPLETED)');
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
