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
            <button onClick={() => setSelectedItem(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-[#FFC857] hover:bg-[#ffbe3b] text-[#2E4052] font-bold rounded-lg transition-all shadow-sm text-sm">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        }
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
              <div><span className="text-gray-500 block">Institution:</span> <span className="font-semibold text-lg text-[#2E4052]">{selectedItem.institutionName}</span></div>
              <div><span className="text-gray-500 block">Type:</span> <span className="font-medium capitalize">{selectedItem.institutionType}</span></div>
              <div><span className="text-gray-500 block">Contact Person:</span> <span className="font-medium">{selectedItem.contactPerson}</span></div>
              <div><span className="text-gray-500 block">Role/Designation:</span> <span className="font-medium">{selectedItem.designation || 'N/A'}</span></div>
              <div><span className="text-gray-500 block">Email:</span> <a href={`mailto:${selectedItem.email}`} className="font-semibold text-[#2E4052] hover:underline">{selectedItem.email}</a></div>
              <div><span className="text-gray-500 block">Phone:</span> <span className="font-medium">{selectedItem.phone}</span></div>
              
              <div className="col-span-1 sm:col-span-2 mt-2">
                <span className="text-gray-500 block mb-2">Interested In:</span> 
                <div className="flex flex-wrap gap-2">
                  {selectedItem.interestedIn?.map(interest => (
                    <span key={interest} className="px-3 py-1 bg-[#BDD9BF]/30 border border-[#BDD9BF] rounded-full text-xs font-semibold text-[#2E4052]">
                      {interest.replace('-', ' ')}
                    </span>
                  )) || <span className="text-gray-400">None specified</span>}
                </div>
              </div>
              
              <div className="col-span-1 sm:col-span-2">
                <span className="text-gray-500 block mb-1">Additional Message:</span> 
                <div className="bg-white p-3 border border-gray-200 rounded-md whitespace-pre-wrap text-gray-800">
                  {selectedItem.message || <span className="text-gray-400 italic">No message provided</span>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={editForm.status} 
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
                <textarea 
                  value={editForm.notes} 
                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none" rows="4"
                  placeholder="Keep track of meetings, proposals, etc."
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
