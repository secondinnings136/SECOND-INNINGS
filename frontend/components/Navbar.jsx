'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'For Students', path: '/for-students' },
    { name: 'For Parents', path: '/for-parents' },
    { name: 'For Institutions', path: '/for-institutions' },
    { name: 'About Deepak', path: '/about' },
    { name: 'Opportunities', path: '/opportunities' },
    { name: 'Resources', path: '/resources' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-white py-5'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex flex-col">
            <span className="text-2xl font-serif font-bold text-primary tracking-tight">SECOND INNINGS</span>
            <span className="hidden md:block text-xs font-medium text-primary/70 tracking-wider mt-1">
              Young Minds. New Perspectives. Wider Possibilities.
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors hover:text-charcoal-blue ${
                  pathname === link.path ? 'text-charcoal-blue font-bold border-b-2 border-golden-pollen pb-1' : 'text-charcoal-blue/80'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/book"
              className="bg-golden-pollen text-charcoal-blue px-6 py-2.5 rounded-full font-semibold shadow-sm hover:bg-secondary-hover hover:shadow transition-all"
            >
              Start a Conversation
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="xl:hidden p-2 text-primary"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 right-0 w-full sm:w-80 bg-white shadow-2xl xl:hidden flex flex-col pt-24 px-6 z-30 h-screen"
          >
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium py-2 border-b border-gray-100 ${
                    pathname === link.path ? 'text-charcoal-blue font-bold border-l-4 border-golden-pollen pl-2' : 'text-charcoal-blue/80'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/book"
                onClick={() => setIsOpen(false)}
                className="bg-golden-pollen text-charcoal-blue text-center px-6 py-3 rounded-full font-semibold shadow-md hover:bg-secondary-hover transition-colors mt-6"
              >
                Start a Conversation
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
