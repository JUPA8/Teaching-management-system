'use client';

import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Clock, BookOpen, Layers } from 'lucide-react';

export interface DbCourse {
  id: string;
  name: string;
  nameAr?: string | null;
  nameDe?: string | null;
  description: string;
  descriptionAr?: string | null;
  descriptionDe?: string | null;
  type: string;
  price: number;
  duration: number;
  totalSessions: number;
  level?: string | null;
  ageGroup?: string | null;
  image?: string | null;
  isActive: boolean;
}

const levelColorMap: Record<string, string> = {
  beginner: '#3B6F5F',
  intermediate: '#C19A6B',
  advanced: '#D4AF37',
};

export default function DbCourseCard({ course }: { course: DbCourse }) {
  const locale = useLocale();
  const t = useTranslations('courses');

  const name =
    locale === 'ar'
      ? course.nameAr || course.name
      : locale === 'de'
      ? course.nameDe || course.name
      : course.name;

  const description =
    locale === 'ar'
      ? course.descriptionAr || course.description
      : locale === 'de'
      ? course.descriptionDe || course.description
      : course.description;

  const levelKey = course.level?.toLowerCase() ?? '';
  const levelColor = levelColorMap[levelKey] ?? '#3B6F5F';

  return (
    <motion.div
      className="overflow-hidden rounded-2xl relative"
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
      {/* Corner ornaments */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-secondary-400 opacity-50 z-10" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-secondary-400 opacity-50 z-10" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-secondary-400 opacity-50 z-10" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-secondary-400 opacity-50 z-10" />

      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#2B7A78] to-[#1a5856]">
        {course.image ? (
          <Image src={course.image} alt={name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {course.level && (
          <div className="absolute top-4 left-4 z-10">
            <span
              className="px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-lg"
              style={{ background: levelColor }}
            >
              {course.level}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-bold text-lg text-charcoal mb-2 font-serif leading-snug">{name}</h3>
        <p className="text-sm text-charcoal-light mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div
          className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4"
          style={{ borderBottom: '1px solid rgba(193, 154, 107, 0.3)' }}
        >
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {course.duration} min
          </span>
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3" />
            {course.totalSessions} sessions
          </span>
          <span className="font-bold text-[#2B7A78] ml-auto">€{course.price}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href={`/courses/${course.id}`}
              className="text-sm py-2.5 px-5 inline-block rounded-xl text-white font-medium shadow-md"
              style={{ background: 'linear-gradient(to right, #3B6F5F, #2F5F54)' }}
            >
              {t('viewCourse')}
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/probestunde"
              className="text-sm py-2.5 px-5 inline-block rounded-xl font-medium border-2 transition-all"
              style={{ color: '#3B6F5F', borderColor: '#3B6F5F', background: 'transparent' }}
            >
              {t('freeTrialLesson')}
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
