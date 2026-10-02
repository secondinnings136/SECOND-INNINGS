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
      <div className="flex justify-between items-center">
        <p className="text-gray-600 text-sm">Manage articles and resources.</p>
        <button 
          onClick={() => router.push('/admin/resources/new')}
          className="flex items-center gap-2 bg-[#FFC857] hover:bg-[#ffbe3b] text-[#2E4052] font-bold px-4 py-2 rounded-xl transition-all shadow-sm text-sm"
        >
          <Plus size={18} /> Add New
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
