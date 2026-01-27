import { getTranslations } from 'next-intl/server';
import CourseCard from '@/components/CourseCard';
import { getCoursesByCategory } from '@/lib/data';

export default async function QuranAdultsPage() {
  const t = await getTranslations('courses');
  const courses = getCoursesByCategory('quran-adults');

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📖</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('quranAdults.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('quranAdults.description')}
          </p>
        </div>

        {/* Course Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-primary-50 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('quranAdults.features.tajweed.title')}</h3>
            <p className="text-sm text-gray-600">
              {t('quranAdults.features.tajweed.description')}
            </p>
          </div>
          <div className="bg-primary-50 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('quranAdults.features.hifz.title')}</h3>
            <p className="text-sm text-gray-600">
              {t('quranAdults.features.hifz.description')}
            </p>
          </div>
          <div className="bg-primary-50 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">🎓</div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('quranAdults.features.ijazah.title')}</h3>
            <p className="text-sm text-gray-600">
              {t('quranAdults.features.ijazah.description')}
            </p>
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
