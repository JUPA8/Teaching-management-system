'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function CTASection() {
  const t = useTranslations('hero');
  const cta = useTranslations('cta');
  const common = useTranslations('common');

  const benefits = [
    cta('benefits.teachers'),
    cta('benefits.schedule'),
    cta('benefits.personalized'),
    cta('benefits.progress'),
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section className="py-16 md:py-24 gradient-primary relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 islamic-pattern" />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-white/20 rounded-full"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            className="text-white"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {cta('title')}
            </motion.h2>
            <motion.p
              className="text-lg text-white/90 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {cta('description')}
            </motion.p>

            {/* Benefits */}
            <motion.ul
              className="space-y-3 mb-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  className="flex items-center gap-3"
                  variants={itemVariants}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CheckCircle className="w-5 h-5 text-white/90 flex-shrink-0" />
                  </motion.div>
                  <span className="text-white/90">{benefit}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/register"
                  className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {common('freeTrial')}
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/pricing"
                  className="border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center"
                >
                  {common('pricing')}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            className="hidden lg:flex justify-center"
            initial={{ opacity: 0, x: 100, rotateY: 15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <div className="relative">
              {/* Decorative elements */}
              <motion.div
                className="w-72 h-72 bg-white/10 rounded-full absolute -top-10 -left-10"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="w-48 h-48 bg-white/10 rounded-full absolute -bottom-5 -right-5"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.1, 0.15, 0.1],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              />

              {/* Main card */}
              <motion.div
                className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm"
                whileHover={{ y: -10, boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.3)' }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <motion.div
                    className="w-20 h-20 bg-primary-100 rounded-full mx-auto flex items-center justify-center mb-4"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <motion.span
                      className="text-4xl"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      📖
                    </motion.span>
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {cta('freeTrialCard.title')}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {cta('freeTrialCard.description')}
                  </p>
                </div>

                <motion.div
                  className="space-y-3 mb-6"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    cta('freeTrialCard.noCreditCard'),
                    cta('freeTrialCard.chooseTime'),
                    cta('freeTrialCard.meetTeacher'),
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 text-sm"
                      variants={itemVariants}
                    >
                      <CheckCircle className="w-5 h-5 text-primary-600" />
                      <span className="text-gray-700">{item}</span>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/register"
                    className="btn-primary w-full text-center block"
                  >
                    {cta('freeTrialCard.bookNow')}
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
