'use client';

import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Users, Award, Globe } from 'lucide-react';
import { IslamicArch, IslamicLantern, GoldLeaf } from './decorative';

// Helper function to convert numbers to Arabic numerals
const toArabicNumerals = (num: string): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.replace(/[0-9]/g, (d) => arabicNumerals[parseInt(d)]);
};

export default function Hero() {
  const t = useTranslations('hero');
  const common = useTranslations('common');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  // Helper to format numbers based on locale
  const formatNumber = (value: string) => {
    return isArabic ? toArabicNumerals(value) : value;
  };

  // Updated statistics based on requirements
  const stats = [
    { icon: Users, value: '460+', label: t('students') || 'Students' },
    { icon: Award, value: '18', label: t('teachers') || 'Teachers' },
    { icon: Globe, value: '11', label: t('countries') || 'Countries' },
  ];

  // Course icons for the interactive circle - with course names
  const courseIcons = [
    { href: '/courses/quran-kids', emoji: '👶', label: common('quranKids'), position: 'top' },
    { href: '/courses/quran-adults', emoji: '📖', label: common('quranAdults'), position: 'right' },
    { href: '/courses/arabic', emoji: '🔤', label: common('arabic'), position: 'bottom' },
    { href: '/courses/islamic-studies', emoji: '🕌', label: common('islamicStudies'), position: 'left' },
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

  // Slower rotation for outer ring
  const rotateVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 45,
        repeat: Infinity,
        ease: 'linear' as const,
      },
    },
  };

  // Counter rotation for inner elements
  const counterRotateVariants = {
    animate: {
      rotate: -360,
      transition: {
        duration: 45,
        repeat: Infinity,
        ease: 'linear' as const,
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.3, 0.5, 0.3],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  // Golden glow animation for the main circle
  const glowVariants = {
    animate: {
      boxShadow: [
        '0 0 50px rgba(177, 140, 93, 0.3)',
        '0 0 80px rgba(177, 140, 93, 0.5)',
        '0 0 50px rgba(177, 140, 93, 0.3)',
      ],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  // Shimmer animation
  const shimmerVariants = {
    animate: {
      background: [
        'linear-gradient(135deg, rgba(177, 140, 93, 0.2) 0%, rgba(61, 107, 101, 0.15) 50%, rgba(177, 140, 93, 0.2) 100%)',
        'linear-gradient(135deg, rgba(61, 107, 101, 0.15) 0%, rgba(177, 140, 93, 0.2) 50%, rgba(61, 107, 101, 0.15) 100%)',
        'linear-gradient(135deg, rgba(177, 140, 93, 0.2) 0%, rgba(61, 107, 101, 0.15) 50%, rgba(177, 140, 93, 0.2) 100%)',
      ],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  // Get position for orbiting course icons
  const getOrbitPosition = (position: string) => {
    switch (position) {
      case 'top':
        return { top: '-30px', left: '50%', transform: 'translateX(-50%)' };
      case 'right':
        return { top: '50%', right: '-30px', transform: 'translateY(-50%)' };
      case 'bottom':
        return { bottom: '-30px', left: '50%', transform: 'translateX(-50%)' };
      case 'left':
        return { top: '50%', left: '-30px', transform: 'translateY(-50%)' };
      default:
        return {};
    }
  };

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center" style={{ background: 'linear-gradient(135deg, #FAF6F1 0%, #F5EFE7 100%)' }}>
      {/* Decorative lanterns */}
      <motion.div
        className="absolute top-10 left-10 opacity-60"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 0.6 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <IslamicLantern className="w-16 h-24" />
      </motion.div>
      <motion.div
        className="absolute top-10 right-10 opacity-60"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 0.6 }}
        transition={{ duration: 1, delay: 0.7 }}
      >
        <IslamicLantern className="w-16 h-24" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            className="text-center lg:text-start relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6 leading-tight font-serif"
            >
              {t('title')}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-secondary-500 font-medium mb-4 font-serif"
            >
              {t('subtitle')}
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-lg text-charcoal-light mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
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
                  {t('bookTrial') || 'Book Free Trial'}
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/about" className="btn-secondary flex items-center justify-center gap-2">
                  {common('learnMore')}
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats with gold leaf decorations */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-3 gap-6 mt-12 relative"
            >
              <GoldLeaf className="absolute -left-8 top-1/2 -translate-y-1/2 w-12 h-12 opacity-30" side="left" />
              <GoldLeaf className="absolute -right-8 top-1/2 -translate-y-1/2 w-12 h-12 opacity-30" side="right" />
              
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="text-center cursor-pointer"
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      <stat.icon className="w-5 h-5 text-secondary-500" />
                    </motion.div>
                    <span className="text-2xl font-bold text-charcoal" dir={isArabic ? 'rtl' : 'ltr'}>
                      {formatNumber(stat.value)}
                    </span>
                  </div>
                  <p className="text-sm text-charcoal-light">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Interactive Circle Section with Islamic Arch Frame */}
          <motion.div
            className="relative hidden lg:flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, type: 'spring' }}
          >
            <div className="relative">
              {/* Islamic Arch Frame - Decorative */}
              <motion.div
                className="absolute -inset-16 z-0"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.5 }}
              >
                <IslamicArch className="w-full h-full" strokeColor="#3B6F5F" />
              </motion.div>

              {/* Main Course Circle - Expanded to 520px */}
              <div className="relative w-[520px] h-[520px] z-10">
                {/* Outer rotating ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-dashed border-secondary-300 opacity-50"
                  variants={rotateVariants}
                  animate="animate"
                />

                {/* Second rotating ring - opposite direction */}
                <motion.div
                  className="absolute inset-6 rounded-full border-2 border-dotted border-primary-300 opacity-40"
                  variants={counterRotateVariants}
                  animate="animate"
                />

                {/* Golden glow aura */}
                <motion.div
                  className="absolute inset-8 rounded-full"
                  variants={glowVariants}
                  animate="animate"
                />

                {/* Shimmer effect layer */}
                <motion.div
                  className="absolute inset-12 rounded-full"
                  variants={shimmerVariants}
                  animate="animate"
                />

                {/* Pulsing circles with golden-teal gradient */}
                <motion.div
                  className="absolute inset-16 rounded-full"
                  style={{ background: 'linear-gradient(135deg, rgba(177, 140, 93, 0.2) 0%, rgba(61, 107, 101, 0.15) 100%)' }}
                  variants={pulseVariants}
                  animate="animate"
                />
                <motion.div
                  className="absolute inset-24 rounded-full"
                  style={{ background: 'linear-gradient(135deg, rgba(177, 140, 93, 0.25) 0%, rgba(61, 107, 101, 0.2) 100%)' }}
                  animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.4, 0.6, 0.4],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                />
                <motion.div
                  className="absolute inset-32 rounded-full"
                  style={{ background: 'linear-gradient(135deg, rgba(177, 140, 93, 0.3) 0%, rgba(61, 107, 101, 0.25) 100%)' }}
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.7, 0.5],
                  }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />

                {/* Main content circle with Quranic verse - Warmer background */}
                <motion.div
                  className="absolute inset-36 rounded-full shadow-2xl flex items-center justify-center border-3"
                  style={{ 
                    background: 'linear-gradient(135deg, #FAF6F1 0%, #F5EFE7 100%)',
                    borderColor: '#C19A6B',
                    boxShadow: '0 0 50px rgba(193, 154, 107, 0.4), inset 0 2px 4px rgba(255,255,255,0.5)'
                  }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, type: 'spring', stiffness: 100 }}
                >
                  <div className="text-center p-6" dir="rtl">
                    <motion.div
                      className="text-6xl mb-4"
                      animate={{
                        rotateY: [0, 360],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        rotateY: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
                        scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                      }}
                    >
                      📖
                    </motion.div>
                    <motion.p
                      className="text-xl font-bold text-charcoal font-arabic leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      ﴿وَقُلْ رَبِّ زِدْنِي عِلْمًا﴾
                    </motion.p>
                    <motion.p
                      className="text-sm text-secondary-500 mt-3 font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      dir="ltr"
                    >
                      طه ٢٠:١١٤
                    </motion.p>
                  </div>
                </motion.div>

                {/* Orbiting Course Icons with Names - Traditional styling */}
                {courseIcons.map((course, index) => (
                  <motion.div
                    key={course.href}
                    className="absolute"
                    style={getOrbitPosition(course.position)}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      delay: 0.8 + index * 0.15,
                      type: 'spring',
                      stiffness: 120,
                    }}
                  >
                    <Link href={course.href}>
                      <motion.div
                        className="rounded-2xl shadow-xl p-3 cursor-pointer group border-2 flex flex-col items-center min-w-[100px]"
                        style={{
                          background: 'linear-gradient(135deg, #FAF6F1 0%, #F5EFE7 100%)',
                          borderColor: '#C19A6B',
                          boxShadow: '0 8px 25px rgba(193, 154, 107, 0.3)'
                        }}
                        whileHover={{
                          scale: 1.15,
                          y: -5,
                          boxShadow: '0 15px 40px rgba(193, 154, 107, 0.5)',
                        }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                          y: [0, -6, 0],
                        }}
                        transition={{
                          y: {
                            duration: 2.5,
                            repeat: Infinity,
                            delay: index * 0.4,
                            ease: 'easeInOut',
                          }
                        }}
                      >
                        <motion.span
                          className="text-3xl block mb-1"
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                        >
                          {course.emoji}
                        </motion.span>
                        <span className="text-xs font-semibold text-charcoal text-center leading-tight group-hover:text-primary-500 transition-colors">
                          {course.label}
                        </span>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}

                {/* Floating particles around the circle */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-secondary-400 rounded-full opacity-40"
                    style={{
                      left: `${50 + 45 * Math.cos((i * Math.PI * 2) / 8)}%`,
                      top: `${50 + 45 * Math.sin((i * Math.PI * 2) / 8)}%`,
                    }}
                    animate={{
                      scale: [0.5, 1.2, 0.5],
                      opacity: [0.2, 0.6, 0.2],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated Wave separator - Cream color */}
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
            fill="#F9F3EA"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.8 }}
          />
        </motion.svg>
      </div>
    </section>
  );
}
