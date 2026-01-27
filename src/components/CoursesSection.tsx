'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import CourseCard from './CourseCard';
import { courses } from '@/lib/data';

export default function CoursesSection() {
  const t = useTranslations('courses');
  const common = useTranslations('common');

  const featuredCourses = courses.slice(0, 4);

  const categories = [
    {
      href: '/courses/quran-adults',
      icon: '📖',
      bgColor: 'bg-primary-100',
      hoverBg: 'group-hover:bg-primary-500',
      title: t('quranAdults.title'),
      description: t('quranAdults.description'),
    },
    {
      href: '/courses/quran-kids',
      icon: '👶',
      bgColor: 'bg-amber-100',
      hoverBg: 'group-hover:bg-amber-500',
      title: t('quranKids.title'),
      description: t('quranKids.description'),
    },
    {
      href: '/courses/arabic',
      icon: '🔤',
      bgColor: 'bg-blue-100',
      hoverBg: 'group-hover:bg-blue-500',
      title: t('arabic.title'),
      description: t('arabic.description'),
    },
    {
      href: '/courses/islamic-studies',
      icon: '🕌',
      bgColor: 'bg-purple-100',
      hoverBg: 'group-hover:bg-purple-500',
      title: t('islamic.title'),
      description: t('islamic.description'),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('title')}
          </motion.h2>
          <motion.p
            className="section-subtitle max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* Course Categories */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {categories.map((category, index) => (
            <motion.div key={category.href} variants={itemVariants}>
              <Link href={category.href}>
                <motion.div
                  className="group p-6 bg-white rounded-xl shadow-md transition-all cursor-pointer h-full"
                  whileHover={{
                    y: -8,
                    boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className={`w-14 h-14 ${category.bgColor} rounded-xl flex items-center justify-center mb-4 transition-all duration-300`}
                    whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                  >
                    <motion.span
                      className="text-3xl"
                      animate={{ y: [0, -3, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    >
                      {category.icon}
                    </motion.span>
                  </motion.div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {category.description}
                  </p>
                  <motion.span
                    className="text-primary-600 text-sm font-medium flex items-center gap-1"
                    whileHover={{ x: 5 }}
                  >
                    {common('learnMore')}
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Courses */}
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {featuredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>

        {/* View All Link */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              {t('viewAll')}
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
