import { Link } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import {
  Clock,
  Users,
  BookOpen,
  CheckCircle,
  Play,
  Award,
  Calendar,
} from 'lucide-react';
import { getCourseBySlug, getTeacherById } from '@/lib/data';

interface CoursePageProps {
  params: { slug: string };
}

// Helper type for dynamic course translation keys
type CourseTranslationKey = Parameters<Awaited<ReturnType<typeof getTranslations<'courses'>>>>[0];

export default async function CoursePage({ params }: CoursePageProps) {
  const t = await getTranslations('courses');
  const course = getCourseBySlug(params.slug);

  // Helper function for dynamic keys
  const getCourseText = (key: string) => t(key as CourseTranslationKey);

  if (!course) {
    notFound();
  }

  const teacher = getTeacherById(course.teacherId);

  const curriculum = [
    { title: 'Introduction & Assessment', lessons: 2, duration: '1 hour' },
    { title: 'Arabic Alphabet Fundamentals', lessons: 6, duration: '3 hours' },
    { title: 'Basic Tajweed Rules', lessons: 8, duration: '4 hours' },
    { title: 'Short Surahs Practice', lessons: 10, duration: '5 hours' },
    { title: 'Advanced Recitation', lessons: 10, duration: '5 hours' },
  ];

  const features = [
    '1-on-1 live sessions with qualified teacher',
    'Personalized learning pace',
    'Recorded lessons for review',
    'Progress tracking dashboard',
    'Certificate upon completion',
    'Lifetime access to materials',
  ];

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li>
              <Link href="/" className="hover:text-primary-600">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/courses" className="hover:text-primary-600">
                Courses
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{getCourseText(course.titleKey)}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.level === 'beginner'
                      ? 'bg-green-100 text-green-700'
                      : course.level === 'intermediate'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {t(course.level)}
                </span>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>{getCourseText(course.studentsCountKey)} {t('studentCount')}</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {getCourseText(course.titleKey)}
              </h1>
              <p className="text-lg text-gray-600">{getCourseText(course.descriptionKey)}</p>
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Clock className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">{t('duration')}</p>
                <p className="font-semibold text-gray-900">{getCourseText(course.durationKey)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <BookOpen className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">{t('lessons')}</p>
                <p className="font-semibold text-gray-900">
                  {getCourseText(course.lessonsCountKey)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Users className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">{t('students')}</p>
                <p className="font-semibold text-gray-900">
                  {getCourseText(course.studentsCountKey)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Award className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">{t('certificateCompletion')}</p>
                <p className="font-semibold text-gray-900">✓</p>
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="card p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                What You'll Learn
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div className="card p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Course Curriculum
              </h2>
              <div className="space-y-3">
                {curriculum.map((section, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:border-primary-200 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {section.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {section.lessons} lessons • {section.duration}
                          </p>
                        </div>
                      </div>
                      <Play className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Teacher */}
            {teacher && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Your Instructor
                </h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl text-primary-600 font-bold">
                      {teacher.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {teacher.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{teacher.title}</p>
                    <p className="text-gray-600 text-sm mb-3">{teacher.bio}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-primary-600" />
                        {teacher.experience} years experience
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              {/* Preview Image */}
              <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl mb-6 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  €{getCourseText(course.priceKey)}
                </span>
                <span className="text-gray-500">{t('perMonth')}</span>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 mb-6">
                <Link href="/register" className="btn-primary w-full text-center block">
                  {t('enrollNow')}
                </Link>
                <button className="btn-outline w-full">
                  {t('bookFreeTrial')}
                </button>
              </div>

              {/* Features */}
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  {t('courseIncludes')}
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-primary-600" />
                    {t('flexibleScheduling')}
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <Play className="w-4 h-4 text-primary-600" />
                    {t('liveOneOnOne')}
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 text-primary-600" />
                    {t('downloadableResources')}
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <Award className="w-4 h-4 text-primary-600" />
                    {t('certificateCompletion')}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
