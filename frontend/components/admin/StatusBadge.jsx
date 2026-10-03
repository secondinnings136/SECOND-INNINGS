'use client';

export default function StatusBadge({ status }) {
  if (!status) return null;

  const getStatusStyles = (s) => {
    const val = s.toLowerCase();
    switch (val) {
      case 'completed':
      case 'replied':
      case 'active':
      case 'approved':
      case 'published':
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
      case 'pending':
        return 'bg-amber-50 text-amber-800 border-amber-200 font-semibold';
      case 'featured':
        return 'bg-[#FFF6E9] text-[#D97724] border-[#FBD8AF] font-bold';
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200 font-semibold';
      case 'new':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold';
      case 'cancelled':
      case 'failed':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-medium';
      case 'free':
        return 'bg-slate-100 text-slate-700 border-slate-200 font-medium';
      case 'read':
      case 'closed':
      case 'draft':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200 font-medium';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border tracking-tight capitalize ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
}
