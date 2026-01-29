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
  const common = await getTranslations('common');
  const course = getCourseBySlug(params.slug);

  // Helper function for dynamic keys
  const getCourseText = (key: string) => t(key as CourseTranslationKey);

  if (!course) {
    notFound();
  }

  const teacher = getTeacherById(course.teacherId);

  return (
    <div className="py-8 md:py-12 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-charcoal-light">
            <li>
              <Link href="/" className="hover:text-primary-600">
                {common('home')}
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/courses" className="hover:text-primary-600">
                {t('title')}
              </Link>
            </li>
            <li>/</li>
            <li className="text-charcoal">{getCourseText(course.titleKey)}</li>
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
                      ? 'bg-primary-100 text-primary-700'
                      : course.level === 'intermediate'
                      ? 'bg-secondary-100 text-secondary-700'
                      : 'bg-secondary-200 text-secondary-800'
                  }`}
                >
                  {t(course.level)}
                </span>
                <div className="flex items-center gap-1 text-sm text-charcoal-light">
                  <Users className="w-4 h-4" />
                  <span>{getCourseText(course.studentsCountKey)} {t('studentCount')}</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
                {getCourseText(course.titleKey)}
              </h1>
              <p className="text-lg text-charcoal-light">{getCourseText(course.descriptionKey)}</p>
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-cream-200 rounded-xl p-4 text-center border border-secondary-100">
                <Clock className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm text-charcoal-light">{t('duration')}</p>
                <p className="font-semibold text-charcoal">{getCourseText(course.durationKey)}</p>
              </div>
              <div className="bg-cream-200 rounded-xl p-4 text-center border border-secondary-100">
                <BookOpen className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm text-charcoal-light">{t('lessons')}</p>
                <p className="font-semibold text-charcoal">
                  {getCourseText(course.lessonsCountKey)}
                </p>
              </div>
              <div className="bg-cream-200 rounded-xl p-4 text-center border border-secondary-100">
                <Users className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm text-charcoal-light">{t('students')}</p>
                <p className="font-semibold text-charcoal">
                  {getCourseText(course.studentsCountKey)}
                </p>
              </div>
              <div className="bg-cream-200 rounded-xl p-4 text-center border border-secondary-100">
                <Award className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm text-charcoal-light">{t('certificateCompletion')}</p>
                <p className="font-semibold text-charcoal">✓</p>
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="card p-6 mb-8">
              <h2 className="text-xl font-bold text-charcoal mb-4">
                {t('whatYouLearn')}
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="text-charcoal-light">{t('features.liveSession')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="text-charcoal-light">{t('features.personalizedPace')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="text-charcoal-light">{t('features.recordedLessons')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="text-charcoal-light">{t('features.progressTracking')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="text-charcoal-light">{t('features.certificate')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="text-charcoal-light">{t('features.lifetimeAccess')}</span>
                </div>
              </div>
            </div>

            {/* Curriculum */}
            <div className="card p-6 mb-8">
              <h2 className="text-xl font-bold text-charcoal mb-4">
                {t('courseCurriculum')}
              </h2>
              <div className="space-y-3">
                <div className="border border-secondary-100 rounded-lg p-4 hover:border-secondary-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                        1
                      </div>
                      <div>
                        <h3 className="font-medium text-charcoal">{t('curriculum.intro')}</h3>
                        <p className="text-sm text-charcoal-light">{t('curriculum.introDetails')}</p>
                      </div>
                    </div>
                    <Play className="w-5 h-5 text-charcoal-light" />
                  </div>
                </div>
                <div className="border border-secondary-100 rounded-lg p-4 hover:border-secondary-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                        2
                      </div>
                      <div>
                        <h3 className="font-medium text-charcoal">{t('curriculum.fundamentals')}</h3>
                        <p className="text-sm text-charcoal-light">{t('curriculum.fundamentalsDetails')}</p>
                      </div>
                    </div>
                    <Play className="w-5 h-5 text-charcoal-light" />
                  </div>
                </div>
                <div className="border border-secondary-100 rounded-lg p-4 hover:border-secondary-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                        3
                      </div>
                      <div>
                        <h3 className="font-medium text-charcoal">{t('curriculum.practice')}</h3>
                        <p className="text-sm text-charcoal-light">{t('curriculum.practiceDetails')}</p>
                      </div>
                    </div>
                    <Play className="w-5 h-5 text-charcoal-light" />
                  </div>
                </div>
                <div className="border border-secondary-100 rounded-lg p-4 hover:border-secondary-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                        4
                      </div>
                      <div>
                        <h3 className="font-medium text-charcoal">{t('curriculum.advanced')}</h3>
                        <p className="text-sm text-charcoal-light">{t('curriculum.advancedDetails')}</p>
                      </div>
                    </div>
                    <Play className="w-5 h-5 text-charcoal-light" />
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher */}
            {teacher && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-charcoal mb-4">
                  {t('yourInstructor')}
                </h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl text-primary-600 font-bold">
                      {teacher.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal">
                      {teacher.name}
                    </h3>
                    <p className="text-sm text-charcoal-light mb-2">{teacher.title}</p>
                    <p className="text-charcoal-light text-sm mb-3">{teacher.bio}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-charcoal-light">
                        <Award className="w-4 h-4 text-primary-600" />
                        {teacher.experience} {t('yearsExperience')}
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
              <div className="h-48 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-xl mb-6 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 mb-6">
                <Link href="/register" className="btn-primary w-full text-center block">
                  {t('bookFreeTrial')}
                </Link>
                <Link href="/register" className="btn-outline w-full text-center block">
                  {t('freeTrialLesson')}
                </Link>
              </div>

              {/* Features */}
              <div className="border-t border-secondary-200 pt-6">
                <h4 className="font-semibold text-charcoal mb-4">
                  {t('courseIncludes')}
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-charcoal-light">
                    <Calendar className="w-4 h-4 text-primary-600" />
                    {t('flexibleScheduling')}
                  </li>
                  <li className="flex items-center gap-3 text-sm text-charcoal-light">
                    <Play className="w-4 h-4 text-primary-600" />
                    {t('liveOneOnOne')}
                  </li>
                  <li className="flex items-center gap-3 text-sm text-charcoal-light">
                    <BookOpen className="w-4 h-4 text-primary-600" />
                    {t('downloadableResources')}
                  </li>
                  <li className="flex items-center gap-3 text-sm text-charcoal-light">
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
