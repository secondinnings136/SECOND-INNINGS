'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  Mail,
  Building2,
  Briefcase,
  FileText,
  MessageSquareQuote,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { removeToken } from '../../lib/adminApi';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/contacts', label: 'Contacts', icon: Mail },
  { href: '/admin/institutions', label: 'Institutions', icon: Building2 },
  { href: '/admin/support', label: 'Support & Bugs', icon: AlertCircle },
  { href: '/admin/opportunities', label: 'Opportunities', icon: Briefcase },
  { href: '/admin/resources', label: 'Resources', icon: FileText },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar({ admin, isOpen, setIsOpen }) {
  const pathname = usePathname();

  const handleLogout = () => {
    removeToken();
    window.location.href = '/admin/login';
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-charcoal-blue text-white
        transform transition-transform duration-200 ease-in-out
        flex flex-col h-screen border-r border-white/10
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-6 h-16 border-b border-white/10">
          <Link href="/admin" className="text-xl font-bold tracking-wider font-serif text-golden-pollen">
            SI ADMIN
          </Link>
          <button className="md:hidden text-white/70 hover:text-white" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                      ${isActive ? 'bg-white/10 text-golden-pollen font-bold border-l-4 border-golden-pollen' : 'text-white/70 hover:bg-white/5 hover:text-white'}
                    `}
                  >
                    <Icon size={20} className={isActive ? 'text-golden-pollen' : ''} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-2xl bg-golden-pollen flex items-center justify-center text-charcoal-blue font-bold text-lg shadow-sm">
              {admin?.name?.charAt(0).toUpperCase() || 'D'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-white">{admin?.name || 'Deepak Sogani'}</p>
              <p className="text-xs text-tea-green truncate capitalize">{admin?.role || 'Superadmin'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-white/10 hover:bg-red-500/20 text-white/80 hover:text-red-400 transition-colors text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
