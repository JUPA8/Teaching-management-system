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
  Layers,
} from 'lucide-react';
import { getCourseBySlug, getTeacherById } from '@/lib/data';
import { prisma } from '@/lib/prisma';

interface CoursePageProps {
  params: { slug: string; locale: string };
}

// Helper type for dynamic course translation keys
type CourseTranslationKey = Parameters<Awaited<ReturnType<typeof getTranslations<'courses'>>>>[0];

export default async function CoursePage({ params }: CoursePageProps) {
  const t = await getTranslations('courses');
  const common = await getTranslations('common');

  // ── 1. Try static course by slug (legacy routes like /courses/quran-reading-basics) ──
  const staticCourse = getCourseBySlug(params.slug);
  if (staticCourse) {
    const getCourseText = (key: string) => t(key as CourseTranslationKey);
    const teacher = getTeacherById(staticCourse.teacherId);

    return (
      <div className="py-8 md:py-12 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 text-sm">
            <ol className="flex items-center gap-2 text-charcoal-light">
              <li><Link href="/" className="hover:text-primary-600">{common('home')}</Link></li>
              <li>/</li>
              <li><Link href="/courses" className="hover:text-primary-600">{t('title')}</Link></li>
              <li>/</li>
              <li className="text-charcoal">{getCourseText(staticCourse.titleKey)}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    staticCourse.level === 'beginner' ? 'bg-primary-100 text-primary-700'
                    : staticCourse.level === 'intermediate' ? 'bg-secondary-100 text-secondary-700'
                    : 'bg-secondary-200 text-secondary-800'
                  }`}>
                    {t(staticCourse.level)}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
                  {getCourseText(staticCourse.titleKey)}
                </h1>
                <p className="text-lg text-charcoal-light">{getCourseText(staticCourse.descriptionKey)}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: Clock, label: t('duration'), value: getCourseText(staticCourse.durationKey) },
                  { icon: BookOpen, label: t('lessons'), value: getCourseText(staticCourse.lessonsCountKey) },
                  { icon: Users, label: t('students'), value: getCourseText(staticCourse.studentsCountKey) },
                  { icon: Award, label: t('certificateCompletion'), value: '✓' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-cream-200 rounded-xl p-4 text-center border border-secondary-100">
                    <Icon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                    <p className="text-sm text-charcoal-light">{label}</p>
                    <p className="font-semibold text-charcoal">{value}</p>
                  </div>
                ))}
              </div>

              <CourseFeatures t={t} />

              {teacher && <TeacherCard teacher={teacher} t={t} />}
            </div>

            <CourseSidebar t={t} />
          </div>
        </div>
      </div>
    );
  }

  // ── 2. Try DB course by ID (new courses created via admin panel) ──
  const dbCourse = await prisma.course.findUnique({
    where: { id: params.slug },
    include: {
      teachers: {
        include: {
          teacher: {
            include: { user: { select: { id: true, name: true } } },
          },
        },
      },
    },
  });

  if (!dbCourse) notFound();

  const name =
    params.locale === 'ar'
      ? dbCourse.nameAr || dbCourse.name
      : params.locale === 'de'
      ? dbCourse.nameDe || dbCourse.name
      : dbCourse.name;

  const description =
    params.locale === 'ar'
      ? dbCourse.descriptionAr || dbCourse.description
      : params.locale === 'de'
      ? dbCourse.descriptionDe || dbCourse.description
      : dbCourse.description;

  return (
    <div className="py-8 md:py-12 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-charcoal-light">
            <li><Link href="/" className="hover:text-primary-600">{common('home')}</Link></li>
            <li>/</li>
            <li><Link href="/courses" className="hover:text-primary-600">{t('title')}</Link></li>
            <li>/</li>
            <li className="text-charcoal">{name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              {dbCourse.level && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 mb-4">
                  {dbCourse.level}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">{name}</h1>
              <p className="text-lg text-charcoal-light">{description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-cream-200 rounded-xl p-4 text-center border border-secondary-100">
                <Clock className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm text-charcoal-light">{t('duration')}</p>
                <p className="font-semibold text-charcoal">{dbCourse.duration} min</p>
              </div>
              <div className="bg-cream-200 rounded-xl p-4 text-center border border-secondary-100">
                <Layers className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm text-charcoal-light">{t('lessons')}</p>
                <p className="font-semibold text-charcoal">{dbCourse.totalSessions}</p>
              </div>
              <div className="bg-cream-200 rounded-xl p-4 text-center border border-secondary-100">
                <Award className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm text-charcoal-light">Price</p>
                <p className="font-semibold text-charcoal">€{dbCourse.price}</p>
              </div>
              <div className="bg-cream-200 rounded-xl p-4 text-center border border-secondary-100">
                <Users className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm text-charcoal-light">Age Group</p>
                <p className="font-semibold text-charcoal">{dbCourse.ageGroup || 'All Ages'}</p>
              </div>
            </div>

            <CourseFeatures t={t} />

            {dbCourse.teachers.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-charcoal mb-4">{t('yourInstructor')}</h2>
                {dbCourse.teachers.map(({ teacher }: { teacher: any }) => (
                  <div key={teacher.id} className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl text-primary-600 font-bold">
                        {teacher.user.name?.charAt(0) ?? '?'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal">{teacher.user.name}</h3>
                      {teacher.bio && <p className="text-sm text-charcoal-light mt-1">{teacher.bio}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <CourseSidebar t={t} />
        </div>
      </div>
    </div>
  );
}

// ── Shared sub-components ──────────────────────────────────────────────────

function CourseFeatures({ t }: { t: Awaited<ReturnType<typeof getTranslations<'courses'>>> }) {
  return (
    <div className="card p-6 mb-8">
      <h2 className="text-xl font-bold text-charcoal mb-4">{t('whatYouLearn')}</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {[
          t('features.liveSession'),
          t('features.personalizedPace'),
          t('features.recordedLessons'),
          t('features.progressTracking'),
          t('features.certificate'),
          t('features.lifetimeAccess'),
        ].map((feature) => (
          <div key={feature} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <span className="text-charcoal-light">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeacherCard({
  teacher,
  t,
}: {
  teacher: { name: string; title: string; bio: string; experience: number };
  t: Awaited<ReturnType<typeof getTranslations<'courses'>>>;
}) {
  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-charcoal mb-4">{t('yourInstructor')}</h2>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-2xl text-primary-600 font-bold">{teacher.name.charAt(0)}</span>
        </div>
        <div>
          <h3 className="font-semibold text-charcoal">{teacher.name}</h3>
          <p className="text-sm text-charcoal-light mb-2">{teacher.title}</p>
          <p className="text-charcoal-light text-sm mb-3">{teacher.bio}</p>
          <span className="flex items-center gap-1 text-sm text-charcoal-light">
            <Award className="w-4 h-4 text-primary-600" />
            {teacher.experience} {t('yearsExperience')}
          </span>
        </div>
      </div>
    </div>
  );
}

function CourseSidebar({ t }: { t: Awaited<ReturnType<typeof getTranslations<'courses'>>> }) {
  return (
    <div className="lg:col-span-1">
      <div className="card p-6 sticky top-24">
        <div className="h-48 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-xl mb-6 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
        <div className="space-y-3 mb-6">
          <Link href="/register" className="btn-primary w-full text-center block">{t('bookFreeTrial')}</Link>
          <Link href="/probestunde" className="btn-outline w-full text-center block">{t('freeTrialLesson')}</Link>
        </div>
        <div className="border-t border-secondary-200 pt-6">
          <h4 className="font-semibold text-charcoal mb-4">{t('courseIncludes')}</h4>
          <ul className="space-y-3">
            {[
              { Icon: Calendar, label: t('flexibleScheduling') },
              { Icon: Play, label: t('liveOneOnOne') },
              { Icon: BookOpen, label: t('downloadableResources') },
              { Icon: Award, label: t('certificateCompletion') },
            ].map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-charcoal-light">
                <Icon className="w-4 h-4 text-primary-600" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
