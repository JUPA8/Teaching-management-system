'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  MessageCircle,
  CheckCircle,
  Headphones,
  Globe,
  Calendar,
  Star,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import IslamicDivider from '@/components/IslamicDivider';

export default function ContactPage() {
  const t = useTranslations('common');
  const contact = useTranslations('contact');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: contact('info.email.title'),
      info: 'info@salaminstitute.com',
      description: contact('info.email.description'),
      gradient: 'from-[#2B7A78] to-[#236260]',
    },
    {
      icon: Phone,
      title: contact('info.phone.title'),
      info: '+49 123 456 78',
      description: contact('info.phone.description'),
      gradient: 'from-[#D9B574] to-[#C9A551]',
    },
    {
      icon: MessageCircle,
      title: contact('whatsapp.title'),
      info: '+49 123 456 78',
      description: contact('whatsapp.description'),
      gradient: 'from-[#25D366] to-[#128C7E]',
      link: 'https://wa.me/49123456789',
    },
    {
      icon: MapPin,
      title: contact('info.location.title'),
      info: 'Berlin, Germany',
      description: contact('info.location.description'),
      gradient: 'from-[#2F6F68] to-[#267169]',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/contact-hero-bg.png"
            alt={contact('heroAlt')}
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2B7A78]/95 via-[#2B7A78]/85 to-[#2B7A78]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Animated Pattern */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10 L40 25 L35 40 L25 40 L20 25 Z' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-3 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/30 flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-[#D9B574]" />
                  <span className="text-white font-bold text-sm">{contact('badge24h')}</span>
                </div>
                <div className="px-5 py-2.5 bg-[#D9B574]/20 backdrop-blur-md rounded-full border border-[#D9B574]/50 flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#D9B574]" fill="#D9B574" />
                  <span className="text-[#D9B574] font-bold text-sm">{contact('badgeQuick')}</span>
                </div>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {contact('title')}
              </motion.h1>

              {/* Decorative Line */}
              <motion.div
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="h-1 w-24 bg-[#D9B574]" />
                <MessageSquare className="w-6 h-6 text-[#D9B574]" />
                <div className="h-1 w-24 bg-[#D9B574]" />
              </motion.div>

              {/* Subtitle */}
              <motion.p
                className="text-xl md:text-2xl text-white/90 leading-relaxed mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {contact('subtitle')}
              </motion.p>

              {/* Quick Links */}
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {[
                  { icon: Mail, text: contact('quickLinks.email'), link: '#form' },
                  { icon: Phone, text: contact('quickLinks.call'), link: '#info' },
                  { icon: Calendar, text: contact('quickLinks.book'), link: '#form' },
                ].map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.link}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/30 hover:bg-white/20 transition-all"
                    whileHover={{ scale: 1.05 }}
                  >
                    <item.icon className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">{item.text}</span>
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards with Images */}
      <section className="py-24 bg-gradient-to-b from-[#F5F0E8] to-white" id="info">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#2B7A78]/10 to-[#D9B574]/10 rounded-full mb-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring' as const, stiffness: 200 }}
            >
              <Globe className="w-5 h-5 text-[#2B7A78]" />
              <span className="text-sm font-bold text-gray-700">{contact('sectionBadge')}</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {contact('sectionTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {contact('sectionDescription')}
            </p>
          </motion.div>

          {/* Grid with Images */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((item, index) => {
              const CardWrapper = item.link ? 'a' : 'div';
              const cardProps = item.link 
                ? { href: item.link, target: '_blank', rel: 'noopener noreferrer' }
                : {};
              
              return (
                <motion.div
                  key={index}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <CardWrapper {...cardProps} className={item.link ? 'block' : ''}>
                    {/* Card Content */}
                    <div className="p-8 text-center relative z-10">
                      {/* Icon */}
                      <motion.div
                        className={`w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg`}
                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <item.icon className="w-10 h-10 text-white" strokeWidth={2} />
                      </motion.div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {item.title}
                      </h3>

                      {/* Divider */}
                      <div className="h-1 w-16 bg-gradient-to-r from-[#2B7A78] to-[#D9B574] mx-auto mb-3" />

                      {/* Info */}
                      <p className="text-[#2B7A78] font-bold mb-3 text-base break-all px-2">
                        {item.info}
                      </p>

                      {/* Description */}
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.description}
                      </p>

                      {/* WhatsApp CTA */}
                      {item.link && (
                        <motion.div
                          className="mt-4 inline-flex items-center gap-2 text-[#25D366] font-semibold text-sm"
                          whileHover={{ gap: '12px' }}
                        >
                          <span>{contact('contactNow')}</span>
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      )}
                    </div>

                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  </CardWrapper>
                </motion.div>
              );
            })}
          </div>

          {/* Support Image Section */}
          <motion.div
            className="mt-20 grid lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Image */}
            <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/contact-support.png"
                alt={contact('supportImageAlt')}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B7A78]/80 to-transparent" />
              
              {/* Floating Badge */}
              <motion.div
                className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-lg rounded-2xl p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2B7A78] to-[#D9B574] flex items-center justify-center">
                    <Headphones className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-gray-900">{contact('supportBadgeTitle')}</div>
                    <div className="text-sm text-gray-600">{contact('supportBadgeSubtitle')}</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {contact('supportTitle')}
              </h3>
              <div className="h-1 w-24 bg-gradient-to-r from-[#2B7A78] to-[#D9B574] mb-6" />
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {contact('supportDescription')}
              </p>

              <div className="space-y-4">
                {[
                  contact('supportFeatures.response'),
                  contact('supportFeatures.multilang'),
                  contact('supportFeatures.expert'),
                  contact('supportFeatures.technical'),
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#2B7A78]/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-[#2B7A78]" />
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <IslamicDivider />

      {/* Contact Form with Side Image */}
      <section className="py-24 bg-white" id="form">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid lg:grid-cols-2 gap-12 items-start"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Left: Images & Info */}
            <div className="space-y-8">
              {/* Main Image */}
              <motion.div
                className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src="/contact-communication.png"
                  alt={contact('communicationAlt')}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#D9B574]/90 to-transparent" />
                
                {/* Overlay Content */}
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="text-3xl font-bold text-white mb-3">
                    {contact('communicationTitle')}
                  </h3>
                  <p className="text-white/90 text-lg">
                    {contact('communicationDescription')}
                  </p>
                </div>
              </motion.div>

              {/* Small Image Card */}
              <motion.div
                className="relative h-[250px] rounded-3xl overflow-hidden shadow-xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src="/contact-global.png"
                  alt={contact('globalAlt')}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B7A78]/90 to-transparent" />
                
                {/* Stats Overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { num: '15+', label: contact('globalStats.countries') },
                      { num: '24/7', label: contact('globalStats.support') },
                      { num: '<2h', label: contact('globalStats.response') },
                    ].map((stat, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">{stat.num}</div>
                        <div className="text-xs text-white/80">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Form */}
            <div className="lg:sticky lg:top-8">
              <motion.div
                className="bg-gradient-to-br from-[#F5F0E8] to-white rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-[#D9B574]/20"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      className="text-center py-16"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring' as const, stiffness: 200 }}
                    >
                      <motion.div
                        className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 mx-auto mb-6 flex items-center justify-center"
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 360],
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <CheckCircle className="w-12 h-12 text-white" />
                      </motion.div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">
                        {contact('success.title')}
                      </h3>
                      <p className="text-xl text-gray-600 mb-8">
                        {contact('success.description')}
                      </p>
                      <div className="flex items-center justify-center gap-2 text-[#2B7A78]">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-semibold">{contact('success.thankYou')}</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* Form Header */}
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#2B7A78]/10 rounded-full mb-4">
                          <MessageSquare className="w-5 h-5 text-[#2B7A78]" />
                          <span className="text-sm font-bold text-[#2B7A78]">{contact('formBadge')}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                          {contact('formTitle')}
                        </h2>
                      </div>

                      {/* Form Fields */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            {contact('form.name')} *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78] focus:border-[#2B7A78] outline-none transition-all text-gray-900"
                            placeholder={contact('form.placeholder.name')}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            {contact('form.email')} *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78] focus:border-[#2B7A78] outline-none transition-all text-gray-900"
                            placeholder={contact('form.placeholder.email')}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          {contact('form.subject')} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78] focus:border-[#2B7A78] outline-none transition-all text-gray-900"
                          placeholder={contact('form.placeholder.subject')}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          {contact('form.message')} *
                        </label>
                        <textarea
                          required
                          rows={6}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78] focus:border-[#2B7A78] outline-none transition-all resize-none text-gray-900"
                          placeholder={contact('form.placeholder.message')}
                        />
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        className="group w-full bg-gradient-to-r from-[#2B7A78] to-[#1a5856] hover:from-[#236260] hover:to-[#1a5856] text-white font-bold py-5 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 text-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Send className="w-6 h-6" />
                        {contact('form.send')}
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-6 h-6" />
                        </motion.div>
                      </motion.button>

                      {/* Privacy Note */}
                      <p className="text-center text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        {contact('privacyNote')}
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
