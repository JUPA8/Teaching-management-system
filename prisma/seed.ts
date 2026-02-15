import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@salam-institut.com' },
    update: {},
    create: {
      email: 'admin@salam-institut.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample courses
  const courses = [
    {
      name: 'Quran for Kids',
      nameAr: 'القرآن للأطفال',
      nameDe: 'Koran für Kinder',
      description: 'Interactive Quran learning for children aged 6-12',
      descriptionAr: 'تعليم القرآن التفاعلي للأطفال من 6 إلى 12 سنة',
      descriptionDe: 'Interaktives Koran-Lernen für Kinder im Alter von 6-12',
      type: 'QURAN_KIDS' as const,
      price: 99.99,
      duration: 45,
      totalSessions: 12,
      level: 'Beginner',
      ageGroup: 'Kids (6-12)',
      isActive: true,
    },
    {
      name: 'Quran for Adults',
      nameAr: 'القرآن للبالغين',
      nameDe: 'Koran für Erwachsene',
      description: 'Comprehensive Quran study with Tajweed for adults',
      descriptionAr: 'دراسة شاملة للقرآن مع التجويد للبالغين',
      descriptionDe: 'Umfassendes Koran-Studium mit Tajweed für Erwachsene',
      type: 'QURAN_ADULTS' as const,
      price: 149.99,
      duration: 60,
      totalSessions: 16,
      level: 'All Levels',
      ageGroup: 'Adults (18+)',
      isActive: true,
    },
    {
      name: 'Arabic Language',
      nameAr: 'اللغة العربية',
      nameDe: 'Arabische Sprache',
      description: 'Learn modern standard Arabic with native speakers',
      descriptionAr: 'تعلم اللغة العربية الفصحى الحديثة مع متحدثين أصليين',
      descriptionDe: 'Lernen Sie modernes Standardarabisch mit Muttersprachlern',
      type: 'ARABIC_LANGUAGE' as const,
      price: 129.99,
      duration: 60,
      totalSessions: 20,
      level: 'Beginner',
      ageGroup: 'All Ages',
      isActive: true,
    },
    {
      name: 'Islamic Studies',
      nameAr: 'الدراسات الإسلامية',
      nameDe: 'Islamische Studien',
      description: 'Comprehensive Islamic knowledge including Fiqh, Hadith, and Seerah',
      descriptionAr: 'معرفة إسلامية شاملة تشمل الفقه والحديث والسيرة',
      descriptionDe: 'Umfassendes islamisches Wissen einschließlich Fiqh, Hadith und Seerah',
      type: 'ISLAMIC_STUDIES' as const,
      price: 119.99,
      duration: 90,
      totalSessions: 15,
      level: 'Intermediate',
      ageGroup: 'Adults (18+)',
      isActive: true,
    },
  ];

  for (const courseData of courses) {
    const course = await prisma.course.upsert({
      where: { id: courseData.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: courseData,
    });
    console.log('✅ Course created:', course.name);
  }

  console.log('🎉 Database seeded successfully!');
  console.log('\n📧 Admin Login Credentials:');
  console.log('   Email: admin@salam-institut.com');
  console.log('   Password: Admin123!');
  console.log('\n🌐 Access admin dashboard at: http://localhost:3000/admin');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
