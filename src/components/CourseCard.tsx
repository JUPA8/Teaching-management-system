'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { BookOpen } from 'lucide-react';
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
    beginner: 'bg-primary-100 text-primary-700',
    intermediate: 'bg-secondary-100 text-secondary-700',
    advanced: 'bg-secondary-200 text-secondary-800',
  };

  const levelLabels = {
    beginner: t('beginner'),
    intermediate: t('intermediate'),
    advanced: t('advanced'),
  };

  return (
    <div
      className={cn(
        'card-framed card-hover overflow-hidden rounded-2xl',
        featured && 'lg:flex lg:flex-row'
      )}
      style={{
        boxShadow: '0 4px 20px rgba(177, 140, 93, 0.1)',
      }}
    >
      {/* Image */}
      <div
        className={cn(
          'relative h-48',
          featured && 'lg:h-auto lg:w-2/5'
        )}
        style={{
          background: 'linear-gradient(135deg, #3D6B65 0%, #4A8079 50%, #B18C5D 100%)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="w-16 h-16 text-white/40" />
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
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary-400 text-white">
              {courseCard('featured')}
            </span>
          </div>
        )}
      </div>

      {/* Content - Only course name and description */}
      <div className={cn('p-6 bg-cream-100', featured && 'lg:flex-1 lg:p-8')}>
        <h3
          className={cn(
            'font-bold text-charcoal mb-2',
            featured ? 'text-2xl' : 'text-lg'
          )}
        >
          {getCourseText(course.titleKey)}
        </h3>
        <p
          className={cn(
            'text-charcoal-light mb-4',
            featured ? 'text-base' : 'text-sm line-clamp-2'
          )}
        >
          {getCourseText(course.descriptionKey)}
        </p>

        {/* CTA Buttons */}
        <div className="pt-4 border-t border-secondary-200 flex flex-wrap gap-2">
          <Link
            href={`/courses/${course.slug}`}
            className="btn-primary text-sm py-2 px-4 inline-block"
          >
            {t('viewCourse')}
          </Link>
          <Link
            href="/register"
            className="btn-outline text-sm py-2 px-4 inline-block"
          >
            {t('freeTrialLesson')}
          </Link>
        </div>
      </div>
    </div>
  );
}
