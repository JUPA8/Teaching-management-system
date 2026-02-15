'use client';

import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Heart, Send } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const t = useTranslations('footer');
  const common = useTranslations('common');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const quickLinks = [
    { href: '/', label: common('home') },
    { href: '/courses/quran-kids', label: common('quranKids') },
    { href: '/courses/quran-adults', label: common('quranAdults') },
    { href: '/teachers', label: common('teachers') },
    { href: '/videos', label: common('videos') },
    { href: '/pricing', label: common('pricing') },
  ];

  const supportLinks = [
    { href: '/faq', label: common('faq') },
    { href: '/contact', label: common('contact') },
    { href: '/about', label: common('about') },
  ];

  const legalLinks = [
    { href: '/privacy', label: common('privacy') },
    { href: '/terms', label: common('terms') },
    { href: '/imprint', label: common('imprint') },
  ];

  // Custom X (Twitter) icon component
  const XIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

  const socialLinks = [
    { href: '#', icon: Facebook, label: 'Facebook' },
    { href: '#', icon: Instagram, label: 'Instagram' },
    { href: '#', icon: Youtube, label: 'YouTube' },
    { href: '#', icon: XIcon, label: 'X' },
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
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#2A2A2A] via-[#1F2937] to-[#1A1A1A]">
      {/* Islamic Decorative Border at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2B7A78] via-[#D9B574] to-[#2B7A78]" />

      {/* Background Islamic Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M50 10 L60 30 L50 50 L40 30 Z" fill="#D9B574" />
              <circle cx="20" cy="20" r="3" fill="#E3C897" />
              <circle cx="80" cy="80" r="3" fill="#E3C897" />
              <path d="M30 60 Q35 65 30 70" stroke="#D9B574" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-pattern)" />
        </svg>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#2B7A78] opacity-5 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-[#D9B574] opacity-5 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
      />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* About Section - Logo & Contact */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            {/* Logo */}
            <Link href="/" className="inline-block mb-6">
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring' as const, stiffness: 300 }}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2B7A78] to-[#236260] flex items-center justify-center shadow-lg">
                  <Image
                    src="/salam-institute-logo.png"
                    alt="Salam Institute"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-[#D9B574] font-serif">
                    Salam Institute
                  </span>
                  <span className="text-sm text-[#E3C897]">معهد سلام</span>
                </div>
              </motion.div>
            </Link>

            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              {t('description')}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {[
                { href: 'mailto:info@salaminstitute.com', icon: Mail, text: 'info@salaminstitute.com' },
                { href: 'tel:+4912345678', icon: Phone, text: '+49 123 456 78' },
                { href: '#', icon: MapPin, text: 'Berlin, Germany' },
              ].map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 text-gray-400 hover:text-[#C9A24D] transition-all group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-9 h-9 rounded-lg bg-[#3B6F5F]/20 group-hover:bg-[#C9A24D]/20 flex items-center justify-center transition-all">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{item.text}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold text-lg mb-6 font-serif flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-[#C9A24D] to-[#D4AF6B] rounded-full" />
              {t('quickLinks')}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#C9A24D] text-sm transition-all flex items-center gap-2 group"
                  >
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-[#C9A24D]"
                      whileHover={{ scale: 1.5 }}
                    />
                    <motion.span whileHover={{ x: 3 }}>{link.label}</motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support & Legal */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold text-lg mb-6 font-serif flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-[#C9A24D] to-[#D4AF6B] rounded-full" />
              {t('support')}
            </h3>
            <ul className="space-y-3 mb-8">
              {supportLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#C9A24D] text-sm transition-all flex items-center gap-2 group"
                  >
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-[#C9A24D]"
                      whileHover={{ scale: 1.5 }}
                    />
                    <motion.span whileHover={{ x: 3 }}>{link.label}</motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>

            <h3 className="text-white font-bold text-lg mb-6 font-serif flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-[#C9A24D] to-[#D4AF6B] rounded-full" />
              {t('legal')}
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#C9A24D] text-sm transition-all flex items-center gap-2 group"
                  >
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-[#C9A24D]"
                      whileHover={{ scale: 1.5 }}
                    />
                    <motion.span whileHover={{ x: 3 }}>{link.label}</motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold text-lg mb-6 font-serif flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-[#C9A24D] to-[#D4AF6B] rounded-full" />
              {t('newsletter')}
            </h3>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              {t('newsletterText')}
            </p>
            
            <form className="space-y-3 mb-6">
              <input
                type="email"
                placeholder={t('emailPlaceholder')}
                className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#C9A24D] focus:border-[#C9A24D] outline-none transition-all"
              />
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-[#3B6F5F] to-[#2F5F54] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg"
                whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(201, 162, 77, 0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                <Send className="w-4 h-4" />
                {t('subscribe')}
              </motion.button>
            </form>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-[#3B6F5F]/20 hover:bg-gradient-to-br hover:from-[#3B6F5F] hover:to-[#C9A24D] flex items-center justify-center text-gray-400 hover:text-white transition-all"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Islamic Divider */}
        <motion.div
          className="flex justify-center my-8"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <svg width="300" height="20" viewBox="0 0 300 20" fill="none">
            <line x1="0" y1="10" x2="120" y2="10" stroke="url(#grad1)" strokeWidth="1" />
            <circle cx="130" cy="10" r="2" fill="#C9A24D" />
            <path d="M150 5 L155 10 L150 15 L145 10 Z" fill="#C9A24D" />
            <circle cx="170" cy="10" r="2" fill="#C9A24D" />
            <line x1="180" y1="10" x2="300" y2="10" stroke="url(#grad2)" strokeWidth="1" />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C9A24D" stopOpacity="0" />
                <stop offset="100%" stopColor="#C9A24D" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C9A24D" stopOpacity="1" />
                <stop offset="100%" stopColor="#C9A24D" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Bottom Copyright */}
        <motion.div
          className="text-center pt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2 flex-wrap">
            <span>© 2024 Salam Institute. {t('copyright')}.</span>
            <span className="flex items-center gap-1">
              {t('madeWith')}
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              </motion.span>
              by Abdelrahman Ahmed
            </span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
