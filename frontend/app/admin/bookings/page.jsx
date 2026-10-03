'use client';

import { useEffect, useState } from 'react';
import { getBookings, updateBooking, createBooking } from '../../../lib/adminApi';
import DataTable from '../../../components/admin/DataTable';
import StatusBadge from '../../../components/admin/StatusBadge';
import Modal from '../../../components/admin/Modal';
import { Plus, CheckCircle, Clock } from 'lucide-react';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Manual booking creation state
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [savingManual, setSavingManual] = useState(false);
  const [manualForm, setManualForm] = useState({
    name: '',
    phone: '',
    email: '',
    userType: 'student',
    topic: '',
    preferredDate: '',
    preferredTime: '',
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentAmount: 50,
    paymentMode: 'DIRECT_UPI',
    notes: ''
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    status: '', 
    notes: '', 
    followUpDate: '', 
    actionAgreed: '', 
    actionStatus: '', 
    feedback: '',
    paymentStatus: 'pending',
    paymentAmount: 0,
    paymentMode: 'DIRECT_UPI'
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
      feedback: row.feedback || '',
      paymentStatus: row.paymentStatus || 'pending',
      paymentAmount: row.paymentAmount || 0,
      paymentMode: row.paymentMode || 'DIRECT_UPI'
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

  const handleOpenManualModal = () => {
    setManualForm({
      name: '',
      phone: '',
      email: '',
      userType: 'student',
      topic: '',
      preferredDate: '',
      preferredTime: '',
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentAmount: 50,
      paymentMode: 'DIRECT_UPI',
      notes: ''
    });
    setIsManualModalOpen(true);
  };

  const handleCreateManualBooking = async (e) => {
    e?.preventDefault();
    if (!manualForm.name.trim() || !manualForm.phone.trim()) {
      alert('Please enter mentee name and mobile number.');
      return;
    }

    setSavingManual(true);
    try {
      const payload = {
        name: manualForm.name.trim(),
        phone: manualForm.phone.trim(),
        email: manualForm.email ? manualForm.email.trim() : undefined,
        userType: manualForm.userType,
        topic: manualForm.topic,
        preferredDate: manualForm.preferredDate || undefined,
        preferredTime: manualForm.preferredTime || undefined,
        status: manualForm.status,
        paymentStatus: manualForm.paymentStatus,
        paymentAmount: manualForm.paymentStatus === 'not_required' ? 0 : Number(manualForm.paymentAmount || 0),
        paymentMode: manualForm.paymentMode,
        paymentTime: manualForm.paymentStatus === 'paid' ? new Date() : null,
        paymentRequired: manualForm.paymentStatus !== 'not_required',
        notes: manualForm.notes || 'Added manually via Admin Portal',
        source: 'Admin Portal (Manual Session Entry)'
      };

      await createBooking(payload);
      setIsManualModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to create booking');
    } finally {
      setSavingManual(false);
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
    { key: 'paymentStatus', label: 'Payment', render: (val, row) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
        val === 'paid' ? 'bg-green-100 text-green-800' :
        val === 'pending' ? 'bg-amber-100 text-amber-800' :
        'bg-gray-100 text-gray-700'
      }`}>
        {val === 'paid' ? `₹${row.paymentAmount || 0} Paid` : val === 'pending' ? 'Payment Due' : 'Complimentary'}
      </span>
    ) },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'createdAt', label: 'Date', render: (val) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
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

        <button
          onClick={handleOpenManualModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition-colors text-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          + Add Manual Booking
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredBookings} 
        isLoading={loading}
        onRowClick={handleRowClick}
        searchPlaceholder="Search by name or phone..."
        searchKey="name"
      />

      {/* Edit Booking Modal */}
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
              <div><span className="text-gray-500 block">Type:</span> <span className="font-medium capitalize">{selectedBooking.type || selectedBooking.userType}</span></div>
              <div><span className="text-gray-500 block">Current Payment:</span> <span className="font-semibold text-emerald-700 capitalize">{selectedBooking.paymentStatus === 'paid' ? `₹${selectedBooking.paymentAmount} Paid` : selectedBooking.paymentStatus === 'pending' ? 'Payment Due' : 'Complimentary'}</span></div>
              <div><span className="text-gray-500 block">Order ID / Ref:</span> <span className="font-mono text-xs text-gray-700">{selectedBooking.cashfreeOrderId || selectedBooking.paymentMode || 'N/A'}</span></div>
              <div className="col-span-2"><span className="text-gray-500 block">Concern / Topic:</span> <p className="mt-1 bg-white p-3 border rounded-md">{selectedBooking.concern || selectedBooking.topic || 'N/A'}</p></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Status</label>
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

              {/* Payment Status & Amount controls */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select 
                  value={editForm.paymentStatus} 
                  onChange={(e) => setEditForm({...editForm, paymentStatus: e.target.value})}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none"
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Payment Due (Pending)</option>
                  <option value="not_required">Complimentary (Waived)</option>
                  <option value="refunded">Refunded</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                <select 
                  value={editForm.paymentMode} 
                  onChange={(e) => setEditForm({...editForm, paymentMode: e.target.value})}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none"
                >
                  <option value="DIRECT_UPI">Direct UPI / GPay / PhonePe</option>
                  <option value="CASH">Cash</option>
                  <option value="BANK_TRANSFER">Bank Transfer / NEFT</option>
                  <option value="CASHFREE">Cashfree Gateway</option>
                  <option value="COMPLIMENTARY">Complimentary / Pro Bono</option>
                </select>
              </div>

              {editForm.paymentStatus !== 'not_required' && (
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee Amount (₹)</label>
                  <input 
                    type="number"
                    min="0"
                    value={editForm.paymentAmount} 
                    onChange={(e) => setEditForm({...editForm, paymentAmount: Number(e.target.value)})}
                    className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none"
                  />
                </div>
              )}

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

      {/* Add Manual Booking Modal */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="Add Manual Mentoring Booking"
        actions={
          <>
            <button
              onClick={() => setIsManualModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateManualBooking}
              disabled={savingManual}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all shadow-sm text-sm"
            >
              {savingManual ? 'Saving...' : 'Record Booking'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateManualBooking} className="space-y-4">
          <p className="text-xs text-gray-500">
            Record direct consultations, WhatsApp/call bookings, or offline payments so they are tracked on both the Bookings and Payments dashboards.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Mentee / Client Name *
              </label>
              <input
                type="text"
                required
                value={manualForm.name}
                onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Mobile / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={manualForm.phone}
                onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                placeholder="e.g. 9876543210"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={manualForm.email}
                onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                placeholder="e.g. rahul@example.com"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Mentee Category
              </label>
              <select
                value={manualForm.userType}
                onChange={(e) => setManualForm({ ...manualForm, userType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-emerald-600 outline-none bg-white"
              >
                <option value="student">Student (16-25 yrs)</option>
                <option value="parent">Parent</option>
                <option value="institution">Institution / Educator</option>
                <option value="working_professional">Working Professional</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Session Date
              </label>
              <input
                type="date"
                value={manualForm.preferredDate}
                onChange={(e) => setManualForm({ ...manualForm, preferredDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Session Time / Slot
              </label>
              <input
                type="text"
                value={manualForm.preferredTime}
                onChange={(e) => setManualForm({ ...manualForm, preferredTime: e.target.value })}
                placeholder="e.g. 4:00 PM - 4:45 PM"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Session Status
              </label>
              <select
                value={manualForm.status}
                onChange={(e) => setManualForm({ ...manualForm, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-emerald-600 outline-none bg-white"
              >
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Payment Status
              </label>
              <select
                value={manualForm.paymentStatus}
                onChange={(e) => setManualForm({ ...manualForm, paymentStatus: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-emerald-600 outline-none bg-white font-medium"
              >
                <option value="paid">Paid (₹ Collected)</option>
                <option value="not_required">Complimentary / Free (₹0)</option>
                <option value="pending">Payment Due (Pending)</option>
              </select>
            </div>

            {manualForm.paymentStatus !== 'not_required' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Amount Collected (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={manualForm.paymentAmount}
                    onChange={(e) => setManualForm({ ...manualForm, paymentAmount: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-emerald-600 outline-none font-semibold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={manualForm.paymentMode}
                    onChange={(e) => setManualForm({ ...manualForm, paymentMode: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-emerald-600 outline-none bg-white"
                  >
                    <option value="DIRECT_UPI">Direct UPI / GPay / PhonePe</option>
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Direct Bank Transfer (NEFT/IMPS)</option>
                    <option value="CASHFREE">Cashfree Payment Gateway</option>
                    <option value="COMPLIMENTARY">Complimentary / Pro Bono</option>
                  </select>
                </div>
              </>
            )}

            <div className="col-span-1 sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Topic / Concern Discussed
              </label>
              <input
                type="text"
                value={manualForm.topic}
                onChange={(e) => setManualForm({ ...manualForm, topic: e.target.value })}
                placeholder="e.g. Career decision post engineering vs MBA"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-emerald-600 outline-none"
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Admin Notes
              </label>
              <textarea
                rows={2}
                value={manualForm.notes}
                onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                placeholder="Session insights, next steps or notes..."
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-emerald-600 outline-none"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

