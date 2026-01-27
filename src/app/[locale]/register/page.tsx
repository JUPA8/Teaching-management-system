'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Eye, EyeOff, CheckCircle, Sparkles, BookOpen, Users, Award, Star } from 'lucide-react';

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
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-br from-gray-50 via-primary-50/30 to-secondary-50/30 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Benefits */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.span
                  className="inline-block px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 rounded-full text-sm font-medium mb-4"
                  whileHover={{ scale: 1.05 }}
                >
                  {t('community')}
                </motion.span>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {t('startJourney')}
                </h1>
                <p className="text-gray-600 mb-8">
                  {t('joinThousands')}
                </p>
              </motion.div>

              <motion.div
                className="space-y-4 mb-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3"
                  >
                    <motion.div
                      className="w-10 h-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <benefit.icon className="w-5 h-5 text-primary-600" />
                    </motion.div>
                    <span className="text-gray-700 font-medium">{benefit.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Testimonial */}
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ y: -5 }}
              >
                {/* Decorative Element */}
                <motion.div
                  className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-100 to-transparent rounded-bl-full opacity-50"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4 relative z-10">
                  "{t('testimonial.text')}"
                </p>
                <div className="flex items-center gap-3 relative z-10">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-white font-semibold">S</span>
                  </motion.div>
                  <div>
                    <p className="font-semibold text-gray-900">{t('testimonial.author')}</p>
                    <p className="text-sm text-gray-500">{t('testimonial.role')}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <BookOpen className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('title')}
              </h2>
              <p className="text-gray-600">{t('subtitle')}</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields */}
              <motion.div
                className="grid sm:grid-cols-2 gap-4"
                custom={0}
                variants={formFieldVariants}
                initial="hidden"
                animate="visible"
              >
                <div>
                  <label className="label">{t('firstName')}</label>
                  <motion.input
                    type="text"
                    required
                    className="input-field"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    whileFocus={{ scale: 1.01, boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)' }}
                  />
                </div>
                <div>
                  <label className="label">{t('lastName')}</label>
                  <motion.input
                    type="text"
                    required
                    className="input-field"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    whileFocus={{ scale: 1.01, boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)' }}
                  />
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                custom={1}
                variants={formFieldVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="label">{t('email')}</label>
                <motion.input
                  type="email"
                  required
                  className="input-field"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  whileFocus={{ scale: 1.01, boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)' }}
                />
              </motion.div>

              {/* Phone */}
              <motion.div
                custom={2}
                variants={formFieldVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="label">{t('phone')}</label>
                <motion.input
                  type="tel"
                  className="input-field"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  whileFocus={{ scale: 1.01, boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)' }}
                />
              </motion.div>

              {/* Country */}
              <motion.div
                custom={3}
                variants={formFieldVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="label">{t('country')}</label>
                <motion.select
                  className="input-field"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  whileFocus={{ scale: 1.01, boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)' }}
                >
                  <option value="">Select country...</option>
                  <option value="DE">Germany</option>
                  <option value="AT">Austria</option>
                  <option value="CH">Switzerland</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="SA">Saudi Arabia</option>
                  <option value="AE">United Arab Emirates</option>
                  <option value="EG">Egypt</option>
                  <option value="other">Other</option>
                </motion.select>
              </motion.div>

              {/* Timezone */}
              <motion.div
                custom={4}
                variants={formFieldVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="label">{t('timezone')}</label>
                <motion.select
                  className="input-field"
                  value={formData.timezone}
                  onChange={(e) =>
                    setFormData({ ...formData, timezone: e.target.value })
                  }
                  whileFocus={{ scale: 1.01, boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)' }}
                >
                  <option value="">Select timezone...</option>
                  <option value="Europe/Berlin">Berlin (GMT+1)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="America/New_York">New York (GMT-5)</option>
                  <option value="America/Los_Angeles">Los Angeles (GMT-8)</option>
                  <option value="Asia/Dubai">Dubai (GMT+4)</option>
                  <option value="Asia/Riyadh">Riyadh (GMT+3)</option>
                  <option value="Australia/Sydney">Sydney (GMT+11)</option>
                </motion.select>
              </motion.div>

              {/* Password */}
              <motion.div
                custom={5}
                variants={formFieldVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="label">{t('password')}</label>
                <div className="relative">
                  <motion.input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input-field pr-10"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    whileFocus={{ scale: 1.01, boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)' }}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* Confirm Password */}
              <motion.div
                custom={6}
                variants={formFieldVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="label">{t('confirmPassword')}</label>
                <motion.input
                  type="password"
                  required
                  className="input-field"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  whileFocus={{ scale: 1.01, boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)' }}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-shadow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {t('submit')}
              </motion.button>

              {/* Login Link */}
              <motion.p
                className="text-center text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {t('haveAccount')}{' '}
                <Link
                  href="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t('loginHere')}
                </Link>
              </motion.p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
