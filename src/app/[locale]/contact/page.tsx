'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Headphones,
  CheckCircle,
} from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('common');
  const contact = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: contact('info.email.title'),
      info: contact('info.email.text'),
      description: contact('info.email.description'),
      color: 'from-primary-500 to-primary-600',
    },
    {
      icon: Phone,
      title: contact('info.phone.title'),
      info: contact('info.phone.text'),
      description: contact('info.phone.description'),
      color: 'from-secondary-500 to-secondary-600',
    },
    {
      icon: MapPin,
      title: contact('info.location.title'),
      info: contact('info.location.text'),
      description: contact('info.location.description'),
      color: 'from-gold-500 to-gold-600',
    },
    {
      icon: Clock,
      title: contact('info.hours.title'),
      info: contact('info.hours.text'),
      description: contact('info.hours.description'),
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const faqs = [
    { q: contact('faq.q1'), a: contact('faq.a1') },
    { q: contact('faq.q2'), a: contact('faq.a2') },
    { q: contact('faq.q3'), a: contact('faq.a3') },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="py-12 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <span className="px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 rounded-full text-sm font-medium inline-flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {contact('title')}
            </span>
          </motion.div>
          <motion.h1
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {contact('heading')}
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {contact('subtitle')}
          </motion.p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {contactInfo.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)' }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center"
            >
              <motion.div
                className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <item.icon className="w-7 h-7 text-white" />
              </motion.div>
              <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-primary-600 font-medium mb-1">{item.info}</p>
              <p className="text-sm text-gray-500">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Send className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Send us a Message</h2>
                <p className="text-gray-500 text-sm">We'd love to hear from you</p>
              </div>
            </motion.div>

            {isSubmitted ? (
              <motion.div
                className="flex flex-col items-center justify-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{contact('success.title')}</h3>
                <p className="text-gray-600">{contact('success.description')}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="label">{contact('form.name')}</label>
                  <motion.input
                    type="text"
                    required
                    className="input-field"
                    placeholder={contact('form.placeholder.name')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    whileFocus={{ scale: 1.01, boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)' }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <label className="label">{contact('form.email')}</label>
                  <motion.input
                    type="email"
                    required
                    className="input-field"
                    placeholder={contact('form.placeholder.email')}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    whileFocus={{ scale: 1.01, boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)' }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="label">{contact('form.subject')}</label>
                  <motion.select
                    className="input-field"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    whileFocus={{ scale: 1.01, boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)' }}
                  >
                    <option value="">{contact('form.placeholder.subject')}</option>
                    <option value="courses">{contact('form.options.courses')}</option>
                    <option value="pricing">{contact('form.options.pricing')}</option>
                    <option value="technical">{contact('form.options.technical')}</option>
                    <option value="teachers">{contact('form.options.teachers')}</option>
                    <option value="partnership">{contact('form.options.partnership')}</option>
                    <option value="other">{contact('form.options.other')}</option>
                  </motion.select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <label className="label">{contact('form.message')}</label>
                  <motion.textarea
                    rows={5}
                    required
                    className="input-field resize-none"
                    placeholder={contact('form.placeholder.message')}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    whileFocus={{ scale: 1.01, boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)' }}
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-shadow flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Send className="w-5 h-5" />
                  {contact('form.submit')}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Right Side - FAQ & Support */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Quick FAQ */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Answers</h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <p className="font-medium text-gray-900 mb-1">{faq.q}</p>
                    <p className="text-sm text-gray-600">{faq.a}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Support Card */}
            <motion.div
              className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 rounded-2xl p-6 text-white overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              {/* Decorative Elements */}
              <motion.div
                className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              />

              <div className="relative z-10">
                <motion.div
                  className="flex items-center gap-3 mb-4"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Headphones className="w-8 h-8" />
                  <div>
                    <h3 className="font-bold text-lg">Live Support</h3>
                    <p className="text-primary-100 text-sm">Available 24/7</p>
                  </div>
                </motion.div>
                <p className="text-primary-100 mb-4">
                  Need immediate assistance? Our support team is ready to help you with any questions.
                </p>
                <motion.button
                  className="w-full bg-white text-primary-600 font-semibold py-3 rounded-xl hover:bg-primary-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Live Chat
                </motion.button>
              </div>
            </motion.div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {['facebook', 'twitter', 'instagram', 'youtube'].map((social, index) => (
                  <motion.a
                    key={social}
                    href={`https://${social}.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <span className="capitalize text-sm font-medium">{social.charAt(0).toUpperCase()}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
