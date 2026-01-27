import { getTranslations } from 'next-intl/server';
import CourseCard from '@/components/CourseCard';
import { getCoursesByCategory } from '@/lib/data';

export default async function IslamicStudiesPage() {
  const t = await getTranslations('courses');
  const courses = getCoursesByCategory('islamic');

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🕌</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('islamic.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('islamic.description')}
          </p>
        </div>

        {/* Subjects */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-purple-50 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">⚖️</div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('islamic.subjects.fiqh.title')}</h3>
            <p className="text-sm text-gray-600">
              {t('islamic.subjects.fiqh.description')}
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">💫</div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('islamic.subjects.aqidah.title')}</h3>
            <p className="text-sm text-gray-600">
              {t('islamic.subjects.aqidah.description')}
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">📜</div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('islamic.subjects.seerah.title')}</h3>
            <p className="text-sm text-gray-600">
              {t('islamic.subjects.seerah.description')}
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('islamic.subjects.hadith.title')}</h3>
            <p className="text-sm text-gray-600">
              {t('islamic.subjects.hadith.description')}
            </p>
          </div>
        </div>

        {/* Why Study */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('islamic.deepenTitle')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('islamic.benefits.practical.title')}</h3>
              <p className="text-sm text-gray-600">
                {t('islamic.benefits.practical.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('islamic.benefits.authentic.title')}</h3>
              <p className="text-sm text-gray-600">
                {t('islamic.benefits.authentic.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('islamic.benefits.community.title')}</h3>
              <p className="text-sm text-gray-600">
                {t('islamic.benefits.community.description')}
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
