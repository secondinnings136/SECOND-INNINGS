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
        <button onClick={() => handleToggle(row._id, 'isFeatured', val)} className="p-1 rounded-full hover:bg-slate-100 transition-colors">
          <Star size={18} className={val ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />
        </button>
      )
    },
    {
      key: 'actions', label: 'Actions',
      render: (_, row) => (
        <button 
          onClick={() => handleOpenModal(row)} 
          className="text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          title="Edit"
        >
          <Edit2 size={16} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Student & Parent Testimonials</h2>
          <p className="text-slate-500 text-xs mt-0.5">Manage genuine testimonials and highlight featured quotes on the homepage.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="inline-flex items-center gap-2 bg-linear-to-r from-[#D97724] to-[#E07A28] hover:opacity-95 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs text-xs self-start sm:self-auto"
        >
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      <DataTable columns={columns} data={data} isLoading={loading} searchKey="name" />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? 'Edit Testimonial' : 'Add New Testimonial'} 
        actions={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-medium transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-linear-to-r from-[#D97724] to-[#E07A28] hover:opacity-95 text-white font-semibold rounded-xl transition-all shadow-xs text-sm disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Testimonial'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Student / Parent Name</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D97724]/20 focus:border-[#D97724] transition-all" 
              placeholder="e.g. Priyanshu Sharma"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Role / University / Affiliation</label>
            <input 
              type="text" 
              value={formData.role} 
              onChange={e => setFormData({...formData, role: e.target.value})} 
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D97724]/20 focus:border-[#D97724] transition-all" 
              placeholder="e.g. Student, JKLU '24 or Parent of 12th Grader"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Quote / Reflection</label>
            <textarea 
              value={formData.quote} 
              onChange={e => setFormData({...formData, quote: e.target.value})} 
              rows="4" 
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D97724]/20 focus:border-[#D97724] transition-all leading-relaxed" 
              placeholder="Write the mentee reflection or quote..."
            />
          </div>
          <div className="flex gap-6 p-3 bg-slate-50/70 border border-slate-100 rounded-xl text-sm text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isApproved} onChange={e => setFormData({...formData, isApproved: e.target.checked})} className="accent-[#D97724] w-4 h-4 rounded" /> 
              <span className="font-medium text-xs">Approved for display</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="accent-[#D97724] w-4 h-4 rounded" /> 
              <span className="font-medium text-xs">Featured on Homepage</span>
            </label>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Display Priority Order</label>
            <input 
              type="number" 
              value={formData.order} 
              onChange={e => setFormData({...formData, order: e.target.value})} 
              className="w-32 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D97724]/20 focus:border-[#D97724] transition-all" 
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
