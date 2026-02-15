'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import CourseCard from '@/components/CourseCard';
import { getCoursesByCategory } from '@/lib/data';
import { motion } from 'framer-motion';

export default function QuranAdultsPage() {
  const t = useTranslations('courses');
  const courses = getCoursesByCategory('quran-adults');

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section with Beautiful Image */}
      <section className="relative h-[75vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/quran-adults-hero-bg.png"
            alt="Quran for Adults"
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-secondary/50 mb-8 backdrop-blur-md"
              style={{ background: 'rgba(217, 181, 116, 0.15)' }}
            >
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-secondary font-semibold">{t('quranAdults.badge')}</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold mb-6 font-serif"
            >
              {t('quranAdults.title')}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl mb-8 text-gray-200 leading-relaxed"
            >
              {t('quranAdults.description')}
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
                {t('bookFreeTrial')}
              </Link>
              <Link
                href="#programs"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                {t('quranAdults.viewPrograms')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Programs Section with Clean Icons */}
      <section id="programs" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4 font-serif">
              {t('quranAdults.specializedTitle')}
            </h2>
            <p className="text-xl text-charcoal-light max-w-2xl mx-auto">
              {t('quranAdults.specializedSubtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: t('quranAdults.features.tajweed.title'),
                desc: t('quranAdults.features.tajweed.description'),
                gradient: 'from-primary/10 to-primary/5',
                iconBg: 'bg-primary/10',
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                ),
              },
              {
                title: t('quranAdults.features.hifz.title'),
                desc: t('quranAdults.features.hifz.description'),
                gradient: 'from-secondary/10 to-secondary/5',
                iconBg: 'bg-secondary/10',
                icon: (
                  <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
              },
              {
                title: t('quranAdults.features.ijazah.title'),
                desc: t('quranAdults.features.ijazah.description'),
                gradient: 'from-primary/10 to-primary/5',
                iconBg: 'bg-primary/10',
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                ),
              },
              {
                title: t('quranAdults.features.tafseer.title'),
                desc: t('quranAdults.features.tafseer.description'),
                gradient: 'from-secondary/10 to-secondary/5',
                iconBg: 'bg-secondary/10',
                icon: (
                  <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
              },
            ].map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`bg-gradient-to-br ${program.gradient} rounded-2xl p-6 border-2 border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all`}
              >
                <div className={`w-16 h-16 ${program.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  {program.icon}
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-3 font-serif">
                  {program.title}
                </h3>
                <p className="text-charcoal-light mb-6 leading-relaxed text-sm">
                  {program.desc}
                </p>
                <Link
                  href="/register"
                  className="inline-block w-full text-center px-4 py-3 bg-charcoal text-white font-semibold rounded-xl hover:bg-charcoal/90 transition-all"
                >
                  {t('quranAdults.startLearning')}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Study Group Image Section */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-charcoal mb-6 font-serif">
                {t('quranAdults.supportiveTitle')}
              </h2>
              <p className="text-xl text-charcoal-light mb-6 leading-relaxed">
                {t('quranAdults.supportiveDescription')}
              </p>
              <div className="space-y-4">
                {[
                  { icon: '👨‍🏫', title: t('quranAdults.environment.certified.title'), desc: t('quranAdults.environment.certified.description') },
                  { icon: '⏰', title: t('quranAdults.environment.flexible.title'), desc: t('quranAdults.environment.flexible.description') },
                  { icon: '🎯', title: t('quranAdults.environment.personalized.title'), desc: t('quranAdults.environment.personalized.description') },
                  { icon: '📱', title: t('quranAdults.environment.anywhere.title'), desc: t('quranAdults.environment.anywhere.description') },
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white transition-colors"
                  >
                    <div className="text-3xl">{benefit.icon}</div>
                    <div>
                      <h4 className="font-bold text-charcoal mb-1">{benefit.title}</h4>
                      <p className="text-charcoal-light text-sm">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/quran-adults-study-group-new.png"
                alt="Adult Quran Study Group"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tajweed Image Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl order-2 md:order-1"
            >
              <Image
                src="/quran-adults-tajweed.png"
                alt="Quran Tajweed Study"
                fill
                className="object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 md:order-2"
            >
              <h2 className="text-4xl font-bold text-charcoal mb-6 font-serif">
                {t('quranAdults.benefitsTitle')}
              </h2>
              <p className="text-xl text-charcoal-light mb-6 leading-relaxed">
                {t('quranAdults.benefitsDescription')}
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  t('quranAdults.benefitsList.stepByStep'),
                  t('quranAdults.benefitsList.liveFeedback'),
                  t('quranAdults.benefitsList.pronunciation'),
                  t('quranAdults.benefitsList.beautify'),
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 30 }}
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
                {t('quranAdults.startJourney')}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section id="courses" className="py-20 bg-cream">
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
              {t('quranAdults.availableSubtitle')}
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
