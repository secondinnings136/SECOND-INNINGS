'use client';

import { useEffect, useState } from 'react';
import { getContacts, updateContact } from '../../../lib/adminApi';
import DataTable from '../../../components/admin/DataTable';
import StatusBadge from '../../../components/admin/StatusBadge';
import Modal from '../../../components/admin/Modal';
import { Mail, ExternalLink } from 'lucide-react';

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [statusForm, setStatusForm] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getContacts();
      setContacts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = async (row) => {
    setSelectedContact(row);
    setStatusForm(row.status || 'new');
    
    // Auto-update status to read if it was new
    if (row.status === 'new') {
      try {
        await updateContact(row._id, { status: 'read' });
        fetchData();
        setStatusForm('read');
      } catch (e) {}
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateContact(selectedContact._id, { status: statusForm });
      setSelectedContact(null);
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subject', render: (val) => <span className="truncate max-w-[200px] block">{val}</span> },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'createdAt', label: 'Date', render: (val) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <DataTable 
        columns={columns} 
        data={contacts} 
        isLoading={loading}
        onRowClick={handleRowClick}
        searchPlaceholder="Search by name or email..."
      />

      <Modal 
        isOpen={!!selectedContact} 
        onClose={() => setSelectedContact(null)} 
        title="Contact Message Details"
        actions={
          <>
            <button onClick={() => setSelectedContact(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-[#FFC857] hover:bg-[#ffbe3b] text-[#2E4052] font-bold rounded-lg transition-all shadow-sm text-sm">
              {saving ? 'Saving...' : 'Save Status'}
            </button>
          </>
        }
      >
        {selectedContact && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
              <div><span className="text-gray-500 block">Name:</span> <span className="font-medium text-[#2E4052]">{selectedContact.name}</span></div>
              <div>
                <span className="text-gray-500 block">Email:</span> 
                <a href={`mailto:${selectedContact.email}`} className="font-semibold text-[#2E4052] flex items-center gap-1 hover:underline">
                  {selectedContact.email} <ExternalLink size={14} />
                </a>
              </div>
              <div><span className="text-gray-500 block">Phone:</span> <span className="font-medium">{selectedContact.phone || 'N/A'}</span></div>
              <div><span className="text-gray-500 block">Date:</span> <span className="font-medium">{new Date(selectedContact.createdAt).toLocaleString()}</span></div>
              
              <div className="col-span-1 sm:col-span-2 mt-2">
                <span className="text-gray-500 block">Subject:</span> 
                <span className="font-semibold text-lg text-[#2E4052]">{selectedContact.subject}</span>
              </div>
              
              <div className="col-span-1 sm:col-span-2">
                <span className="text-gray-500 block mb-1">Message:</span> 
                <div className="bg-white p-4 border border-gray-200 rounded-md whitespace-pre-wrap text-gray-800">
                  {selectedContact.message}
                </div>
              </div>
            </div>

            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                <select 
                  value={statusForm} 
                  onChange={(e) => setStatusForm(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              
              <a 
                href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(selectedContact.subject)}`}
                className="flex items-center gap-2 px-5 py-2 bg-[#2E4052] hover:bg-[#243342] text-white font-medium rounded-lg transition-all shadow-sm h-10 text-sm"
              >
                <Mail size={18} /> Reply via Email
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
