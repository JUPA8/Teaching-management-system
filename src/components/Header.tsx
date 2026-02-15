'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, BookOpen, Users, MessageSquare, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations('common');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const courseLinks = [
    { href: '/courses/quran-adults', label: t('quranAdults'), icon: '📖' },
    { href: '/courses/quran-kids', label: t('quranKids'), icon: '👶' },
    { href: '/courses/arabic', label: t('arabic'), icon: '🔤' },
    { href: '/courses/islamic-studies', label: t('islamicStudies'), icon: '🕌' },
  ];

  const header = useTranslations('header');
  
  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/teachers', label: t('teachers') },
    { href: '/videos', label: t('videos') },
    { href: '/pricing', label: t('pricing') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 300, damping: 25 },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3, staggerChildren: 0.05 },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 },
    },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        isScrolled
          ? 'backdrop-blur-md shadow-lg border-b border-secondary-200'
          : 'shadow-sm border-b border-secondary-100'
      )}
      style={{
        background: isScrolled
          ? 'rgba(250, 246, 241, 0.95)'
          : 'rgba(250, 246, 241, 1)'
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring' as const, stiffness: 100, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/" className="flex items-center gap-3">
              <motion.img
                src="/salam-institute-logo.png"
                alt="Salam Institute"
                className="w-12 h-12 object-contain"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="hidden sm:flex flex-col"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-lg font-bold text-primary-500 font-serif">Salam Institute</span>
                <span className="text-xs text-secondary-500 font-arabic">معهد سلام</span>
              </motion.div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 ml-20">
            {/* Courses Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setIsCoursesOpen(!isCoursesOpen)}
                className="flex items-center gap-1 text-charcoal hover:text-primary-500 font-medium transition-colors whitespace-nowrap"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('courses')}
                <motion.div
                  animate={{ rotate: isCoursesOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isCoursesOpen && (
                  <motion.div
                    className="absolute top-full start-0 mt-2 w-64 rounded-xl shadow-xl border-2 border-secondary-200 py-2 overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #FAF6F1 0%, #F5EFE7 100%)' }}
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {courseLinks.map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          className="flex items-center gap-3 px-4 py-3 text-charcoal hover:bg-secondary-50 hover:text-primary-500 transition-colors rounded-lg mx-1"
                          onClick={() => setIsCoursesOpen(false)}
                        >
                          <span className="text-xl">{link.icon}</span>
                          <span className="font-medium">{link.label}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.slice(1).map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <Link
                  href={link.href}
                  className="text-charcoal hover:text-primary-500 font-medium transition-colors relative group px-2 whitespace-nowrap"
                >
                  {link.label}
                  <span className="absolute -bottom-1 start-0 w-0 h-0.5 bg-secondary-500 group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            <motion.div
              className="hidden md:flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/login"
                  className="text-charcoal hover:text-primary-500 font-medium transition-colors whitespace-nowrap px-2"
                >
                  {t('login')}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/register"
                  className="bg-primary-500 hover:bg-primary-600 text-white font-medium text-sm py-2.5 px-5 rounded-xl shadow-md hover:shadow-lg transition-all whitespace-nowrap inline-flex items-center justify-center"
                >
                  {t('register')}
                </Link>
              </motion.div>
              
              {/* Probestunde Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/probestunde"
                  className="bg-gradient-to-r from-secondary-400 to-secondary-500 hover:from-secondary-500 hover:to-secondary-600 text-white font-semibold text-sm py-2.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all whitespace-nowrap inline-flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  {t('probestunde') || 'Probestunde'}
                </Link>
              </motion.div>
            </motion.div>

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-charcoal hover:text-primary-500 rounded-lg hover:bg-secondary-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden py-4 border-t overflow-hidden"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <nav className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <motion.div key={link.href} variants={mobileItemVariants}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600 rounded-xl transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div variants={mobileItemVariants} className="px-4 py-2">
                  <p className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary-600" />
                    {t('courses')}
                  </p>
                  <div className="pl-6 flex flex-col gap-1">
                    {courseLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-2 py-2 text-gray-600 hover:text-primary-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span>{link.icon}</span>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  variants={mobileItemVariants}
                  className="flex flex-col gap-3 px-4 pt-4 border-t mt-2"
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/login"
                      className="block w-full text-center py-3 border-2 border-primary-600 text-primary-600 font-medium rounded-xl hover:bg-primary-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('login')}
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/register"
                      className="block w-full text-center py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-xl"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('freeTrial')}
                    </Link>
                  </motion.div>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
