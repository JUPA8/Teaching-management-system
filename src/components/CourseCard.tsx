'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { BookOpen } from 'lucide-react';
import { Course } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
    beginner: 'text-white',
    intermediate: 'text-white',
    advanced: 'text-white',
  };

  const levelBgColors = {
    beginner: '#3B6F5F',
    intermediate: '#C19A6B',
    advanced: '#D4AF37',
  };

  const levelLabels = {
    beginner: t('beginner'),
    intermediate: t('intermediate'),
    advanced: t('advanced'),
  };

  return (
    <motion.div
      className={cn(
        'overflow-hidden rounded-2xl relative',
        featured && 'lg:flex lg:flex-row'
      )}
      style={{
        background: 'linear-gradient(135deg, #FAF6F1 0%, #F5EFE7 100%)',
        border: '2px solid #C19A6B',
        boxShadow: '0 8px 25px rgba(193, 154, 107, 0.15)',
      }}
      whileHover={{
        y: -8,
        boxShadow: '0 15px 40px rgba(193, 154, 107, 0.25)',
        borderColor: '#D4AF37',
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Decorative corner ornaments */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-secondary-400 opacity-50"></div>
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-secondary-400 opacity-50"></div>
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-secondary-400 opacity-50"></div>
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-secondary-400 opacity-50"></div>
      {/* Course Image */}
      <div
        className={cn(
          'relative h-48 overflow-hidden',
          featured && 'lg:h-auto lg:w-2/5'
        )}
      >
        <Image
          src={course.image}
          alt={getCourseText(course.titleKey)}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        
        <div className="absolute top-4 start-4 z-10">
          <motion.span
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium shadow-lg',
              levelColors[course.level]
            )}
            style={{ background: levelBgColors[course.level] }}
            whileHover={{ scale: 1.05 }}
          >
            {levelLabels[course.level]}
          </motion.span>
        </div>
        {featured && (
          <div className="absolute top-4 end-4">
            <motion.span 
              className="px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-lg"
              style={{ background: '#D4AF37' }}
              whileHover={{ scale: 1.05 }}
            >
              {courseCard('featured')}
            </motion.span>
          </div>
        )}
      </div>

      {/* Content - Only course name and description */}
      <div className={cn('p-6 relative', featured && 'lg:flex-1 lg:p-8')}>
        <h3
          className={cn(
            'font-bold text-charcoal mb-2 font-serif',
            featured ? 'text-2xl' : 'text-lg'
          )}
        >
          {getCourseText(course.titleKey)}
        </h3>
        <p
          className={cn(
            'text-charcoal-light mb-4 leading-relaxed',
            featured ? 'text-base' : 'text-sm line-clamp-2'
          )}
        >
          {getCourseText(course.descriptionKey)}
        </p>

        {/* CTA Buttons */}
        <div className="pt-4 flex flex-wrap gap-2" style={{ borderTop: '1px solid rgba(193, 154, 107, 0.3)' }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href={`/courses/${course.slug}`}
              className="text-sm py-2.5 px-5 inline-block rounded-xl text-white font-medium shadow-md transition-all"
              style={{ background: 'linear-gradient(to right, #3B6F5F, #2F5F54)' }}
            >
              {t('viewCourse')}
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/register"
              className="text-sm py-2.5 px-5 inline-block rounded-xl font-medium transition-all border-2"
              style={{ 
                color: '#3B6F5F',
                borderColor: '#3B6F5F',
                background: 'transparent'
              }}
            >
              {t('freeTrialLesson')}
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
