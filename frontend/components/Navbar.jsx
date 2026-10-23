'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, User, Sparkles } from 'lucide-react';
import { useUserAuth } from '../context/UserAuthContext';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Students', href: '/for-students' },
  { name: 'Parents', href: '/for-parents' },
  { name: 'Institutions', href: '/for-institutions' },
  { name: 'Opportunities', href: '/opportunities' },
  { name: 'Resources', href: '/resources' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, remainingCredits } = useUserAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Account';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out-expo ${
          scrolled
            ? 'bg-paper/85 backdrop-blur-md border-b border-stone/40 py-3.5'
            : 'bg-transparent py-5 lg:py-6'
        }`}
      >
        <div className="container-editorial flex items-center justify-between">
          {/* Brand Lockup */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative h-10 w-10 md:h-11 md:w-11 overflow-hidden rounded-full border border-stone/40 bg-warm/40 shrink-0">
              <Image
                src="/logo.png"
                alt="Second Innings Logo"
                fill
                className="object-contain p-1 transition-transform duration-500 ease-out-expo group-hover:scale-105"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl md:text-2xl tracking-tight text-ink leading-none">
                Second Innings
              </span>
              <span className="hidden sm:block text-[10px] font-mono uppercase tracking-[0.14em] text-ash mt-1">
                Young Minds · New Perspectives
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-[14px] font-medium transition-colors duration-300 py-1 ${
                    isActive ? 'text-ink' : 'text-charcoal/70 hover:text-ink'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-terracotta"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Account & CTA */}
          <div className="hidden xl:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-stone/60 bg-white/90 hover:border-ink/40 text-ink text-xs font-semibold transition-all shadow-sm"
              >
                <span className="w-6 h-6 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center font-bold text-[11px]">
                  {firstName.charAt(0).toUpperCase()}
                </span>
                <span>{firstName}&apos;s Dashboard</span>
                {remainingCredits > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-sage/15 text-sage font-mono text-[10px] font-bold">
                    {remainingCredits} {remainingCredits === 1 ? 'Credit' : 'Credits'}
                  </span>
                )}
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-charcoal hover:text-ink border border-transparent hover:border-stone/50 transition-all"
              >
                <User className="w-3.5 h-3.5 text-terracotta" />
                <span>Sign In</span>
              </Link>
            )}

            <Link
              href="/book"
              className="btn-editorial text-xs py-2.5 px-5"
            >
              <span>{isAuthenticated ? 'Book Session' : 'Start a Conversation'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className="xl:hidden flex items-center justify-center w-10 h-10 rounded-full border border-stone/60 text-ink hover:bg-warm transition-colors"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Fullscreen Editorial Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-paper pt-24 pb-10 px-6 flex flex-col justify-between xl:hidden overflow-y-auto"
          >
            <div className="container-editorial">
              <p className="eyebrow mb-6">Navigation</p>
              <div className="flex flex-col divide-y divide-stone/40">
                {navLinks.map((link, idx) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04, duration: 0.4 }}
                    >
                      <Link
                        href={link.href}
                        className={`flex items-center justify-between py-3.5 font-serif text-2xl ${
                          isActive ? 'text-terracotta italic' : 'text-ink'
                        }`}
                      >
                        <span>{link.name}</span>
                        <span className="font-mono text-xs text-ash">0{idx + 1}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="container-editorial pt-8 border-t border-stone/40 space-y-3">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="btn-editorial-outline w-full justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-terracotta" />
                    <span>My Mentee Dashboard ({firstName})</span>
                  </span>
                  {remainingCredits > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-sage/15 text-sage text-xs font-mono">
                      {remainingCredits} Credits
                    </span>
                  )}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="btn-editorial-outline w-full justify-between"
                >
                  <span>Sign In / Create Account</span>
                  <User className="w-4 h-4" />
                </Link>
              )}

              <Link
                href="/book"
                className="btn-editorial w-full justify-between"
              >
                <span>{isAuthenticated ? 'Book Next Session' : 'Start a Conversation'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
