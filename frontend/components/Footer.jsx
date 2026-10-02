'use client';

import Link from 'next/link';
import { useState } from 'react';
import { subscribeNewsletter } from '../lib/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus({ loading: true, success: null, error: null });

    try {
      await subscribeNewsletter({ email });
      setStatus({ loading: false, success: 'Thank you for subscribing!', error: null });
      setEmail('');
    } catch (err) {
      console.error('Newsletter error:', err);
      setStatus({ 
        loading: false, 
        success: null, 
        error: err.message?.includes('already subscribed') 
          ? 'You are already subscribed!' 
          : 'Subscription failed. Please try again.' 
      });
    }
  };

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand & Newsletter */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-white tracking-tight mb-1">SECOND INNINGS</h2>
              <p className="text-secondary text-sm font-medium tracking-widest">MENTORING YOUNG MINDS</p>
            </div>
            
            <form onSubmit={handleSubscribe} className="space-y-3 pt-2">
              <p className="text-sm text-gray-300">Subscribe to our newsletter</p>
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="bg-white/10 text-white placeholder-gray-400 px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-secondary text-sm"
                />
                <button
                  type="submit"
                  disabled={status.loading}
                  className="bg-secondary text-white px-4 py-2 rounded-r-md font-medium hover:bg-secondary/90 transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
                >
                  {status.loading ? '...' : 'Join'}
                </button>
              </div>
              {status.success && (
                <p className="text-xs text-green-400 font-medium">{status.success}</p>
              )}
              {status.error && (
                <p className="text-xs text-amber-300 font-medium">{status.error}</p>
              )}
            </form>
          </div>

          {/* Navigate */}
          <div>
            <h3 className="text-secondary font-semibold mb-4 uppercase text-sm tracking-wider">Navigate</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Deepak</Link></li>
              <li><Link href="/opportunities" className="text-gray-300 hover:text-white transition-colors">Opportunities</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* For You */}
          <div>
            <h3 className="text-secondary font-semibold mb-4 uppercase text-sm tracking-wider">For You</h3>
            <ul className="space-y-3">
              <li><Link href="/for-students" className="text-gray-300 hover:text-white transition-colors">For Students</Link></li>
              <li><Link href="/for-parents" className="text-gray-300 hover:text-white transition-colors">For Parents</Link></li>
              <li><Link href="/for-institutions" className="text-gray-300 hover:text-white transition-colors">For Institutions</Link></li>
              <li><Link href="/resources" className="text-gray-300 hover:text-white transition-colors">Resources</Link></li>
            </ul>
          </div>

          {/* Connect & Follow */}
          <div>
            <h3 className="text-golden-pollen font-semibold mb-4 uppercase text-sm tracking-wider">Connect</h3>
            <ul className="space-y-3 text-gray-300">
              <li><a href="mailto:deepaksogani18@gmail.com" className="hover:text-white transition-colors">deepaksogani18@gmail.com</a></li>
              <li><a href="https://wa.me/919314072153" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp: +91 9314072153</a></li>
              <li><a href="tel:+919314072153" className="hover:text-white transition-colors">Phone: +91 9314072153</a></li>
              <li className="pt-2">
                <a href="https://linkedin.com/in/deepak-sogani" target="_blank" rel="noopener noreferrer" className="text-golden-pollen hover:text-white transition-colors font-medium">
                  Follow on LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center my-10">
          <Link
            href="/book"
            className="bg-golden-pollen text-charcoal-blue px-8 py-3.5 rounded-full font-bold hover:bg-secondary-hover transition-all text-lg shadow-xl hover:shadow-2xl"
          >
            Start a Conversation
          </Link>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>© 2026 Second Innings. All rights reserved.</p>
          <button 
            onClick={() => {
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('si_intro_seen');
                window.location.reload();
              }
            }}
            className="text-xs text-[#BDD9BF] hover:text-[#FFC857] transition-colors py-1 px-3 rounded-full bg-white/5 border border-white/10 mt-2 md:mt-0 inline-flex items-center gap-1.5"
          >
            <span>↺</span> Replay Opening Intro
          </button>
          <p className="mt-2 md:mt-0">Jaipur, Rajasthan, India</p>
        </div>
      </div>
    </footer>
  );
}
