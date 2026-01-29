'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

// Testimonial data with Islamic-style avatars and country flags
const testimonialData = [
  { key: 'sarah', avatar: '🧕', flag: '🇩🇪', bgColor: 'bg-primary-100', initial: 'س' },
  { key: 'ahmed', avatar: '🧔', flag: '🇦🇹', bgColor: 'bg-secondary-100', initial: 'أ' },
  { key: 'fatima', avatar: '🧕🏽', flag: '🇨🇭', bgColor: 'bg-primary-50', initial: 'ف' },
  { key: 'muhammad', avatar: '👳', flag: '🇺🇸', bgColor: 'bg-secondary-50', initial: 'م' },
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
    <section className="py-16 md:py-24 bg-cream-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('title')}
          </motion.h2>
          <motion.p
            className="section-subtitle max-w-2xl mx-auto"
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
                  boxShadow: '0 25px 50px -12px rgba(177, 140, 93, 0.2)',
                }}
                className="card p-6 cursor-pointer"
              >
                {/* Quote Icon */}
                <motion.div
                  className="mb-4"
                  initial={{ rotate: -20, opacity: 0 }}
                  whileInView={{ rotate: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <Quote className="w-8 h-8 text-secondary-300" />
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
                    className={`w-12 h-12 rounded-full ${item.bgColor} flex items-center justify-center`}
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
                    <p className="font-semibold text-charcoal text-sm flex items-center gap-2">
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
