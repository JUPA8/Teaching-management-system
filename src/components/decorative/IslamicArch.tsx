'use client';

interface IslamicArchProps {
  className?: string;
  fillColor?: string;
  strokeColor?: string;
}

export default function IslamicArch({ 
  className = '', 
  fillColor = 'none',
  strokeColor = '#3B6F5F' 
}: IslamicArchProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 120"
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main arch shape */}
      <path
        d="M 10 120 L 10 60 Q 10 20, 50 20 Q 70 20, 85 10 Q 100 0, 115 10 Q 130 20, 150 20 Q 190 20, 190 60 L 190 120"
        stroke={strokeColor}
        strokeWidth="3"
        fill={fillColor}
      />
      {/* Inner decorative arch */}
      <path
        d="M 20 120 L 20 65 Q 20 30, 55 30 Q 70 30, 85 22 Q 100 14, 115 22 Q 130 30, 145 30 Q 180 30, 180 65 L 180 120"
        stroke={strokeColor}
        strokeWidth="1.5"
        fill={fillColor}
        opacity="0.5"
      />
      {/* Decorative scallops at top */}
      <circle cx="50" cy="25" r="4" fill={strokeColor} opacity="0.3" />
      <circle cx="100" cy="5" r="4" fill={strokeColor} opacity="0.3" />
      <circle cx="150" cy="25" r="4" fill={strokeColor} opacity="0.3" />
    </svg>
  );
}
