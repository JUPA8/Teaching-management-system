'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Play, Users, Award, Globe, BookOpen, Baby, Languages, GraduationCap, Calendar } from 'lucide-react';
import { FloatingElement } from './animations/MotionWrapper';

export default function Hero() {
  const t = useTranslations('hero');
  const common = useTranslations('common');

  // Updated statistics based on requirements
  const stats = [
    { icon: Users, value: '460+', label: t('students') || 'Students' },
    { icon: Award, value: '18', label: t('teachers') || 'Teachers' },
    { icon: Globe, value: '11', label: t('countries') || 'Countries' },
  ];

  // Course icons for the interactive circle
  const courseIcons = [
    { href: '/courses/quran-adults', icon: BookOpen, label: common('quranAdults'), position: 'top' },
    { href: '/courses/quran-kids', icon: Baby, label: common('quranKids'), position: 'right' },
    { href: '/courses/arabic', icon: Languages, label: common('arabic'), position: 'bottom' },
    { href: '/courses/islamic-studies', icon: GraduationCap, label: common('islamicStudies'), position: 'left' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const rotateVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 60,
        repeat: Infinity,
        ease: 'linear' as const,
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.2, 0.3, 0.2],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  // Get position classes for course icons around the circle
  const getIconPosition = (position: string) => {
    switch (position) {
      case 'top':
        return 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'right':
        return 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2';
      case 'bottom':
        return 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2';
      case 'left':
        return 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2';
      default:
        return '';
    }
  };

  return (
    <section className="relative overflow-hidden gradient-hero islamic-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            className="text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              {t('title')}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-primary-700 font-medium mb-4"
            >
              {t('subtitle')}
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              {t('description')}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/register" className="btn-primary text-lg inline-block">
                  {t('cta')}
                </Link>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                {common('learnMore')}
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-3 gap-6 mt-12"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="text-center lg:text-left cursor-pointer"
                >
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      <stat.icon className="w-5 h-5 text-primary-600" />
                    </motion.div>
                    <span className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Interactive Circles Section */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
          >
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main Course Circle */}
              <div className="relative w-80 h-80 mx-auto mb-8">
                {/* Rotating outer ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-dashed border-primary-300 opacity-30"
                  variants={rotateVariants}
                  animate="animate"
                />

                {/* Pulsing circles */}
                <motion.div
                  className="absolute inset-0 bg-primary-200 rounded-full"
                  variants={pulseVariants}
                  animate="animate"
                />
                <motion.div
                  className="absolute inset-8 bg-primary-300 rounded-full opacity-30"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.4, 0.3],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                />
                <motion.div
                  className="absolute inset-16 bg-primary-400 rounded-full opacity-40"
                  animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.4, 0.5, 0.4],
                  }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />

                {/* Main content circle with Quranic verse */}
                <motion.div
                  className="absolute inset-20 bg-white rounded-full shadow-2xl flex items-center justify-center"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, type: 'spring', stiffness: 100 }}
                >
                  <div className="text-center p-4">
                    <motion.div
                      className="text-4xl mb-2"
                      animate={{
                        rotateY: [0, 360],
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      📖
                    </motion.div>
                    <motion.p
                      className="text-base font-semibold text-gray-900 font-arabic leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      ﴿وَقُلْ رَبِّ زِدْنِي عِلْمًا﴾
                    </motion.p>
                    <motion.p
                      className="text-xs text-gray-500 mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      Taha 20:114
                    </motion.p>
                  </div>
                </motion.div>

                {/* Interactive Course Icons */}
                {courseIcons.map((course, index) => (
                  <motion.div
                    key={course.href}
                    className={`absolute ${getIconPosition(course.position)}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, type: 'spring' }}
                  >
                    <Link href={course.href}>
                      <motion.div
                        className="bg-white rounded-xl shadow-lg p-3 cursor-pointer group"
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <course.icon className="w-6 h-6 text-primary-600 group-hover:text-gold-500 transition-colors" />
                        <motion.div
                          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {course.label}
                        </motion.div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Second Circle - Free Trial Booking */}
              <motion.div
                className="relative w-48 h-48 mx-auto"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, type: 'spring' }}
              >
                {/* Pulsing background */}
                <motion.div
                  className="absolute inset-0 bg-gold-200 rounded-full"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Inner circle with CTA */}
                <Link href="/register">
                  <motion.div
                    className="absolute inset-4 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full shadow-xl flex items-center justify-center cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-center p-4">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Calendar className="w-8 h-8 text-white mx-auto mb-2" />
                      </motion.div>
                      <p className="text-white font-bold text-sm leading-tight">
                        {t('bookTrial') || 'Book Free Trial'}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated Wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <motion.svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.8 }}
          />
        </motion.svg>
      </div>
    </section>
  );
}
