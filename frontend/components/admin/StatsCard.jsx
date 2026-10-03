'use client';

export default function StatsCard({ icon: Icon, title, value, subtitle, variant = 'white', onClick }) {
  const variants = {
    navy: 'bg-[#16202C] text-white border-white/10 shadow-sm',
    charcoal: 'bg-[#16202C] text-white border-white/10 shadow-sm',
    amber: 'bg-gradient-to-br from-amber-50 to-orange-50/60 border-amber-200/80 text-gray-900 shadow-xs',
    teal: 'bg-gradient-to-br from-emerald-50 to-teal-50/60 border-emerald-200/80 text-gray-900 shadow-xs',
    coral: 'bg-gradient-to-br from-rose-50 to-red-50/60 border-rose-200/80 text-gray-900 shadow-xs',
    white: 'bg-white border-gray-200 text-gray-900 shadow-xs'
  };

  const iconStyles = {
    navy: 'bg-white/10 text-amber',
    charcoal: 'bg-white/10 text-amber',
    amber: 'bg-amber-100 text-amber-900',
    teal: 'bg-emerald-100 text-emerald-900',
    coral: 'bg-rose-100 text-rose-900',
    white: 'bg-gray-100 text-gray-700'
  };

  const isDark = variant === 'navy' || variant === 'charcoal';
  const selectedVariant = variants[variant] || variants.white;
  const iconStyle = iconStyles[variant] || iconStyles.white;

  return (
    <div 
      onClick={onClick}
      className={`
        rounded-2xl p-5 sm:p-6 border transition-all duration-200
        ${selectedVariant}
        ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-[11px] font-mono uppercase tracking-wider font-semibold mb-1.5 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {title}
          </p>
          <h3 className={`text-2xl sm:text-3xl font-serif font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {value}
          </h3>
          {subtitle && (
            <p className={`text-xs mt-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {subtitle}
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
