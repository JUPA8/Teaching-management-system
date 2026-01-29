'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

// Testimonial data with Islamic-style avatars and country flags
const testimonialData = [
  { key: 'sarah', avatar: '🧕', flag: '🇩🇪', bgColor: '#3B6F5F', initial: 'س' },
  { key: 'ahmed', avatar: '🧔', flag: '🇦🇹', bgColor: '#C19A6B', initial: 'أ' },
  { key: 'fatima', avatar: '🧕🏽', flag: '🇨🇭', bgColor: '#D4AF37', initial: 'ف' },
  { key: 'muhammad', avatar: '👳', flag: '🇺🇸', bgColor: '#2F5F54', initial: 'م' },
] as const;

export default function Testimonials() {
  const t = useTranslations('testimonials');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section className="py-16 md:py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #FAF6F1 0%, #F5EFE7 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-charcoal mb-4 font-serif"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('title')}
          </motion.h2>
          <motion.p
            className="text-lg text-charcoal-light max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {testimonialData.map((item, index) => {
            const name = t(`items.${item.key}.name`);
            const role = t(`items.${item.key}.role`);
            const content = t(`items.${item.key}.content`);

            return (
              <motion.div
                key={item.key}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  borderColor: item.bgColor,
                }}
                className="p-6 cursor-pointer rounded-2xl border-2 relative"
                style={{
                  background: 'linear-gradient(135deg, #FAF6F1 0%, #F5EFE7 100%)',
                  borderColor: '#C19A6B',
                  boxShadow: '0 8px 25px rgba(193, 154, 107, 0.15)',
                }}
              >
                {/* Decorative corner ornaments */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 opacity-30" style={{ borderColor: item.bgColor }}></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 opacity-30" style={{ borderColor: item.bgColor }}></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 opacity-30" style={{ borderColor: item.bgColor }}></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 opacity-30" style={{ borderColor: item.bgColor }}></div>
                
                {/* Quote Icon */}
                <motion.div
                  className="mb-4"
                  initial={{ rotate: -20, opacity: 0 }}
                  whileInView={{ rotate: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <Quote className="w-8 h-8" style={{ color: item.bgColor, opacity: 0.5 }} />
                </motion.div>

                {/* Content */}
                <motion.p
                  className="text-charcoal-light mb-6 text-sm leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 * index, duration: 0.5 }}
                >
                  &quot;{content}&quot;
                </motion.p>

                {/* Author */}
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * index, duration: 0.5 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-full flex items-center justify-center border-2"
                    style={{ 
                      background: `${item.bgColor}20`,
                      borderColor: item.bgColor
                    }}
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    animate={{
                      y: [0, -3, 0],
                    }}
                    transition={{
                      y: {
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }
                    }}
                  >
                    <span className="text-2xl">
                      {item.avatar}
                    </span>
                  </motion.div>
                  <div>
                    <p className="font-semibold text-charcoal text-sm flex items-center gap-2 font-serif">
                      {name}
                      <motion.span
                        className="text-base"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      >
                        {item.flag}
                      </motion.span>
                    </p>
                    <p className="text-charcoal-light text-xs">{role}</p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
