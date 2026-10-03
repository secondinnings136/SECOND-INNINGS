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
            <button onClick={() => setSelectedContact(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-medium transition-colors">
              Close
            </button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-linear-to-r from-[#D97724] to-[#E07A28] hover:opacity-95 text-white font-semibold rounded-xl transition-all shadow-xs text-sm disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Status'}
            </button>
          </>
        }
      >
        {selectedContact && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-slate-50/70 border border-slate-100 p-4 rounded-xl">
              <div>
                <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Name</span> 
                <span className="font-semibold text-slate-900">{selectedContact.name}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Email</span> 
                <a href={`mailto:${selectedContact.email}`} className="font-semibold text-[#D97724] flex items-center gap-1 hover:underline">
                  {selectedContact.email} <ExternalLink size={13} />
                </a>
              </div>
              <div>
                <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Phone</span> 
                <span className="font-medium text-slate-800">{selectedContact.phone || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Received Date</span> 
                <span className="font-medium text-slate-800">{new Date(selectedContact.createdAt).toLocaleString()}</span>
              </div>
              
              <div className="col-span-1 sm:col-span-2 pt-2 border-t border-slate-200/60">
                <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Subject</span> 
                <span className="font-bold text-base text-slate-900">{selectedContact.subject}</span>
              </div>
              
              <div className="col-span-1 sm:col-span-2">
                <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1.5">Message</span> 
                <div className="bg-white p-4 border border-slate-200 rounded-xl whitespace-pre-wrap text-slate-700 leading-relaxed text-sm">
                  {selectedContact.message}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-end justify-between pt-2">
              <div className="flex-1 max-w-xs">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Update Status</label>
                <select 
                  value={statusForm} 
                  onChange={(e) => setStatusForm(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D97724]/20 focus:border-[#D97724] transition-all"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              
              <a 
                href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(selectedContact.subject)}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#111720] hover:bg-[#1E293B] text-white font-medium rounded-xl transition-all shadow-xs text-sm"
              >
                <Mail size={16} /> Reply via Email
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
