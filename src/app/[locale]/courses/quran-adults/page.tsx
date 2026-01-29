import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import CourseCard from '@/components/CourseCard';
import { getCoursesByCategory } from '@/lib/data';

export default async function QuranAdultsPage() {
  const t = await getTranslations('courses');
  const courses = getCoursesByCategory('quran-adults');

  return (
    <div className="py-12 md:py-20 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📖</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
            {t('quranAdults.title')}
          </h1>
          <p className="text-lg text-charcoal-light max-w-2xl mx-auto">
            {t('quranAdults.description')}
          </p>
        </div>

        {/* Course Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-cream-200 rounded-xl p-6 text-center border border-secondary-100 hover:border-secondary-300 transition-colors">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-charcoal mb-2">{t('quranAdults.features.tajweed.title')}</h3>
            <p className="text-sm text-charcoal-light mb-4">
              {t('quranAdults.features.tajweed.description')}
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/courses/tajweed-mastery" className="btn-primary text-xs py-2 px-3 inline-block">{t('viewCourse')}</Link>
              <Link href="/register" className="btn-outline text-xs py-2 px-3 inline-block">{t('freeTrialLesson')}</Link>
            </div>
          </div>
          <div className="bg-cream-200 rounded-xl p-6 text-center border border-secondary-100 hover:border-secondary-300 transition-colors">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-semibold text-charcoal mb-2">{t('quranAdults.features.hifz.title')}</h3>
            <p className="text-sm text-charcoal-light mb-4">
              {t('quranAdults.features.hifz.description')}
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/courses/hifz-program" className="btn-primary text-xs py-2 px-3 inline-block">{t('viewCourse')}</Link>
              <Link href="/register" className="btn-outline text-xs py-2 px-3 inline-block">{t('freeTrialLesson')}</Link>
            </div>
          </div>
          <div className="bg-cream-200 rounded-xl p-6 text-center border border-secondary-100 hover:border-secondary-300 transition-colors">
            <div className="text-3xl mb-3">🎓</div>
            <h3 className="font-semibold text-charcoal mb-2">{t('quranAdults.features.ijazah.title')}</h3>
            <p className="text-sm text-charcoal-light mb-4">
              {t('quranAdults.features.ijazah.description')}
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/register" className="btn-primary text-xs py-2 px-3 inline-block">{t('bookFreeTrial')}</Link>
            </div>
          </div>
          <div className="bg-cream-200 rounded-xl p-6 text-center border border-secondary-100 hover:border-secondary-300 transition-colors">
            <div className="text-3xl mb-3">📜</div>
            <h3 className="font-semibold text-charcoal mb-2">{t('quranAdults.features.tafseer.title')}</h3>
            <p className="text-sm text-charcoal-light mb-4">
              {t('quranAdults.features.tafseer.description')}
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/courses/tafseer-course" className="btn-primary text-xs py-2 px-3 inline-block">{t('viewCourse')}</Link>
              <Link href="/register" className="btn-outline text-xs py-2 px-3 inline-block">{t('freeTrialLesson')}</Link>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
