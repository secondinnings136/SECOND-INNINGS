'use client';

import { useEffect, useState } from 'react';
import { getBookings, updateBooking } from '../../../lib/adminApi';
import DataTable from '../../../components/admin/DataTable';
import StatusBadge from '../../../components/admin/StatusBadge';
import Modal from '../../../components/admin/Modal';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    status: '', notes: '', followUpDate: '', actionAgreed: '', actionStatus: '', feedback: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (row) => {
    setSelectedBooking(row);
    setEditForm({
      status: row.status || 'pending',
      notes: row.notes || '',
      followUpDate: row.followUpDate ? new Date(row.followUpDate).toISOString().split('T')[0] : '',
      actionAgreed: row.actionAgreed || '',
      actionStatus: row.actionStatus || 'pending',
      feedback: row.feedback || ''
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateBooking(selectedBooking._id, editForm);
      setSelectedBooking(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to update booking');
    } finally {
      setSaving(false);
    }
  };

  const filteredBookings = filter === 'All' 
    ? bookings 
    : bookings.filter(b => b.status.toLowerCase() === filter.toLowerCase());

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'type', label: 'Type', render: (val) => <span className="capitalize">{val}</span> },
    { key: 'concern', label: 'Concern', render: (val) => <span className="truncate max-w-[150px] block">{val}</span> },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'createdAt', label: 'Date', render: (val) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 pb-4 overflow-x-auto border-b border-gray-200">
        {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap
              ${filter === f ? 'bg-[#2E4052] text-white shadow-sm' : 'bg-gray-100 text-[#2E4052] hover:bg-gray-200'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <DataTable 
        columns={columns} 
        data={filteredBookings} 
        isLoading={loading}
        onRowClick={handleRowClick}
        searchPlaceholder="Search by name or phone..."
        searchKey="name"
      />

      <Modal 
        isOpen={!!selectedBooking} 
        onClose={() => setSelectedBooking(null)} 
        title="Booking Details"
        actions={
          <>
            <button onClick={() => setSelectedBooking(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-[#FFC857] hover:bg-[#ffbe3b] text-[#2E4052] font-bold rounded-lg transition-all shadow-sm text-sm">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        }
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
              <div><span className="text-gray-500 block">Name:</span> <span className="font-medium">{selectedBooking.name}</span></div>
              <div><span className="text-gray-500 block">Phone:</span> <span className="font-medium">{selectedBooking.phone}</span></div>
              <div><span className="text-gray-500 block">Email:</span> <span className="font-medium">{selectedBooking.email || 'N/A'}</span></div>
              <div><span className="text-gray-500 block">Type:</span> <span className="font-medium capitalize">{selectedBooking.type}</span></div>
              <div className="col-span-2"><span className="text-gray-500 block">Concern:</span> <p className="mt-1 bg-white p-3 border rounded-md">{selectedBooking.concern}</p></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={editForm.status} 
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                <input 
                  type="date" 
                  value={editForm.followUpDate} 
                  onChange={(e) => setEditForm({...editForm, followUpDate: e.target.value})}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
                <textarea 
                  value={editForm.notes} 
                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none" rows="2"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Action Status</label>
                <select 
                  value={editForm.actionStatus} 
                  onChange={(e) => setEditForm({...editForm, actionStatus: e.target.value})}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Action Agreed</label>
                <textarea 
                  value={editForm.actionAgreed} 
                  onChange={(e) => setEditForm({...editForm, actionAgreed: e.target.value})}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none" rows="2"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                <textarea 
                  value={editForm.feedback} 
                  onChange={(e) => setEditForm({...editForm, feedback: e.target.value})}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none" rows="2"
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
