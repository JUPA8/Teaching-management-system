'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Users, Award, Globe, GraduationCap, BookOpen, Star, Calendar, Video, MessageCircle, CheckCircle, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const teacherKeys = ['ahmad', 'fatima', 'mariam', 'omar', 'ibrahim'] as const;
const teacherExperience: Record<typeof teacherKeys[number], number> = {
  ahmad: 15,
  fatima: 12,
  mariam: 8,
  omar: 18,
  ibrahim: 10,
};

// Gender mapping for teachers (to ensure proper imagery)
const teacherGender: Record<typeof teacherKeys[number], 'male' | 'female'> = {
  ahmad: 'male',
  fatima: 'female',
  mariam: 'female',
  omar: 'male',
  ibrahim: 'male',
};

// Islamic patterns for each teacher card background
const teacherPatterns: Record<typeof teacherKeys[number], string> = {
  ahmad: 'M25,25 L75,25 L75,75 L25,75 Z M35,35 L65,35 L65,65 L35,65 Z',
  fatima: 'M50,20 L65,35 L65,65 L50,80 L35,65 L35,35 Z',
  mariam: 'M30,30 Q50,15 70,30 T70,70 Q50,85 30,70 T30,30',
  omar: 'M40,25 L60,25 L75,50 L60,75 L40,75 L25,50 Z',
  ibrahim: 'M50,25 L60,40 L75,40 L65,50 L70,65 L50,55 L30,65 L35,50 L25,40 L40,40 Z',
};

const teacherColors: Record<typeof teacherKeys[number], { from: string; to: string; accent: string }> = {
  ahmad: { from: '#2B7A78', to: '#1a5856', accent: '#D9B574' },
  fatima: { from: '#D9B574', to: '#b8964d', accent: '#2B7A78' },
  mariam: { from: '#8B4513', to: '#6b3410', accent: '#D9B574' },
  omar: { from: '#2B7A78', to: '#1a5856', accent: '#8B4513' },
  ibrahim: { from: '#5F9EA0', to: '#4a7c7e', accent: '#D9B574' },
};

export default function TeachersPage() {
  const t = useTranslations('teachers');
  const locale = useLocale();

  // Helper function to convert numbers to Arabic numerals
  const toArabicNumerals = (num: string | number): string => {
    const str = num.toString();
    if (locale !== 'ar') return str;
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return str.replace(/[0-9]/g, (d) => arabicNumerals[parseInt(d)]);
  };

  const stats = [
    { value: '18', label: t('stats.qualified'), icon: GraduationCap, color: 'from-[#2B7A78] to-[#1a5856]' },
    { value: '11', label: t('stats.countries'), icon: Globe, color: 'from-[#D9B574] to-[#b8964d]' },
    { value: '10+', label: t('stats.languages'), icon: BookOpen, color: 'from-[#8B4513] to-[#6b3410]' },
    { value: '460+', label: t('stats.students'), icon: Users, color: 'from-[#5F9EA0] to-[#4a7c7e]' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 80, damping: 12 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] via-white to-[#F5F0E8]">
      {/* Premium Split-Screen Hero */}
      <div className="relative min-h-[600px] md:min-h-[700px] overflow-hidden">
        {/* Split Screen Layout */}
        <div className="grid md:grid-cols-2 h-full">
          {/* Left Side - Content */}
          <div className="relative bg-gradient-to-br from-[#2B7A78] to-[#1a5856] py-20 px-6 md:px-12 flex items-center">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <Image
                src="/teacher-hero-background.png"
                alt={t('heroEducationAlt')}
                fill
                className="object-cover"
              />
            </div>

            <div className="relative z-10 max-w-xl">
              {/* Excellence Badge */}
              <motion.div
                className="inline-flex items-center gap-3 mb-8"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative w-16 h-16">
                  <Image
                    src="/teacher-excellence-badge.png"
                    alt={t('excellenceAlt')}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-white">
                  <div className="text-sm font-semibold opacity-90">{t('certifiedExcellence')}</div>
                  <div className="text-xs opacity-75">{t('badgeLabel')}</div>
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {t('title')}
              </motion.h1>

              {/* Decorative Line */}
              <motion.div
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="h-1 w-20 bg-[#D9B574] rounded-full" />
                <Star className="w-5 h-5 text-[#D9B574]" fill="#D9B574" />
                <div className="h-1 w-20 bg-[#D9B574] rounded-full" />
              </motion.div>

              {/* Subtitle */}
              <motion.p
                className="text-xl md:text-2xl text-white/90 leading-relaxed mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {t('subtitle')}
              </motion.p>

              {/* Quick Stats */}
              <motion.div
                className="grid grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {stats.slice(0, 4).map((stat, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  >
                    <stat.icon className="w-8 h-8 text-[#D9B574] mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">
                      {toArabicNumerals(stat.value)}
                    </div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative hidden md:block">
            <Image
              src="/teacher-hero-background.png"
              alt={t('teachingAlt')}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#2B7A78]/10 to-[#2B7A78]" />
            
            {/* Floating Info Card */}
            <motion.div
              className="absolute bottom-12 left-12 right-12 bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2B7A78] to-[#D9B574] flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg text-gray-900 mb-1">
                    {t('qualifiedTitle')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t('qualifiedDescription')}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Premium Teachers Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Section Header with Background */}
        <motion.div
          className="text-center mb-20 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Background Decoration */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-48 bg-gradient-to-r from-[#2B7A78]/5 via-[#D9B574]/5 to-[#2B7A78]/5 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#2B7A78]/10 to-[#D9B574]/10 rounded-full mb-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring' as const, stiffness: 200 }}
            >
              <Award className="w-5 h-5 text-[#2B7A78]" />
              <span className="text-sm font-bold text-gray-700">{t('expertTeam')}</span>
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#2B7A78] via-[#8B4513] to-[#D9B574] bg-clip-text text-transparent mb-6">
              {t('meetScholars')}
            </h2>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-1 w-16 bg-gradient-to-r from-transparent to-[#2B7A78]" />
              <div className="w-3 h-3 bg-[#D9B574] rotate-45" />
              <div className="h-1 w-24 bg-[#D9B574]" />
              <div className="w-3 h-3 bg-[#2B7A78] rotate-45" />
              <div className="h-1 w-16 bg-gradient-to-l from-transparent to-[#2B7A78]" />
            </div>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('scholarsDescription')}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {teacherKeys.map((key, index) => {
            const name = t(`list.${key}.name`);
            const title = t(`list.${key}.title`);
            const bio = t(`list.${key}.bio`);
            const languages = t.raw(`list.${key}.languages`) as string[];
            const specializations = t.raw(`list.${key}.specializations`) as string[];
            const experience = teacherExperience[key];
            const colors = teacherColors[key];
            const gender = teacherGender[key];
            const pattern = teacherPatterns[key];
            
            // Select appropriate teacher image based on gender
            const teacherImage = gender === 'male' ? '/teacher-male-scholar.png' : '/teacher-female-scholar.png';

            return (
              <motion.div
                key={key}
                variants={itemVariants}
                whileHover={{ y: -12 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[#D9B574]/30"
              >
                {/* Premium Image Header */}
                <div className="relative h-64 overflow-hidden">
                  {/* Actual Teacher Image */}
                  <Image
                    src={teacherImage}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                  {/* Top Badges Row */}
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                    {/* Verified Badge */}
                    <motion.div
                      className="bg-white/95 backdrop-blur-md rounded-xl px-3 py-2 flex items-center gap-2 shadow-xl"
                      whileHover={{ scale: 1.05 }}
                    >
                      <CheckCircle className="w-4 h-4 text-green-600" fill="currentColor" />
                      <span className="text-xs font-bold text-gray-700">{t('certified')}</span>
                    </motion.div>

                    {/* Excellence Badge */}
                    <motion.div
                      className="relative w-12 h-12"
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Image
                        src="/teacher-excellence-badge.png"
                        alt={t('excellenceAlt')}
                        fill
                        className="object-contain drop-shadow-2xl"
                      />
                    </motion.div>
                  </div>

                  {/* Bottom Info Bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-[#D9B574]" />
                        <span className="text-sm font-bold">
                          {toArabicNumerals(experience)}+ {t('yearsExperience')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-[#D9B574]" />
                        <span className="text-sm font-bold">
                          {toArabicNumerals(languages.length)} {t('languagesCount')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Name and Title */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {name}
                    </h3>
                    <p 
                      className="text-base font-semibold mb-4"
                      style={{ color: colors.from }}
                    >
                      {title}
                    </p>
                    
                    {/* Bio */}
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {bio}
                    </p>
                  </div>

                  {/* Languages */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                      <Globe className="w-4 h-4" style={{ color: colors.from }} />
                      <span>{t('languages')}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((lang, idx) => (
                        <motion.span
                          key={lang}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 * idx }}
                          whileHover={{ scale: 1.1, y: -2 }}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-xs font-semibold text-gray-700 cursor-default transition-all border border-gray-200"
                        >
                          {lang}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                      <BookOpen className="w-4 h-4" style={{ color: colors.from }} />
                      <span>{t('specializations')}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {specializations.map((spec, idx) => (
                        <motion.span
                          key={spec}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 * idx }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all border"
                          style={{
                            background: `${colors.from}10`,
                            borderColor: `${colors.from}30`,
                            color: colors.from,
                          }}
                        >
                          {spec}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Hover Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    boxShadow: `0 0 40px ${colors.from}40`,
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Enhanced CTA Section */}
      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative bg-gradient-to-br from-[#2B7A78] via-[#236260] to-[#1a5856] rounded-[2rem] p-12 md:p-16 text-center text-white overflow-hidden shadow-2xl">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="ctaPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <circle cx="40" cy="40" r="25" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M20,20 L60,20 L60,60 L20,60 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
                  <circle cx="40" cy="40" r="10" fill="currentColor" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ctaPattern)" />
            </svg>
          </div>

          {/* Decorative Corner Elements */}
          <motion.div
            className="absolute top-8 right-8 w-20 h-20 border-4 border-[#D9B574]/30 rounded-full"
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-8 left-8 w-16 h-16 border-4 border-[#D9B574]/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring' as const, stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 mb-8 bg-[#D9B574] rounded-2xl shadow-xl"
            >
              <GraduationCap className="w-10 h-10 text-white" strokeWidth={2} />
            </motion.div>

            {/* Heading */}
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {t('cta.title')}
            </motion.h2>

            {/* Divider */}
            <motion.div
              className="flex items-center justify-center gap-2 mb-8"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="h-1 w-12 bg-[#D9B574]/50 rounded-full" />
              <div className="w-2 h-2 bg-[#D9B574] rounded-full" />
              <div className="h-1 w-12 bg-[#D9B574]/50 rounded-full" />
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className="text-xl md:text-2xl text-white/95 mb-10 leading-relaxed font-light"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              {t('cta.subtitle')}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/probestunde">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(217, 181, 116, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="group inline-flex items-center gap-3 px-10 py-5 bg-[#D9B574] hover:bg-[#C9A551] text-white font-bold text-lg rounded-2xl shadow-2xl transition-all duration-300"
                >
                  <Calendar className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  <span>{t('cta.button')}</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm text-white/80"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#D9B574]" />
                <span>{t('noCreditCard')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#D9B574]" />
                <span>{t('minFreeTrial')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#D9B574]" />
                <span>{t('happyStudents')}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
