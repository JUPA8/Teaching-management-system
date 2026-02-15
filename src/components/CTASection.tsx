'use client';

import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, BookOpen, Clock, Users, Award } from 'lucide-react';

export default function CTASection() {
  const t = useTranslations('hero');
  const cta = useTranslations('cta');
  const common = useTranslations('common');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const benefits = [
    { 
      icon: Award,
      text: cta('benefits.teachers'),
    },
    { 
      icon: Clock,
      text: cta('benefits.schedule'),
    },
    { 
      icon: Users,
      text: cta('benefits.personalized'),
    },
    { 
      icon: BookOpen,
      text: cta('benefits.progress'),
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
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background with Islamic pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2F6F68] via-[#3B6F5F] to-[#2F5F54]">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cta-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M50 10 L60 30 L50 50 L40 30 Z" fill="#C9A24D" />
                <circle cx="20" cy="20" r="3" fill="#D4AF6B" />
                <circle cx="80" cy="80" r="3" fill="#D4AF6B" />
                <path d="M70 20 Q75 25 70 30" stroke="#C9A24D" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-pattern)" />
          </svg>
        </div>
      </div>

      {/* Animated floating elements */}
      <motion.div
        className="absolute top-20 left-10 w-40 h-40 rounded-full bg-[#C9A24D] opacity-10 blur-3xl"
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-52 h-52 rounded-full bg-[#D4AF6B] opacity-10 blur-3xl"
        animate={{
          y: [0, -40, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Title */}
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 font-serif"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {cta('title')}
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-lg text-white/90 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {cta('description')}
            </motion.p>

            {/* Benefits Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#C9A24D] flex items-center justify-center">
                      <benefit.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <span className="text-white/90 text-sm leading-relaxed pt-2">{benefit.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(201, 162, 77, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-white text-[#2F6F68] font-bold rounded-2xl shadow-2xl flex items-center justify-center gap-2 hover:bg-[#C9A24D] hover:text-white transition-all duration-300"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>{t('startFreeTrial')}</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.button>
              </Link>

              <Link href="/pricing">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-2xl hover:bg-white hover:text-[#2F6F68] transition-all duration-300"
                >
                  {common('pricing')}
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Visual Card */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 100, rotateY: 15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02, rotateY: 5 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Decorative circles */}
              <motion.div
                className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#C9A24D] opacity-20 blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-[#D4AF6B] opacity-20 blur-2xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.25, 0.2],
                }}
                transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
              />

              {/* Main card */}
              <motion.div
                className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto border-4 border-[#C9A24D]"
                whileHover={{ y: -10 }}
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    className="w-24 h-24 bg-gradient-to-br from-[#2F6F68] to-[#3B6F5F] rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <BookOpen className="w-12 h-12 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-[#2A2A2A] mb-2 font-serif">
                    {cta('freeTrialCard.title')}
                  </h3>
                  <p className="text-gray-600">
                    {cta('freeTrialCard.description')}
                  </p>
                </div>

                {/* Benefits list */}
                <div className="space-y-3 mb-6">
                  {[
                    cta('freeTrialCard.noCreditCard'),
                    cta('freeTrialCard.chooseTime'),
                    cta('freeTrialCard.meetTeacher'),
                    cta('freeTrialCard.fullSession'),
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CheckCircle className="w-5 h-5 text-[#3B6F5F] flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Button */}
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-4 bg-gradient-to-r from-[#2F6F68] to-[#3B6F5F] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  >
                    {cta('freeTrialCard.bookNow')}
                  </motion.button>
                </Link>

                {/* Decorative corners */}
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#C9A24D] opacity-40 rounded-tl-lg" />
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#C9A24D] opacity-40 rounded-tr-lg" />
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#C9A24D] opacity-40 rounded-bl-lg" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#C9A24D] opacity-40 rounded-br-lg" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
