'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import CourseCard from '@/components/CourseCard';
import { getCoursesByCategory } from '@/lib/data';
import { motion } from 'framer-motion';

export default function QuranKidsPage() {
  const t = useTranslations('courses');
  const courses = getCoursesByCategory('quran-kids');

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative h-[75vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/quran-kids-classroom.png"
            alt="Quran for Kids"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal/70" />
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-8 backdrop-blur-md border-2"
              style={{ background: 'rgba(217, 181, 116, 0.2)', borderColor: 'rgba(217, 181, 116, 0.5)' }}
            >
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-secondary font-semibold">{t('quranKids.ageBadge')}</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold mb-6 font-serif"
            >
              {t('quranKids.title')}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl mb-8 text-gray-200 leading-relaxed"
            >
              {t('quranKids.description')}
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
                {t('quranKids.startFreeTrial')}
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                {t('quranKids.learnMore')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Fun Learning Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4 font-serif">
              {t('quranKids.funLearningTitle')}
            </h2>
            <p className="text-xl text-charcoal-light max-w-2xl mx-auto">
              {t('quranKids.funLearningSubtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: t('quranKids.features.interactive.title'),
                desc: t('quranKids.features.interactive.description'),
                gradient: 'from-primary/10 to-primary/5',
                iconBg: 'bg-primary/10',
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: t('quranKids.features.rewards.title'),
                desc: t('quranKids.features.rewards.description'),
                gradient: 'from-secondary/10 to-secondary/5',
                iconBg: 'bg-secondary/10',
                icon: (
                  <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ),
              },
              {
                title: t('quranKids.features.reports.title'),
                desc: t('quranKids.features.reports.description'),
                gradient: 'from-primary/10 to-primary/5',
                iconBg: 'bg-primary/10',
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -8 }}
                className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-8 border-2 border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all`}
              >
                <div className={`w-16 h-16 ${feature.iconBg} rounded-xl flex items-center justify-center mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-charcoal mb-3 font-serif">
                  {feature.title}
                </h3>
                <p className="text-charcoal-light leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Classroom Image Section */}
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
                src="/quran-kids-classroom.png"
                alt={t('quranKids.classroomAlt')}
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
                {t('quranKids.joyfulTitle')}
              </h2>
              <p className="text-xl text-charcoal-light mb-6 leading-relaxed">
                {t('quranKids.joyfulDescription')}
              </p>
              <div className="space-y-4">
                {[
                  { key: 'smallGroups' },
                  { key: 'qualifiedTeachers' },
                  { key: 'interactiveActivities' },
                  { key: 'progressTracking' },
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
                      <h4 className="font-bold text-charcoal mb-1">{t(`quranKids.environment.${item.key}.title` as any)}</h4>
                      <p className="text-charcoal-light text-sm">{t(`quranKids.environment.${item.key}.description` as any)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Age Programs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-charcoal mb-4 font-serif">
              {t('quranKids.agePrograms.title')}
            </h2>
            <p className="text-xl text-charcoal-light">
              {t('quranKids.agePrograms.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                key: 'ages46',
                gradient: 'from-primary/10 to-primary/5',
                borderColor: 'border-primary/20',
                iconBg: 'bg-primary/10',
                iconColor: 'text-primary',
              },
              {
                key: 'ages710',
                gradient: 'from-secondary/10 to-secondary/5',
                borderColor: 'border-secondary/20',
                iconBg: 'bg-secondary/10',
                iconColor: 'text-secondary',
              },
              {
                key: 'ages1114',
                gradient: 'from-primary/10 to-primary/5',
                borderColor: 'border-primary/20',
                iconBg: 'bg-primary/10',
                iconColor: 'text-primary',
              },
            ].map((program, index) => (
              <motion.div
                key={program.key}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className={`bg-gradient-to-br ${program.gradient} rounded-2xl p-8 border-2 ${program.borderColor} hover:shadow-xl transition-all`}
              >
                <div className={`w-20 h-20 ${program.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <svg className={`w-10 h-10 ${program.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-charcoal mb-4 text-center font-serif">
                  {t(`quranKids.agePrograms.${program.key}.title` as any)}
                </h3>
                <p className="text-charcoal-light text-center mb-6 leading-relaxed">
                  {t(`quranKids.agePrograms.${program.key}.description` as any)}
                </p>
                <Link
                  href="/register"
                  className="block w-full text-center px-6 py-3 bg-charcoal text-white font-semibold rounded-xl hover:bg-charcoal/90 transition-all"
                >
                  {t('quranKids.enrollNow')}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Image Section */}
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
                {t('quranKids.materialsTitle')}
              </h2>
              <p className="text-xl text-charcoal-light mb-6 leading-relaxed">
                {t('quranKids.materialsDescription')}
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  t('quranKids.materialsList.books'),
                  t('quranKids.materialsList.games'),
                  t('quranKids.materialsList.aids'),
                  t('quranKids.materialsList.rewards'),
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
                {t('quranKids.bookFreeTrial')}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl order-1 md:order-2"
            >
              <Image
                src="/quran-kids-learning.png"
                alt={t('quranKids.learningAlt')}
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
              {t('quranKids.availableSubtitle')}
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
