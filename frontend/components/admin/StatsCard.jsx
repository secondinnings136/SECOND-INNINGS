'use client';

export default function StatsCard({ icon: Icon, title, value, variant = 'navy' }) {
  const variants = {
    navy: 'bg-charcoal-blue text-white',
    charcoal: 'bg-charcoal-blue text-white',
    amber: 'bg-golden-pollen text-charcoal-blue',
    golden: 'bg-golden-pollen text-charcoal-blue',
    teal: 'bg-tea-green text-charcoal-blue',
    tea: 'bg-tea-green text-charcoal-blue',
    violet: 'bg-midnight-violet text-white',
    white: 'bg-white border border-slate-200 text-charcoal-blue'
  };

  const iconStyles = {
    navy: 'bg-white/10 text-golden-pollen',
    charcoal: 'bg-white/10 text-golden-pollen',
    amber: 'bg-charcoal-blue/10 text-charcoal-blue',
    golden: 'bg-charcoal-blue/10 text-charcoal-blue',
    teal: 'bg-charcoal-blue/10 text-charcoal-blue',
    tea: 'bg-charcoal-blue/10 text-charcoal-blue',
    violet: 'bg-white/10 text-golden-pollen',
    white: 'bg-slate-100 text-charcoal-blue'
  };

  const selectedVariant = variants[variant] || variants.white;
  const iconStyle = iconStyles[variant] || iconStyles.white;

  return (
    <div className={`rounded-2xl p-6 shadow-sm ${selectedVariant} transition-all`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs uppercase tracking-wider font-bold mb-1.5 ${
            variant === 'white' 
              ? 'text-gray-500' 
              : variant === 'amber' || variant === 'golden' || variant === 'teal' || variant === 'tea'
                ? 'text-charcoal-blue/70'
                : 'text-white/70'
          }`}>
            {title}
          </p>
          <h3 className="text-3xl font-extrabold font-sans tracking-tight">{value}</h3>
        </div>
        <div className={`p-3.5 rounded-2xl ${iconStyle}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
