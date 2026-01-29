'use client';

interface IslamicBorderProps {
  className?: string;
  color?: string;
}

export default function IslamicBorder({ 
  className = '', 
  color = '#C19A6B' 
}: IslamicBorderProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ornate decorative border pattern */}
      <path
        d="M 0 10 L 40 10 M 40 5 L 50 10 L 40 15 M 50 10 L 90 10 M 90 5 L 100 10 L 90 15 M 100 10 L 140 10 M 140 5 L 150 10 L 140 15 M 150 10 L 190 10 M 190 5 L 200 10 L 190 15 M 200 10 L 240 10 M 240 5 L 250 10 L 240 15 M 250 10 L 290 10 M 290 5 L 300 10 L 290 15 M 300 10 L 340 10 M 340 5 L 350 10 L 340 15 M 350 10 L 400 10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Center ornament */}
      <circle cx="200" cy="10" r="6" fill={color} opacity="0.3" />
      <circle cx="200" cy="10" r="3" fill={color} />
    </svg>
  );
}
