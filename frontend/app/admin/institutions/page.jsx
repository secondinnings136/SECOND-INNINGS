'use client';

import { useEffect, useState } from 'react';
import { getInstitutions, updateInstitution } from '../../../lib/adminApi';
import DataTable from '../../../components/admin/DataTable';
import StatusBadge from '../../../components/admin/StatusBadge';
import Modal from '../../../components/admin/Modal';

export default function InstitutionsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editForm, setEditForm] = useState({ status: '', notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getInstitutions();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (row) => {
    setSelectedItem(row);
    setEditForm({
      status: row.status || 'new',
      notes: row.notes || ''
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateInstitution(selectedItem._id, editForm);
      setSelectedItem(null);
      fetchData();
    } catch (err) {
      alert('Failed to update enquiry');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: 'institutionName', label: 'Institution' },
    { key: 'institutionType', label: 'Type', render: (v) => <span className="capitalize">{v}</span> },
    { key: 'contactPerson', label: 'Contact Person' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'createdAt', label: 'Date', render: (val) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <DataTable 
        columns={columns} 
        data={data} 
        isLoading={loading}
        onRowClick={handleRowClick}
        searchPlaceholder="Search institution or contact..."
        searchKey="institutionName"
      />

      <Modal 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        title="Institution Enquiry Details"
        actions={
          <>
            <button onClick={() => setSelectedItem(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-medium transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-linear-to-r from-[#D97724] to-[#E07A28] hover:opacity-95 text-white font-semibold rounded-xl transition-all shadow-xs text-sm disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        }
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-slate-50/70 border border-slate-100 p-4 rounded-xl">
              <div>
                <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Institution</span> 
                <span className="font-bold text-lg text-slate-900">{selectedItem.institutionName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Type</span> 
                <span className="font-semibold text-slate-800 capitalize">{selectedItem.institutionType}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Contact Person</span> 
                <span className="font-medium text-slate-800">{selectedItem.contactPerson}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Role / Designation</span> 
                <span className="font-medium text-slate-800">{selectedItem.designation || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Email</span> 
                <a href={`mailto:${selectedItem.email}`} className="font-semibold text-[#D97724] hover:underline">{selectedItem.email}</a>
              </div>
              <div>
                <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Phone</span> 
                <span className="font-medium text-slate-800">{selectedItem.phone}</span>
              </div>
              
              <div className="col-span-1 sm:col-span-2 pt-2 border-t border-slate-200/60">
                <span className="text-slate-500 text-xs uppercase tracking-wider block mb-2">Interested In Programs</span> 
                <div className="flex flex-wrap gap-2">
                  {selectedItem.interestedIn?.map(interest => (
                    <span key={interest} className="px-3 py-1 bg-amber-50 border border-amber-200/60 rounded-full text-xs font-semibold text-amber-900 capitalize">
                      {interest.replace('-', ' ')}
                    </span>
                  )) || <span className="text-slate-400">None specified</span>}
                </div>
              </div>
              
              <div className="col-span-1 sm:col-span-2">
                <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1.5">Additional Message</span> 
                <div className="bg-white p-3.5 border border-slate-200 rounded-xl whitespace-pre-wrap text-slate-700 text-sm leading-relaxed">
                  {selectedItem.message || <span className="text-slate-400 italic">No message provided</span>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Enquiry Status</label>
                <select 
                  value={editForm.status} 
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D97724]/20 focus:border-[#D97724] transition-all"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="meeting-scheduled">Meeting Scheduled</option>
                  <option value="pilot-proposed">Pilot Proposed</option>
                  <option value="active">Active/Partner</option>
                  <option value="closed">Closed/Lost</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Internal Notes & Action Items</label>
                <textarea 
                  value={editForm.notes} 
                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D97724]/20 focus:border-[#D97724] transition-all" 
                  rows="3"
                  placeholder="Keep track of discovery call discussions, proposals, and pilot dates..."
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
