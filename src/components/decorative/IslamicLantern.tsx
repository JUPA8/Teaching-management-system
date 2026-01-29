'use client';

interface IslamicLanternProps {
  className?: string;
  color?: string;
}

export default function IslamicLantern({ 
  className = '', 
  color = '#D4AF37' 
}: IslamicLanternProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hanging chain */}
      <line x1="30" y1="0" x2="30" y2="15" stroke={color} strokeWidth="1" />
      
      {/* Top cap */}
      <path
        d="M 25 15 L 20 20 L 40 20 L 35 15 Z"
        fill={color}
        opacity="0.8"
      />
      
      {/* Main lantern body */}
      <path
        d="M 20 20 Q 15 30, 15 45 Q 15 60, 20 70 L 40 70 Q 45 60, 45 45 Q 45 30, 40 20 Z"
        fill={color}
        opacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      
      {/* Decorative glass panels */}
      <path
        d="M 22 25 Q 20 35, 20 45 Q 20 55, 22 65 L 28 65 L 28 25 Z"
        fill={color}
        opacity="0.5"
      />
      <path
        d="M 32 25 L 32 65 L 38 65 Q 40 55, 40 45 Q 40 35, 38 25 Z"
        fill={color}
        opacity="0.5"
      />
      
      {/* Bottom cap */}
      <path
        d="M 20 70 L 23 75 L 37 75 L 40 70 Z"
        fill={color}
        opacity="0.8"
      />
      
      {/* Bottom ornament */}
      <circle cx="30" cy="78" r="3" fill={color} />
      <path
        d="M 28 81 L 30 90 L 32 81 Z"
        fill={color}
        opacity="0.6"
      />
    </svg>
  );
}
