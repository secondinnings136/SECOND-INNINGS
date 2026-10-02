'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Briefcase, FileText, Mail, Building2, MessageSquareQuote, Users, Clock } from 'lucide-react';
import { getDashboard } from '../../lib/adminApi';
import StatsCard from '../../components/admin/StatsCard';
import StatusBadge from '../../components/admin/StatusBadge';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboard();
        setData(res);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>;
  }

  // Use provided stats or fallback to 0
  const stats = data?.stats || {
    totalBookings: 0, pendingBookings: 0, activeOpportunities: 0, publishedResources: 0,
    totalContacts: 0, institutionalEnquiries: 0, approvedTestimonials: 0, newsletterSubscribers: 0
  };

  return (
    <div className="space-y-8">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard icon={Calendar} title="Total Bookings" value={stats.totalBookings || 0} variant="navy" />
        <StatsCard icon={Clock} title="Pending Bookings" value={stats.pendingBookings || 0} variant="amber" />
        <StatsCard icon={Briefcase} title="Active Opportunities" value={stats.activeOpportunities || 0} variant="teal" />
        <StatsCard icon={FileText} title="Published Resources" value={stats.publishedResources || 0} variant="white" />
      </div>

      {/* Second Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard icon={Mail} title="Total Contacts" value={stats.totalContacts || 0} variant="white" />
        <StatsCard icon={Building2} title="Institution Enquiries" value={stats.institutionalEnquiries || 0} variant="white" />
        <StatsCard icon={MessageSquareQuote} title="Approved Testimonials" value={stats.approvedTestimonials || 0} variant="white" />
        <StatsCard icon={Users} title="Newsletter Subs" value={stats.newsletterSubscribers || 0} variant="white" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-semibold text-gray-800">Recent Bookings</h2>
            <button onClick={() => router.push('/admin/bookings')} className="text-sm font-semibold text-[#2E4052] hover:text-[#412234] hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.recentBookings?.length > 0 ? (
                  data.recentBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push('/admin/bookings')}>
                      <td className="px-6 py-3 font-medium text-gray-900">{b.name}</td>
                      <td className="px-6 py-3 text-gray-500 capitalize">{b.type}</td>
                      <td className="px-6 py-3"><StatusBadge status={b.status} /></td>
                      <td className="px-6 py-3 text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No recent bookings</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-semibold text-gray-800">Recent Contacts</h2>
            <button onClick={() => router.push('/admin/contacts')} className="text-sm font-semibold text-[#2E4052] hover:text-[#412234] hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Subject</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.recentContacts?.length > 0 ? (
                  data.recentContacts.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push('/admin/contacts')}>
                      <td className="px-6 py-3 font-medium text-gray-900">{c.name}</td>
                      <td className="px-6 py-3 text-gray-500 truncate max-w-[150px]">{c.subject}</td>
                      <td className="px-6 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-6 py-3 text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No recent messages</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
