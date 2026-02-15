'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import CourseCard from '@/components/CourseCard';
import { getCoursesByCategory } from '@/lib/data';
import { motion } from 'framer-motion';

export default function IslamicStudiesPage() {
  const t = useTranslations('courses');
  const courses = getCoursesByCategory('islamic');

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section with Beautiful Image */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/islamic-studies-hero-bg.png"
            alt={t('islamic.heroAlt')}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/60 to-transparent" />
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full mb-8 backdrop-blur-md border-2 border-secondary/50"
              style={{ background: 'rgba(217, 181, 116, 0.15)' }}
            >
              <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
              </svg>
              <span className="text-secondary font-semibold text-lg">{t('islamic.heroBadge')}</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold mb-6 font-serif leading-tight"
            >
              {t('islamic.title')}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl mb-8 text-gray-200 leading-relaxed"
            >
              {t('islamic.description')}
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
                {t('islamic.beginJourney')}
              </Link>
              <Link
                href="#subjects"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                {t('islamic.exploreSubjects')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Islamic Subjects with Natural Icons */}
      <section id="subjects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4 font-serif">
              {t('islamic.coreSubjectsTitle')}
            </h2>
            <p className="text-xl text-charcoal-light max-w-3xl mx-auto">
              {t('islamic.coreSubjectsSubtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: t('islamic.subjects.fiqh.title'),
                desc: t('islamic.subjects.fiqh.description'),
                gradient: 'from-primary/10 to-primary/5',
                iconBg: 'bg-primary/10',
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
              },
              {
                title: t('islamic.subjects.aqidah.title'),
                desc: t('islamic.subjects.aqidah.description'),
                gradient: 'from-secondary/10 to-secondary/5',
                iconBg: 'bg-secondary/10',
                icon: (
                  <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ),
              },
              {
                title: t('islamic.subjects.seerah.title'),
                desc: t('islamic.subjects.seerah.description'),
                gradient: 'from-primary/10 to-primary/5',
                iconBg: 'bg-primary/10',
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: t('islamic.subjects.hadith.title'),
                desc: t('islamic.subjects.hadith.description'),
                gradient: 'from-secondary/10 to-secondary/5',
                iconBg: 'bg-secondary/10',
                icon: (
                  <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                ),
              },
            ].map((subject, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`bg-gradient-to-br ${subject.gradient} rounded-2xl p-8 border-2 border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all`}
              >
                <div className={`w-16 h-16 ${subject.iconBg} rounded-xl flex items-center justify-center mb-6`}>
                  {subject.icon}
                </div>
                <h3 className="text-2xl font-bold text-charcoal mb-4 font-serif">
                  {subject.title}
                </h3>
                <p className="text-charcoal-light leading-relaxed mb-6">
                  {subject.desc}
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                >
                  {t('islamic.learnMore')}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
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
                src="/islamic-studies-classroom-new.png"
                alt={t('islamic.classroomAlt')}
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
                {t('islamic.deepenTitle')}
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    title: t('islamic.benefits.practical.title'),
                    desc: t('islamic.benefits.practical.description'),
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                  },
                  {
                    title: t('islamic.benefits.authentic.title'),
                    desc: t('islamic.benefits.authentic.description'),
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    ),
                  },
                  {
                    title: t('islamic.benefits.community.title'),
                    desc: t('islamic.benefits.community.description'),
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    ),
                  },
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white transition-colors"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-charcoal mb-2">
                        {benefit.title}
                      </h4>
                      <p className="text-charcoal-light leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Books Image Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <h2 className="text-4xl font-bold text-charcoal mb-6 font-serif">
                {t('islamic.authenticSourcesTitle')}
              </h2>
              <p className="text-xl text-charcoal-light mb-6 leading-relaxed">
                {t('islamic.authenticSourcesDescription')}
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  t('islamic.authenticFeatures.classical'),
                  t('islamic.authenticFeatures.isnad'),
                  t('islamic.authenticFeatures.context'),
                  t('islamic.authenticFeatures.qa'),
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
                {t('islamic.startLearningToday')}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl order-1 md:order-2"
            >
              <Image
                src="/islamic-studies-books.png"
                alt={t('islamic.booksAlt')}
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 bg-cream">
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
              {t('islamic.availableSubtitle')}
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
