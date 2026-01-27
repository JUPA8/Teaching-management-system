'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  Globe,
  Award,
  Heart,
  Star,
  Target,
  Lightbulb,
  Shield,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

export default function AboutPage() {
  const about = useTranslations('about');
  const common = useTranslations('common');

  const stats = [
    { value: '10,000+', label: about('stats.students'), icon: Users },
    { value: '50+', label: about('stats.teachers'), icon: Award },
    { value: '15+', label: about('stats.countries'), icon: Globe },
    { value: '4.9', label: about('stats.rating'), icon: Star },
  ];

  const values = [
    {
      icon: BookOpen,
      title: about('values.excellence.title'),
      description: about('values.excellence.description'),
      color: 'from-primary-500 to-primary-600',
    },
    {
      icon: Heart,
      title: about('values.compassion.title'),
      description: about('values.compassion.description'),
      color: 'from-secondary-500 to-secondary-600',
    },
    {
      icon: Target,
      title: about('values.personalized.title'),
      description: about('values.personalized.description'),
      color: 'from-gold-500 to-gold-600',
    },
    {
      icon: Shield,
      title: about('values.integrity.title'),
      description: about('values.integrity.description'),
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const team = [
    { name: about('team.members.ahmad.name'), role: about('team.members.ahmad.role'), initial: 'A' },
    { name: about('team.members.fatima.name'), role: about('team.members.fatima.role'), initial: 'F' },
    { name: about('team.members.omar.name'), role: about('team.members.omar.role'), initial: 'O' },
    { name: about('team.members.maryam.name'), role: about('team.members.maryam.role'), initial: 'M' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 overflow-hidden">
        {/* Background Pattern */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px)',
            backgroundSize: '50px 50px',
          }}
          animate={{ x: [0, 50], y: [0, 50] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />

        {/* Floating Decorations */}
        <motion.div
          className="absolute top-20 start-10 w-32 h-32 bg-white/10 rounded-full"
          animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 end-10 w-48 h-48 bg-white/10 rounded-full"
          animate={{ y: [0, 30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 start-1/4 w-20 h-20 bg-gold-400/20 rounded-full"
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <span className="px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                {about('story')}
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {about('title')}
            </motion.h1>

            <motion.p
              className="text-xl text-primary-100 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {about('subtitle')}
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-white text-primary-600 font-semibold px-6 py-3 rounded-xl hover:shadow-xl transition-shadow"
                >
                  {about('startLearning')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition-colors"
                >
                  {about('contactUs')}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-12 relative z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 text-center"
              >
                <motion.div
                  className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <stat.icon className="w-6 h-6 text-primary-600" />
                </motion.div>
                <motion.p
                  className="text-2xl md:text-3xl font-bold text-gray-900 mb-1"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, type: 'spring' }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.span
                className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4"
                whileHover={{ scale: 1.05 }}
              >
                {about('mission')}
              </motion.span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {about('missionTitle')}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {about('missionDesc1')}
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {about('missionDesc2')}
              </p>

              <motion.div className="space-y-3">
                {['Certified Ijazah holders', 'Personalized learning paths', 'Flexible scheduling', '24/7 support'].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center"
                      whileHover={{ scale: 1.2 }}
                    >
                      <CheckCircle className="w-4 h-4 text-primary-600" />
                    </motion.div>
                    <span className="text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="relative bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl p-8 text-white overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                {/* Decorative Elements */}
                <motion.div
                  className="absolute top-0 end-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                  className="absolute bottom-0 start-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                />

                <div className="relative z-10">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    📖
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-primary-100 leading-relaxed">
                    To become the world's most trusted platform for online Quran education,
                    nurturing a global community of learners who carry the light of the Quran
                    in their hearts and lives.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              {about('valuesTitle')}
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {about('coreValues')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {about('coreValuesDesc')}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <motion.div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <value.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="inline-block px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              {about('team.leadershipTeam')}
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {about('team.meetLeaders')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {about('team.meetLeadersDesc')}
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center"
              >
                <motion.div
                  className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <span className="text-4xl font-bold text-white">{member.initial}</span>
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-gray-500 text-sm">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 rounded-3xl p-8 md:p-12 text-center text-white overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Decorative Elements */}
            <motion.div
              className="absolute top-0 start-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 end-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 translate-x-1/2"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />

            <div className="relative z-10">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Ready to Begin Your Journey?
              </motion.h2>
              <motion.p
                className="text-primary-100 mb-8 max-w-xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Join thousands of students who have transformed their relationship with the Quran through Salam Institute.
              </motion.p>
              <motion.div
                className="flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:shadow-xl transition-shadow"
                  >
                    {common('freeTrial')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
