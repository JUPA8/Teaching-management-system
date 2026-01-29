'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Check, Star, Sparkles, Shield, Clock, Zap, CreditCard, ChevronDown } from 'lucide-react';
import { pricingPlans } from '@/lib/data';
import { useState } from 'react';
import { formatNumberForLocale } from '@/lib/utils';

// Helper type for dynamic pricing translation keys
type PricingTranslationKey = Parameters<ReturnType<typeof useTranslations<'pricing'>>>[0];

export default function PricingPage() {
  const t = useTranslations('pricing');
  const locale = useLocale();

  // Helper function for dynamic keys
  const getPricingText = (key: string) => t(key as PricingTranslationKey);
  const common = useTranslations('common');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Features translation keys for each plan
  const planFeatures: Record<string, string[]> = {
    basic: ['features.oneOnOne', 'features.qualifiedTeachers', 'features.flexibleSchedule'],
    standard: ['features.oneOnOne', 'features.qualifiedTeachers', 'features.flexibleSchedule', 'features.progressReports'],
    premium: ['features.oneOnOne', 'features.qualifiedTeachers', 'features.flexibleSchedule', 'features.progressReports', 'features.recordedLessons', 'features.prioritySupport'],
  };

  const faqs = [
    {
      question: t('faq.trial.question'),
      answer: t('faq.trial.answer'),
      icon: Sparkles,
    },
    {
      question: t('faq.change.question'),
      answer: t('faq.change.answer'),
      icon: Zap,
    },
    {
      question: t('faq.payment.question'),
      answer: t('faq.payment.answer'),
      icon: CreditCard,
    },
    {
      question: t('faq.lessonLength.question'),
      answer: t('faq.lessonLength.answer'),
      icon: Clock,
    },
    {
      question: t('faq.reschedule.question'),
      answer: t('faq.reschedule.answer'),
      icon: Shield,
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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="py-12 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <span className="px-4 py-2 bg-gradient-to-r from-gold-100 to-gold-200 text-gold-700 rounded-full text-sm font-medium inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t('badgeLabel')}
            </span>
          </motion.div>
          <motion.h1
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('title')}
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className={`relative overflow-hidden rounded-2xl bg-white shadow-xl border ${
                plan.popular ? 'ring-2 ring-primary-600 scale-105 z-10' : 'border-gray-100'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div
                  className="absolute top-0 right-0 bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-xs font-medium px-4 py-1.5 rounded-bl-xl"
                  initial={{ x: 100 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                >
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    {t('popular')}
                  </span>
                </motion.div>
              )}

              {/* Card Background Decoration */}
              {plan.popular && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent pointer-events-none"
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}

              <div className="p-6 md:p-8 relative">
                {/* Plan Name */}
                <motion.h3
                  className="text-xl font-bold text-gray-900 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {getPricingText(`${plan.id}.title`)}
                </motion.h3>
                <motion.p
                  className="text-gray-600 text-sm mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {getPricingText(`${plan.id}.description`)}
                </motion.p>

                {/* Price */}
                <motion.div
                  className="mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                >
                  <span className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    €{formatNumberForLocale(plan.price, locale)}
                  </span>
                  <span className="text-gray-500">/{t('perMonth')}</span>
                </motion.div>

                {/* Lessons per week */}
                <motion.div
                  className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 mb-6 text-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.span
                    className="text-3xl font-bold text-primary-600"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    {formatNumberForLocale(plan.lessonsPerWeek, locale)}
                  </motion.span>
                  <span className="text-primary-700 text-sm ms-2">
                    {t('lessonsPerWeek')}
                  </span>
                </motion.div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {(planFeatures[plan.id] || []).map((featureKey, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 + featureIndex * 0.05 }}
                    >
                      <motion.div
                        className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5"
                        whileHover={{ scale: 1.2, backgroundColor: '#059669' }}
                      >
                        <Check className="w-3 h-3 text-primary-600" />
                      </motion.div>
                      <span className="text-gray-600 text-sm">{getPricingText(featureKey)}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/register"
                      className={`block w-full text-center py-3.5 rounded-xl font-semibold transition-all ${
                        plan.popular
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:shadow-lg hover:shadow-primary-500/30'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {t('choosePlan')}
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/register"
                      className="block w-full text-center py-3.5 rounded-xl font-semibold transition-all border-2 border-primary-600 text-primary-600 hover:bg-primary-50"
                    >
                      {common('freeTrial')}
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="mt-20 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {t('faqTitle')}
          </motion.h2>

          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
              >
                <motion.button
                  className="w-full p-5 flex items-center gap-4 text-left"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
                >
                  <motion.div
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center flex-shrink-0"
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                  >
                    <faq.icon className="w-5 h-5 text-primary-600" />
                  </motion.div>
                  <span className="font-semibold text-gray-900 flex-1">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </motion.button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === index ? 'auto' : 0,
                    opacity: openFaq === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-gray-600 text-sm pl-19">
                    {faq.answer}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 rounded-3xl p-8 md:p-12 overflow-hidden"
            whileHover={{ scale: 1.01 }}
          >
            {/* Decorative Elements */}
            <motion.div
              className="absolute top-4 left-4 w-32 h-32 bg-white/10 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-4 right-4 w-24 h-24 bg-white/10 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
              className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative z-10">
              <motion.h2
                className="text-2xl md:text-3xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {t('ctaTitle')}
              </motion.h2>
              <motion.p
                className="text-primary-100 mb-8 max-w-xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                {t('ctaDescription')}
              </motion.p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/register"
                  className="inline-block bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:shadow-xl transition-shadow"
                >
                  {common('freeTrial')}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
