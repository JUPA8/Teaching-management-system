'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  ChevronDown,
  BookOpen,
  CreditCard,
  Clock,
  Users,
  GraduationCap,
  Headphones,
  ArrowRight,
  Search,
} from 'lucide-react';

export default function FAQPage() {
  const faqT = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'general', label: faqT('categories.general'), icon: HelpCircle },
    { id: 'courses', label: faqT('categories.courses'), icon: BookOpen },
    { id: 'pricing', label: faqT('categories.pricing'), icon: CreditCard },
    { id: 'schedule', label: faqT('categories.schedule'), icon: Clock },
    { id: 'teachers', label: faqT('categories.teachers'), icon: GraduationCap },
    { id: 'technical', label: faqT('categories.technical'), icon: Headphones },
  ];

  const faqs: Record<string, Array<{ question: string; answer: string }>> = {
    general: [
      {
        question: faqT('general.q1'),
        answer: faqT('general.a1'),
      },
      {
        question: faqT('general.q2'),
        answer: faqT('general.a2'),
      },
      {
        question: faqT('general.q3'),
        answer: faqT('general.a3'),
      },
      {
        question: faqT('general.q4'),
        answer: faqT('general.a4'),
      },
    ],
    courses: [
      {
        question: faqT('courses.q1'),
        answer: faqT('courses.a1'),
      },
      {
        question: faqT('courses.q2'),
        answer: faqT('courses.a2'),
      },
      {
        question: faqT('courses.q3'),
        answer: faqT('courses.a3'),
      },
      {
        question: faqT('courses.q4'),
        answer: faqT('courses.a4'),
      },
    ],
    pricing: [
      {
        question: faqT('pricing.q1'),
        answer: faqT('pricing.a1'),
      },
      {
        question: faqT('pricing.q2'),
        answer: faqT('pricing.a2'),
      },
      {
        question: faqT('pricing.q3'),
        answer: faqT('pricing.a3'),
      },
      {
        question: faqT('pricing.q4'),
        answer: faqT('pricing.a4'),
      },
    ],
    schedule: [
      {
        question: faqT('schedule.q1'),
        answer: faqT('schedule.a1'),
      },
      {
        question: faqT('schedule.q2'),
        answer: faqT('schedule.a2'),
      },
      {
        question: faqT('schedule.q3'),
        answer: faqT('schedule.a3'),
      },
    ],
    teachers: [
      {
        question: faqT('teachers.q1'),
        answer: faqT('teachers.a1'),
      },
    ],
    technical: [
      {
        question: faqT('technical.q1'),
        answer: faqT('technical.a1'),
      },
    ],
  };

  const currentFaqs = faqs[activeCategory] || [];
  const filteredFaqs = searchQuery
    ? currentFaqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentFaqs;

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
    <div className="py-12 md:py-20 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' as const, stiffness: 200, delay: 0.2 }}
          >
            <span className="px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 rounded-full text-sm font-medium inline-flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Help Center
            </span>
          </motion.div>
          <motion.h1
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {faqT('title')}
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {faqT('subtitle')}
          </motion.p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="max-w-xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <motion.input
              type="text"
              placeholder={faqT('search')}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              whileFocus={{ scale: 1.01, boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)' }}
            />
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setOpenIndex(0);
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05, type: 'spring' as const }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md border border-gray-100'
              }`}
            >
              <category.icon className="w-4 h-4" />
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* FAQ List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  <motion.button
                    className="w-full p-5 flex items-center gap-4 text-left"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
                  >
                    <motion.div
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center flex-shrink-0"
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                    >
                      <HelpCircle className="w-5 h-5 text-primary-600" />
                    </motion.div>
                    <span className="font-semibold text-gray-900 flex-1 pr-4">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </motion.div>
                  </motion.button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-gray-600 pl-[4.5rem]">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{faqT('noMatching')}</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* CTA Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 rounded-3xl p-8 md:p-12 text-center text-white overflow-hidden"
            whileHover={{ scale: 1.01 }}
          >
            {/* Decorative Elements */}
            <motion.div
              className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 translate-x-1/2"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />

            <div className="relative z-10">
              <motion.div
                className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Users className="w-8 h-8" />
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {faqT('stillQuestions')}
              </h2>
              <p className="text-primary-100 mb-8 max-w-xl mx-auto">
                {faqT('stillQuestionsDesc')}
              </p>
              <motion.div
                className="flex flex-wrap justify-center gap-4"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:shadow-xl transition-shadow"
                  >
                    {faqT('contactSupport')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
