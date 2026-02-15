'use client';

import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Clock, Award, Star, Check } from 'lucide-react';
import CourseCard from '@/components/CourseCard';
import { courses } from '@/lib/data';
import { useTranslations, useLocale } from 'next-intl';
import IslamicDivider from '@/components/IslamicDivider';
import Image from 'next/image';

export default function CoursesPage() {
  const t = useTranslations('courses');
  const common = useTranslations('common');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const categories = [
    {
      key: 'quran-adults',
      href: '/courses/quran-adults',
      title: t('quranAdults.title'),
      description: t('quranAdults.description'),
      image: '/course-quran-adults.png',
      bgGradient: 'from-[#2B7A78] to-[#236260]',
      features: [
        isArabic ? 'تجويد احترافي' : 'Professional Tajweed',
        isArabic ? 'حفظ متقن' : 'Memorization',
        isArabic ? 'تفسير' : 'Tafsir',
        isArabic ? 'إجازة' : 'Ijazah',
      ],
    },
    {
      key: 'quran-kids',
      href: '/courses/quran-kids',
      title: t('quranKids.title'),
      description: t('quranKids.description'),
      image: '/course-quran-kids.png',
      bgGradient: 'from-[#D9B574] to-[#C9A551]',
      features: [
        isArabic ? 'طرق تفاعلية' : 'Interactive Methods',
        isArabic ? 'ألعاب تعليمية' : 'Educational Games',
        isArabic ? 'مكافآت' : 'Rewards System',
        isArabic ? 'تقارير للوالدين' : 'Parent Reports',
      ],
    },
    {
      key: 'arabic',
      href: '/courses/arabic',
      title: t('arabic.title'),
      description: t('arabic.description'),
      image: '/course-arabic-language.png',
      bgGradient: 'from-[#2F6F68] to-[#267169]',
      features: [
        isArabic ? 'قواعد شاملة' : 'Complete Grammar',
        isArabic ? 'محادثة' : 'Conversation',
        isArabic ? 'كتابة' : 'Writing',
        isArabic ? 'عربية قرآنية' : 'Quranic Arabic',
      ],
    },
    {
      key: 'islamic',
      href: '/courses/islamic-studies',
      title: t('islamic.title'),
      description: t('islamic.description'),
      image: '/course-islamic-studies.png',
      bgGradient: 'from-[#C9A551] to-[#B18C41]',
      features: [
        isArabic ? 'فقه' : 'Fiqh',
        isArabic ? 'عقيدة' : 'Aqidah',
        isArabic ? 'سيرة' : 'Seerah',
        isArabic ? 'حديث' : 'Hadith',
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F4E8] via-[#FAF6F1] to-[#F5EFE7]">
      {/* Hero Section */}
      <motion.section
        className="relative py-20 md:py-32 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 bg-primary-500 opacity-10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-500 opacity-10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-xl mx-auto">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2A2A2A] mb-6 font-serif">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('subtitle')}
            </p>
          </motion.div>

          {/* Categories Grid - Image-based Cards */}
          <motion.div
            className="grid md:grid-cols-2 gap-8 mb-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {categories.map((category, index) => (
              <motion.div key={category.key} variants={itemVariants}>
                <Link href={category.href}>
                  <motion.div
                    className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 h-full"
                    whileHover={{ y: -10, scale: 1.02 }}
                  >
                    {/* Image Section */}
                    <div className="relative h-72 overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        quality={100}
                      />
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${category.bgGradient} opacity-60 group-hover:opacity-40 transition-opacity`} />
                      
                      {/* Title on Image */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                        <h3 className="text-3xl font-bold mb-2 font-serif drop-shadow-lg">
                          {category.title}
                        </h3>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        {category.description}
                      </p>

                      {/* Features Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {category.features.map((feature, i) => (
                          <motion.div
                            key={i}
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-primary-500" />
                            </div>
                            <span className="text-sm text-gray-700">{feature}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* CTA */}
                      <motion.div
                        className="flex items-center justify-between pt-4 border-t border-gray-200"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-primary-500 font-semibold">
                          {common('learnMore')}
                        </span>
                        <ArrowRight className="w-5 h-5 text-primary-500 group-hover:translate-x-2 transition-transform" />
                      </motion.div>
                    </div>

                    {/* Corner decorations */}
                    <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-white/30 opacity-50" />
                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-white/30 opacity-50" />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <IslamicDivider />

      {/* All Courses Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#2A2A2A] mb-4 font-serif">
              {t('allCourses')}
            </h2>
            <p className="text-lg text-gray-600">
              {isArabic ? 'استكشف مجموعتنا الكاملة من الدورات' : 'Explore our complete collection of courses'}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
