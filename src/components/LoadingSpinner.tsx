'use client';

import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  text?: string;
}

export default function LoadingSpinner({ fullScreen = false, text = 'Loading...' }: LoadingSpinnerProps) {
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated Logo */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 w-20 h-20 rounded-full border-4 border-primary-200"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        {/* Spinning Arc */}
        <motion.div
          className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-primary-600 border-r-secondary-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />

        {/* Center Icon */}
        <motion.div
          className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center"
          animate={{ scale: [1, 0.9, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <BookOpen className="w-8 h-8 text-white" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Loading Text */}
      <motion.div
        className="flex items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-gray-600 font-medium">{text}</span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
        >
          .
        </motion.span>
      </motion.div>
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-50 via-primary-50/30 to-secondary-50/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Background Decorations */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />

        {spinnerContent}
      </motion.div>
    );
  }

  return spinnerContent;
}

// Simple inline spinner for buttons
export function ButtonSpinner() {
  return (
    <motion.div
      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
}

// Skeleton loader for content
export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`bg-gray-200 rounded-lg ${className}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );
}

// Card skeleton
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <SkeletonLoader className="w-full h-40 mb-4" />
      <SkeletonLoader className="w-3/4 h-6 mb-2" />
      <SkeletonLoader className="w-1/2 h-4 mb-4" />
      <div className="flex gap-2">
        <SkeletonLoader className="w-20 h-8" />
        <SkeletonLoader className="w-20 h-8" />
      </div>
    </div>
  );
}
