'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Check, Star, Sparkles, Shield, Clock, Award, Users, UserCheck, Crown, Gem, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { formatNumberForLocale } from '@/lib/utils';
import IslamicDivider from '@/components/IslamicDivider';
import Image from 'next/image';

export default function PricingPage() {
  const t = useTranslations('pricing');
  const common = useTranslations('common');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const [membershipType, setMembershipType] = useState<'private' | 'group'>('private');

  const plans = [
    {
      name: isArabic ? 'أساسي' : 'Basic',
      pricePrivate: membershipType === 'private' ? '€49' : '€29',
      priceGroup: '€29',
      period: isArabic ? 'شهرياً' : '/month',
      description: isArabic ? 'مثالي للمبتدئين' : 'Perfect for beginners',
      features: [
        isArabic ? '4 دروس شهرياً' : '4 lessons per month',
        isArabic ? 'معلمون معتمدون' : 'Certified teachers',
        isArabic ? 'جدول مرن' : 'Flexible schedule',
        isArabic ? 'دعم عبر البريد' : 'Email support',
      ],
      gradient: 'from-[#2B7A78] to-[#236260]',
      popular: false,
    },
    {
      name: isArabic ? 'قياسي' : 'Standard',
      pricePrivate: membershipType === 'private' ? '€89' : '€59',
      priceGroup: '€59',
      period: isArabic ? 'شهرياً' : '/month',
      description: isArabic ? 'الأكثر شعبية' : 'Most popular',
      features: [
        isArabic ? '8 دروس شهرياً' : '8 lessons per month',
        isArabic ? 'معلمون معتمدون' : 'Certified teachers',
        isArabic ? 'جدول مرن' : 'Flexible schedule',
        isArabic ? 'تقارير تقدم' : 'Progress reports',
        isArabic ? 'دعم ذو أولوية' : 'Priority support',
      ],
      gradient: 'from-[#D9B574] to-[#C9A551]',
      popular: true,
    },
    {
      name: isArabic ? 'مميز' : 'Premium',
      pricePrivate: membershipType === 'private' ? '€149' : '€99',
      priceGroup: '€99',
      period: isArabic ? 'شهرياً' : '/month',
      description: isArabic ? 'للطلاب الجادين' : 'For serious students',
      features: [
        isArabic ? '12 درس شهرياً' : '12 lessons per month',
        isArabic ? 'معلمون متميزون' : 'Premium teachers',
        isArabic ? 'جدول مرن' : 'Flexible schedule',
        isArabic ? 'تقارير مفصلة' : 'Detailed reports',
        isArabic ? 'دروس مسجلة' : 'Recorded lessons',
        isArabic ? 'دعم 24/7' : '24/7 support',
      ],
      gradient: 'from-[#2F6F68] to-[#267169]',
      popular: false,
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
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
    },
  };

  // Detailed pricing data - Private (1-on-1) lessons
  const privatePricing = {
    thirtyMin: [
      { classesPerWeek: 1, costPerMonth: '£16', perClass: '£4', classesTotal: 4 },
      { classesPerWeek: 2, costPerMonth: '£32', perClass: '£4', classesTotal: 8 },
      { classesPerWeek: 3, costPerMonth: '£48', perClass: '£4', classesTotal: 12 },
      { classesPerWeek: 4, costPerMonth: '£64', perClass: '£4', classesTotal: 16 },
      { classesPerWeek: 5, costPerMonth: '£80', perClass: '£4', classesTotal: 20 },
    ],
    sixtyMin: [
      { classesPerWeek: 1, costPerMonth: '£32', perClass: '£8', classesTotal: 4 },
      { classesPerWeek: 2, costPerMonth: '£64', perClass: '£8', classesTotal: 8 },
      { classesPerWeek: 3, costPerMonth: '£84', perClass: '£7', classesTotal: 12 },
      { classesPerWeek: 4, costPerMonth: '£112', perClass: '£7', classesTotal: 16 },
      { classesPerWeek: 5, costPerMonth: '£130', perClass: '£6.5', classesTotal: 20 },
    ],
  };

  // Group lessons pricing (30% discount)
  const groupPricing = {
    thirtyMin: [
      { classesPerWeek: 1, costPerMonth: '£11', perClass: '£2.8', classesTotal: 4 },
      { classesPerWeek: 2, costPerMonth: '£22', perClass: '£2.8', classesTotal: 8 },
      { classesPerWeek: 3, costPerMonth: '£34', perClass: '£2.8', classesTotal: 12 },
      { classesPerWeek: 4, costPerMonth: '£45', perClass: '£2.8', classesTotal: 16 },
      { classesPerWeek: 5, costPerMonth: '£56', perClass: '£2.8', classesTotal: 20 },
    ],
    sixtyMin: [
      { classesPerWeek: 1, costPerMonth: '£22', perClass: '£5.6', classesTotal: 4 },
      { classesPerWeek: 2, costPerMonth: '£45', perClass: '£5.6', classesTotal: 8 },
      { classesPerWeek: 3, costPerMonth: '£59', perClass: '£4.9', classesTotal: 12 },
      { classesPerWeek: 4, costPerMonth: '£78', perClass: '£4.9', classesTotal: 16 },
      { classesPerWeek: 5, costPerMonth: '£91', perClass: '£4.6', classesTotal: 20 },
    ],
  };

  const detailedPricing = membershipType === 'private' ? privatePricing : groupPricing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E8] via-[#FAF6F1] to-[#F0EAE0]">
      {/* Elegant Hero with Islamic Arch */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background with Islamic Arch Image */}
        <div className="absolute inset-0">
          <Image
            src="/pricing-hero-arch.png"
            alt={t('heroAlt')}
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#F5F0E8]/80 via-[#FAF6F1]/70 to-[#F0EAE0]/80" />
        </div>

        {/* Ornamental Islamic patterns */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pricingArchPattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <path d="M60,10 Q40,40 60,70 Q80,40 60,10 Z" fill="none" stroke="#8B4513" strokeWidth="1.5"/>
                <circle cx="60" cy="40" r="15" fill="none" stroke="#8B4513" strokeWidth="1"/>
                <path d="M30,90 L90,90 L90,110 L30,110 Z" fill="none" stroke="#8B4513" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pricingArchPattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Elegant Badge */}
            <motion.div
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-md rounded-full mb-8 shadow-2xl border-2 border-[#D9B574]/30"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring' as const, stiffness: 150, delay: 0.2 }}
            >
              <Crown className="w-6 h-6 text-[#D9B574]" />
              <span className="text-lg font-bold text-[#8B4513]">
                {t('badge')}
              </span>
              <Crown className="w-6 h-6 text-[#D9B574]" />
            </motion.div>

            {/* Main Title with Islamic Aesthetic */}
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-[#2A2A2A] mb-6 font-serif leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-[#8B4513] via-[#D9B574] to-[#8B4513] bg-clip-text text-transparent">
                {t('title')}
              </span>
            </motion.h1>

            {/* Ornamental Divider */}
            <motion.div
              className="flex items-center justify-center gap-4 mb-8"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-[#D9B574]" />
                <Gem className="w-5 h-5 text-[#D9B574]" />
                <div className="w-3 h-3 bg-[#D9B574] rotate-45" />
                <Gem className="w-5 h-5 text-[#D9B574]" />
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-[#D9B574]" />
              </div>
            </motion.div>
            
            {/* Subtitle */}
            <motion.p
              className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {t('subtitle')}
            </motion.p>

            {/* Private/Group Toggle */}
            <motion.div
              className="inline-flex rounded-2xl p-2 bg-white/90 backdrop-blur-md shadow-2xl border-2 border-[#D9B574]/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <button
                onClick={() => setMembershipType('private')}
                className={`px-8 py-4 rounded-xl font-bold text-base transition-all flex items-center gap-3 ${
                  membershipType === 'private'
                    ? 'bg-gradient-to-r from-[#2B7A78] to-[#236260] text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:text-[#2B7A78]'
                }`}
              >
                <UserCheck className="w-5 h-5" />
                <div className="text-left">
                  <div>{t('membershipTypes.private')}</div>
                  <div className="text-xs opacity-80 font-normal">
                    {t('membershipTypes.privateSubtitle')}
                  </div>
                </div>
              </button>
              <button
                onClick={() => setMembershipType('group')}
                className={`px-8 py-4 rounded-xl font-bold text-base transition-all flex items-center gap-3 ${
                  membershipType === 'group'
                    ? 'bg-gradient-to-r from-[#D9B574] to-[#C9A551] text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:text-[#D9B574]'
                }`}
              >
                <Users className="w-5 h-5" />
                <div className="text-left">
                  <div>{t('membershipTypes.group')}</div>
                  <div className="text-xs opacity-80 font-normal">
                    {t('membershipTypes.groupSubtitle')}
                  </div>
                </div>
              </button>
            </motion.div>
          </motion.div>

          {/* Detailed Pricing Tables */}
          <div className="space-y-20">
            {/* 60 Mins Class */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Section Header */}
              <div className="text-center mb-12">
                <motion.div
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#2B7A78] to-[#236260] rounded-full mb-6 shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  key={membershipType} // Re-animate on change
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  <Award className="w-6 h-6 text-white" />
                  <h2 className="text-3xl font-bold text-white">{t('duration.sixtyMin')}</h2>
                  <Award className="w-6 h-6 text-white" />
                </motion.div>
                <p className="text-gray-600 text-lg">
                  {membershipType === 'private'
                    ? t('sixtyMinDescription.private')
                    : t('sixtyMinDescription.group')
                  }
                </p>
                <motion.div
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/80 rounded-full shadow-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={`60min-${membershipType}`}
                >
                  {membershipType === 'private' ? (
                    <>
                      <UserCheck className="w-4 h-4 text-[#2B7A78]" />
                      <span className="text-sm font-semibold text-[#2B7A78]">{t('pricingType.private')}</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 text-[#2B7A78]" />
                      <span className="text-sm font-semibold text-[#2B7A78]">{t('pricingType.group')}</span>
                    </>
                  )}
                </motion.div>
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {detailedPricing.sixtyMin.map((plan, index) => (
                  <motion.div
                    key={index}
                    className="group relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                  >
                    {/* Islamic Arch Card */}
                    <div className="relative bg-gradient-to-br from-white to-teal-50/30 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-[#2B7A78]/20 group-hover:border-[#2B7A78]/50 overflow-hidden">
                      {/* Arch decoration at top */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-24 h-12 bg-gradient-to-b from-[#2B7A78] to-transparent rounded-b-full opacity-20" />
                      </div>

                      {/* Best Value Badge */}
                      {index === 3 && (
                        <div className="absolute -top-3 -right-3">
                          <div className="bg-gradient-to-r from-[#2B7A78] to-[#236260] text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-1">
                            <Star className="w-3 h-3" fill="currentColor" />
                            {t('bestValue')}
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      <div className="text-center relative z-10">
                        <div className="mb-6">
                          <div className="text-lg font-bold text-gray-700 mb-2">
                            {plan.classesPerWeek} {t('classesPerWeek')}
                          </div>
                        </div>

                        <div className="mb-6">
                          <div className="text-sm text-gray-500 mb-2">{t('costPerMonth')}</div>
                          <div className="text-4xl font-bold text-[#2B7A78] mb-2">
                            {plan.costPerMonth}
                          </div>
                          <div className="text-lg font-semibold text-[#D9B574]">
                            {plan.perClass} {t('perClass')}
                          </div>
                        </div>

                        <div className="py-4 px-6 bg-gradient-to-r from-[#2B7A78]/10 to-[#D9B574]/10 rounded-xl mb-6">
                          <div className="text-sm text-gray-600">
                            {plan.classesTotal} {t('classesPerMonth')}
                          </div>
                        </div>

                        <Link href="/register">
                          <motion.button
                            className="w-full py-3 bg-gradient-to-r from-[#2B7A78] to-[#236260] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {t('choosePlan')}
                          </motion.button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 30 Mins Class */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Section Header */}
              <div className="text-center mb-12">
                <motion.div
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#D9B574] to-[#C9A551] rounded-full mb-6 shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  key={membershipType} // Re-animate on change
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  <Clock className="w-6 h-6 text-white" />
                  <h2 className="text-3xl font-bold text-white">{t('duration.thirtyMin')}</h2>
                  <Clock className="w-6 h-6 text-white" />
                </motion.div>
                <p className="text-gray-600 text-lg">
                  {membershipType === 'private' 
                    ? t('thirtyMinDescription.private')
                    : t('thirtyMinDescription.group')
                  }
                </p>
                <motion.div
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/80 rounded-full shadow-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={`30min-${membershipType}`}
                >
                  {membershipType === 'private' ? (
                    <>
                      <UserCheck className="w-4 h-4 text-[#D9B574]" />
                      <span className="text-sm font-semibold text-[#D9B574]">{t('pricingType.private')}</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 text-[#D9B574]" />
                      <span className="text-sm font-semibold text-[#D9B574]">{t('pricingType.group')}</span>
                    </>
                  )}
                </motion.div>
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {detailedPricing.thirtyMin.map((plan, index) => (
                  <motion.div
                    key={index}
                    className="group relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                  >
                    {/* Islamic Arch Card */}
                    <div className="relative bg-gradient-to-br from-white to-amber-50/30 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-[#D9B574]/20 group-hover:border-[#D9B574]/50 overflow-hidden">
                      {/* Arch decoration at top */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-24 h-12 bg-gradient-to-b from-[#D9B574] to-transparent rounded-b-full opacity-20" />
                      </div>

                      {/* Content */}
                      <div className="text-center relative z-10">
                        <div className="mb-6">
                          <div className="text-lg font-bold text-gray-700 mb-2">
                            {plan.classesPerWeek} {t('classesPerWeek')}
                          </div>
                          {index === 2 && (
                            <div className="absolute -top-4 -right-4">
                              <Star className="w-8 h-8 text-[#D9B574]" fill="#D9B574" />
                            </div>
                          )}
                        </div>

                        <div className="mb-6">
                          <div className="text-sm text-gray-500 mb-2">{t('costPerMonth')}</div>
                          <div className="text-4xl font-bold text-[#D9B574] mb-2">
                            {plan.costPerMonth}
                          </div>
                          <div className="text-lg font-semibold text-[#2B7A78]">
                            {plan.perClass} {t('perClass')}
                          </div>
                        </div>

                        <div className="py-4 px-6 bg-gradient-to-r from-[#D9B574]/10 to-[#2B7A78]/10 rounded-xl mb-6">
                          <div className="text-sm text-gray-600">
                            {plan.classesTotal} {t('classesPerMonth')}
                          </div>
                        </div>

                        <Link href="/register">
                          <motion.button
                            className="w-full py-3 bg-gradient-to-r from-[#D9B574] to-[#C9A551] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {t('choosePlan')}
                          </motion.button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Premium Quality Section with Image */}
          <motion.div
            className="mt-24 grid md:grid-cols-2 gap-12 items-center bg-gradient-to-br from-white to-amber-50/30 rounded-3xl p-12 shadow-2xl border-2 border-[#D9B574]/30 overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Image Side */}
            <motion.div
              className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Image
                src="/pricing-premium-quality.png"
                alt={t('premiumImageAlt')}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D9B574] to-[#C9A551] flex items-center justify-center">
                      <Gem className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{t('premiumQuality')}</div>
                      <div className="text-sm text-gray-600">{t('authenticEducation')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content Side */}
            <div>
              <motion.h3
                className="text-3xl md:text-4xl font-bold text-[#2A2A2A] mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {t('whyChoose')}
              </motion.h3>
              <div className="space-y-4">
                {[
                  { icon: CheckCircle, title: t('features.certified.title'), desc: t('features.certified.description') },
                  { icon: Clock, title: t('features.flexible.title'), desc: t('features.flexible.description') },
                  { icon: Award, title: t('features.reports.title'), desc: t('features.reports.description') },
                  { icon: Shield, title: t('features.guarantee.title'), desc: t('features.guarantee.description') },
                  { icon: Users, title: t('features.discounts.title'), desc: t('features.discounts.description') },
                  { icon: Gem, title: t('features.materials.title'), desc: t('features.materials.description') },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/80 transition-all"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2B7A78] to-[#D9B574] flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Certificate/Achievement Section */}
          <motion.div
            className="mt-24 bg-gradient-to-br from-[#2B7A78] to-[#236260] rounded-3xl p-12 shadow-2xl overflow-hidden relative"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <pattern id="certPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                  <circle cx="30" cy="30" r="2" fill="white" />
                  <path d="M30,15 L30,45 M15,30 L45,30" stroke="white" strokeWidth="0.5" opacity="0.5"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#certPattern)" />
              </svg>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              <div className="text-white">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <Award className="w-5 h-5 text-[#D9B574]" />
                  <span className="text-sm font-bold">{t('certificate.badge')}</span>
                </motion.div>

                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  {t('certificate.title')}
                </h3>
                <p className="text-white/90 text-lg leading-relaxed mb-8">
                  {t('certificate.description')}
                </p>

                <div className="space-y-4">
                  {[
                    t('certificate.features.ijazah'),
                    t('certificate.features.tracking'),
                    t('certificate.features.reports'),
                    t('certificate.features.recognized'),
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CheckCircle className="w-5 h-5 text-[#D9B574]" />
                      <span className="text-white/90">{item}</span>
                    </motion.div>
                  ))}
                </div>

                <Link href="/register">
                  <motion.button
                    className="mt-8 px-8 py-4 bg-gradient-to-r from-[#D9B574] to-[#C9A551] text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('startJourney')}
                  </motion.button>
                </Link>
              </div>

              {/* Certificate Image */}
              <motion.div
                className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
              >
                <Image
                  src="/pricing-certificate.png"
                  alt={t('certificate.imageAlt')}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
