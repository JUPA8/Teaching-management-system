'use client';

import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Award, Globe, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

// Helper function to convert numbers to Arabic numerals
const toArabicNumerals = (num: string): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.replace(/[0-9]/g, (d) => arabicNumerals[parseInt(d)]);
};

// Hero images carousel - Natural learning scenes (NO mixing of men and women)
const heroImages = [
  '/hero-learning-1.png', // Man reading Quran in mosque
  '/hero-learning-2.png', // Woman studying by window
  '/hero-learning-3.png', // Child learning with teacher
  '/hero-learning-women-only.png', // Woman studying with Quran - NO MIXING
];

export default function Hero() {
  const t = useTranslations('hero');
  const common = useTranslations('common');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Helper to format numbers based on locale
  const formatNumber = (value: string) => {
    return isArabic ? toArabicNumerals(value) : value;
  };

  // Updated statistics
  const stats = [
    { icon: Users, value: '10,000+', label: t('students') || 'Students' },
    { icon: Award, value: '50+', label: t('teachers') || 'Teachers' },
    { icon: Globe, value: '15+', label: t('countries') || 'Countries' },
  ];

  return (
    <section className="relative bg-[#F9F4E8] py-20 overflow-hidden">
      {/* Animated Decorative Elements - Islamic Style */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Islamic Geometric Patterns */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-[#C9A24D]/20 to-[#D4AF6B]/10 backdrop-blur-sm border border-[#C9A24D]/30"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-2 rounded-full border-2 border-[#C9A24D]/40" />
        </motion.div>

        <motion.div
          className="absolute top-40 left-20 w-16 h-16 rounded-full bg-gradient-to-br from-[#3B6F5F]/20 to-[#2F5F54]/10 backdrop-blur-sm border border-[#3B6F5F]/30"
          animate={{
            y: [0, 40, 0],
            x: [0, 20, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-60 left-32 w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A24D]/30 to-transparent backdrop-blur-sm"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#D4AF6B]/40 to-transparent" />
        </motion.div>

        <motion.div
          className="absolute top-[30%] left-[8%] w-8 h-8 rounded-full bg-[#C9A24D]/20 backdrop-blur-sm border border-[#C9A24D]/40"
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-[50%] left-[5%] w-10 h-10 rounded-full bg-gradient-to-br from-[#3B6F5F]/15 to-transparent backdrop-blur-sm"
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-[20%] left-[15%] w-6 h-6 rounded-full bg-[#C9A24D]/40 blur-sm"
          animate={{
            y: [0, -50, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Decorative Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-[#C9A24D]/30 shadow-lg"
            >
              <Award className="w-4 h-4 text-[#C9A24D]" />
              <span className="text-sm font-medium text-[#3B6F5F]">
                {t('badge')}
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-4 text-[#2A2A2A]">
                <span className="text-[#2A2A2A]">{t('welcomeTo')}</span>
                <br />
                <span className="text-[#C9A24D]">{t('salamInstitute')}</span>
              </h1>
              
              {/* Golden Underline Decoration */}
              <div className="flex items-center gap-2 mt-4">
                <div className="h-1 w-20 bg-gradient-to-r from-[#C9A24D] to-[#D4AF6B] rounded-full shadow-lg" />
                <div className="w-2 h-2 bg-[#C9A24D] rounded-full shadow-lg" />
                <div className="h-1 w-12 bg-gradient-to-r from-[#D4AF6B] to-transparent rounded-full" />
              </div>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-lg"
            >
              {t('mainDescription')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(201, 162, 77, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#2F6F68] to-[#3B6F5F] text-white font-semibold rounded-2xl shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C9A24D] to-[#D4AF6B] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {t('startFreeTrial')}
                  </span>
                </motion.button>
              </Link>

              <Link href="/courses">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-white text-[#3B6F5F] font-semibold rounded-2xl border-2 border-[#C9A24D]/30 hover:border-[#C9A24D] hover:bg-white transition-all shadow-lg"
                >
                  {t('exploreCourses')}
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-3 gap-6 pt-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-2 bg-gradient-to-br from-[#3B6F5F]/20 to-[#C9A24D]/20 rounded-xl">
                    <stat.icon className="w-6 h-6 text-[#3B6F5F]" />
                  </div>
                  <div className="text-3xl font-bold text-[#C9A24D] mb-1">
                    {formatNumber(stat.value)}
                  </div>
                  <div className="text-sm text-[#6B5D54]">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Image/Illustration with Carousel - BIGGER FRAME */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative"
          >
            <div className="relative w-full h-[550px] md:h-[650px] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#D9B574]/30">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={heroImages[currentImageIndex]}
                    alt={t('illustration')}
                    fill
                    className="object-cover"
                    priority={currentImageIndex === 0}
                    quality={100}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Carousel Indicators */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'bg-[#C9A24D] w-8'
                      : 'bg-[#C9A24D]/30 hover:bg-[#C9A24D]/50'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Decorative elements around image */}
            <motion.div
              className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#C9A24D]/30 to-transparent rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <motion.div
              className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-[#3B6F5F]/30 to-transparent rounded-full blur-2xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

        </div>
      </div>

      {/* Bottom Decorative Border */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#3B6F5F] via-[#C9A24D] to-[#3B6F5F]" />
    </section>
  );
}
