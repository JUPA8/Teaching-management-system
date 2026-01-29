'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { GraduationCap, Clock, UserCheck, TrendingUp } from 'lucide-react';

export default function Features() {
  const t = useTranslations('features');

  const features = [
    {
      icon: GraduationCap,
      title: t('qualified.title'),
      description: t('qualified.description'),
      color: 'bg-primary-100 text-primary-600',
      hoverColor: 'group-hover:bg-primary-600 group-hover:text-white',
    },
    {
      icon: Clock,
      title: t('flexible.title'),
      description: t('flexible.description'),
      color: 'bg-blue-100 text-blue-600',
      hoverColor: 'group-hover:bg-blue-600 group-hover:text-white',
    },
    {
      icon: UserCheck,
      title: t('personalized.title'),
      description: t('personalized.description'),
      color: 'bg-amber-100 text-amber-600',
      hoverColor: 'group-hover:bg-amber-600 group-hover:text-white',
    },
    {
      icon: TrendingUp,
      title: t('progress.title'),
      description: t('progress.description'),
      color: 'bg-purple-100 text-purple-600',
      hoverColor: 'group-hover:bg-purple-600 group-hover:text-white',
    },
  ];

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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-cream-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 md:mb-16"
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
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('title')}
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -10,
                boxShadow: '0 25px 50px -12px rgba(177, 140, 93, 0.2)',
              }}
              className="group p-6 rounded-2xl bg-cream-100 hover:bg-white transition-all duration-300 cursor-pointer border border-secondary-100 hover:border-secondary-300"
            >
              <motion.div
                className={`w-14 h-14 rounded-xl ${feature.color} ${feature.hoverColor} flex items-center justify-center mb-5 transition-all duration-300`}
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className="w-7 h-7" />
              </motion.div>
              <motion.h3
                className="text-xl font-semibold text-charcoal mb-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
              >
                {feature.title}
              </motion.h3>
              <p className="text-charcoal-light">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
