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
        <button onClick={(e) => { e.stopPropagation(); handleToggleActive(row._id, val); }} className="flex items-center gap-1">
          {val ? <CheckCircle size={16} className="text-green-500" /> : <XCircle size={16} className="text-gray-400" />}
          <span className={val ? 'text-green-700 text-xs' : 'text-gray-500 text-xs'}>{val ? 'Active' : 'Inactive'}</span>
        </button>
      )
    },
    { 
      key: 'isFeatured', 
      label: 'Featured', 
      render: (val, row) => (
        <button onClick={(e) => { e.stopPropagation(); handleToggleFeatured(row._id, val); }} className="p-1 rounded-full hover:bg-gray-100">
          <Star size={18} className={val ? 'text-[#FFC857] fill-[#FFC857]' : 'text-gray-300'} />
        </button>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <button 
            onClick={(e) => { e.stopPropagation(); router.push(`/admin/opportunities/${row._id}/edit`); }}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleDelete(row._id); }}
            className="text-red-500 hover:text-red-700 p-1"
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
      <div className="flex justify-between items-center">
        <p className="text-gray-600 text-sm">Manage opportunities available to users.</p>
        <button 
          onClick={() => router.push('/admin/opportunities/new')}
          className="flex items-center gap-2 bg-[#FFC857] hover:bg-[#ffbe3b] text-[#2E4052] px-4 py-2 rounded-xl font-bold transition-all shadow-sm hover:shadow-md text-sm"
        >
          <Plus size={18} /> Add New Opportunity
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
