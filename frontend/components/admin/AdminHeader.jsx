'use client';

import { Menu, UserCircle } from 'lucide-react';
import { removeToken } from '../../lib/adminApi';

export default function AdminHeader({ admin, title, onMenuClick }) {
  const handleLogout = () => {
    removeToken();
    window.location.href = '/admin/login';
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-md text-gray-500 hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-medium text-gray-700">{admin?.name || 'Admin'}</span>
          <span className="text-xs bg-[#FFC857] text-[#2E4052] font-bold px-2.5 py-0.5 rounded-full capitalize">
            {admin?.role || 'Superadmin'}
          </span>
        </div>
        <button 
          onClick={handleLogout} 
          className="sm:hidden text-sm text-red-600 font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
