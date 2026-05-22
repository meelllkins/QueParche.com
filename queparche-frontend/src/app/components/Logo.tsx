import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', variant = 'full', size = 'md' }: LogoProps) {
  const sizeClasses = { sm: 'w-32 h-8', md: 'w-48 h-12', lg: 'w-64 h-16' };
  const iconSizeClasses = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' };

  if (variant === 'icon') {
    return (
      <svg viewBox="0 0 100 100" className={`${iconSizeClasses[size]} ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B026FF" />
            <stop offset="50%" stopColor="#FF006E" />
            <stop offset="100%" stopColor="#00F5FF" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="#1A1A1A" stroke="url(#iconGradient)" strokeWidth="3" />
        <path d="M50 25 C35 25 25 35 25 50 C25 65 35 75 50 75 C52 75 54 74.5 56 74 L52 78 L58 76 C68 72 75 62 75 50 C75 35 65 25 50 25Z M50 35 C59 35 65 41 65 50 C65 59 59 65 50 65 C41 65 35 59 35 50 C35 41 41 35 50 35Z" fill="url(#iconGradient)" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 300 80" className={`${sizeClasses[size]} ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B026FF" />
          <stop offset="50%" stopColor="#FF006E" />
          <stop offset="100%" stopColor="#00F5FF" />
        </linearGradient>
        <filter id="neonGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g transform="translate(10, 15)">
        <circle cx="25" cy="25" r="24" fill="#1A1A1A" stroke="url(#logoGradient)" strokeWidth="3" />
        <path d="M25 10 C17 10 10 17 10 25 C10 33 17 40 25 40 C26 40 27 39.8 28 39.5 L26 42 L29 41 C35 38 40 32 40 25 C40 17 33 10 25 10Z M25 16 C30 16 34 20 34 25 C34 30 30 34 25 34 C20 34 16 30 16 25 C16 20 20 16 25 16Z" fill="url(#logoGradient)" />
      </g>
      <g filter="url(#neonGlow)">
        <text x="65" y="50" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="36" fill="url(#logoGradient)" letterSpacing="-1">
          Que<tspan fill="#00F5FF">Parche</tspan>
        </text>
      </g>
      <line x1="65" y1="58" x2="280" y2="58" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
