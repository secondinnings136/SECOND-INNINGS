'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin, setToken } from '../../../lib/adminApi';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginAdmin(email, password);
      if (data.token) {
        setToken(data.token);
        router.push('/admin');
      } else {
        setError('Login failed, no token received');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2E4052] via-[#243342] to-[#412234] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        <div className="p-8 text-center bg-slate-50/80 border-b border-gray-100">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#BDD9BF]/40 text-[#2E4052] text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-[#2E4052]"></span>
            Portal Access
          </div>
          <h1 className="text-2xl font-bold font-serif text-[#2E4052] tracking-tight">Second Innings</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold">Self-Service Admin Dashboard</p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 text-sm p-3.5 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2E4052] focus:border-transparent outline-none transition-all text-sm"
                placeholder="admin@secondinnings.com"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2E4052] focus:border-transparent outline-none transition-all text-sm"
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFC857] hover:bg-[#ffbe3b] text-[#2E4052] font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center text-sm uppercase tracking-wider"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#2E4052]/30 border-t-[#2E4052] rounded-full animate-spin"></div>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
