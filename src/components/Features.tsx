'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { GraduationCap, Clock, UserCheck, TrendingUp } from 'lucide-react';
import { IslamicBorder } from './decorative';

export default function Features() {
  const t = useTranslations('features');

  const features = [
    {
      icon: GraduationCap,
      title: t('qualified.title'),
      description: t('qualified.description'),
      bgColor: '#3B6F5F',
      iconBg: 'rgba(59, 111, 95, 0.1)',
    },
    {
      icon: Clock,
      title: t('flexible.title'),
      description: t('flexible.description'),
      bgColor: '#C19A6B',
      iconBg: 'rgba(193, 154, 107, 0.1)',
    },
    {
      icon: UserCheck,
      title: t('personalized.title'),
      description: t('personalized.description'),
      bgColor: '#D4AF37',
      iconBg: 'rgba(212, 175, 55, 0.1)',
    },
    {
      icon: TrendingUp,
      title: t('progress.title'),
      description: t('progress.description'),
      bgColor: '#2F5F54',
      iconBg: 'rgba(47, 95, 84, 0.1)',
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
    <section className="py-16 md:py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #F5EFE7 0%, #FAF6F1 100%)' }}>
      {/* Decorative Islamic Border */}
      <div className="absolute top-0 left-0 right-0 flex justify-center">
        <IslamicBorder className="w-full max-w-2xl h-8" color="#C19A6B" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 md:mb-16"
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
                borderColor: feature.bgColor,
              }}
              className="group p-6 rounded-2xl transition-all duration-300 cursor-pointer border-2 relative"
              style={{
                background: 'linear-gradient(135deg, #FAF6F1 0%, #F5EFE7 100%)',
                borderColor: '#C19A6B',
                boxShadow: '0 8px 25px rgba(193, 154, 107, 0.1)',
              }}
            >
              {/* Corner decorations */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 opacity-30" style={{ borderColor: feature.bgColor }}></div>
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 opacity-30" style={{ borderColor: feature.bgColor }}></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 opacity-30" style={{ borderColor: feature.bgColor }}></div>
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 opacity-30" style={{ borderColor: feature.bgColor }}></div>
              
              <motion.div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
                style={{ 
                  background: feature.iconBg,
                }}
                whileHover={{ 
                  rotate: [0, -10, 10, 0], 
                  scale: 1.1,
                  background: feature.bgColor,
                  color: 'white'
                }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className="w-7 h-7" style={{ color: feature.bgColor }} />
              </motion.div>
              <motion.h3
                className="text-xl font-semibold text-charcoal mb-3 font-serif"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
              >
                {feature.title}
              </motion.h3>
              <p className="text-charcoal-light leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
