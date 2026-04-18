'use client';

export const dynamic = 'force-dynamic';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
} from 'lucide-react';

interface UpcomingLesson {
  id: string;
  course: { name: string };
  teacher: { user: { name: string | null } };
  scheduledAt: string;
  endTime: string;
  status: string;
}

interface AttendanceRecord {
  id: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  markedAt: string;
  booking: { scheduledAt: string; course: { name: string } };
}

interface GradeRecord {
  id: string;
  score: number;
  maxScore: number;
  label: string | null;
  gradedAt: string;
  course: { name: string };
}

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const { data: session } = useSession();
  const [upcomingLessons, setUpcomingLessons] = useState<UpcomingLesson[]>([]);
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([]);
  const [recentGrades, setRecentGrades] = useState<GradeRecord[]>([]);

  const firstName = session?.user?.name?.split(' ')[0] ?? '...';

  useEffect(() => {
    fetch('/api/bookings?limit=5&status=CONFIRMED')
      .then(r => r.json())
      .then(data => {
        if (data.success) setUpcomingLessons(data.data.bookings ?? data.data ?? []);
      })
      .catch(() => {});

    fetch('/api/attendance')
      .then(r => r.json())
      .then(data => {
        if (data.success) setRecentAttendance((data.data ?? []).slice(0, 5));
      })
      .catch(() => {});

    fetch('/api/grades')
      .then(r => r.json())
      .then(data => {
        if (data.success) setRecentGrades((data.data ?? []).slice(0, 3));
      })
      .catch(() => {});
  }, []);

  const presentCount = recentAttendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
  const attendancePct = recentAttendance.length > 0 ? Math.round((presentCount / recentAttendance.length) * 100) : null;
  const avgGrade = recentGrades.length > 0
    ? Math.round((recentGrades.reduce((s, g) => s + (g.score / g.maxScore) * 100, 0) / recentGrades.length) * 10) / 10
    : null;

  const stats = [
    { label: 'Upcoming Lessons', value: upcomingLessons.length, icon: CheckCircle, color: 'from-primary-500 to-primary-600' },
    { label: 'Attendance Rate', value: attendancePct !== null ? `${attendancePct}%` : '—', icon: TrendingUp, color: 'from-secondary-500 to-secondary-600' },
    { label: 'Avg Grade', value: avgGrade !== null ? `${avgGrade}%` : '—', icon: Award, color: 'from-gold-500 to-gold-600' },
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
              {t('welcome')}, {firstName}!
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
                  transition={{ type: 'spring' as const, stiffness: 300 }}
                >
                  <stat.icon className="w-7 h-7 text-white" />
                </motion.div>
                <div>
                  <motion.p
                    className="text-3xl font-bold text-gray-900"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, type: 'spring' as const }}
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

              {upcomingLessons.length === 0 ? (
                <p className="text-gray-500 text-sm py-4">{t('noLessons')}</p>
              ) : (
                <motion.div
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {upcomingLessons.map((lesson, index) => {
                    const scheduledDate = new Date(lesson.scheduledAt);
                    const endDate = new Date(lesson.endTime);
                    return (
                      <motion.div
                        key={lesson.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.01, boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)' }}
                        className="border border-gray-100 rounded-xl p-4 hover:border-primary-200 transition-colors bg-gradient-to-r from-white to-gray-50"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{lesson.course.name}</h3>
                            <p className="text-sm text-gray-500">{lesson.teacher.user.name ?? 'Teacher'}</p>
                          </div>
                          <span className="text-sm font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">
                            {lesson.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {scheduledDate.toLocaleDateString()} {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>

            {/* Recent Attendance & Grades */}
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
                Recent Activity
              </motion.h2>

              {recentAttendance.length === 0 && recentGrades.length === 0 ? (
                <p className="text-gray-500 text-sm py-4">No activity recorded yet.</p>
              ) : (
                <motion.div
                  className="space-y-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {recentAttendance.map((att) => {
                    const cfg = {
                      PRESENT: { bg: 'bg-green-50', iconBg: 'bg-green-100', iconColor: 'text-green-600', label: 'Attended' },
                      ABSENT: { bg: 'bg-red-50', iconBg: 'bg-red-100', iconColor: 'text-red-600', label: 'Absent' },
                      LATE: { bg: 'bg-yellow-50', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', label: 'Late' },
                      EXCUSED: { bg: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', label: 'Excused' },
                    }[att.status] ?? { bg: 'bg-gray-50', iconBg: 'bg-gray-100', iconColor: 'text-gray-600', label: att.status };
                    return (
                      <motion.div
                        key={att.id}
                        variants={itemVariants}
                        whileHover={{ x: 5 }}
                        className={`flex items-center gap-4 p-4 ${cfg.bg} rounded-xl`}
                      >
                        <div className={`w-10 h-10 ${cfg.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <CheckCircle className={`w-5 h-5 ${cfg.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {cfg.label}: {att.booking.course.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(att.booking.scheduledAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                  {recentGrades.map((grade) => {
                    const pct = Math.round((grade.score / grade.maxScore) * 100);
                    return (
                      <motion.div
                        key={grade.id}
                        variants={itemVariants}
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl"
                      >
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {grade.label ?? 'Assessment'}: {grade.course.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Score: {pct}% · {new Date(grade.gradedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
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
                  {upcomingLessons.slice(0, 3).map((lesson) => {
                    const scheduledDate = new Date(lesson.scheduledAt);
                    const endDate = new Date(lesson.endTime);
                    const today = new Date();
                    const isToday = scheduledDate.toDateString() === today.toDateString();
                    const isTomorrow = scheduledDate.toDateString() === new Date(today.getTime() + 86400000).toDateString();
                    const dayLabel = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : scheduledDate.toLocaleDateString();
                    return (
                      <motion.div
                        key={lesson.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, x: 3 }}
                        className="p-4 bg-gradient-to-r from-gray-50 to-primary-50/30 rounded-xl border border-gray-100"
                      >
                        <p className="font-medium text-gray-900 text-sm">{lesson.course.name}</p>
                        <p className="text-xs text-gray-500 mb-2">{lesson.teacher.user.name ?? 'Teacher'}</p>
                        <div className="flex items-center justify-between text-xs">
                          <motion.span
                            className="text-primary-600 font-semibold bg-primary-50 px-2 py-1 rounded"
                            animate={isToday ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            {dayLabel}
                          </motion.span>
                          <span className="text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
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
                <motion.div whileHover={{ x: 5 }}>
                  <Link
                    href="/courses"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-primary-50/30 transition-colors"
                  >
                    <motion.div
                      whileHover={{ rotate: 10 }}
                      className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center"
                    >
                      <BookOpen className="w-5 h-5 text-gray-500" />
                    </motion.div>
                    <span className="text-gray-700 font-medium">Browse Courses</span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ x: 5 }}>
                  <Link
                    href="/probestunde"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-primary-50/30 transition-colors"
                  >
                    <motion.div
                      whileHover={{ rotate: 10 }}
                      className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center"
                    >
                      <Calendar className="w-5 h-5 text-gray-500" />
                    </motion.div>
                    <span className="text-gray-700 font-medium">Book Free Trial</span>
                  </Link>
                </motion.div>
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
                <Link
                  href="/probestunde"
                  className="block bg-white text-primary-600 font-semibold py-2.5 px-4 rounded-xl text-sm hover:bg-primary-50 transition-colors w-full text-center"
                >
                  Contact Support
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
