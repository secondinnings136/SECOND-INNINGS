'use client';

import { useEffect, useState } from 'react';
import { getTestimonials, updateTestimonial, createTestimonial } from '../../../lib/adminApi';
import DataTable from '../../../components/admin/DataTable';
import Modal from '../../../components/admin/Modal';
import { Plus, Edit2, CheckCircle, XCircle, Star } from 'lucide-react';

export default function TestimonialsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '', role: '', quote: '', order: 0, isApproved: true, isFeatured: false
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getTestimonials();
      setData(res);
    } catch (e) {} finally { setLoading(false); }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        name: item.name, role: item.role, quote: item.quote,
        order: item.order || 0, isApproved: item.isApproved, isFeatured: item.isFeatured
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', role: '', quote: '', order: 0, isApproved: true, isFeatured: false });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await updateTestimonial(editingId, formData);
      } else {
        await createTestimonial(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (e) {
      alert('Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id, field, value) => {
    try {
      await updateTestimonial(id, { [field]: !value });
      fetchData();
    } catch (e) { alert('Update failed'); }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'quote', label: 'Quote', render: (v) => <span className="truncate max-w-[200px] block">{v}</span> },
    { 
      key: 'isApproved', label: 'Approved', 
      render: (val, row) => (
        <button onClick={() => handleToggle(row._id, 'isApproved', val)}>
          {val ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-gray-300" />}
        </button>
      )
    },
    { 
      key: 'isFeatured', label: 'Featured', 
      render: (val, row) => (
        <button onClick={() => handleToggle(row._id, 'isFeatured', val)}>
          <Star size={18} className={val ? 'text-[#FFC857] fill-[#FFC857]' : 'text-gray-300'} />
        </button>
      )
    },
    {
      key: 'actions', label: 'Actions',
      render: (_, row) => (
        <button onClick={() => handleOpenModal(row)} className="text-blue-600 hover:text-blue-800"><Edit2 size={16} /></button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <p className="text-gray-600">Manage what users say about you.</p>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-[#FFC857] hover:bg-[#ffbe3b] text-[#2E4052] font-bold px-4 py-2 rounded-xl transition-all shadow-sm text-sm"><Plus size={18} /> Add</button>
      </div>

      <DataTable columns={columns} data={data} isLoading={loading} searchKey="name" />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Testimonial' : 'Add Testimonial'} actions={<><button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600">Cancel</button><button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-[#FFC857] hover:bg-[#ffbe3b] text-[#2E4052] font-bold rounded-lg px-4 py-2 transition-all">{saving ? 'Saving...' : 'Save'}</button></>}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Name</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-md outline-none" /></div>
          <div><label className="block text-sm font-medium mb-1">Role/Info</label><input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-2 border rounded-md outline-none" /></div>
          <div><label className="block text-sm font-medium mb-1">Quote</label><textarea value={formData.quote} onChange={e => setFormData({...formData, quote: e.target.value})} rows="4" className="w-full p-2 border rounded-md outline-none" /></div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isApproved} onChange={e => setFormData({...formData, isApproved: e.target.checked})} /> Approved</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} /> Featured</label>
          </div>
          <div><label className="block text-sm font-medium mb-1">Display Order</label><input type="number" value={formData.order} onChange={e => setFormData({...formData, order: e.target.value})} className="w-24 p-2 border rounded-md outline-none" /></div>
        </div>
      </Modal>
    </div>
  );
}
