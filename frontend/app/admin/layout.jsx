'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isAuthenticated, getMe } from '../../lib/adminApi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

export default function AdminLayout({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    const checkAuth = async () => {
      if (isLoginPage) {
        setIsLoading(false);
        return;
      }

      if (!isAuthenticated()) {
        router.push('/admin/login');
        return;
      }

      try {
        const data = await getMe();
        setAdmin(data.admin || data);
      } catch (err) {
        console.error('Auth check failed', err);
        // Will be handled by adminApi (redirect to login)
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, isLoginPage, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#2E4052] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  // Map path to title
  const getPageTitle = () => {
    const path = pathname.split('/').filter(Boolean);
    if (path.length <= 1) return 'Dashboard';
    
    // e.g. /admin/opportunities/new -> 'Add Opportunity'
    if (path[2] === 'new') return `Add ${path[1].slice(0,-1)}`;
    if (path[3] === 'edit') return `Edit ${path[1].slice(0,-1)}`;
    
    return path[1].charAt(0).toUpperCase() + path[1].slice(1);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar admin={admin} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
          admin={admin} 
          title={getPageTitle()} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
