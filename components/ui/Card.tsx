import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
  dark?: boolean;
  glow?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = "", gradient = false, dark = false, glow = false }) => {
  return (
    <div className={`
      relative rounded-2xl overflow-hidden transition-all duration-300
      ${dark ? 'bg-slate-900 text-white border-slate-800' : 'bg-white border-slate-200'}
      border shadow-sm hover:shadow-lg
      ${gradient ? 'bg-gradient-to-br from-[#E56334] to-[#DE3078] text-white border-none' : ''}
      ${glow ? 'shadow-lg shadow-[#E56334]/20' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;