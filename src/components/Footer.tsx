'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Heart, Send } from 'lucide-react';
import { IslamicBorder } from './decorative';

export default function Footer() {
  const t = useTranslations('footer');
  const common = useTranslations('common');

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
    <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #2C3E50 0%, #1a252f 100%)' }}>
      {/* Decorative Islamic Border at top */}
      <div className="absolute top-0 left-0 right-0">
        <IslamicBorder className="w-full h-8" color="#C19A6B" />
      </div>
      
      {/* Background Decorations */}
      <motion.div
        className="absolute top-0 start-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ background: 'rgba(59, 111, 95, 0.08)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 end-1/4 w-72 h-72 rounded-full blur-3xl"
        style={{ background: 'rgba(193, 154, 107, 0.08)' }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.08, 0.05] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
      />

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10 text-gray-300">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* About Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <motion.div whileHover={{ scale: 1.02 }}>
              <Link href="/" className="flex items-center gap-3 mb-4">
                <motion.img
                  src="/salam-logo-new.png"
                  alt="Salam Institute"
                  className="w-14 h-14 object-contain"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="flex flex-col">
                  <span className="text-lg font-bold font-serif" style={{ color: '#C19A6B' }}>
                    Salam Institute
                  </span>
                  <span className="text-xs font-arabic" style={{ color: '#D4AF37' }}>معهد سلام</span>
                </div>
              </Link>
            </motion.div>
            <p className="text-gray-400 text-sm mb-6">{t('description')}</p>

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
                  className="flex items-center gap-2 text-sm transition-colors group"
                  style={{ color: '#9CA3AF' }}
                  whileHover={{ x: 5, color: '#C19A6B' }}
                >
                  <motion.div
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    style={{ background: 'rgba(59, 111, 95, 0.2)' }}
                    whileHover={{ scale: 1.1, background: 'rgba(193, 154, 107, 0.3)' }}
                  >
                    <item.icon className="w-4 h-4" />
                  </motion.div>
                  {item.text}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2 font-serif">
              <span className="w-8 h-0.5" style={{ background: 'linear-gradient(to right, #3B6F5F, #C19A6B)' }}></span>
              {t('quickLinks')}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <motion.div whileHover={{ x: 5 }}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors flex items-center gap-2"
                      style={{ color: '#9CA3AF' }}
                    >
                      <motion.span 
                        className="w-1.5 h-1.5 rounded-full" 
                        style={{ background: '#4B5563' }}
                        whileHover={{ background: '#C19A6B' }}
                      ></motion.span>
                      <motion.span whileHover={{ color: '#C19A6B' }}>{link.label}</motion.span>
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support & Legal */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2 font-serif">
              <span className="w-8 h-0.5" style={{ background: 'linear-gradient(to right, #3B6F5F, #C19A6B)' }}></span>
              {t('support')}
            </h3>
            <ul className="space-y-2 mb-6">
              {supportLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <motion.div whileHover={{ x: 5 }}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>

            <h3 className="text-white font-semibold mb-4 flex items-center gap-2 font-serif">
              <span className="w-8 h-0.5" style={{ background: 'linear-gradient(to right, #3B6F5F, #C19A6B)' }}></span>
              {t('legal')}
            </h3>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <motion.div whileHover={{ x: 5 }}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2 font-serif">
              <span className="w-8 h-0.5" style={{ background: 'linear-gradient(to right, #3B6F5F, #C19A6B)' }}></span>
              {t('newsletter')}
            </h3>
            <p className="text-sm text-gray-400 mb-4">{t('newsletterText')}</p>
            <form className="space-y-3">
              <motion.div whileFocus={{ scale: 1.02 }}>
                <input
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </motion.div>
              <motion.button
                type="submit"
                className="w-full text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(to right, #3B6F5F, #2F5F54)' }}
                whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(193, 154, 107, 0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                <Send className="w-4 h-4" />
                {t('subscribe')}
              </motion.button>
            </form>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: 'rgba(59, 111, 95, 0.3)' }}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    background: 'linear-gradient(135deg, #3B6F5F, #C19A6B)'
                  }}
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
      </div>

      {/* Bottom Bar */}
      <motion.div
        className="border-t border-gray-800/50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.p
            className="text-sm text-center text-gray-500 flex items-center justify-center gap-1"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('copyright')} Made with{' '}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500 inline" />
            </motion.span>{' '}
            by Abdelrahman Ahmed
          </motion.p>
        </div>
      </motion.div>
    </footer>
  );
}
