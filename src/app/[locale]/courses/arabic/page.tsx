'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import CourseCard from '@/components/CourseCard';
import { getCoursesByCategory } from '@/lib/data';
import { motion } from 'framer-motion';

export default function ArabicPage() {
  const t = useTranslations('courses');
  const courses = getCoursesByCategory('arabic');

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative h-[75vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/arabic-learning-hero-bg.png"
            alt={t('arabic.heroAlt')}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/60 to-transparent" />
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 border-secondary/50 mb-8 backdrop-blur-md"
              style={{ background: 'rgba(217, 181, 116, 0.15)' }}
            >
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span className="text-secondary font-semibold">{t('arabic.heroBadge')}</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold mb-6 font-serif"
            >
              {t('arabic.title')}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl mb-8 text-gray-200 leading-relaxed"
            >
              {t('arabic.description')}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4"
            >
              <Link
                href="/register"
                className="px-8 py-4 bg-secondary text-charcoal font-bold rounded-xl hover:bg-secondary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {t('arabic.startLearning')}
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                {t('arabic.viewLevels')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4 font-serif">
              {t('arabic.whatYouLearnTitle')}
            </h2>
            <p className="text-xl text-charcoal-light max-w-2xl mx-auto">
              {t('arabic.whatYouLearnSubtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: t('arabic.features.alphabet'),
                desc: t('arabic.features.alphabetDesc'),
                gradient: 'from-primary/10 to-primary/5',
                iconBg: 'bg-primary/10',
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
              },
              {
                title: t('arabic.features.grammar'),
                desc: t('arabic.features.grammarDesc'),
                gradient: 'from-secondary/10 to-secondary/5',
                iconBg: 'bg-secondary/10',
                icon: (
                  <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
              },
              {
                title: t('arabic.features.conversation'),
                desc: t('arabic.features.conversationDesc'),
                gradient: 'from-primary/10 to-primary/5',
                iconBg: 'bg-primary/10',
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                ),
              },
              {
                title: t('arabic.features.quranic'),
                desc: t('arabic.features.quranicDesc'),
                gradient: 'from-secondary/10 to-secondary/5',
                iconBg: 'bg-secondary/10',
                icon: (
                  <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-6 border-2 border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all`}
              >
                <div className={`w-16 h-16 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-3">
                  {feature.title}
                </h3>
                <p className="text-charcoal-light leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Image Section */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/arabic-language-teaching-new.png"
                alt={t('arabic.teachingAlt')}
                fill
                className="object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-charcoal mb-6 font-serif">
                {t('arabic.expertTeachersTitle')}
              </h2>
              <p className="text-xl text-charcoal-light mb-6 leading-relaxed">
                {t('arabic.expertTeachersDescription')}
              </p>
              <div className="space-y-4">
                {[
                  { key: 'native' },
                  { key: 'interactive' },
                  { key: 'modern' },
                  { key: 'cultural' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <svg className="w-6 h-6 text-secondary flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-bold text-charcoal mb-1">{t(`arabic.teachingFeatures.${item.key}.title`)}</h4>
                      <p className="text-charcoal-light text-sm">{t(`arabic.teachingFeatures.${item.key}.description`)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Learning Levels */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-charcoal mb-4 font-serif">
              {t('arabic.learningPath')}
            </h2>
            <p className="text-xl text-charcoal-light">
              {t('arabic.learningPathSubtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { level: '1', label: t('arabic.levels.1'), color: 'primary' },
              { level: '2', label: t('arabic.levels.2'), color: 'secondary' },
              { level: '3', label: t('arabic.levels.3'), color: 'primary' },
              { level: '4', label: t('arabic.levels.4'), color: 'secondary' },
            ].map((level, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                className={`bg-gradient-to-br from-${level.color}/10 to-${level.color}/5 rounded-2xl p-8 text-center border-2 border-${level.color}/20 hover:shadow-xl transition-all`}
              >
                <div className={`w-20 h-20 bg-${level.color} rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold shadow-lg`}>
                  {level.level}
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-2">Level {level.level}</h3>
                <p className="text-charcoal-light">{level.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Calligraphy Image Section */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <h2 className="text-4xl font-bold text-charcoal mb-6 font-serif">
                {t('arabic.writingTitle')}
              </h2>
              <p className="text-xl text-charcoal-light mb-6 leading-relaxed">
                {t('arabic.writingDescription')}
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  t('arabic.writingFeatures.letters'),
                  t('arabic.writingFeatures.connections'),
                  t('arabic.writingFeatures.practice'),
                  t('arabic.writingFeatures.fluency'),
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 text-charcoal-light"
                  >
                    <svg className="w-6 h-6 text-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </motion.li>
                ))}
              </ul>
              <Link
                href="/register"
                className="inline-block px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-lg"
              >
                {t('arabic.startJourney')}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl order-1 md:order-2"
            >
              <Image
                src="/arabic-calligraphy.png"
                alt={t('arabic.calligraphyAlt')}
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-charcoal mb-4 font-serif">
              {t('quranAdults.availableTitle')}
            </h2>
            <p className="text-lg text-charcoal-light">
              {t('arabic.availableSubtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>

          {/* See All Courses Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-secondary font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>{t('viewAll')}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
