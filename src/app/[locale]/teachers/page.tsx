'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Users, Award, Globe, GraduationCap, Heart } from 'lucide-react';

const teacherKeys = ['ahmad', 'fatima', 'mariam', 'omar', 'ibrahim'] as const;
const teacherExperience: Record<typeof teacherKeys[number], number> = {
  ahmad: 15,
  fatima: 12,
  mariam: 8,
  omar: 18,
  ibrahim: 10,
};

export default function TeachersPage() {
  const t = useTranslations('teachers');

  const stats = [
    { value: '18', label: t('stats.qualified'), icon: GraduationCap, color: 'from-primary-500 to-primary-600' },
    { value: '11', label: t('stats.countries'), icon: Globe, color: 'from-secondary-500 to-secondary-600' },
    { value: '10+', label: t('stats.languages'), icon: Heart, color: 'from-gold-500 to-gold-600' },
    { value: '460+', label: t('stats.students'), icon: Users, color: 'from-purple-500 to-purple-600' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
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
            <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
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

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative overflow-hidden rounded-2xl p-6 text-center bg-white shadow-lg border border-gray-100"
            >
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}
                whileHover={{ opacity: 0.1 }}
              />
              <motion.div
                className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </motion.div>
              <motion.div
                className="text-3xl font-bold text-gray-900 mb-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 + index * 0.1 }}
              >
                {stat.value}
              </motion.div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Teachers Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {teacherKeys.map((key, index) => {
            const name = t(`list.${key}.name`);
            const title = t(`list.${key}.title`);
            const bio = t(`list.${key}.bio`);
            const languages = t.raw(`list.${key}.languages`) as string[];
            const specializations = t.raw(`list.${key}.specializations`) as string[];
            const experience = teacherExperience[key];

            return (
              <motion.div
                key={key}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group"
              >
                {/* Header with Avatar */}
                <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 p-8 text-center">
                  {/* Decorative elements */}
                  <motion.div
                    className="absolute top-4 end-4 w-20 h-20 bg-white/10 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity, delay: index * 0.2 }}
                  />
                  <motion.div
                    className="absolute bottom-4 start-4 w-12 h-12 bg-white/10 rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
                  />

                  <motion.div
                    className="relative w-28 h-28 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <span className="text-5xl font-bold bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                      {name.charAt(0)}
                    </span>
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {name}
                  </h3>
                  <p className="text-primary-100 text-sm">{title}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-5 line-clamp-3">
                    {bio}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    {[
                      { icon: Award, value: experience, label: t('experience'), color: 'text-primary-600' },
                      { icon: Globe, value: languages.length, label: t('stats.languages'), color: 'text-secondary-600' },
                    ].map((stat, idx) => (
                      <motion.div
                        key={idx}
                        className="text-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className={`flex items-center justify-center gap-1 ${stat.color} font-bold`}>
                          <stat.icon className="w-4 h-4" />
                          {stat.value}
                        </div>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Languages */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Globe className="w-4 h-4" />
                      <span>{t('languages')}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((lang, idx) => (
                        <motion.span
                          key={lang}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          whileHover={{ scale: 1.1 }}
                          className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 cursor-default"
                        >
                          {lang}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Specializations */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">{t('specializations')}</p>
                    <div className="flex flex-wrap gap-2">
                      {specializations.map((spec, idx) => (
                        <motion.span
                          key={spec}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + idx * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          className="px-3 py-1 bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 rounded-full text-xs font-medium"
                        >
                          {spec}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
