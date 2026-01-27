'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Clock, Users, BookOpen } from 'lucide-react';
import { Course } from '@/types';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
  featured?: boolean;
}

// Helper type for dynamic course translation keys
type CourseTranslationKey = Parameters<ReturnType<typeof useTranslations<'courses'>>>[0];

export default function CourseCard({ course, featured = false }: CourseCardProps) {
  const t = useTranslations('courses');
  const courseCard = useTranslations('courseCard');

  // Helper function for dynamic keys
  const getCourseText = (key: string) => t(key as CourseTranslationKey);

  const levelColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-amber-100 text-amber-700',
    advanced: 'bg-red-100 text-red-700',
  };

  const levelLabels = {
    month: t('month'),
    beginner: t('beginner'),
    intermediate: t('intermediate'),
    advanced: t('advanced'),
  };

  return (
    <div
      className={cn(
        'card card-hover overflow-hidden',
        featured && 'lg:flex lg:flex-row'
      )}
    >
      {/* Image */}
      <div
        className={cn(
          'relative h-48 bg-gradient-to-br from-primary-400 to-primary-600',
          featured && 'lg:h-auto lg:w-2/5'
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="w-16 h-16 text-white/30" />
        </div>
        <div className="absolute top-4 start-4">
          <span
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium',
              levelColors[course.level]
            )}
          >
            {levelLabels[course.level]}
          </span>
        </div>
        {featured && (
          <div className="absolute top-4 end-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-400 text-amber-900">
              {courseCard('featured')}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn('p-6', featured && 'lg:flex-1 lg:p-8')}>
        <h3
          className={cn(
            'font-bold text-gray-900 mb-2',
            featured ? 'text-2xl' : 'text-lg'
          )}
        >
          {getCourseText(course.titleKey)}
        </h3>
        <p
          className={cn(
            'text-gray-600 mb-4',
            featured ? 'text-base' : 'text-sm line-clamp-2'
          )}
        >
          {getCourseText(course.descriptionKey)}
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{getCourseText(course.durationKey)}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>
              {getCourseText(course.lessonsCountKey)} {t('lessons')}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>
              {getCourseText(course.studentsCountKey)} {t('students')}
            </span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <span className="text-2xl font-bold text-primary-600">
              €{getCourseText(course.priceKey)}
            </span>
            <span className="text-gray-500 text-sm">{t('month')}</span>
          </div>
          <Link
            href={`/courses/${course.slug}`}
            className="btn-primary text-sm py-2 px-4"
          >
            {t('viewCourse')}
          </Link>
        </div>
      </div>
    </div>
  );
}
