'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Eye, EyeOff, BookOpen, Lock, Mail, ArrowRight, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const t = useTranslations('login');
  const params = useParams();
  const locale = params.locale as string;
  
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const verified = searchParams.get('verified');
    const errorParam = searchParams.get('error');
    if (verified === '1') {
      setSuccessMessage('Your email has been verified! You can now log in.');
    } else if (errorParam === 'token_expired') {
      setError('Your verification link has expired. Please request a new one.');
    } else if (errorParam === 'invalid_token') {
      setError('Invalid verification link. Please request a new one.');
    }
  }, [searchParams]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        // NextAuth passes the thrown error message through result.error
        if (result.error.includes('verify your email')) {
          setError(result.error);
        } else {
          setError('Invalid email or password');
        }
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        // Fetch session to determine role-based redirect
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        const role = session?.user?.role;
        if (role === 'ADMIN') {
          window.location.href = `/${locale}/admin`;
        } else if (role === 'TEACHER') {
          window.location.href = `/${locale}/dashboard`;
        } else {
          window.location.href = `/${locale}/dashboard`;
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image & Info */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#2B7A78] to-[#1a5856] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/login-hero-bg.png"
            alt={t('heroAlt')}
            fill
            className="object-cover opacity-30"
          />
        </div>

        {/* Animated Pattern */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10 L40 25 L35 40 L25 40 L20 25 Z' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 py-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link href="/" className="inline-block mb-12">
              <motion.div
                className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border-2 border-white/30"
                whileHover={{ scale: 1.05, rotate: 5 }}
                animate={{ rotate: [0, 3, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <BookOpen className="w-10 h-10 text-white" />
              </motion.div>
            </Link>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              {t('heroTitle')}
            </h1>
            
            <div className="h-1 w-24 bg-[#D9B574] mb-8" />

            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              {t('heroDescription')}
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {[
              t('heroFeatures.dashboard'),
              t('heroFeatures.courses'),
              t('heroFeatures.teachers'),
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="w-8 h-8 rounded-full bg-[#D9B574]/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-[#D9B574]" />
                </div>
                <span className="text-white/90">{feature}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Study Image */}
          <motion.div
            className="mt-12 relative h-48 rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <Image
              src="/login-study.png"
              alt={t('studyAlt')}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gradient-to-br from-[#FDFBF7] to-white relative z-10">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Form Header */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8">
              <Link href="/" className="inline-block">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-[#2B7A78] to-[#D9B574] rounded-2xl flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <BookOpen className="w-8 h-8 text-white" />
                </motion.div>
              </Link>
            </div>

            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#2B7A78]/10 rounded-full mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' as const, stiffness: 200 }}
            >
              <Sparkles className="w-4 h-4 text-[#2B7A78]" />
              <span className="text-sm font-bold text-[#2B7A78]">{t('heroBadge')}</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('subtitle')}
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-700 font-medium">{successMessage}</p>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </motion.div>
            )}

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t('email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <motion.input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78] focus:border-[#2B7A78] outline-none transition-all text-gray-900 text-lg"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="your@email.com"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <motion.input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78] focus:border-[#2B7A78] outline-none transition-all text-gray-900 text-lg"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  whileFocus={{ scale: 1.01 }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

            {/* Remember & Forgot */}
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.label
                className="flex items-center gap-2 cursor-pointer group"
                whileHover={{ x: 2 }}
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 text-[#2B7A78] border-gray-300 rounded focus:ring-[#2B7A78]"
                  checked={formData.remember}
                  onChange={(e) =>
                    setFormData({ ...formData, remember: e.target.checked })
                  }
                />
                <span className="text-sm text-gray-700 font-medium group-hover:text-[#2B7A78] transition-colors">
                  {t('remember')}
                </span>
              </motion.label>
              {/* Password reset handled by admin — removed dead link */}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="group w-full py-5 bg-gradient-to-r from-[#2B7A78] to-[#D9B574] text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  {t('submit')}
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </>
              )}
            </motion.button>

            {/* Register Link */}
            <motion.p
              className="text-center text-gray-600 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {t('noAccount')}{' '}
              <Link
                href="/register"
                className="text-[#2B7A78] hover:text-[#236260] font-bold"
              >
                {t('registerHere')}
              </Link>
            </motion.p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
