'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Briefcase, 
  FileText, 
  Mail, 
  Building2, 
  MessageSquareQuote, 
  Users, 
  Clock, 
  AlertCircle,
  CreditCard,
  ArrowRight,
  PlusCircle,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  Video,
  Link2,
  Unlink
} from 'lucide-react';
import {
  getDashboard,
  getAdminPaymentSettings,
  getGoogleIntegrationStatus,
  getGoogleConnectUrl,
  disconnectGoogleIntegration
} from '../../lib/adminApi';
import StatsCard from '../../components/admin/StatsCard';
import StatusBadge from '../../components/admin/StatusBadge';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [googleStatus, setGoogleStatus] = useState(null);
  const [googleActionLoading, setGoogleActionLoading] = useState(false);
  const [googleNotice, setGoogleNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const connected = params.get('google_connected');
      const email = params.get('google_email');
      const gErr = params.get('google_error');
      if (connected === 'true') {
        setGoogleNotice({
          type: 'success',
          message: `Google Calendar & Meet connected successfully${email ? ` (${email})` : ''}! Confirmed bookings will now automatically generate unique Google Meet links.`
        });
        window.history.replaceState({}, '', window.location.pathname);
      } else if (gErr) {
        setGoogleNotice({
          type: 'error',
          message: `Google Calendar connection error: ${gErr}`
        });
        window.history.replaceState({}, '', window.location.pathname);
      }
    }

    const fetchAll = async () => {
      try {
        const [dashData, payData, gStatus] = await Promise.all([
          getDashboard(),
          getAdminPaymentSettings().catch(() => null),
          getGoogleIntegrationStatus().catch(() => null)
        ]);
        setData(dashData);
        if (payData?.success) {
          setPaymentConfig(payData);
        }
        if (gStatus?.data) {
          setGoogleStatus(gStatus.data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleConnectGoogle = async () => {
    setGoogleActionLoading(true);
    setGoogleNotice(null);
    try {
      let preferredRedirectUri = '';
      if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        if (host === 'localhost' || host === '127.0.0.1') {
          preferredRedirectUri = 'http://localhost:5000/api/admin/google/callback';
        } else {
          preferredRedirectUri = `${window.location.origin}/api/admin/google/callback`;
        }
      }
      const res = await getGoogleConnectUrl(preferredRedirectUri);
      if (res?.authUrl) {
        window.location.href = res.authUrl;
      }
    } catch (err) {
      setGoogleNotice({
        type: 'error',
        message: err.message || 'Failed to initiate Google Calendar OAuth flow'
      });
      setGoogleActionLoading(false);
    }
  };

  const handleDisconnectGoogle = async () => {
    if (!window.confirm('Disconnect Google Calendar & Meet integration? Automated Meet link generation will pause until reconnected.')) {
      return;
    }
    setGoogleActionLoading(true);
    try {
      await disconnectGoogleIntegration();
      const updated = await getGoogleIntegrationStatus().catch(() => null);
      if (updated?.data) setGoogleStatus(updated.data);
      setGoogleNotice({
        type: 'success',
        message: 'Google Calendar & Meet integration disconnected.'
      });
    } catch (err) {
      setGoogleNotice({
        type: 'error',
        message: err.message || 'Failed to disconnect Google Calendar'
      });
    } finally {
      setGoogleActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-28 bg-gray-200/70 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200/70 rounded-2xl animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="h-96 bg-gray-200/70 rounded-2xl animate-pulse" />
          <div className="h-96 bg-gray-200/70 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
        {error}
      </div>
    );
  }

  const stats = data?.stats || {
    totalBookings: 0, 
    pendingBookings: 0, 
    activeOpportunities: 0, 
    publishedResources: 0,
    totalContacts: 0, 
    institutionalEnquiries: 0, 
    approvedTestimonials: 0, 
    newsletterSubscribers: 0,
    totalSupport: 0, 
    openSupport: 0
  };

  const isFeeActive = paymentConfig?.settings?.paymentsEnabled;
  const currentFee = paymentConfig?.settings?.sessionFee || 0;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#16202C] to-[#202E3F] text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-sm relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber text-xs font-mono font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Founder&apos;s Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Welcome, Mr. Deepak Sogani
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-xl">
              Second Innings mentoring overview: review pending student requests, track consultations, and control platform settings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => router.push('/admin/bookings')}
              className="px-4 py-2.5 bg-amber hover:bg-amber-600 text-charcoal-blue text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center gap-2"
            >
              <span>View Bookings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => router.push('/admin/payments')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-mono font-semibold uppercase tracking-wider rounded-xl transition-colors border border-white/10 flex items-center gap-2"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber" />
              <span>Fee Control</span>
            </button>
          </div>
        </div>
      </div>

      {/* Google Calendar & Meet Connection Status Card */}
      {googleNotice && (
        <div
          className={`p-4 rounded-2xl border text-sm flex items-center justify-between gap-4 ${
            googleNotice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <span>{googleNotice.message}</span>
          <button
            onClick={() => setGoogleNotice(null)}
            className="text-xs font-mono uppercase font-semibold underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              googleStatus?.connected
                ? 'bg-emerald-100 text-emerald-700'
                : googleStatus?.status === 'revoked_or_expired'
                ? 'bg-red-100 text-red-700'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            <Video className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-bold text-gray-900 text-base">
                Google Calendar &amp; Google Meet Automation
              </h2>
              {googleStatus?.connected ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Connected
                </span>
              ) : googleStatus?.status === 'revoked_or_expired' ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                  Token Expired / Revoked — Reconnect Needed
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                  Not Connected Yet
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1 max-w-2xl leading-relaxed">
              {googleStatus?.connected
                ? `Connected to ${googleStatus.connectedEmail || 'Mentor Google Calendar'} (${googleStatus.calendarId || 'primary'}). Every confirmed booking automatically creates a Google Calendar event and a unique Google Meet conference link.`
                : googleStatus?.lastError
                ? `Last status: ${googleStatus.lastError}. Click "Connect Google Calendar & Meet" to authorize automatic Google Meet link creation.`
                : 'Connect Deepak’s Google account once using OAuth 2.0 so confirmed bookings automatically generate a Calendar invite and unique Google Meet link.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {googleStatus?.connected ? (
            <>
              <button
                type="button"
                disabled={googleActionLoading}
                onClick={handleConnectGoogle}
                className="px-3.5 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>{googleActionLoading ? 'Redirecting...' : 'Reconnect Account'}</span>
              </button>
              <button
                type="button"
                disabled={googleActionLoading}
                onClick={handleDisconnectGoogle}
                className="px-3.5 py-2 rounded-xl border border-red-200 hover:bg-red-50 text-xs font-semibold text-red-700 flex items-center gap-1.5 transition-colors"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={googleActionLoading}
              onClick={handleConnectGoogle}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
            >
              <Video className="w-4 h-4" />
              <span>
                {googleActionLoading
                  ? 'Redirecting to Google...'
                  : 'Connect Google Calendar & Meet'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Top KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard 
          icon={Calendar} 
          title="Total Bookings" 
          value={stats.totalBookings || 0} 
          subtitle="All-time student & parent requests"
          variant="navy" 
          onClick={() => router.push('/admin/bookings')}
        />
        <StatsCard 
          icon={Clock} 
          title="Pending Sessions" 
          value={stats.pendingBookings || 0} 
          subtitle="Awaiting date confirmation"
          variant="amber" 
          onClick={() => router.push('/admin/bookings')}
        />
        <StatsCard 
          icon={CreditCard} 
          title="Consultation Fees" 
          value={isFeeActive ? `₹${currentFee}` : 'Complimentary'} 
          subtitle={isFeeActive ? 'Cashfree checkout enabled' : 'Fees currently turned OFF'}
          variant={isFeeActive ? 'teal' : 'white'} 
          onClick={() => router.push('/admin/payments')}
        />
        <StatsCard 
          icon={AlertCircle} 
          title="Website Issues / Bugs" 
          value={stats.openSupport || stats.totalSupport || 0} 
          subtitle="Support desk tickets"
          variant={stats.openSupport > 0 ? 'coral' : 'white'} 
          onClick={() => router.push('/admin/support')}
        />
      </div>

      {/* Secondary Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          icon={Mail} 
          title="Mentoring Inquiries" 
          value={stats.totalContacts || 0} 
          variant="white" 
          onClick={() => router.push('/admin/contacts')}
        />
        <StatsCard 
          icon={Building2} 
          title="Institutional Enquiries" 
          value={stats.institutionalEnquiries || 0} 
          variant="white" 
          onClick={() => router.push('/admin/institutions')}
        />
        <StatsCard 
          icon={Briefcase} 
          title="Curated Opportunities" 
          value={stats.activeOpportunities || 0} 
          variant="white" 
          onClick={() => router.push('/admin/opportunities')}
        />
        <StatsCard 
          icon={FileText} 
          title="Framework Articles" 
          value={stats.publishedResources || 0} 
          variant="white" 
          onClick={() => router.push('/admin/resources')}
        />
      </div>

      {/* Tables Row: Recent Bookings & Inquiries */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/60">
            <div>
              <h2 className="font-bold text-gray-900 text-sm">Recent Bookings</h2>
              <p className="text-xs text-gray-500">Latest student &amp; parent appointment requests</p>
            </div>
            <button 
              onClick={() => router.push('/admin/bookings')} 
              className="text-xs font-mono font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/80 text-[11px] font-mono uppercase text-gray-400 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-semibold">Student</th>
                  <th className="px-6 py-3 font-semibold">Type</th>
                  <th className="px-6 py-3 font-semibold">Payment</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {data?.recentBookings?.length > 0 ? (
                  data.recentBookings.map((b) => (
                    <tr 
                      key={b._id} 
                      className="hover:bg-gray-50/80 cursor-pointer transition-colors" 
                      onClick={() => router.push('/admin/bookings')}
                    >
                      <td className="px-6 py-3.5 font-semibold text-gray-900">{b.name}</td>
                      <td className="px-6 py-3.5 capitalize text-gray-500">{b.userType || b.type || 'Student'}</td>
                      <td className="px-6 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          b.paymentStatus === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : b.paymentStatus === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {b.paymentStatus === 'paid' ? 'Paid' : b.paymentStatus === 'pending' ? 'Payment Due' : 'Free'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5"><StatusBadge status={b.status} /></td>
                      <td className="px-6 py-3.5 text-gray-400 font-mono">
                        {b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN') : '—'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                      No bookings recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Support Tickets / Bug Reports */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/60">
            <div>
              <h2 className="font-bold text-gray-900 text-sm">Website Bug &amp; Support Reports</h2>
              <p className="text-xs text-gray-500">Submitted through the dedicated /support desk</p>
            </div>
            <button 
              onClick={() => router.push('/admin/support')} 
              className="text-xs font-mono font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1"
            >
              <span>View Support</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/80 text-[11px] font-mono uppercase text-gray-400 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-semibold">User</th>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold">Subject</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {data?.recentSupport?.length > 0 ? (
                  data.recentSupport.map((t) => (
                    <tr 
                      key={t._id} 
                      className="hover:bg-gray-50/80 cursor-pointer transition-colors" 
                      onClick={() => router.push('/admin/support')}
                    >
                      <td className="px-6 py-3.5 font-semibold text-gray-900">{t.name}</td>
                      <td className="px-6 py-3.5 capitalize text-gray-500">{t.category?.replace('-', ' ')}</td>
                      <td className="px-6 py-3.5 truncate max-w-[160px] text-gray-700">{t.subject}</td>
                      <td className="px-6 py-3.5"><StatusBadge status={t.status} /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                      No support tickets recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Quick Action Shortcuts Bar */}
      <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-xs">
        <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-bold mb-4">
          Quick Administrative Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/admin/opportunities/new"
            className="p-3.5 rounded-xl border border-gray-200 hover:border-amber hover:bg-amber-50/30 transition-all flex items-center gap-3 text-xs font-semibold text-gray-800 group"
          >
            <PlusCircle className="w-4 h-4 text-amber group-hover:scale-110 transition-transform" />
            <span>Post Opportunity</span>
          </Link>

          <Link
            href="/admin/resources/new"
            className="p-3.5 rounded-xl border border-gray-200 hover:border-amber hover:bg-amber-50/30 transition-all flex items-center gap-3 text-xs font-semibold text-gray-800 group"
          >
            <PlusCircle className="w-4 h-4 text-amber group-hover:scale-110 transition-transform" />
            <span>Publish Article</span>
          </Link>

          <Link
            href="/admin/payments"
            className="p-3.5 rounded-xl border border-gray-200 hover:border-amber hover:bg-amber-50/30 transition-all flex items-center gap-3 text-xs font-semibold text-gray-800 group"
          >
            <CreditCard className="w-4 h-4 text-amber group-hover:scale-110 transition-transform" />
            <span>Manage Fees</span>
          </Link>

          <Link
            href="/admin/settings"
            className="p-3.5 rounded-xl border border-gray-200 hover:border-amber hover:bg-amber-50/30 transition-all flex items-center gap-3 text-xs font-semibold text-gray-800 group"
          >
            <ShieldCheck className="w-4 h-4 text-amber group-hover:scale-110 transition-transform" />
            <span>Account Security</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
