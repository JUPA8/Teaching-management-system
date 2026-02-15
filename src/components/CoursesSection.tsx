'use client';

import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function CoursesSection() {
  const t = useTranslations('courses');
  const common = useTranslations('common');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const categories = [
    {
      href: '/courses/quran-adults',
      title: t('quranAdults.title'),
      description: t('quranAdults.description'),
      bgGradient: 'from-[#3B6F5F] to-[#2F5F54]',
      imageSrc: '/course-quran-adults.png',
      oldIllustration: (
        <svg viewBox="0 0 150 150" className="w-full h-full">
          <ellipse cx="75" cy="130" rx="50" ry="10" fill="#E8DCC8" opacity="0.3" />
          {/* Open Quran */}
          <path d="M75 40 L75 110 L120 105 L120 35 Z" fill="#F9F4E8" stroke="#C9A24D" strokeWidth="2" />
          <path d="M75 40 L75 110 L30 105 L30 35 Z" fill="#FAF6F1" stroke="#C9A24D" strokeWidth="2" />
          {/* Arabic text lines */}
          <line x1="85" y1="50" x2="110" y2="48" stroke="#3B6F5F" strokeWidth="1.5" />
          <line x1="85" y1="60" x2="110" y2="58" stroke="#3B6F5F" strokeWidth="1.5" />
          <line x1="85" y1="70" x2="110" y2="68" stroke="#3B6F5F" strokeWidth="1.5" />
          <line x1="85" y1="80" x2="110" y2="78" stroke="#3B6F5F" strokeWidth="1.5" />
          <line x1="40" y1="50" x2="65" y2="48" stroke="#3B6F5F" strokeWidth="1.5" />
          <line x1="40" y1="60" x2="65" y2="58" stroke="#3B6F5F" strokeWidth="1.5" />
          <line x1="40" y1="70" x2="65" y2="68" stroke="#3B6F5F" strokeWidth="1.5" />
          <line x1="40" y1="80" x2="65" y2="78" stroke="#3B6F5F" strokeWidth="1.5" />
          {/* Bookmark */}
          <path d="M75 35 L75 80 L70 75 L65 80 L65 35 Z" fill="#C9A24D" />
          {/* Decorative stars */}
          <circle cx="20" cy="30" r="3" fill="#D4AF6B" opacity="0.6" />
          <circle cx="130" cy="25" r="4" fill="#C9A24D" opacity="0.5" />
        </svg>
      ),
    },
    {
      href: '/courses/quran-kids',
      title: t('quranKids.title'),
      description: t('quranKids.description'),
      bgGradient: 'from-[#C19A6B] to-[#B8935F]',
      imageSrc: '/course-quran-kids.png',
      oldIllustration: (
        <svg viewBox="0 0 150 150" className="w-full h-full">
          <ellipse cx="75" cy="135" rx="50" ry="10" fill="#E8DCC8" opacity="0.3" />
          {/* Happy child reading */}
          <circle cx="75" cy="60" r="20" fill="#C19A6B" />
          {/* Smile */}
          <path d="M65 62 Q75 68 85 62" stroke="#2A2A2A" strokeWidth="2" fill="none" />
          {/* Eyes */}
          <circle cx="68" cy="55" r="2" fill="#2A2A2A" />
          <circle cx="82" cy="55" r="2" fill="#2A2A2A" />
          {/* Body */}
          <rect x="60" y="78" width="30" height="35" rx="5" fill="#3B6F5F" />
          {/* Small Quran in hands */}
          <rect x="65" y="85" width="20" height="15" rx="2" fill="#D4AF6B" />
          <line x1="70" y1="90" x2="80" y2="90" stroke="#2F5F54" strokeWidth="1" />
          <line x1="70" y1="95" x2="80" y2="95" stroke="#2F5F54" strokeWidth="1" />
          {/* Legs */}
          <rect x="63" y="113" width="10" height="20" rx="3" fill="#2A2A2A" />
          <rect x="77" y="113" width="10" height="20" rx="3" fill="#2A2A2A" />
          {/* Decorative elements */}
          <circle cx="30" cy="40" r="4" fill="#C9A24D" opacity="0.5" />
          <circle cx="120" cy="50" r="3" fill="#D4AF6B" opacity="0.6" />
          <path d="M110 80 L115 85 L110 90" fill="#C9A24D" opacity="0.4" />
        </svg>
      ),
    },
    {
      href: '/courses/arabic',
      title: t('arabic.title'),
      description: t('arabic.description'),
      bgGradient: 'from-[#2F6F68] to-[#267169]',
      imageSrc: '/course-arabic-language.png',
      oldIllustration: (
        <svg viewBox="0 0 150 150" className="w-full h-full">
          <ellipse cx="75" cy="130" rx="50" ry="10" fill="#E8DCC8" opacity="0.3" />
          {/* Calligraphy pen */}
          <path d="M50 100 L60 40 L65 40 L55 100 Z" fill="#2A2A2A" />
          <circle cx="62.5" cy="35" r="5" fill="#C9A24D" />
          {/* Arabic letters */}
          <text x="75" y="60" fontSize="32" fill="#3B6F5F" fontFamily="serif" fontWeight="bold">ع</text>
          <text x="90" y="80" fontSize="28" fill="#C19A6B" fontFamily="serif" fontWeight="bold">ر</text>
          <text x="65" y="95" fontSize="30" fill="#2F5F54" fontFamily="serif" fontWeight="bold">ب</text>
          {/* Paper/scroll */}
          <rect x="70" y="100" width="60" height="30" rx="3" fill="#FAF6F1" stroke="#C9A24D" strokeWidth="1.5" />
          <line x1="75" y1="110" x2="120" y2="110" stroke="#D4AF6B" strokeWidth="1" opacity="0.6" />
          <line x1="75" y1="118" x2="115" y2="118" stroke="#D4AF6B" strokeWidth="1" opacity="0.6" />
          {/* Decorative */}
          <circle cx="30" cy="50" r="4" fill="#C9A24D" opacity="0.4" />
          <circle cx="120" cy="45" r="3" fill="#D4AF6B" opacity="0.5" />
        </svg>
      ),
    },
    {
      href: '/courses/islamic-studies',
      title: t('islamic.title'),
      description: t('islamic.description'),
      bgGradient: 'from-[#D4AF37] to-[#C9A24D]',
      imageSrc: '/course-islamic-studies.png',
      oldIllustration: (
        <svg viewBox="0 0 150 150" className="w-full h-full">
          <ellipse cx="75" cy="135" rx="50" ry="10" fill="#E8DCC8" opacity="0.3" />
          {/* Mosque/Dome */}
          <path d="M75 30 Q60 45 60 60 L90 60 Q90 45 75 30 Z" fill="#3B6F5F" />
          <rect x="65" y="60" width="20" height="40" rx="2" fill="#2F5F54" />
          {/* Minaret */}
          <rect x="40" y="50" width="10" height="50" fill="#C19A6B" />
          <path d="M35 50 L40 40 L50 40 L55 50 Z" fill="#D4AF6B" />
          <circle cx="45" cy="37" r="4" fill="#C9A24D" />
          {/* Books stack */}
          <rect x="90" y="95" width="35" height="8" rx="1" fill="#3B6F5F" />
          <rect x="92" y="87" width="33" height="8" rx="1" fill="#C19A6B" />
          <rect x="90" y="79" width="35" height="8" rx="1" fill="#2F5F54" />
          {/* Crescent */}
          <path d="M75 20 Q72 25 75 30 Q80 27 75 20" fill="#C9A24D" />
          {/* Decorative stars */}
          <circle cx="25" cy="35" r="3" fill="#D4AF6B" opacity="0.6" />
          <circle cx="125" cy="40" r="4" fill="#C9A24D" opacity="0.5" />
          <circle cx="110" cy="60" r="3" fill="#D4AF6B" opacity="0.5" />
        </svg>
      ),
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
    <section className="py-16 md:py-24 relative overflow-hidden bg-[#F5EFE7]">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="courses-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="2" fill="#C9A24D" />
              <path d="M40 20 L45 30 L40 40 L35 30 Z" fill="#D4AF6B" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#courses-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2A2A2A] mb-4 font-serif"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('title')}
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* Course Cards Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category, index) => (
            <motion.div key={category.href} variants={itemVariants}>
              <motion.div
                className="group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden h-full flex flex-col"
                whileHover={{ y: -10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Top gradient decoration */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category.bgGradient}`} />
                
                {/* Corner decorations */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#C9A24D] opacity-30" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#C9A24D] opacity-30" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#C9A24D] opacity-30" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#C9A24D] opacity-30" />

                {/* REAL PHOTO */}
                <motion.div
                  className="relative w-full h-52 mb-6 rounded-2xl overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <Image
                    src={category.imageSrc}
                    alt={category.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#2A2A2A] mb-3 font-serif group-hover:text-[#3B6F5F] transition-colors">
                  {category.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                  {category.description}
                </p>

                {/* Book Free Trial Button */}
                <Link href="/probestunde">
                  <motion.div
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3B6F5F] to-[#2F5F54] text-white font-semibold rounded-xl hover:from-[#2F5F54] hover:to-[#3B6F5F] transition-all shadow-md hover:shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{common('bookTrial')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
