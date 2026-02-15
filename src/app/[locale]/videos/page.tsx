'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, Filter, PlayCircle, Sparkles, Calendar, Eye, BookOpen, Star } from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

// Video data with translation keys and image paths
const videoData = [
  { 
    id: '1', 
    translationKey: 'tajweedIntro', 
    duration: '15:30', 
    views: 45000, 
    category: 'tajweed',
    image: '/video-tajweed-intro.png',
    featured: true
  },
  { 
    id: '2', 
    translationKey: 'arabicAlphabet', 
    duration: '22:45', 
    views: 78000, 
    category: 'arabic',
    image: '/video-arabic-alphabet.png',
    featured: false
  },
  { 
    id: '3', 
    translationKey: 'fatiha', 
    duration: '35:20', 
    views: 125000, 
    category: 'quran',
    image: '/video-surah-fatiha.png',
    featured: true
  },
  { 
    id: '4', 
    translationKey: 'seerah', 
    duration: '42:15', 
    views: 89000, 
    category: 'islamic',
    image: '/video-seerah.png',
    featured: false
  },
  { 
    id: '5', 
    translationKey: 'makharij', 
    duration: '28:40', 
    views: 56000, 
    category: 'tajweed',
    image: '/video-makharij.png',
    featured: false
  },
  { 
    id: '6', 
    translationKey: 'kidsShortSurahs', 
    duration: '18:30', 
    views: 234000, 
    category: 'quran',
    image: '/video-kids-surahs.png',
    featured: true
  },
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

  // Helper to format view count
  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF6F1] via-white to-[#FAF6F1]">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-[#2B7A78] via-[#236260] to-[#1a5856] text-white py-24 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/videos-hero-background.png"
            alt={t('heroAlt')}
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2B7A78]/90 via-[#236260]/90 to-[#1a5856]/90" />
        </div>

        {/* Decorative Islamic Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="videoPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1"/>
                <path d="M 42 50 L 58 42 L 58 58 Z" fill="currentColor"/>
                <path d="M 25 25 L 75 25 L 75 75 L 25 75 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#videoPattern)" />
          </svg>
        </div>

        {/* Animated Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-20 right-20 w-32 h-32 border-4 border-[#D9B574]/20 rounded-full"
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-24 h-24 border-4 border-[#D9B574]/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-md rounded-full mb-8 border border-white/20"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <PlayCircle className="w-5 h-5 text-[#D9B574]" fill="#D9B574" />
              <span className="text-sm font-semibold tracking-wide">{t('badgeLabel')}</span>
            </motion.div>
            
            {/* Main Title */}
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {t('title')}
            </motion.h1>
            
            {/* Golden Divider */}
            <motion.div
              className="flex items-center justify-center gap-3 mb-8"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="h-1 w-16 bg-gradient-to-r from-transparent to-[#D9B574] rounded-full" />
              <div className="w-3 h-3 bg-[#D9B574] rounded-full rotate-45" />
              <div className="h-1 w-32 bg-[#D9B574] rounded-full" />
              <div className="w-3 h-3 bg-[#D9B574] rounded-full rotate-45" />
              <div className="h-1 w-16 bg-gradient-to-l from-transparent to-[#D9B574] rounded-full" />
            </motion.div>
            
            {/* Subtitle */}
            <motion.p
              className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-light mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {t('subtitle')}
            </motion.p>

            {/* Enhanced Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {[
                { icon: PlayCircle, value: '100+', label: t('stats.videos') },
                { icon: Eye, value: '500K+', label: t('stats.views') },
                { icon: BookOpen, value: '4', label: t('stats.categories') },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  className="group bg-white/15 backdrop-blur-lg rounded-3xl p-6 md:p-8 text-center border border-white/30 hover:bg-white/20 transition-all duration-300"
                  whileHover={{ y: -8, scale: 1.05 }}
                >
                  <motion.div
                    className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#D9B574] flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow"
                    whileHover={{ rotate: [0, -8, 8, -8, 0], scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </motion.div>
                  <div className="text-3xl md:text-4xl font-bold mb-2 text-white">{stat.value}</div>
                  <div className="text-sm md:text-base text-white/90 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-8" viewBox="0 0 1200 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,20 Q300,0 600,20 T1200,20 L1200,40 L0,40 Z" fill="#FAF6F1" opacity="0.3"/>
            <path d="M0,25 Q300,5 600,25 T1200,25 L1200,40 L0,40 Z" fill="#FAF6F1" opacity="0.5"/>
            <path d="M0,30 Q300,10 600,30 T1200,30 L1200,40 L0,40 Z" fill="#FAF6F1"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Enhanced Filter Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Filter className="w-8 h-8 text-[#2B7A78]" />
              {t('filter')}
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="h-1 w-12 bg-gradient-to-r from-transparent to-[#D9B574] rounded-full" />
              <div className="w-2 h-2 bg-[#D9B574] rounded-full" />
              <div className="h-1 w-20 bg-[#D9B574] rounded-full" />
              <div className="w-2 h-2 bg-[#D9B574] rounded-full" />
              <div className="h-1 w-12 bg-gradient-to-l from-transparent to-[#D9B574] rounded-full" />
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 rounded-2xl text-base font-bold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-[#2B7A78] to-[#236260] text-white shadow-2xl shadow-[#2B7A78]/40 border-2 border-[#2B7A78]'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg border-2 border-gray-200 hover:border-[#2B7A78]/40 hover:shadow-xl'
                }`}
              >
                {category.label}
              </motion.button>
            ))}
          </div>
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
                <VideoCard video={video} t={t} index={index} translationKey={video.translationKey} formatViews={formatViews} />
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

function VideoCard({ video, t, index, translationKey, formatViews }: { video: typeof videoData[number]; t: any; index: number; translationKey: string; formatViews: (views: number) => string }) {
  const title = t(`list.${translationKey}.title`);
  const description = t(`list.${translationKey}.description`);

  return (
    <motion.div
      className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border-2 border-gray-100 hover:border-[#2B7A78]/30 transition-all duration-500 cursor-pointer"
      whileHover={{ y: -12 }}
    >
      {/* Enhanced Thumbnail with Real Image */}
      <div className="relative h-64 bg-gradient-to-br from-[#2B7A78] via-[#236260] to-[#1a5856] overflow-hidden">
        {/* Actual Image */}
        <Image
          src={video.image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          quality={95}
        />
        
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Enhanced Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.div
            className="w-24 h-24 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white shadow-2xl"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Play className="w-12 h-12 text-[#2B7A78] fill-[#2B7A78] ms-1" />
          </motion.div>
        </div>

        {/* Pulsing Play Icon (visible by default) */}
        <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
          <motion.div
            className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Play className="w-8 h-8 text-white fill-white ms-0.5" />
          </motion.div>
        </div>

        {/* Duration Badge */}
        <motion.div
          className="absolute bottom-4 end-4 bg-black/90 backdrop-blur-md text-white text-sm px-4 py-2 rounded-xl flex items-center gap-2 shadow-xl font-bold"
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + index * 0.1 }}
        >
          <Clock className="w-4 h-4" />
          <span>{video.duration}</span>
        </motion.div>

        {/* Category Badge */}
        <motion.div
          className="absolute top-4 start-4"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 + index * 0.1 }}
        >
          <span className="bg-gradient-to-r from-[#D9B574] to-[#C9A551] text-white text-xs px-4 py-2 rounded-xl capitalize font-bold shadow-xl backdrop-blur-sm">
            {t(video.category)}
          </span>
        </motion.div>

        {/* Featured Badge */}
        {video.featured && (
          <motion.div
            className="absolute top-4 end-4"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
          >
            <div className="bg-gradient-to-br from-[#D9B574] to-[#C9A551] text-white p-2.5 rounded-xl shadow-xl">
              <Star className="w-5 h-5" fill="currentColor" />
            </div>
          </motion.div>
        )}

        {/* Views Badge */}
        <motion.div
          className="absolute bottom-4 start-4 bg-white/25 backdrop-blur-md text-white text-sm px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + index * 0.1 }}
        >
          <Eye className="w-4 h-4" />
          <span>{formatViews(video.views)}</span>
        </motion.div>
      </div>

      {/* Enhanced Content */}
      <div className="p-8">
        <motion.h3
          className="font-bold text-2xl text-gray-900 mb-4 line-clamp-2 group-hover:text-[#2B7A78] transition-colors leading-tight"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          {title}
        </motion.h3>
        <motion.p
          className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 + index * 0.1 }}
        >
          {description}
        </motion.p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />

        {/* Enhanced Actions */}
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.03 }} 
            whileTap={{ scale: 0.97 }} 
            className="flex-1"
          >
            <button className="w-full bg-gradient-to-r from-[#2B7A78] to-[#236260] hover:from-[#236260] hover:to-[#2B7A78] text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-2xl flex items-center justify-center gap-2">
              <Play className="w-5 h-5 fill-current" />
              <span>{t('watchNow')}</span>
            </button>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.08 }} 
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/register"
              className="bg-gradient-to-r from-[#D9B574] to-[#C9A551] hover:from-[#C9A551] hover:to-[#D9B574] text-white font-bold p-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <Calendar className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: '0 0 40px rgba(43, 122, 120, 0.3)',
        }}
      />
    </motion.div>
  );
}
