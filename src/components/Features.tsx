'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { BookOpen, Laptop, GraduationCap } from 'lucide-react';

export default function Features() {
  const t = useTranslations('features');
  const hero = useTranslations('hero');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const features = [
    {
      icon: GraduationCap,
      title: t('qualified.title'),
      description: t('qualified.description'),
      imageSrc: '/feature-qualified-teacher.png',
    },
    {
      icon: Laptop,
      title: t('interactive.title'),
      description: t('interactive.description'),
      imageSrc: '/feature-interactive-learning.png',
    },
    {
      icon: BookOpen,
      title: t('diverse.title'),
      description: t('diverse.description'),
      imageSrc: '/feature-diverse-methods.png',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 12 },
    },
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-[#FAF6F1]">
      {/* Islamic decorative patterns background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M50 0 L60 20 L50 40 L40 20 Z" fill="#C9A24D" />
              <circle cx="20" cy="20" r="3" fill="#D4AF6B" />
              <circle cx="80" cy="80" r="3" fill="#D4AF6B" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
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
        </motion.div>

        {/* Features Grid - 3 columns */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center"
            >
              {/* REAL PHOTO with Animation */}
              <motion.div
                className="relative w-full max-w-[280px] h-[280px] mx-auto mb-6 rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.08, rotate: 2 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Image
                  src={feature.imageSrc}
                  alt={feature.title}
                  fill
                  className="object-cover"
                />
                {/* Gradient overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                
                {/* Icon overlay */}
                <motion.div
                  className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-6 h-6 text-[#2B7A78]" />
                </motion.div>
              </motion.div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold text-[#2A2A2A] mb-3 font-serif">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed px-4">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats and CTA */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Left Stat */}
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <motion.svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <path d="M15 5 L20 10 L15 15 L10 10 Z" fill="#C9A24D" />
                <circle cx="15" cy="15" r="2" fill="#D4AF6B" />
              </motion.svg>
              <span className="text-4xl md:text-5xl font-bold text-[#C9A24D]">
                {isArabic ? '١٠٬٠٠٠+' : '+10,000'}
              </span>
              <motion.svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <path d="M15 5 L20 10 L15 15 L10 10 Z" fill="#C9A24D" />
                <circle cx="15" cy="15" r="2" fill="#D4AF6B" />
              </motion.svg>
            </div>
            <p className="text-gray-700 font-medium">
              {hero('studentsLearned')}
            </p>
          </motion.div>

          {/* Center CTA Button */}
          <Link href="/courses">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(47, 95, 84, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gradient-to-r from-[#2F6F68] to-[#3B6F5F] text-white font-bold rounded-2xl shadow-2xl text-lg"
            >
              {t('exploreAll')}
            </motion.button>
          </Link>

          {/* Right Stat */}
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <motion.svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <path d="M15 5 L20 10 L15 15 L10 10 Z" fill="#C9A24D" />
                <circle cx="15" cy="15" r="2" fill="#D4AF6B" />
              </motion.svg>
              <span className="text-4xl md:text-5xl font-bold text-[#C9A24D]">
                {isArabic ? '١٬٠٠٠+' : '+1,000'}
              </span>
              <motion.svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <path d="M15 5 L20 10 L15 15 L10 10 Z" fill="#C9A24D" />
                <circle cx="15" cy="15" r="2" fill="#D4AF6B" />
              </motion.svg>
            </div>
            <p className="text-gray-700 font-medium">
              {hero('premiumSessions')}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
