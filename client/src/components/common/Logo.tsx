import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  textClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  textClassName = '',
}) => {
  const containerSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-10 h-10 rounded-xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* COMPETENCY AI Mark */}
      <div
        className={`${containerSizes[size]} bg-gradient-to-tr from-brand-600 to-ai-500 flex items-center justify-center text-white shadow-sm transition-transform`}
      >
        <svg
          className={`${iconSizes[size]}`}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Competency "C" Arc */}
          <path
            d="M68 28C64 24 57 22 50 22C34.5 22 22 34.5 22 50C22 65.5 34.5 78 50 78C58 78 65 75 69 70"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Ascending Competency Milestone Bars */}
          <path d="M42 58L42 50" stroke="white" strokeWidth="6.5" strokeLinecap="round" />
          <path d="M52 58L52 42" stroke="white" strokeWidth="6.5" strokeLinecap="round" />
          <path d="M62 58L62 35" stroke="white" strokeWidth="6.5" strokeLinecap="round" />
          {/* AI Neural Nodes */}
          <circle cx="68" cy="28" r="4.5" fill="#A5F3FC" />
          <circle cx="62" cy="35" r="4" fill="#67E8F9" />
          <circle cx="22" cy="50" r="3.5" fill="#BFDBFE" />
        </svg>
      </div>

      {showText && (
        <span
          className={`font-extrabold ${textSizes[size]} tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent ${textClassName}`}
        >
          COMPETENCY <span className="text-brand-600">AI</span>
        </span>
      )}
    </div>
  );
};
