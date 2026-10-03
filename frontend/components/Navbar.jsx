'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE } from './ui/motion';
import Arrow from './ui/Arrow';

const navLinks = [
  { name: 'For Students', path: '/for-students' },
  { name: 'For Parents', path: '/for-parents' },
  { name: 'For Institutions', path: '/for-institutions' },
  { name: 'How It Works', path: '/how-it-works' },
  { name: 'About Deepak', path: '/about' },
  { name: 'Opportunities', path: '/opportunities' },
  { name: 'Resources', path: '/resources' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close overlay on route change, lock scroll while open.
  useEffect(() => setIsOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const isActive = (p) => pathname === p || pathname?.startsWith(p + '/');

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-nav px-3 pt-3 md:px-6 md:pt-5">
        <div
          className={`mx-auto flex max-w-page items-center justify-between gap-4 rounded-full border pl-5 pr-2 py-2 transition-[background-color,border-color] duration-700 ease-editorial ${
            scrolled || isOpen
              ? 'border-line bg-paper/80 backdrop-blur-xl'
              : 'border-transparent bg-transparent'
          }`}
        >
          <Link href="/" className="flex items-baseline gap-2 shrink-0" aria-label="Second Innings home">
            <span className="font-serif text-[1.375rem] leading-none tracking-[-0.01em] text-ink">
              Second Innings
            </span>
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal translate-y-[-2px]" />
          </Link>

          <nav className="hidden xl:flex items-center gap-1" aria-label="Primary">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`relative rounded-full px-3 py-2 text-[0.8125rem] transition-colors duration-300 ${
                  isActive(link.path) ? 'text-ink' : 'text-muted hover:text-ink'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-px h-px bg-signal"
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/book"
              className="group hidden sm:inline-flex items-center gap-2.5 rounded-full bg-ink pl-4 pr-1 py-1 text-[0.8125rem] font-medium text-paper transition-[transform,background-color] duration-500 ease-editorial hover:bg-ink-2 active:scale-[0.98]"
            >
              Start a Conversation
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-paper/10 transition-transform duration-500 ease-editorial group-hover:translate-x-0.5">
                <Arrow className="h-3 w-3" />
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              className="xl:hidden relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper transition-transform active:scale-[0.96]"
            >
              <span
                className={`absolute h-px w-4 bg-ink transition-transform duration-500 ease-editorial ${
                  isOpen ? 'rotate-45' : '-translate-y-[3px]'
                }`}
              />
              <span
                className={`absolute h-px w-4 bg-ink transition-transform duration-500 ease-editorial ${
                  isOpen ? '-rotate-45' : 'translate-y-[3px]'
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed inset-0 z-overlay flex flex-col bg-paper/95 backdrop-blur-2xl xl:hidden"
          >
            <nav className="page-x flex flex-1 flex-col justify-center pt-24 pb-10" aria-label="Mobile">
              <ul className="border-t border-line">
                {[{ name: 'Home', path: '/' }, ...navLinks, { name: 'Contact', path: '/contact' }].map((link, i) => (
                  <motion.li
                    key={link.path}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.06 + i * 0.045 }}
                    className="border-b border-line"
                  >
                    <Link
                      href={link.path}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-baseline justify-between py-3.5"
                    >
                      <span
                        className={`font-serif text-[2rem] leading-none tracking-[-0.02em] ${
                          pathname === link.path ? 'text-signal' : 'text-ink'
                        }`}
                      >
                        {link.name}
                      </span>
                      <span className="meta">{String(i + 1).padStart(2, '0')}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
                className="mt-10"
              >
                <Link
                  href="/book"
                  onClick={() => setIsOpen(false)}
                  className="group inline-flex items-center gap-3 rounded-full bg-ink pl-6 pr-1.5 py-1.5 font-medium text-paper active:scale-[0.98]"
                >
                  Start a Conversation
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper/10">
                    <Arrow className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
