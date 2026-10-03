'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  IndianRupee, 
  ShieldCheck, 
  Power, 
  ArrowUpRight,
  Lock,
  Copy,
  Check,
  Plus
} from 'lucide-react';
import { getAdminPaymentSettings, updateAdminPaymentSettings, getBookings, createBooking } from '../../../lib/adminApi';
import Modal from '../../../components/admin/Modal';

export default function AdminPaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Settings state
  const [paymentsEnabled, setPaymentsEnabled] = useState(false);
  const [sessionFee, setSessionFee] = useState(0);
  const [feeNotice, setFeeNotice] = useState('');
  const [requirePaymentFor, setRequirePaymentFor] = useState(['student', 'parent', 'institution']);

  // Gateway & Stats state
  const [gateway, setGateway] = useState({});
  const [stats, setStats] = useState({
    totalBookings: 0,
    paidBookings: 0,
    freeBookings: 0,
    totalRevenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);

  // Manual payment / booking recording state
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [recordingManual, setRecordingManual] = useState(false);
  const [manualForm, setManualForm] = useState({
    name: '',
    phone: '',
    email: '',
    userType: 'student',
    paymentStatus: 'paid',
    paymentAmount: 50,
    paymentMode: 'DIRECT_UPI',
    topic: '',
    status: 'confirmed',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenManualModal = () => {
    setManualForm({
      name: '',
      phone: '',
      email: '',
      userType: 'student',
      paymentStatus: paymentsEnabled ? 'paid' : 'not_required',
      paymentAmount: paymentsEnabled ? Number(sessionFee || 50) : 0,
      paymentMode: paymentsEnabled ? 'DIRECT_UPI' : 'COMPLIMENTARY',
      topic: '',
      status: 'confirmed',
      notes: ''
    });
    setIsManualModalOpen(true);
  };

  const handleManualSubmit = async (e) => {
    e?.preventDefault();
    if (!manualForm.name || !manualForm.phone) {
      alert('Please provide student name and mobile number.');
      return;
    }

    setRecordingManual(true);
    try {
      const payload = {
        name: manualForm.name.trim(),
        phone: manualForm.phone.trim(),
        email: manualForm.email ? manualForm.email.trim() : undefined,
        userType: manualForm.userType,
        paymentStatus: manualForm.paymentStatus,
        paymentAmount: manualForm.paymentStatus === 'not_required' ? 0 : Number(manualForm.paymentAmount || 0),
        paymentMode: manualForm.paymentMode,
        paymentTime: manualForm.paymentStatus === 'paid' ? new Date() : null,
        paymentRequired: manualForm.paymentStatus === 'paid' || manualForm.paymentStatus === 'pending',
        topic: manualForm.topic,
        status: manualForm.status,
        notes: manualForm.notes || 'Recorded manually via Admin Portal',
        source: 'Admin Portal (Manual Entry)'
      };

      await createBooking(payload);
      setIsManualModalOpen(false);
      setFeedback({ 
        type: 'success', 
        message: `Booking for "${payload.name}" recorded successfully with payment status "${payload.paymentStatus.toUpperCase()}"!` 
      });
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to record manual booking');
    } finally {
      setRecordingManual(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resSettings, bookingsList] = await Promise.all([
        getAdminPaymentSettings(),
        getBookings('limit=10')
      ]);

      if (resSettings.success) {
        setPaymentsEnabled(resSettings.settings.paymentsEnabled);
        setSessionFee(resSettings.settings.sessionFee || 0);
        setFeeNotice(resSettings.settings.feeNotice || '');
        setRequirePaymentFor(resSettings.settings.requirePaymentFor || ['student', 'parent', 'institution']);
        setGateway(resSettings.gateway || {});
        setStats(resSettings.stats || {});
      }

      setRecentBookings(bookingsList || []);
    } catch (err) {
      console.error('Failed to load payment settings:', err);
      setFeedback({ type: 'error', message: err.message || 'Could not load payment settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await updateAdminPaymentSettings({
        paymentsEnabled,
        sessionFee: Number(sessionFee),
        feeNotice,
        requirePaymentFor
      });

      if (res.success) {
        setFeedback({ 
          type: 'success', 
          message: paymentsEnabled 
            ? `Payment gateway activated! Session fee set to ₹${sessionFee}.`
            : 'Payment gateway disabled. All sessions are now complimentary (Free).'
        });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleCopyWebhook = () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/payment/webhook`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-amber" />
            Payment Gateway & Fee Control
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Integrated with Cashfree Payments (Production SDK). Toggle fees ON or OFF with a single click.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Status
        </button>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl flex items-start gap-3 border ${
          feedback.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-900' 
            : 'bg-red-50 border-red-200 text-red-900'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <span className="text-sm font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Primary Toggle & Status Card */}
      <div className={`rounded-2xl border p-6 transition-all duration-300 shadow-sm ${
        paymentsEnabled 
          ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200' 
          : 'bg-gradient-to-r from-amber-50/60 to-orange-50/40 border-amber-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`p-3.5 rounded-xl ${
              paymentsEnabled ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
            }`}>
              <Power className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-gray-900">
                  {paymentsEnabled ? 'Fees Activated (Paid Booking)' : 'Complimentary Mode (Fees OFF)'}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  paymentsEnabled 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-amber-100 text-amber-900 border border-amber-200'
                }`}>
                  {paymentsEnabled ? 'PAYMENTS ACTIVE' : 'FEES TURNED OFF'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1 max-w-xl">
                {paymentsEnabled
                  ? `Students and parents must complete payment of ₹${sessionFee} via Cashfree (UPI, Cards, NetBanking) before their slot is confirmed.`
                  : 'Currently, you are not charging any consultation fee. Anyone can book a session directly with zero payment required.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200/80 shadow-sm self-start md:self-auto">
            <span className="text-sm font-medium text-gray-700">Enable Fees:</span>
            <button
              type="button"
              onClick={() => {
                const nextState = !paymentsEnabled;
                setPaymentsEnabled(nextState);
              }}
              className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                paymentsEnabled ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  paymentsEnabled ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main Settings & Gateway Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Fee Configuration Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2 pb-3 border-b border-gray-100">
            <IndianRupee className="w-5 h-5 text-amber" />
            Pricing & Fee Settings
          </h3>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Session Fee Amount (₹ INR)
              </label>
              <div className="relative rounded-lg shadow-sm max-w-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 font-bold sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={sessionFee}
                  onChange={(e) => setSessionFee(e.target.value)}
                  placeholder="e.g. 999"
                  className="block w-full rounded-lg border border-gray-300 pl-8 pr-4 py-2.5 text-gray-900 focus:border-amber focus:ring-amber sm:text-sm font-medium"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                Set to 0 or turn the toggle OFF above to offer complimentary sessions.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Public Notice / Fee Note
              </label>
              <textarea
                rows={3}
                value={feeNotice}
                onChange={(e) => setFeeNotice(e.target.value)}
                placeholder="e.g. A nominal fee of ₹999 for a 45-minute comprehensive mentorship session."
                className="block w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:border-amber focus:ring-amber sm:text-sm"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                This notice is displayed to users on the booking page.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Who Needs to Pay?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'student', label: 'Students (16-25)' },
                  { id: 'parent', label: 'Parents' },
                  { id: 'institution', label: 'Institutions' },
                ].map((aud) => (
                  <label 
                    key={aud.id} 
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={requirePaymentFor.includes(aud.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRequirePaymentFor([...requirePaymentFor, aud.id]);
                        } else {
                          setRequirePaymentFor(requirePaymentFor.filter(x => x !== aud.id));
                        }
                      }}
                      className="rounded border-gray-300 text-amber focus:ring-amber h-4 w-4"
                    />
                    <span className="text-xs font-medium text-gray-700">{aud.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Changes apply immediately to all upcoming bookings.
              </span>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-amber hover:bg-amber-600 text-charcoal-blue font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 text-sm flex items-center gap-2"
              >
                {saving && <RefreshCw className="w-4 h-4 animate-spin" />}
                Save Payment Settings
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Gateway Health & Credentials (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Gateway Status Box */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Cashfree PG Gateway
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Production Live
              </span>
            </h3>

            <div className="space-y-3.5 text-xs text-gray-600">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Provider</span>
                <span className="font-semibold text-gray-900">Cashfree Payments India</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">App ID</span>
                <span className="font-mono font-medium text-gray-800">{gateway.appId || '1454...94541'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">API Version</span>
                <span className="font-mono text-gray-800">2023-08-01 (Latest)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Supported Channels</span>
                <span className="font-medium text-gray-800 text-right">UPI, GooglePay, PhonePe, Cards, NetBanking</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500 font-medium">Auto Webhook Sync</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Enabled
                </span>
              </div>
            </div>

            {/* Webhook copy box */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between text-[11px] font-medium text-gray-500 mb-1">
                <span>Cashfree Webhook Endpoint:</span>
                <button
                  onClick={handleCopyWebhook}
                  className="text-amber-700 hover:text-amber-900 flex items-center gap-1 font-semibold"
                >
                  {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="font-mono text-[11px] text-gray-700 break-all select-all">
                {`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/payment/webhook`}
              </div>
            </div>
          </div>

          {/* Financial Stats Widget */}
          <div className="bg-charcoal-blue text-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs uppercase tracking-wider font-mono text-amber font-semibold mb-4">
              Mentoring Revenue Summary
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-300">Total Collected</p>
                <p className="text-2xl font-serif font-bold text-white mt-0.5">
                  ₹{Number(stats.totalRevenue || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-300">Paid Bookings</p>
                <p className="text-2xl font-serif font-bold text-amber mt-0.5">
                  {stats.paidBookings || 0}
                </p>
              </div>
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs text-gray-400">Complimentary (Free)</p>
                <p className="text-lg font-semibold text-gray-200 mt-0.5">
                  {stats.freeBookings || 0}
                </p>
              </div>
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs text-gray-400">Pending Payment</p>
                <p className="text-lg font-semibold text-gray-200 mt-0.5">
                  {stats.pendingPaymentBookings || 0}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Recent Bookings & Payment Status Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gray-50/40">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Recent Bookings &amp; Payment Status
            </h3>
            <span className="text-xs text-gray-500">
              Showing latest {recentBookings.length} bookings
            </span>
          </div>

          <button
            type="button"
            onClick={handleOpenManualModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#D97724] hover:bg-[#c4681d] text-white text-xs font-bold rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <Plus size={16} /> Record Manual Payment
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">Student / User</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Payment Status</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Channel / Mode</th>
                <th className="px-6 py-3">Order ID / Ref</th>
                <th className="px-6 py-3">Booking Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-400 text-sm">
                    No bookings found yet. Click &quot;Record Manual Payment&quot; above to add an offline or direct booking.
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-gray-900">
                      <div>{b.name}</div>
                      {b.topic && <div className="text-[11px] text-gray-400 truncate max-w-[200px]">{b.topic}</div>}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-xs">
                      {b.phone}
                    </td>
                    <td className="px-6 py-3.5 capitalize text-xs">
                      {b.userType}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        b.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : b.paymentStatus === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {b.paymentStatus === 'paid' ? 'Paid' : b.paymentStatus === 'pending' ? 'Pending' : 'Complimentary'}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-gray-900">
                      ₹{b.paymentAmount || 0}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-gray-600">
                      <span className="px-2 py-0.5 rounded bg-gray-100 font-mono text-[11px]">
                        {b.paymentMode?.replace('_', ' ') || (b.cashfreeOrderId ? 'Cashfree' : 'Direct')}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-xs text-gray-500">
                      {b.cashfreeOrderId || (b.source === 'Admin Portal (Manual Entry)' ? 'Manual Entry' : '—')}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-gray-500">
                      {b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Payment / Booking Modal */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="Record Manual / Offline Payment & Booking"
        actions={
          <>
            <button
              type="button"
              onClick={() => setIsManualModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl text-sm font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleManualSubmit}
              disabled={recordingManual}
              className="px-5 py-2.5 bg-[#D97724] hover:bg-[#c4681d] text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {recordingManual ? 'Recording...' : 'Save & Record Booking'}
            </button>
          </>
        }
      >
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <p className="text-xs text-gray-500 pb-2 border-b border-gray-100">
            Use this to manually register sessions booked via phone, WhatsApp, or paid offline (Cash, direct UPI/GPay, Bank Transfer).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Student / Mentee Name *
              </label>
              <input
                type="text"
                required
                value={manualForm.name}
                onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D97724]/20 focus:border-[#D97724]"
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
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D97724]/20 focus:border-[#D97724]"
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
                placeholder="rahul@example.com"
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D97724]/20 focus:border-[#D97724]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Mentee Category
              </label>
              <select
                value={manualForm.userType}
                onChange={(e) => setManualForm({ ...manualForm, userType: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D97724]/20 focus:border-[#D97724]"
              >
                <option value="student">Student (Ages 16–25)</option>
                <option value="parent">Parent</option>
                <option value="institution">Institutional Rep</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/70 space-y-3">
            <div className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Payment Details
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Payment Status
                </label>
                <select
                  value={manualForm.paymentStatus}
                  onChange={(e) => {
                    const status = e.target.value;
                    setManualForm({
                      ...manualForm,
                      paymentStatus: status,
                      paymentAmount: status === 'not_required' ? 0 : manualForm.paymentAmount || 50,
                      paymentMode: status === 'not_required' ? 'COMPLIMENTARY' : manualForm.paymentMode
                    });
                  }}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#D97724]/20"
                >
                  <option value="paid">Paid (Collected)</option>
                  <option value="not_required">Complimentary (Free)</option>
                  <option value="pending">Pending Payment</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Fee Amount (₹ INR)
                </label>
                <input
                  type="number"
                  min="0"
                  disabled={manualForm.paymentStatus === 'not_required'}
                  value={manualForm.paymentAmount}
                  onChange={(e) => setManualForm({ ...manualForm, paymentAmount: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#D97724]/20 disabled:bg-gray-100 disabled:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Payment Mode
                </label>
                <select
                  value={manualForm.paymentMode}
                  onChange={(e) => setManualForm({ ...manualForm, paymentMode: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#D97724]/20"
                >
                  <option value="DIRECT_UPI">Direct UPI (GPay/PhonePe/Paytm)</option>
                  <option value="CASH">Cash (In-person)</option>
                  <option value="BANK_TRANSFER">Bank Transfer (IMPS/NEFT)</option>
                  <option value="CASHFREE">Cashfree Gateway</option>
                  <option value="COMPLIMENTARY">Complimentary / Waived</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Booking Status
              </label>
              <select
                value={manualForm.status}
                onChange={(e) => setManualForm({ ...manualForm, status: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D97724]/20 focus:border-[#D97724]"
              >
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Discussion Topic / Focus
              </label>
              <input
                type="text"
                value={manualForm.topic}
                onChange={(e) => setManualForm({ ...manualForm, topic: e.target.value })}
                placeholder="e.g. Career dilemma after graduation"
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D97724]/20 focus:border-[#D97724]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Internal Admin Notes
            </label>
            <textarea
              rows={2}
              value={manualForm.notes}
              onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
              placeholder="e.g. Paid via GPay on WhatsApp; session scheduled for Thursday 4 PM"
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D97724]/20 focus:border-[#D97724]"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
