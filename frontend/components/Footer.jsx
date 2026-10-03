'use client';

import Link from 'next/link';
import Arrow from './ui/Arrow';
import Logo from './Logo';

const columns = [
  {
    title: 'Who it is for',
    links: [
      { name: 'For Students (16 to 25)', href: '/for-students' },
      { name: 'For Parents', href: '/for-parents' },
      { name: 'For Institutions', href: '/for-institutions' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'About Deepak', href: '/about' },
      { name: 'Opportunities', href: '/opportunities' },
      { name: 'Resources', href: '/resources' },
      { name: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Policies & Support',
    links: [
      { name: 'Privacy Policy (DPDP)', href: '/privacy-policy' },
      { name: 'Terms & Conditions', href: '/terms-and-conditions' },
      { name: 'Refund Policy', href: '/refund-policy' },
      { name: 'Website Support & Helpdesk', href: '/support' },
      { name: 'Mentoring Boundaries', href: '/privacy-boundaries' },
    ],
  },
];

export default function Footer() {
  const replayIntro = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('si_intro_seen');
      window.location.reload();
    }
  };

  return (
    <footer className="relative mt-16 border-t border-line bg-paper-2">
      <div className="page-x pt-20 md:pt-28">
        {/* Invitation row */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-7">
            <div className="mb-8">
              <Logo size="md" showTagline={true} />
            </div>
            <p className="max-w-[18ch] font-serif text-[clamp(2.25rem,4.4vw,4rem)] leading-[1] tracking-[-0.02em] text-ink">
              Your first step can simply be a conversation.
            </p>
            <Link
              href="/book"
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-ink pl-6 pr-1.5 py-1.5 font-medium text-paper transition-[transform,background-color] duration-500 ease-editorial hover:bg-ink-2 active:scale-[0.98]"
            >
              Start a Conversation
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper/10 transition-transform duration-500 ease-editorial group-hover:translate-x-0.5">
                <Arrow className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>

          <div className="md:col-span-5 md:pl-10 md:border-l md:border-line">
            <p className="meta mb-6">Write or call</p>
            <ul className="space-y-4 text-[0.9375rem]">
              <li>
                <a href="mailto:deepak@second-innings.in" className="group flex flex-col">
                  <span className="text-muted text-[0.8125rem]">Primary</span>
                  <span className="text-ink underline decoration-ink/20 underline-offset-4 group-hover:decoration-signal">
                    deepak@second-innings.in
                  </span>
                </a>
              </li>
              <li>
                <Link href="/support" className="group flex flex-col">
                  <span className="text-muted text-[0.8125rem]">Website Issues &amp; Support</span>
                  <span className="text-ink underline decoration-ink/20 underline-offset-4 group-hover:decoration-signal">
                    Helpdesk &amp; Bug Reporting →
                  </span>
                </Link>
              </li>
              <li className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
                <a href="https://wa.me/917737220724" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-signal transition-colors">
                  WhatsApp ↗
                </a>
                <a href="tel:+917737220724" className="text-ink hover:text-signal transition-colors font-mono text-[0.8125rem] tracking-tight">
                  +91 77372 20724
                </a>
                <a href="https://www.linkedin.com/in/deepak-sogani/" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-signal transition-colors">
                  LinkedIn ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Link columns on a hairline grid */}
        <div className="hairline-grid mt-20 grid-cols-1 sm:grid-cols-3 [&>*]:bg-paper-2">
          {columns.map((col) => (
            <div key={col.title} className="p-6 md:p-8">
              <p className="meta mb-5">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[0.9375rem] text-ink-2 hover:text-ink transition-colors">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Wordmark */}
        <div aria-hidden="true" className="select-none overflow-hidden pt-16 md:pt-20">
          <p className="whitespace-nowrap font-serif text-[clamp(4rem,15.5vw,15rem)] leading-[0.8] tracking-[-0.04em] text-ink">
            Second Innings<span className="text-signal">.</span>
          </p>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-6 text-[0.8125rem] text-muted md:flex-row md:items-center md:justify-between">
          <p>© 2026 Second Innings. Young Minds. New Perspectives. Wider Possibilities.</p>
          <button
            type="button"
            onClick={replayIntro}
            className="self-start md:self-auto meta hover:text-ink transition-colors"
          >
            ↺ Replay intro
          </button>
        </div>
      </div>
    </footer>
  );
}
