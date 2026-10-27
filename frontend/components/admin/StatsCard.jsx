'use client';

import { ArrowUpRight } from 'lucide-react';

export default function StatsCard({ icon: Icon, title, value, subtitle, badge, variant = 'white', onClick }) {
  const variants = {
    navy: 'bg-gradient-to-br from-[#141E2B] to-[#1D2B3D] text-white border-[#2A3B52] shadow-sm',
    charcoal: 'bg-gradient-to-br from-[#141E2B] to-[#1D2B3D] text-white border-[#2A3B52] shadow-sm',
    amber: 'bg-gradient-to-br from-amber-50/90 to-orange-50/50 border-amber-200/90 text-slate-900 shadow-xs',
    teal: 'bg-gradient-to-br from-emerald-50/90 to-teal-50/50 border-emerald-200/90 text-slate-900 shadow-xs',
    blue: 'bg-gradient-to-br from-blue-50/90 to-indigo-50/50 border-blue-200/90 text-slate-900 shadow-xs',
    coral: 'bg-gradient-to-br from-rose-50/90 to-red-50/50 border-rose-200/90 text-slate-900 shadow-xs',
    white: 'bg-white border-slate-200/90 text-slate-900 shadow-xs'
  };

  const iconStyles = {
    navy: 'bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/30',
    charcoal: 'bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/30',
    amber: 'bg-amber-100 text-amber-800 border border-amber-200',
    teal: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    blue: 'bg-blue-100 text-blue-800 border border-blue-200',
    coral: 'bg-rose-100 text-rose-800 border border-rose-200',
    white: 'bg-slate-100 text-slate-700 border border-slate-200/80'
  };

  const isDark = variant === 'navy' || variant === 'charcoal';
  const selectedVariant = variants[variant] || variants.white;
  const iconStyle = iconStyles[variant] || iconStyles.white;

  return (
    <div 
      onClick={onClick}
      className={`
        group relative rounded-2xl p-5 sm:p-6 border transition-all duration-200
        ${selectedVariant}
        ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <p className={`text-[11px] font-mono uppercase tracking-wider font-bold ${
              isDark ? 'text-slate-300' : 'text-slate-500'
            }`}>
              {title}
            </p>
            {badge && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                isDark ? 'bg-white/10 text-amber-300' : 'bg-slate-100 text-slate-700'
              }`}>
                {badge}
              </span>
            )}
          </div>
          <h3 className={`text-3xl sm:text-4xl font-serif font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {value}
          </h3>
          {subtitle && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
              <span>{subtitle}</span>
              {onClick && (
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity inline" />
              )}
            </p>
          )}
        </div>
        
        <div className={`p-3 rounded-xl flex-shrink-0 ${iconStyle}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
