import { getTranslations } from 'next-intl/server';
import CourseCard from '@/components/CourseCard';
import { getCoursesByCategory } from '@/lib/data';

export default async function QuranKidsPage() {
  const t = await getTranslations('courses');
  const courses = getCoursesByCategory('quran-kids');

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">👶</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('quranKids.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('quranKids.description')}
          </p>
        </div>

        {/* Kids Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-amber-50 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">🎮</div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('quranKids.features.interactive.title')}</h3>
            <p className="text-sm text-gray-600">
              {t('quranKids.features.interactive.description')}
            </p>
          </div>
          <div className="bg-amber-50 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('quranKids.features.rewards.title')}</h3>
            <p className="text-sm text-gray-600">
              {t('quranKids.features.rewards.description')}
            </p>
          </div>
          <div className="bg-amber-50 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">👨‍👩‍👧</div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('quranKids.features.reports.title')}</h3>
            <p className="text-sm text-gray-600">
              {t('quranKids.features.reports.description')}
            </p>
          </div>
        </div>

        {/* Age Groups */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('quranKids.agePrograms.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="text-4xl mb-3">🌟</div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('quranKids.agePrograms.ages46.title')}</h3>
              <p className="text-sm text-gray-600">
                {t('quranKids.agePrograms.ages46.description')}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="text-4xl mb-3">📖</div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('quranKids.agePrograms.ages710.title')}</h3>
              <p className="text-sm text-gray-600">
                {t('quranKids.agePrograms.ages710.description')}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('quranKids.agePrograms.ages1114.title')}</h3>
              <p className="text-sm text-gray-600">
                {t('quranKids.agePrograms.ages1114.description')}
              </p>
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
