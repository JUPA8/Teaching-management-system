'use client';

import { motion } from 'framer-motion';

interface IslamicDividerProps {
  className?: string;
}

export default function IslamicDivider({ className = '' }: IslamicDividerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`flex justify-center items-center py-8 ${className}`}
    >
      <svg
        width="400"
        height="30"
        viewBox="0 0 400 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-md"
      >
        {/* Left decorative line */}
        <motion.line
          x1="0"
          y1="15"
          x2="120"
          y2="15"
          stroke="url(#gradient1)"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        {/* Left small decorative circles */}
        <motion.circle
          cx="130"
          cy="15"
          r="2"
          fill="#C9A24D"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />
        <motion.circle
          cx="140"
          cy="15"
          r="2"
          fill="#C9A24D"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />
        
        {/* Center Islamic ornament */}
        <motion.g
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
        >
          {/* Center diamond shape */}
          <path
            d="M200 5 L210 15 L200 25 L190 15 Z"
            fill="url(#gradient2)"
            stroke="#C9A24D"
            strokeWidth="1"
          />
          
          {/* Inner diamond */}
          <path
            d="M200 10 L205 15 L200 20 L195 15 Z"
            fill="#F9F4E8"
            stroke="#D4AF6B"
            strokeWidth="0.5"
          />
          
          {/* Small decorative dots around center */}
          <circle cx="200" cy="2" r="1.5" fill="#C9A24D" />
          <circle cx="200" cy="28" r="1.5" fill="#C9A24D" />
          <circle cx="183" cy="15" r="1.5" fill="#C9A24D" />
          <circle cx="217" cy="15" r="1.5" fill="#C9A24D" />
          
          {/* Corner accents */}
          <circle cx="186" cy="8" r="1" fill="#D4AF6B" opacity="0.6" />
          <circle cx="214" cy="8" r="1" fill="#D4AF6B" opacity="0.6" />
          <circle cx="186" cy="22" r="1" fill="#D4AF6B" opacity="0.6" />
          <circle cx="214" cy="22" r="1" fill="#D4AF6B" opacity="0.6" />
        </motion.g>
        
        {/* Right small decorative circles */}
        <motion.circle
          cx="260"
          cy="15"
          r="2"
          fill="#C9A24D"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />
        <motion.circle
          cx="270"
          cy="15"
          r="2"
          fill="#C9A24D"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />
        
        {/* Right decorative line */}
        <motion.line
          x1="280"
          y1="15"
          x2="400"
          y2="15"
          stroke="url(#gradient3)"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        {/* Gradients */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A24D" stopOpacity="0" />
            <stop offset="100%" stopColor="#C9A24D" stopOpacity="1" />
          </linearGradient>
          
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF6B" />
            <stop offset="100%" stopColor="#C9A24D" />
          </linearGradient>
          
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A24D" stopOpacity="1" />
            <stop offset="100%" stopColor="#C9A24D" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
