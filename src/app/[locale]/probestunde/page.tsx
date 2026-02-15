'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Users,
  Mail,
  Phone,
  MessageCircle,
  UserCheck,
  BookOpen,
  CheckCircle,
  Send,
  Plus,
  Minus,
  Video,
  Clock,
  Award,
  Sparkles,
  Gift,
  Star,
  ArrowRight,
} from 'lucide-react';

interface Student {
  name: string;
  age: string;
}

export default function ProbestundePage() {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const isGerman = locale === 'de';
  const t = useTranslations('probestunde');

  const [numStudents, setNumStudents] = useState(1);
  const [students, setStudents] = useState<Student[]>([{ name: '', age: '' }]);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [contactMethod, setContactMethod] = useState('whatsapp');
  const [teacherPreference, setTeacherPreference] = useState('no-preference');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNumStudentsChange = (newNum: number) => {
    if (newNum < 1) newNum = 1;
    if (newNum > 10) newNum = 10;
    
    setNumStudents(newNum);
    const newStudents = [...students];
    
    if (newNum > students.length) {
      for (let i = students.length; i < newNum; i++) {
        newStudents.push({ name: '', age: '' });
      }
    } else {
      newStudents.splice(newNum);
    }
    
    setStudents(newStudents);
  };

  const handleStudentChange = (index: number, field: 'name' | 'age', value: string) => {
    const newStudents = [...students];
    newStudents[index][field] = value;
    setStudents(newStudents);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare data
    const formData = {
      numStudents,
      students,
      email,
      phone,
      contactMethod,
      teacherPreference,
      timestamp: new Date().toISOString(),
    };

    try {
      // TODO: Send to API endpoint that saves to Google Sheets
      const response = await fetch('/api/probestunde', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        // Reset form
        setTimeout(() => {
          setNumStudents(1);
          setStudents([{ name: '', age: '' }]);
          setEmail('');
          setPhone('');
          setContactMethod('whatsapp');
          setTeacherPreference('no-preference');
          setIsSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-white">
      {/* AMAZING HERO SECTION */}
      <section className="relative h-[500px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/trial-hero-bg.png"
            alt={t('heroAlt')}
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2B7A78]/95 via-[#2B7A78]/85 to-[#2B7A78]/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Animated Pattern */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10 L40 25 L35 40 L25 40 L20 25 Z' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* FREE Badge */}
                <motion.div
                  className="inline-flex items-center gap-3 mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="relative">
                    <motion.div
                      className="absolute -inset-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full blur-lg"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                    <div className="relative bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-6 py-3 rounded-full border-2 border-white shadow-xl">
                      <div className="flex items-center gap-2">
                        <Gift className="w-6 h-6 text-white" />
                        <span className="text-white font-black text-lg">100% FREE</span>
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Main Title */}
                <motion.h1
                  className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {t('title')}
                </motion.h1>

                {/* Golden Line */}
                <motion.div
                  className="flex items-center gap-3 mb-6"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="h-1 w-24 bg-[#D9B574]" />
                  <Star className="w-6 h-6 text-[#D9B574]" fill="#D9B574" />
                  <div className="h-1 w-24 bg-[#D9B574]" />
                </motion.div>

                {/* Subtitle */}
                <motion.p
                  className="text-xl text-white/95 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {t('subtitle')}
                </motion.p>

                {/* Benefits */}
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {[
                    { icon: Video, text: t('benefits.liveSession') },
                    { icon: Clock, text: t('benefits.freeClass') },
                    { icon: Award, text: t('benefits.expertTeacher') },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white font-medium text-lg">{item.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Image */}
              <motion.div
                className="hidden lg:block relative h-80 rounded-3xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Image
                  src="/trial-online-class.png"
                  alt={t('onlineClassAlt')}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="py-16 bg-gradient-to-b from-[#F5F0E8] to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2B7A78]/10 rounded-full mb-4"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Sparkles className="w-5 h-5 text-[#2B7A78]" />
              <span className="text-sm font-bold text-[#2B7A78]">{t('badge')}</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('mainTitle')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('mainDescription')}
            </p>
          </motion.div>

          {/* Form Container */}
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-[#D9B574]/20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
          {isSuccess ? (
            <motion.div
              className="text-center py-12"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('success')}</h3>
              <p className="text-gray-600">{isGerman ? 'Wir werden uns bald bei Ihnen melden.' : isArabic ? 'سنتواصل معك قريباً.' : 'We will contact you soon.'}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Number of Students */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  <Users className="w-5 h-5 inline mr-2" />
                  {t('numStudentsLabel')}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleNumStudentsChange(numStudents - 1)}
                    className="w-12 h-12 bg-secondary-100 hover:bg-secondary-200 rounded-xl flex items-center justify-center transition-all"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-3xl font-bold text-primary-500 min-w-[60px] text-center">
                    {numStudents}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleNumStudentsChange(numStudents + 1)}
                    className="w-12 h-12 bg-secondary-100 hover:bg-secondary-200 rounded-xl flex items-center justify-center transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Students Info */}
              <div className="space-y-6">
                {students.map((student, index) => (
                  <motion.div
                    key={index}
                    className="bg-[#F9F4E8] rounded-2xl p-6 border border-secondary-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {t('studentLabel')} {index + 1}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('nameLabel')}
                        </label>
                        <input
                          type="text"
                          required
                          value={student.name}
                          onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                          placeholder={t('namePlaceholder')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('ageLabel')}
                        </label>
                        <input
                          type="number"
                          required
                          min="3"
                          max="100"
                          value={student.age}
                          onChange={(e) => handleStudentChange(index, 'age', e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                          placeholder={t('agePlaceholder')}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    {t('emailLabel')}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F9F4E8] border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    {t('phoneLabel')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F9F4E8] border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="+49 123 456 789"
                  />
                </div>
              </div>

              {/* Contact Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  {t('contactMethodLabel')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['whatsapp', 'email', 'call'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setContactMethod(method)}
                      className={`py-3 px-4 rounded-xl font-medium transition-all ${
                        contactMethod === method
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'bg-[#F9F4E8] text-gray-700 hover:bg-secondary-100'
                      }`}
                    >
                      {t(method as 'whatsapp' | 'email' | 'call')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Teacher Preference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <UserCheck className="w-4 h-4 inline mr-2" />
                  {t('teacherLabel')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['male', 'female', 'no-preference'].map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setTeacherPreference(pref)}
                      className={`py-3 px-4 rounded-xl font-medium transition-all ${
                        teacherPreference === pref
                          ? 'bg-secondary-500 text-white shadow-lg'
                          : 'bg-[#F9F4E8] text-gray-700 hover:bg-secondary-100'
                      }`}
                    >
                      {pref === 'no-preference' ? t('noPreference') : pref === 'male' ? t('male') : t('female')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button - SUPER ATTRACTIVE */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#2B7A78] via-[#D9B574] to-[#2B7A78]"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  style={{
                    backgroundSize: '200% 100%',
                  }}
                />

                {/* Button content */}
                <div className="relative flex items-center justify-center gap-3 py-6 px-8 text-white font-bold text-lg rounded-2xl shadow-2xl">
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t('sending')}</span>
                    </>
                  ) : (
                    <>
                      <Gift className="w-6 h-6" />
                      <span>{t('submit')}</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-6 h-6" />
                      </motion.div>
                    </>
                  )}
                </div>

                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ['-200%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />
              </motion.button>

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{t('features.noCreditCard')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{t('features.instantConfirmation')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{t('features.free')}</span>
                </div>
              </div>
            </form>
          )}
        </motion.div>

        {/* Success Image */}
        <motion.div
          className="mt-16 relative h-64 rounded-3xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Image
            src="/trial-success.png"
            alt={t('successAlt')}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">{t('successTitle')}</h3>
              <p className="text-lg">{t('successDescription')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
    </div>
  );
}
