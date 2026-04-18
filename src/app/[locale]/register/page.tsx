'use client';

import { useState, useMemo } from 'react';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Eye, EyeOff, CheckCircle, XCircle, Sparkles, BookOpen,
  Users, Award, ArrowRight, Rocket, Mail, ShieldCheck,
} from 'lucide-react';
import {
  PASSWORD_RULES,
  STRENGTH_CONFIG,
  validatePassword,
  normalizeEmail,
  isValidEmail,
} from '@/lib/validation';

// ─── Resend Verification Button ───────────────────────────────────────────────

function ResendVerificationButton({ email }: { email: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error' | 'cooldown'>('idle');
  const [message, setMessage] = useState('');

  const handleResend = async () => {
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.status === 429 || data.code === 'COOLDOWN') {
        setStatus('cooldown');
        setMessage(data.error || 'Please wait a few minutes before requesting another email.');
        return;
      }
      if (!data.success) {
        setStatus('error');
        setMessage(data.error || 'Could not send email. Please try again.');
        return;
      }
      setStatus('sent');
      setMessage(
        data.emailSent
          ? 'Verification email sent! Please check your inbox.'
          : 'Request received. If email is not configured, contact support at +20 122 032 5887.'
      );
    } catch {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  if (status === 'sent') {
    return <div className="text-sm text-green-600 font-medium py-2 text-center">✓ {message}</div>;
  }
  if (status === 'cooldown') {
    return <div className="text-sm text-amber-600 font-medium py-2 text-center">⏳ {message}</div>;
  }
  if (status === 'error') {
    return (
      <div className="space-y-2">
        <div className="text-sm text-red-600 font-medium py-1 text-center">{message}</div>
        <button
          onClick={handleResend}
          className="w-full py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:border-[#2B7A78] hover:text-[#2B7A78] transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={handleResend}
      disabled={status === 'loading'}
      className="w-full py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:border-[#2B7A78] hover:text-[#2B7A78] transition-colors disabled:opacity-50"
    >
      {status === 'loading' ? 'Sending...' : 'Resend verification email'}
    </button>
  );
}

// ─── Password Strength Indicator ──────────────────────────────────────────────

function PasswordStrengthIndicator({ password }: { password: string }) {
  const result = useMemo(() => validatePassword(password), [password]);
  const config = STRENGTH_CONFIG[result.strength];

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 space-y-2"
    >
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${config.color}`}
            initial={{ width: 0 }}
            animate={{ width: config.width.replace('w-', '').replace('/', '/') }}
            style={{ width: config.width === 'w-1/4' ? '25%' : config.width === 'w-2/4' ? '50%' : config.width === 'w-3/4' ? '75%' : '100%' }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className={`text-xs font-semibold ${config.textColor}`}>{config.label}</span>
      </div>

      {/* Rule checklist */}
      <div className="grid grid-cols-1 gap-1">
        {PASSWORD_RULES.map((rule) => {
          const passed = rule.test(password);
          return (
            <div key={rule.id} className="flex items-center gap-1.5">
              {passed ? (
                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
              )}
              <span className={`text-xs ${passed ? 'text-green-600' : 'text-gray-400'}`}>
                {rule.label}
              </span>
            </div>
          );
        })}
        {result.isCommon && (
          <div className="flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
            <span className="text-xs text-red-500">Password is too common</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Register Page ───────────────────────────────────────────────────────

export default function RegisterPage() {
  const t = useTranslations('register');
  const params = useParams();
  const locale = params.locale as string;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [emailWasSent, setEmailWasSent] = useState(true);
  const [passwordTouched, setPasswordTouched] = useState(false);

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

  // Real-time password validation
  const passwordValidation = useMemo(
    () => validatePassword(formData.password),
    [formData.password]
  );

  const confirmMismatch =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // ── Client-side pre-flight ────────────────────────────────────────────────
    const emailNorm = normalizeEmail(formData.email);
    if (!isValidEmail(emailNorm)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!passwordValidation.isValid) {
      setPasswordTouched(true);
      setError('Please fix the password requirements highlighted below.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailNorm,
          password: formData.password,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Registration failed. Please try again.');
        setIsLoading(false);
        return;
      }

      setEmailWasSent(result.emailSent !== false);
      setRegisteredEmail(emailNorm);
    } catch {
      setError('A network error occurred. Please check your connection and try again.');
      setIsLoading(false);
    }
  };

  const benefits = [
    { text: t('benefits.trial'), icon: Sparkles },
    { text: t('benefits.library'), icon: BookOpen },
    { text: t('benefits.personalized'), icon: Award },
    { text: t('benefits.tracking'), icon: Users },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
  };
  const formFieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.05, type: 'spring' as const, stiffness: 100 },
    }),
  };

  // ── Post-registration screen ───────────────────────────────────────────────
  if (registeredEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#D9B574]/20 to-[#2B7A78]/10 px-4">
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring' as const, stiffness: 200 }}
        >
          <motion.div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              emailWasSent
                ? 'bg-gradient-to-br from-[#2B7A78] to-[#D9B574]'
                : 'bg-gradient-to-br from-amber-400 to-amber-600'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' as const, stiffness: 300, delay: 0.1 }}
          >
            <Mail className="w-10 h-10 text-white" />
          </motion.div>

          {emailWasSent ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Check your email!</h2>
              <p className="text-gray-600 mb-2">We sent a verification link to:</p>
              <p className="font-bold text-[#2B7A78] text-lg mb-4 break-all">{registeredEmail}</p>
              <p className="text-gray-500 text-sm mb-8">
                Click the link in the email to verify your account. The link expires in 24 hours.
                Can&apos;t find it? Check your spam folder.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Account created!</h2>
              <p className="text-gray-600 mb-2">Your account was created for:</p>
              <p className="font-bold text-[#2B7A78] text-lg mb-4 break-all">{registeredEmail}</p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
                <p className="text-amber-800 text-sm font-medium mb-1">⚠️ Email not sent</p>
                <p className="text-amber-700 text-sm">
                  We could not send the verification email right now. Use the button below to retry,
                  or contact us at{' '}
                  <a href="tel:+201220325887" className="underline font-semibold">+20 122 032 5887</a>.
                </p>
              </div>
            </>
          )}

          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full py-3 bg-gradient-to-r from-[#2B7A78] to-[#D9B574] text-white font-bold rounded-xl text-center"
            >
              Go to Login
            </Link>
            <ResendVerificationButton email={registeredEmail} />
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Registration form ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image src="/register-hero-bg.png" alt={t('heroAlt')} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-br from-[#D9B574]/95 via-[#C9A551]/90 to-[#B18C41]/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 30, repeat: Infinity, repeatType: 'reverse' }}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10 L40 25 L35 40 L25 40 L20 25 Z' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Left — Benefits */}
            <motion.div
              className="hidden lg:block pt-12"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="sticky top-24">
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

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <motion.div
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/30 mb-6"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Rocket className="w-5 h-5 text-white" />
                    <span className="text-sm font-bold text-white">{t('community')}</span>
                  </motion.div>
                  <h1 className="text-5xl font-bold text-white mb-6 leading-tight">{t('startJourney')}</h1>
                  <div className="h-1 w-24 bg-white/80 mb-6" />
                  <p className="text-xl text-white/90 mb-10 leading-relaxed">{t('joinThousands')}</p>
                </motion.div>

                <motion.div className="space-y-5 mb-10" variants={containerVariants} initial="hidden" animate="visible">
                  {benefits.map((benefit, index) => (
                    <motion.div key={index} variants={itemVariants} className="flex items-start gap-4 group" whileHover={{ x: 5 }}>
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

                <motion.div
                  className="relative h-56 rounded-3xl overflow-hidden shadow-2xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Image src="/register-journey.png" alt={t('journeyAlt')} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="font-bold text-lg mb-1">{t('journeyTitle')}</div>
                    <div className="text-sm text-white/80">{t('journeySubtitle')}</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-white/50"
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Header */}
              <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <div className="lg:hidden mb-6">
                  <Link href="/">
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
                  transition={{ type: 'spring' as const, stiffness: 200 }}
                >
                  <Sparkles className="w-4 h-4 text-[#D9B574]" />
                  <span className="text-sm font-bold text-[#D9B574]">{t('badge')}</span>
                </motion.div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h2>
                <p className="text-gray-600">{t('subtitle')}</p>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Error banner */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 font-medium text-sm flex items-start gap-2"
                    >
                      <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Name */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <motion.div custom={0} variants={formFieldVariants} initial="hidden" animate="visible">
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('firstName')}</label>
                    <input
                      type="text"
                      required
                      autoComplete="given-name"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D9B574] focus:border-[#D9B574] outline-none transition-all text-gray-900"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </motion.div>
                  <motion.div custom={0} variants={formFieldVariants} initial="hidden" animate="visible">
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('lastName')}</label>
                    <input
                      type="text"
                      required
                      autoComplete="family-name"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D9B574] focus:border-[#D9B574] outline-none transition-all text-gray-900"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </motion.div>
                </div>

                {/* Email */}
                <motion.div custom={1} variants={formFieldVariants} initial="hidden" animate="visible">
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('email')}</label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D9B574] focus:border-[#D9B574] outline-none transition-all text-gray-900"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </motion.div>

                {/* Phone */}
                <motion.div custom={2} variants={formFieldVariants} initial="hidden" animate="visible">
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('phone')}</label>
                  <input
                    type="tel"
                    autoComplete="tel"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D9B574] focus:border-[#D9B574] outline-none transition-all text-gray-900"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+20 122 032 5887"
                  />
                </motion.div>

                {/* Country + Timezone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <motion.div custom={3} variants={formFieldVariants} initial="hidden" animate="visible">
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('country')}</label>
                    <select
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D9B574] focus:border-[#D9B574] outline-none transition-all text-gray-900"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
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
                    </select>
                  </motion.div>

                  <motion.div custom={4} variants={formFieldVariants} initial="hidden" animate="visible">
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('timezone')}</label>
                    <select
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D9B574] focus:border-[#D9B574] outline-none transition-all text-gray-900"
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    >
                      <option value="">Select...</option>
                      <option value="Europe/Berlin">Berlin (GMT+1)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="America/New_York">New York (GMT-5)</option>
                      <option value="America/Los_Angeles">Los Angeles (GMT-8)</option>
                      <option value="Asia/Dubai">Dubai (GMT+4)</option>
                      <option value="Asia/Riyadh">Riyadh (GMT+3)</option>
                      <option value="Australia/Sydney">Sydney (GMT+11)</option>
                    </select>
                  </motion.div>
                </div>

                {/* Password */}
                <motion.div custom={5} variants={formFieldVariants} initial="hidden" animate="visible">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <span className="flex items-center gap-1.5">
                      {t('password')}
                      <ShieldCheck className="w-4 h-4 text-[#D9B574]" />
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      className={`w-full px-4 py-3 pr-12 bg-white border-2 rounded-xl focus:ring-2 focus:ring-[#D9B574] focus:border-[#D9B574] outline-none transition-all text-gray-900 ${
                        passwordTouched && !passwordValidation.isValid
                          ? 'border-red-300'
                          : passwordValidation.isValid && formData.password
                          ? 'border-green-300'
                          : 'border-gray-200'
                      }`}
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        if (!passwordTouched && e.target.value.length > 0) setPasswordTouched(true);
                      }}
                      onBlur={() => formData.password && setPasswordTouched(true)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Real-time strength indicator */}
                  <AnimatePresence>
                    {passwordTouched && <PasswordStrengthIndicator password={formData.password} />}
                  </AnimatePresence>
                </motion.div>

                {/* Confirm Password */}
                <motion.div custom={6} variants={formFieldVariants} initial="hidden" animate="visible">
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('confirmPassword')}</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      className={`w-full px-4 py-3 pr-12 bg-white border-2 rounded-xl focus:ring-2 focus:ring-[#D9B574] focus:border-[#D9B574] outline-none transition-all text-gray-900 ${
                        confirmMismatch
                          ? 'border-red-300'
                          : formData.confirmPassword && !confirmMismatch
                          ? 'border-green-300'
                          : 'border-gray-200'
                      }`}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {confirmMismatch && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-red-500 mt-1 flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Passwords do not match
                      </motion.p>
                    )}
                    {formData.confirmPassword && !confirmMismatch && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-green-600 mt-1 flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Passwords match
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="group w-full py-5 bg-gradient-to-r from-[#D9B574] to-[#C9A551] text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 text-lg mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      {t('submit')}
                      <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <ArrowRight className="w-6 h-6" />
                      </motion.div>
                    </>
                  )}
                </motion.button>

                {/* Login link */}
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
