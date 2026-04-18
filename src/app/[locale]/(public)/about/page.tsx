'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { formatNumberForLocale } from '@/lib/utils';
import Image from 'next/image';
import {
  BookOpen,
  Users,
  Globe,
  Award,
  Heart,
  Star,
  Target,
  Lightbulb,
  Shield,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Eye,
  Compass,
  Gem,
  Rocket,
} from 'lucide-react';
import IslamicDivider from '@/components/IslamicDivider';

export default function AboutPage() {
  const about = useTranslations('about');
  const common = useTranslations('common');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const stats = [
    { value: formatNumberForLocale('10,000+', locale), label: about('stats.students'), icon: Users },
    { value: formatNumberForLocale('50+', locale), label: about('stats.teachers'), icon: Award },
    { value: formatNumberForLocale('15+', locale), label: about('stats.countries'), icon: Globe },
    { value: formatNumberForLocale('4.9', locale), label: about('stats.rating'), icon: Star },
  ];

  const values = [
    {
      icon: BookOpen,
      title: about('values.excellence.title'),
      description: about('values.excellence.description'),
      gradient: 'from-[#2B7A78] to-[#236260]',
    },
    {
      icon: Heart,
      title: about('values.compassion.title'),
      description: about('values.compassion.description'),
      gradient: 'from-[#D9B574] to-[#C9A551]',
    },
    {
      icon: Target,
      title: about('values.dedication.title'),
      description: about('values.dedication.description'),
      gradient: 'from-[#2F6F68] to-[#267169]',
    },
    {
      icon: Lightbulb,
      title: about('values.innovation.title'),
      description: about('values.innovation.description'),
      gradient: 'from-[#C9A551] to-[#B18C41]',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FDFBF7] to-[#F5F0E8]">
      {/* Stunning Full-Width Hero */}
      <section className="relative h-screen min-h-[700px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/about-hero-institute.png"
            alt="Salam Institute"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
        </div>

        {/* Animated Pattern Overlay */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10 L40 25 L35 40 L25 40 L20 25 Z' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-3 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/30 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D9B574]" />
                  <span className="text-white font-bold text-sm">{about('story')}</span>
                </div>
                <div className="px-5 py-2.5 bg-[#D9B574]/20 backdrop-blur-md rounded-full border border-[#D9B574]/50">
                  <span className="text-[#D9B574] font-bold text-sm">{about('established')}</span>
                </div>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {about('title')}
              </motion.h1>

              {/* Golden Line */}
              <motion.div
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="h-1 w-32 bg-[#D9B574]" />
                <Star className="w-6 h-6 text-[#D9B574]" fill="#D9B574" />
                <div className="h-1 w-32 bg-[#D9B574]" />
              </motion.div>

              {/* Description */}
              <motion.p
                className="text-xl md:text-2xl text-white/90 leading-relaxed mb-12 max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {about('description')}
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link href="/register">
                  <motion.button
                    className="group bg-gradient-to-r from-[#D9B574] to-[#C9A551] text-white font-bold py-5 px-10 rounded-2xl shadow-2xl flex items-center gap-3 text-lg"
                    whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(217, 181, 116, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {common('register')}
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-6 h-6" />
                    </motion.div>
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Stats Bar at Bottom */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg py-8 border-t border-gray-200"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-center mb-3">
                    <motion.div
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2B7A78] to-[#D9B574] flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-[#2B7A78] to-[#D9B574] bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Mission & Vision Section with Images */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#2B7A78]/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Mission */}
          <motion.div
            className="grid lg:grid-cols-2 gap-16 items-center mb-32"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Image */}
            <motion.div
              className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src="/about-mission.png"
                alt={about('mission.imageAlt')}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B7A78]/80 to-transparent" />
              
              {/* Floating Badge */}
              <motion.div
                className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2B7A78] to-[#D9B574] flex items-center justify-center flex-shrink-0">
                    <Compass className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-gray-900 mb-1">{about('mission.cardTitle')}</div>
                    <div className="text-sm text-gray-600">{about('mission.cardSubtitle')}</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Content */}
            <div className={isArabic ? 'lg:order-first' : ''}>
              <motion.div
                className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#2B7A78]/10 rounded-full mb-6"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Compass className="w-5 h-5 text-[#2B7A78]" />
                <span className="text-sm font-bold text-[#2B7A78]">{about('mission.badge')}</span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {about('mission.title')}
              </h2>

              <div className="h-1 w-24 bg-gradient-to-r from-[#2B7A78] to-[#D9B574] mb-8" />

              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                {about('mission.description')}
              </p>

              <div className="space-y-4">
                {[
                  about('mission.features.instruction'),
                  about('mission.features.curriculum'),
                  about('mission.features.teachers'),
                  about('mission.features.platform'),
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#2B7A78]/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-[#2B7A78]" />
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div
            className="grid lg:grid-cols-2 gap-16 items-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Content */}
            <div>
              <motion.div
                className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#D9B574]/10 rounded-full mb-6"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Eye className="w-5 h-5 text-[#D9B574]" />
                <span className="text-sm font-bold text-[#D9B574]">{about('vision.badge')}</span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {about('vision.title')}
              </h2>

              <div className="h-1 w-24 bg-gradient-to-r from-[#D9B574] to-[#2B7A78] mb-8" />

              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                {about('vision.description')}
              </p>

              <div className="space-y-4">
                {[
                  about('vision.features.reach'),
                  about('vision.features.excellence'),
                  about('vision.features.technology'),
                  about('vision.features.community'),
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#D9B574]/10 flex items-center justify-center flex-shrink-0">
                      <Rocket className="w-5 h-5 text-[#D9B574]" />
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Image */}
            <motion.div
              className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src="/about-vision.png"
                alt={about('vision.imageAlt')}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#D9B574]/80 to-transparent" />
              
              {/* Floating Badge */}
              <motion.div
                className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D9B574] to-[#2B7A78] flex items-center justify-center flex-shrink-0">
                    <Eye className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-gray-900 mb-1">{about('vision.cardTitle')}</div>
                    <div className="text-sm text-gray-600">{about('vision.cardSubtitle')}</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <IslamicDivider />

      {/* Values Section with Enhanced Design */}
      <section className="py-24 bg-gradient-to-b from-white to-[#F5F0E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#2B7A78]/10 to-[#D9B574]/10 rounded-full mb-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring' as const, stiffness: 200 }}
            >
              <Gem className="w-5 h-5 text-[#D9B574]" />
              <span className="text-sm font-bold text-gray-700">{about('coreValuesBadge')}</span>
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#2B7A78] to-[#D9B574] bg-clip-text text-transparent mb-6">
              {about('valuesTitle')}
            </h2>

            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-1 w-20 bg-gradient-to-r from-transparent to-[#2B7A78]" />
              <Gem className="w-5 h-5 text-[#D9B574]" />
              <div className="h-1 w-20 bg-gradient-to-l from-transparent to-[#D9B574]" />
            </div>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {about('valuesDescription')}
            </p>
          </motion.div>

          {/* Values Grid with Image */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="relative bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all overflow-hidden group border-2 border-gray-100 hover:border-[#D9B574]/30"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-[#D9B574]/10 rounded-bl-full" />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    className={`w-20 h-20 bg-gradient-to-br ${value.gradient} rounded-3xl flex items-center justify-center mb-6 shadow-lg`}
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <value.icon className="w-10 h-10 text-white" strokeWidth={2} />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <div className="h-1 w-16 bg-gradient-to-r from-[#2B7A78] to-[#D9B574] mb-4" />
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Community Values Image Section */}
          <motion.div
            className="relative rounded-3xl overflow-hidden shadow-2xl mt-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-[400px]">
              <Image
                src="/about-values.png"
                alt={about('communityImageAlt')}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-6">
                  <motion.div
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Heart className="w-10 h-10 text-[#D9B574]" />
                  </motion.div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">{about('communityTitle')}</h3>
                  <p className="text-xl text-white/90 max-w-2xl mx-auto">
                    {about('communityDescription')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#2B7A78] to-[#1a5856] relative overflow-hidden">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10 L40 25 L35 40 L25 40 L20 25 Z' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {about('ctaTitle')}
            </h2>
            <p className="text-xl text-white/90 mb-10">
              {about('ctaDescription')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <motion.button
                  className="bg-[#D9B574] hover:bg-[#C9A551] text-white font-bold py-5 px-10 rounded-2xl shadow-2xl flex items-center gap-3 text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {about('getStartedFree')}
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              </Link>
              
              <Link href="/contact">
                <motion.button
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold py-5 px-10 rounded-2xl border-2 border-white/30 flex items-center gap-3 text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {about('contactUs')}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
