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
    <div className="flex items-start md:items-center gap-3 md:gap-4 mb-5 md:mb-8">
      <div className="p-2 md:p-0 bg-slate-50 md:bg-transparent rounded-xl md:rounded-none shrink-0">
        <Icon size={24} className={`md:w-8 md:h-8 ${colors[color]} drop-shadow-sm`} strokeWidth={2.5} />
      </div>
      <div>
        <h3 className="font-bold text-slate-900 text-lg md:text-2xl leading-tight md:leading-tight">{title}</h3>
        {subtitle && <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

export default SectionTitle;