'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  TrendingUp,
  MessageSquare,
  Settings,
  Play,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Flame,
} from 'lucide-react';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  // Mock data - in real app, this would come from API
  const user = {
    firstName: 'Ahmed',
    lastName: 'Hassan',
  };

  const enrolledCourses = [
    {
      id: '1',
      title: 'Quran Reading Basics',
      progress: 65,
      nextLesson: 'Lesson 12: Surah Al-Ikhlas',
      teacher: 'Sheikh Ahmad Hassan',
    },
    {
      id: '2',
      title: 'Arabic for Beginners',
      progress: 30,
      nextLesson: 'Lesson 5: Basic Vocabulary',
      teacher: 'Dr. Omar Rashid',
    },
  ];

  const upcomingLessons = [
    {
      id: '1',
      course: 'Quran Reading Basics',
      teacher: 'Sheikh Ahmad Hassan',
      date: 'Today',
      time: '14:00 - 14:30',
    },
    {
      id: '2',
      course: 'Arabic for Beginners',
      date: 'Tomorrow',
      teacher: 'Dr. Omar Rashid',
      time: '10:00 - 10:30',
    },
  ];

  const stats = [
    { label: 'Completed Lessons', value: 24, icon: CheckCircle, color: 'from-primary-500 to-primary-600' },
    { label: 'Hours Learned', value: 12, icon: Clock, color: 'from-secondary-500 to-secondary-600' },
    { label: 'Current Streak', value: '7 days', icon: Flame, color: 'from-gold-500 to-gold-600' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-secondary-50/20 py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex items-center gap-2 mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              className="text-3xl"
            >
              👋
            </motion.span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t('welcome')}, {user.firstName}!
            </h1>
          </motion.div>
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Continue your learning journey today.
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1)' }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <stat.icon className="w-7 h-7 text-white" />
                </motion.div>
                <div>
                  <motion.p
                    className="text-3xl font-bold text-gray-900"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Courses */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <motion.h2
                  className="text-xl font-bold text-gray-900 flex items-center gap-2"
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <BookOpen className="w-5 h-5 text-primary-600" />
                  </motion.div>
                  {t('myCourses')}
                </motion.h2>
                <motion.div whileHover={{ x: 5 }}>
                  <Link
                    href="/dashboard/courses"
                    className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1"
                  >
                    {t('viewAll')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>

              <motion.div
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {enrolledCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)' }}
                    className="border border-gray-100 rounded-xl p-4 hover:border-primary-200 transition-colors bg-gradient-to-r from-white to-gray-50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-500">{course.teacher}</p>
                      </div>
                      <motion.span
                        className="text-sm font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-lg"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      >
                        {course.progress}%
                      </motion.span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Next: {course.nextLesson}
                      </p>
                      <motion.button
                        className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-sm py-2 px-4 rounded-lg flex items-center gap-1 font-medium"
                        whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(16, 185, 129, 0.3)' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play className="w-4 h-4" />
                        Continue
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.h2
                className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6"
                whileHover={{ x: 5 }}
              >
                <TrendingUp className="w-5 h-5 text-primary-600" />
                {t('progress')}
              </motion.h2>

              <motion.div
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[
                  { icon: CheckCircle, bg: 'bg-green-50', iconBg: 'bg-green-100', iconColor: 'text-green-600', title: 'Completed Lesson 11: Surah Al-Falaq', time: '2 hours ago' },
                  { icon: Play, bg: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', title: 'Started Arabic for Beginners course', time: 'Yesterday' },
                  { icon: Flame, bg: 'bg-amber-50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', title: '7-day learning streak achieved!', time: '2 days ago' },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    className={`flex items-center gap-4 p-4 ${activity.bg} rounded-xl`}
                  >
                    <motion.div
                      className={`w-12 h-12 ${activity.iconBg} rounded-full flex items-center justify-center`}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <activity.icon className={`w-6 h-6 ${activity.iconColor}`} />
                    </motion.div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Upcoming Lessons */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              whileHover={{ y: -3 }}
            >
              <motion.h2
                className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4"
                whileHover={{ x: 5 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Calendar className="w-5 h-5 text-primary-600" />
                </motion.div>
                {t('upcomingLessons')}
              </motion.h2>

              {upcomingLessons.length > 0 ? (
                <motion.div
                  className="space-y-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {upcomingLessons.map((lesson, index) => (
                    <motion.div
                      key={lesson.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, x: 3 }}
                      className="p-4 bg-gradient-to-r from-gray-50 to-primary-50/30 rounded-xl border border-gray-100"
                    >
                      <p className="font-medium text-gray-900 text-sm">
                        {lesson.course}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        {lesson.teacher}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <motion.span
                          className="text-primary-600 font-semibold bg-primary-50 px-2 py-1 rounded"
                          animate={lesson.date === 'Today' ? { scale: [1, 1.05, 1] } : {}}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          {lesson.date}
                        </motion.span>
                        <span className="text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lesson.time}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <p className="text-gray-500 text-sm">{t('noLessons')}</p>
              )}

              <motion.button
                className="w-full mt-4 py-2.5 border-2 border-primary-600 text-primary-600 font-medium rounded-xl hover:bg-primary-50 transition-colors text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('bookLesson')}
              </motion.button>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              whileHover={{ y: -3 }}
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Quick Links
              </h2>
              <div className="space-y-2">
                {[
                  { href: '/dashboard/messages', icon: MessageSquare, label: t('messages') },
                  { href: '/dashboard/settings', icon: Settings, label: t('settings') },
                ].map((link, index) => (
                  <motion.div key={link.href} whileHover={{ x: 5 }}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-primary-50/30 transition-colors"
                    >
                      <motion.div
                        whileHover={{ rotate: 10 }}
                        className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center"
                      >
                        <link.icon className="w-5 h-5 text-gray-500" />
                      </motion.div>
                      <span className="text-gray-700 font-medium">{link.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Help Card */}
            <motion.div
              className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 rounded-2xl p-6 text-white overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              {/* Decorative Elements */}
              <motion.div
                className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              />

              <div className="relative z-10">
                <motion.div
                  className="flex items-center gap-2 mb-2"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-bold">Need Help?</h3>
                </motion.div>
                <p className="text-sm text-primary-100 mb-4">
                  Our support team is here to assist you with any questions.
                </p>
                <motion.button
                  className="bg-white text-primary-600 font-semibold py-2.5 px-4 rounded-xl text-sm hover:bg-primary-50 transition-colors w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Support
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
