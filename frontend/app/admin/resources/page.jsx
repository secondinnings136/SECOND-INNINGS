'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { getResources, updateResource } from '../../../lib/adminApi';
import DataTable from '../../../components/admin/DataTable';

export default function ResourcesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getResources();
      setData(res.resources || res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublished = async (id, currentVal) => {
    try {
      await updateResource(id, { isPublished: !currentVal });
      fetchData();
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const columns = [
    { key: 'title', label: 'Title', render: (val) => <span className="font-medium text-gray-900">{val}</span> },
    { key: 'category', label: 'Category', render: (val) => <span className="capitalize">{val?.replace('-', ' ')}</span> },
    { key: 'readTime', label: 'Read Time', render: (val) => `${val} min` },
    { key: 'createdAt', label: 'Date', render: (val) => new Date(val).toLocaleDateString() },
    { 
      key: 'isPublished', 
      label: 'Published', 
      render: (val, row) => (
        <button onClick={() => handleTogglePublished(row._id, val)} className="flex items-center gap-1">
          {val ? <CheckCircle size={16} className="text-green-500" /> : <XCircle size={16} className="text-gray-400" />}
          <span className={val ? 'text-green-700 text-xs' : 'text-gray-500 text-xs'}>{val ? 'Published' : 'Draft'}</span>
        </button>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <button onClick={() => router.push(`/admin/resources/${row._id}/edit`)} className="text-blue-600 hover:text-blue-800 p-1">
            <Edit2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Articles & Resource Guides</h2>
          <p className="text-slate-500 text-xs mt-0.5">Manage published insights, frameworks, and student guidance pieces.</p>
        </div>
        <button 
          onClick={() => router.push('/admin/resources/new')}
          className="inline-flex items-center gap-2 bg-linear-to-r from-[#D97724] to-[#E07A28] hover:opacity-95 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs text-xs self-start sm:self-auto"
        >
          <Plus size={16} /> Add New Resource
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        isLoading={loading}
        searchKey="title"
        searchPlaceholder="Search resources by title..."
      />
    </div>
  );
}
