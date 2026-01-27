'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonialKeys = ['sarah', 'ahmed', 'fatima', 'muhammad'] as const;

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
    <section className="py-16 md:py-24 bg-white overflow-hidden">
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
          {testimonialKeys.map((key, index) => {
            const name = t(`items.${key}.name`);
            const role = t(`items.${key}.role`);
            const content = t(`items.${key}.content`);

            return (
              <motion.div
                key={key}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
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
                  <Quote className="w-8 h-8 text-primary-200" />
                </motion.div>

                {/* Content */}
                <motion.p
                  className="text-gray-600 mb-6 text-sm leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 * index, duration: 0.5 }}
                >
                  "{content}"
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
                    className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <span className="text-primary-600 font-semibold text-sm">
                      {name.charAt(0)}
                    </span>
                  </motion.div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {name}
                    </p>
                    <p className="text-gray-500 text-xs">{role}</p>
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
