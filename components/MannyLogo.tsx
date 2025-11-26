import React from 'react';

export const MannyLogo: React.FC<{ className?: string, textSize?: string }> = ({ className = "", textSize = "text-3xl" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span 
        className={`font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#E56334] via-[#D14656] to-[#DE3078] ${textSize}`} 
        style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.05em' }}
      >
        manny
      </span>
    </div>
  );
};

export default MannyLogo;