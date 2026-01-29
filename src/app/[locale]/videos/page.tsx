'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, Filter, PlayCircle, Sparkles, Calendar } from 'lucide-react';
import { Link } from '@/i18n/routing';

// Video data with translation keys
const videoData = [
  { id: '1', translationKey: 'tajweedIntro', duration: '15:30', views: 45000, category: 'tajweed' },
  { id: '2', translationKey: 'arabicAlphabet', duration: '22:45', views: 78000, category: 'arabic' },
  { id: '3', translationKey: 'fatiha', duration: '35:20', views: 125000, category: 'quran' },
  { id: '4', translationKey: 'seerah', duration: '42:15', views: 89000, category: 'islamic' },
  { id: '5', translationKey: 'makharij', duration: '28:40', views: 56000, category: 'tajweed' },
  { id: '6', translationKey: 'kidsShortSurahs', duration: '18:30', views: 234000, category: 'quran' },
] as const;

type VideoItem = typeof videoData[number];

export default function VideosPage() {
  const t = useTranslations('videos');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: t('all') },
    { id: 'quran', label: t('quran') },
    { id: 'tajweed', label: t('tajweed') },
    { id: 'arabic', label: t('arabic') },
    { id: 'islamic', label: t('islamic') },
  ];

  const filteredVideos =
    selectedCategory === 'all'
      ? videoData
      : videoData.filter((video) => video.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="py-12 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <span className="px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 rounded-full text-sm font-medium inline-flex items-center gap-2">
              <PlayCircle className="w-4 h-4" />
              {t('badgeLabel')}
            </span>
          </motion.div>
          <motion.h1
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('title')}
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* Filter */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Filter className="w-5 h-5 text-primary-500" />
          </motion.div>
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05, type: 'spring' }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md border border-gray-100'
              }`}
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Videos Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {filteredVideos.map((video, index) => (
              <motion.div key={video.id} variants={itemVariants} layout>
                <VideoCard video={video} t={t} index={index} translationKey={video.translationKey} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredVideos.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            </motion.div>
            <p className="text-gray-500">{t('noVideos')}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function VideoCard({ video, t, index, translationKey }: { video: VideoItem; t: any; index: number; translationKey: string }) {
  const title = t(`list.${translationKey}.title`);
  const description = t(`list.${translationKey}.description`);

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group cursor-pointer"
      whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 overflow-hidden">
        {/* Animated Background Pattern */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px)',
            backgroundSize: '30px 30px',
          }}
          animate={{ x: [0, 30], y: [0, 30] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30"
            whileHover={{ scale: 1.2, backgroundColor: 'rgba(255,255,255,0.3)' }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Play className="w-8 h-8 text-white fill-white ms-1" />
            </motion.div>
          </motion.div>
        </div>

        {/* Duration Badge */}
        <motion.div
          className="absolute bottom-3 end-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          <Clock className="w-3 h-3" />
          {video.duration}
        </motion.div>

        {/* Category Badge */}
        <motion.div
          className="absolute top-3 start-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + index * 0.1 }}
        >
          <span className="bg-gradient-to-r from-gold-500 to-gold-600 text-white text-xs px-3 py-1.5 rounded-lg capitalize font-medium shadow-lg">
            {t(video.category)}
          </span>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute top-4 end-4 w-16 h-16 bg-white/10 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, delay: index * 0.2 }}
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <motion.h3
          className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 + index * 0.1 }}
        >
          {title}
        </motion.h3>
        <motion.p
          className="text-sm text-gray-600 mb-4 line-clamp-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
        >
          {description}
        </motion.p>

        {/* Actions */}
        <div className="flex items-center gap-3 text-sm">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
            <Link
              href="/register"
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium py-2 px-4 rounded-lg transition-all hover:shadow-lg flex items-center justify-center gap-2 text-xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              {t('bookFreeTrial')}
            </Link>
          </motion.div>
          <motion.button
            className="text-primary-600 font-medium hover:text-primary-700 transition-colors flex items-center gap-1"
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('watchNow')}
            <Play className="w-3 h-3 fill-current" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
