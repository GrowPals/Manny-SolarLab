import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionTitleProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
}

const SectionTitle: React.FC<SectionTitleProps> = ({ icon: Icon, title, subtitle, color = 'blue' }) => {
  const colors = {
    blue: 'text-blue-600',
    green: 'text-emerald-600',
    orange: 'text-[#E56334]',
    purple: 'text-purple-600',
    red: 'text-[#D14656]',
  };

  return (
    <div className="flex items-center gap-4 mb-8">
      <Icon size={32} className={`${colors[color]} drop-shadow-sm`} strokeWidth={2} />
      <div>
        <h3 className="font-bold text-slate-900 text-xl leading-tight">{title}</h3>
        {subtitle && <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

export default SectionTitle;