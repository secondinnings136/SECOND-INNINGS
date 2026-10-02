'use client';

import { useState, useEffect } from 'react';
import { changePassword, getMe } from '../../../lib/adminApi';
import { KeyRound, User, Shield } from 'lucide-react';

export default function SettingsPage() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    getMe().then(data => setAdmin(data.admin || data)).catch(console.error);
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await changePassword({ 
        currentPassword: passwords.currentPassword, 
        newPassword: passwords.newPassword 
      });
      setMessage('Password updated successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      
      {/* Profile Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
          <User className="text-[#2E4052]" size={20} />
          <h2 className="font-semibold text-gray-800">Admin Profile</h2>
        </div>
        <div className="p-6">
          {admin ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              <div><span className="text-gray-500 text-sm block">Name</span><p className="font-medium text-lg">{admin.name}</p></div>
              <div><span className="text-gray-500 text-sm block">Email</span><p className="font-medium text-lg">{admin.email}</p></div>
              <div>
                <span className="text-gray-500 text-sm block">Role</span>
                <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFC857]/30 text-[#2E4052] border border-[#FFC857]/50 font-bold capitalize">
                  <Shield size={12} /> {admin.role}
                </span>
              </div>
            </div>
          ) : (
            <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-gray-200 rounded w-3/4"></div></div></div>
          )}
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
          <KeyRound className="text-[#2E4052]" size={20} />
          <h2 className="font-semibold text-gray-800">Change Password</h2>
        </div>
        <div className="p-6">
          {message && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">{message}</div>}
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">{error}</div>}
          
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input type="password" required value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md outline-none focus:border-[#2E4052]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" required value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md outline-none focus:border-[#2E4052]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input type="password" required value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md outline-none focus:border-[#2E4052]" />
            </div>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-[#FFC857] hover:bg-[#ffbe3b] text-[#2E4052] font-bold rounded-xl shadow-sm transition-all disabled:opacity-70 mt-2">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
      
    </div>
  );
}
