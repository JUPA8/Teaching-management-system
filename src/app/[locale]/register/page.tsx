'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Eye, EyeOff, CheckCircle, Sparkles, BookOpen, Users, Award, Star, ArrowRight, Rocket, Globe, Heart } from 'lucide-react';

export default function RegisterPage() {
  const t = useTranslations('register');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: '',
    timezone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Form submitted:', formData);
  };

  const benefits = [
    { text: t('benefits.trial'), icon: Sparkles },
    { text: t('benefits.library'), icon: BookOpen },
    { text: t('benefits.personalized'), icon: Award },
    { text: t('benefits.tracking'), icon: Users },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
    },
  };

  const formFieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, type: 'spring' as const, stiffness: 100 },
    }),
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/register-hero-bg.png"
          alt={t('heroAlt')}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#D9B574]/95 via-[#C9A551]/90 to-[#B18C41]/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Animated Pattern */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 30, repeat: Infinity, repeatType: 'reverse' }}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10 L40 25 L35 40 L25 40 L20 25 Z' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Welcome & Benefits */}
            <motion.div
              className="hidden lg:block pt-12"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="sticky top-24">
                {/* Logo */}
                <Link href="/" className="inline-block mb-8">
                  <motion.div
                    className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border-2 border-white/30"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    animate={{ rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <BookOpen className="w-10 h-10 text-white" />
                  </motion.div>
                </Link>

                {/* Main Content */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/30 mb-6"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Rocket className="w-5 h-5 text-white" />
                    <span className="text-sm font-bold text-white">{t('community')}</span>
                  </motion.div>

                  <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                    {t('startJourney')}
                  </h1>

                  <div className="h-1 w-24 bg-white/80 mb-6" />

                  <p className="text-xl text-white/90 mb-10 leading-relaxed">
                    {t('joinThousands')}
                  </p>
                </motion.div>

                {/* Benefits */}
                <motion.div
                  className="space-y-5 mb-10"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="flex items-start gap-4 group"
                      whileHover={{ x: 5 }}
                    >
                      <motion.div
                        className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 flex-shrink-0"
                        whileHover={{ scale: 1.1, rotate: 10, backgroundColor: 'rgba(255,255,255,0.2)' }}
                      >
                        <benefit.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <span className="text-white/90 font-medium text-lg pt-2">{benefit.text}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Journey Image */}
                <motion.div
                  className="relative h-56 rounded-3xl overflow-hidden shadow-2xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Image
                    src="/register-journey.png"
                    alt={t('journeyAlt')}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="text-white">
                      <div className="font-bold text-lg mb-1">{t('journeyTitle')}</div>
                      <div className="text-sm text-white/80">{t('journeySubtitle')}</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-white/50"
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Form Header */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {/* Mobile Logo */}
                <div className="lg:hidden mb-6">
                  <Link href="/" className="inline-block">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-[#D9B574] to-[#C9A551] rounded-2xl flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                    >
                      <BookOpen className="w-8 h-8 text-white" />
                    </motion.div>
                  </Link>
                </div>

                  <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#D9B574]/10 rounded-full mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <Sparkles className="w-4 h-4 text-[#D9B574]" />
                  <span className="text-sm font-bold text-[#D9B574]">{t('badge')}</span>
                </motion.div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {t('title')}
                </h2>
                <p className="text-gray-600">{t('subtitle')}</p>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Fields */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <motion.div custom={0} variants={formFieldVariants} initial="hidden" animate="visible">
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('firstName')}</label>
                    <motion.input
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D9B574] focus:border-[#D9B574] outline-none transition-all text-gray-900"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      whileFocus={{ scale: 1.01 }}
                    />
                  </motion.div>
                  <motion.div custom={0} variants={formFieldVariants} initial="hidden" animate="visible">
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('lastName')}</label>
                    <motion.input
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D9B574] focus:border-[#D9B574] outline-none transition-all text-gray-900"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      whileFocus={{ scale: 1.01 }}
                    />
                  </motion.div>
                </div>

                {/* Email */}
                <motion.div custom={1} variants={formFieldVariants} initial="hidden" animate="visible">
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('email')}</label>
                  <motion.input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D9B574] focus:border-[#D9B574] outline-none transition-all text-gray-900"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    whileFocus={{ scale: 1.01 }}
                  />
                </motion.div>

                {/* Phone */}
                <motion.div custom={2} variants={formFieldVariants} initial="hidden" animate="visible">
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('phone')}</label>
                  <motion.input
                    type="tel"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D9B574] focus:border-[#D9B574] outline-none transition-all text-gray-900"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    whileFocus={{ scale: 1.01 }}
                  />
                </motion.div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Country */}
                  <motion.div custom={3} variants={formFieldVariants} initial="hidden" animate="visible">
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('country')}</label>
                    <motion.select
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D9B574] focus:border-[#D9B574] outline-none transition-all text-gray-900"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      whileFocus={{ scale: 1.01 }}
                    >
                      <option value="">Select...</option>
                      <option value="DE">Germany</option>
                      <option value="AT">Austria</option>
                      <option value="CH">Switzerland</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="SA">Saudi Arabia</option>
                      <option value="AE">UAE</option>
                      <option value="EG">Egypt</option>
                      <option value="other">Other</option>
                    </motion.select>
                  </motion.div>

                  {/* Timezone */}
                  <motion.div custom={4} variants={formFieldVariants} initial="hidden" animate="visible">
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('timezone')}</label>
                    <motion.select
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D9B574] focus:border-[#D9B574] outline-none transition-all text-gray-900"
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      whileFocus={{ scale: 1.01 }}
                    >
                      <option value="">Select...</option>
                      <option value="Europe/Berlin">Berlin (GMT+1)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="America/New_York">New York (GMT-5)</option>
                      <option value="America/Los_Angeles">Los Angeles (GMT-8)</option>
                      <option value="Asia/Dubai">Dubai (GMT+4)</option>
                      <option value="Asia/Riyadh">Riyadh (GMT+3)</option>
                      <option value="Australia/Sydney">Sydney (GMT+11)</option>
                    </motion.select>
                  </motion.div>
                </div>

                {/* Password */}
                <motion.div custom={5} variants={formFieldVariants} initial="hidden" animate="visible">
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('password')}</label>
                  <div className="relative">
                    <motion.input
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="w-full px-4 py-3 pr-12 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D9B574] focus:border-[#D9B574] outline-none transition-all text-gray-900"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      whileFocus={{ scale: 1.01 }}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Confirm Password */}
                <motion.div custom={6} variants={formFieldVariants} initial="hidden" animate="visible">
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('confirmPassword')}</label>
                  <motion.input
                    type="password"
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D9B574] focus:border-[#D9B574] outline-none transition-all text-gray-900"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    whileFocus={{ scale: 1.01 }}
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="group w-full py-5 bg-gradient-to-r from-[#D9B574] to-[#C9A551] text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 text-lg mt-8"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {t('submit')}
                  <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </motion.button>

                {/* Login Link */}
                <motion.p
                  className="text-center text-gray-600 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {t('haveAccount')}{' '}
                  <Link href="/login" className="text-[#D9B574] hover:text-[#C9A551] font-bold">
                    {t('loginHere')}
                  </Link>
                </motion.p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
