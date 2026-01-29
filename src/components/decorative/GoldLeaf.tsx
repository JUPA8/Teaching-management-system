'use client';

interface GoldLeafProps {
  className?: string;
  side?: 'left' | 'right';
}

export default function GoldLeaf({ className = '', side = 'left' }: GoldLeafProps) {
  const transform = side === 'right' ? 'scale(-1, 1)' : '';
  
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform }}
    >
      {/* Decorative gold leaf pattern */}
      <path
        d="M 10 40 Q 20 20, 40 10 Q 50 5, 60 10 Q 70 15, 70 25 Q 70 40, 50 55 Q 30 70, 10 60 Q 5 55, 10 40 Z"
        fill="#D4AF37"
        opacity="0.3"
      />
      <path
        d="M 15 40 Q 25 25, 40 18 Q 48 15, 55 20 Q 60 25, 60 33 Q 60 42, 48 52 Q 35 62, 20 55 Q 15 50, 15 40 Z"
        fill="#C19A6B"
        opacity="0.4"
      />
      {/* Leaf veins */}
      <path
        d="M 15 40 Q 30 35, 45 30 M 20 45 Q 32 42, 44 40 M 18 50 Q 28 48, 38 47"
        stroke="#B8956A"
        strokeWidth="1"
        opacity="0.5"
      />
    </svg>
  );
}
