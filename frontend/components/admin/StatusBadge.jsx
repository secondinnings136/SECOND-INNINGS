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
        return 'bg-[#BDD9BF]/40 text-[#2E4052] border-[#BDD9BF] font-semibold';
      case 'pending':
        return 'bg-[#FFC857]/25 text-[#2E4052] border-[#FFC857]/50 font-semibold';
      case 'featured':
        return 'bg-[#FFC857] text-[#2E4052] border-[#FFC857] font-bold shadow-xs';
      case 'confirmed':
      case 'new':
        return 'bg-[#2E4052]/10 text-[#2E4052] border-[#2E4052]/30 font-semibold';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'read':
      case 'closed':
      case 'draft':
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
}
