'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Star } from 'lucide-react';
import { getOpportunities, updateOpportunity, deleteOpportunity } from '../../../lib/adminApi';
import DataTable from '../../../components/admin/DataTable';
import StatusBadge from '../../../components/admin/StatusBadge';

export default function OpportunitiesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getOpportunities();
      setData(res.opportunities || res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id, currentVal) => {
    try {
      await updateOpportunity(id, { isActive: !currentVal });
      fetchData();
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const handleToggleFeatured = async (id, currentVal) => {
    try {
      await updateOpportunity(id, { isFeatured: !currentVal });
      fetchData();
    } catch (e) {
      alert('Failed to update featured status');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this opportunity? This cannot be undone.')) {
      try {
        await deleteOpportunity(id);
        fetchData();
      } catch (e) {
        alert('Failed to delete');
      }
    }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (val) => <span className="font-medium text-gray-900">{val}</span> },
    { key: 'category', label: 'Category', render: (val) => <span className="capitalize">{val?.replace('-', ' ')}</span> },
    { key: 'deadline', label: 'Deadline', render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A' },
    { key: 'locationMode', label: 'Mode', render: (val) => <span className="capitalize">{val}</span> },
    { 
      key: 'isActive', 
      label: 'Status', 
      render: (val, row) => (
        <button onClick={(e) => { e.stopPropagation(); handleToggleActive(row._id, val); }} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors">
          {val ? <CheckCircle size={14} className="text-emerald-600" /> : <XCircle size={14} className="text-slate-400" />}
          <span className={val ? 'text-emerald-700 text-xs font-semibold' : 'text-slate-500 text-xs font-medium'}>{val ? 'Active' : 'Draft'}</span>
        </button>
      )
    },
    { 
      key: 'isFeatured', 
      label: 'Featured', 
      render: (val, row) => (
        <button onClick={(e) => { e.stopPropagation(); handleToggleFeatured(row._id, val); }} className="p-1 rounded-full hover:bg-slate-100 transition-colors">
          <Star size={18} className={val ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />
        </button>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); router.push(`/admin/opportunities/${row._id}/edit`); }}
            className="text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleDelete(row._id); }}
            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Opportunities Directory</h2>
          <p className="text-slate-500 text-xs mt-0.5">Manage curated fellowships, internships, and scholarships for mentees.</p>
        </div>
        <button 
          onClick={() => router.push('/admin/opportunities/new')}
          className="inline-flex items-center gap-2 bg-linear-to-r from-[#D97724] to-[#E07A28] hover:opacity-95 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-xs text-xs self-start sm:self-auto"
        >
          <Plus size={16} /> Add New Opportunity
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        isLoading={loading}
        searchPlaceholder="Search opportunities..."
      />
    </div>
  );
}
