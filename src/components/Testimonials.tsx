'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Star, Quote, Sparkles, Award } from 'lucide-react';

export default function Testimonials() {
  const t = useTranslations('testimonials');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const testimonials = [
    {
      name: t('items.sarah.name'),
      role: t('items.sarah.role'),
      content: t('items.sarah.content'),
      avatar: '🧕',
      flag: '🇩🇪',
      rating: 5,
      bgGradient: 'from-[#3B6F5F] to-[#2F5F54]',
    },
    {
      name: t('items.ahmed.name'),
      role: t('items.ahmed.role'),
      content: t('items.ahmed.content'),
      avatar: '🧔',
      flag: '🇦🇹',
      rating: 5,
      bgGradient: 'from-[#C19A6B] to-[#B8935F]',
    },
    {
      name: t('items.fatima.name'),
      role: t('items.fatima.role'),
      content: t('items.fatima.content'),
      avatar: '🧕🏽',
      flag: '🇨🇭',
      rating: 5,
      bgGradient: 'from-[#D4AF37] to-[#C9A24D]',
    },
    {
      name: t('items.muhammad.name'),
      role: t('items.muhammad.role'),
      content: t('items.muhammad.content'),
      avatar: '👳',
      flag: '🇺🇸',
      rating: 5,
      bgGradient: 'from-[#2F6F68] to-[#267169]',
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
    hidden: { opacity: 0, scale: 0.8, rotateY: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-white via-[#FDFBF7] to-[#F5F0E8]">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-[#D9B574] opacity-10 rounded-full blur-3xl"
          animate={{
            y: [0, 50, 0],
            x: [0, 30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-[#2B7A78] opacity-10 rounded-full blur-3xl"
          animate={{
            y: [0, -50, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Premium Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#2B7A78]/10 to-[#D9B574]/10 rounded-full mb-6"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring' as const, stiffness: 200 }}
          >
            <Award className="w-5 h-5 text-[#D9B574]" />
            <span className="text-sm font-bold text-gray-700">{t('badge')}</span>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#2B7A78] to-[#D9B574] bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('title')}
          </motion.h2>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-1 w-20 bg-gradient-to-r from-transparent to-[#2B7A78]" />
            <Sparkles className="w-6 h-6 text-[#D9B574]" />
            <div className="h-1 w-20 bg-gradient-to-l from-transparent to-[#D9B574]" />
          </div>

          {/* Subtitle */}
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* Premium Testimonials Grid - All Side by Side */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <motion.div
                className="relative bg-white rounded-3xl overflow-hidden border-2 border-gray-100 hover:border-[#D9B574]/50 transition-all duration-500"
                whileHover={{ y: -12, scale: 1.02, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}
              >
                {/* Gradient Header */}
                <div className={`relative h-3 bg-gradient-to-r ${testimonial.bgGradient}`}>
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>

                <div className="p-6">
                  {/* Quote Icon */}
                  <motion.div
                    className="absolute top-6 right-6 opacity-10"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.15, 1],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                    }}
                  >
                    <Quote className="w-16 h-16 text-[#D9B574]" />
                  </motion.div>

                  {/* Stars - Animated */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0, rotate: -180 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          delay: 0.1 * i, 
                          type: 'spring' as const,
                          stiffness: 200 
                        }}
                        whileHover={{ scale: 1.3, rotate: 360 }}
                      >
                        <Star className="w-5 h-5 fill-[#D9B574] text-[#D9B574]" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 leading-relaxed mb-6 text-sm relative z-10">
                    <span className="text-3xl text-[#D9B574] leading-none">"</span>
                    {testimonial.content}
                    <span className="text-3xl text-[#D9B574] leading-none">"</span>
                  </p>

                  {/* Author Section - Redesigned */}
                  <div className="flex flex-col items-center gap-3 pt-4 border-t-2 border-gray-100">
                    {/* Avatar with Gradient Border */}
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: 'spring' as const, stiffness: 300 }}
                    >
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${testimonial.bgGradient} p-1 shadow-xl`}>
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                          <span className="text-3xl">{testimonial.avatar}</span>
                        </div>
                      </div>
                      
                      {/* Flag Badge */}
                      <motion.div
                        className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.4 }}
                      >
                        <span className="text-base">{testimonial.flag}</span>
                      </motion.div>
                    </motion.div>

                    {/* Name and Role */}
                    <div className="text-center">
                      <h4 className="font-bold text-gray-900 text-base mb-0.5">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-500 text-xs font-medium mb-2">
                        {testimonial.role}
                      </p>
                      {/* Verified Badge */}
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 rounded-full">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span className="text-xs font-bold text-green-700">{t('verified')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-8 mt-20 pt-16 border-t-2 border-gray-200"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.1 }}
          >
            <div className="text-4xl font-bold bg-gradient-to-r from-[#2B7A78] to-[#D9B574] bg-clip-text text-transparent mb-2">
              4.9/5
            </div>
            <div className="text-gray-600 text-sm font-medium">{t('stats.averageRating')}</div>
          </motion.div>

          <div className="h-12 w-px bg-gray-300" />

          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.1 }}
          >
            <div className="text-4xl font-bold bg-gradient-to-r from-[#2B7A78] to-[#D9B574] bg-clip-text text-transparent mb-2">
              1,200+
            </div>
            <div className="text-gray-600 text-sm font-medium">{t('stats.happyReviews')}</div>
          </motion.div>

          <div className="h-12 w-px bg-gray-300" />

          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.1 }}
          >
            <div className="text-4xl font-bold bg-gradient-to-r from-[#2B7A78] to-[#D9B574] bg-clip-text text-transparent mb-2">
              98%
            </div>
            <div className="text-gray-600 text-sm font-medium">{t('stats.satisfactionRate')}</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
