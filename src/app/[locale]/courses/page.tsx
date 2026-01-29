import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import CourseCard from '@/components/CourseCard';
import { courses } from '@/lib/data';

export default async function CoursesPage() {
  const t = await getTranslations('courses');
  const common = await getTranslations('common');

  // Group courses by category
  const categories = [
    {
      key: 'quran-adults',
      href: '/courses/quran-adults',
      icon: '📖',
      title: t('quranAdults.title'),
      description: t('quranAdults.description'),
      bgColor: 'bg-primary-100',
    },
    {
      key: 'quran-kids',
      href: '/courses/quran-kids',
      icon: '👶',
      title: t('quranKids.title'),
      description: t('quranKids.description'),
      bgColor: 'bg-amber-100',
    },
    {
      key: 'arabic',
      href: '/courses/arabic',
      icon: '🔤',
      title: t('arabic.title'),
      description: t('arabic.description'),
      bgColor: 'bg-blue-100',
    },
    {
      key: 'islamic',
      href: '/courses/islamic-studies',
      icon: '🕌',
      title: t('islamic.title'),
      description: t('islamic.description'),
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="py-12 md:py-20 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-charcoal-light max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => (
            <Link
              key={category.key}
              href={category.href}
              className="bg-cream-200 rounded-xl p-6 text-center hover:bg-cream-300 transition-colors group border border-secondary-100 hover:border-secondary-300"
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="font-semibold text-charcoal mb-2 group-hover:text-primary-600">
                {category.title}
              </h3>
              <p className="text-sm text-charcoal-light line-clamp-2">
                {category.description}
              </p>
              <span className="text-primary-600 text-sm font-medium mt-3 inline-block">
                {common('learnMore')} →
              </span>
            </Link>
          ))}
        </div>

        {/* All Courses */}
        <h2 className="text-2xl font-bold text-charcoal mb-6">{t('allCourses')}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
