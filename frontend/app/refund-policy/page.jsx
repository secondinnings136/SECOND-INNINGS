import Link from 'next/link';
import Button from '../../components/ui/Button';
import Breadcrumbs from '../../components/ui/Breadcrumbs';

export const metadata = {
  title: 'Refund & Engagement Policy | Second Innings',
  description:
    'Engagement and refund policy for Second Innings. Introductory conversations are currently complimentary with full fee transparency.',
  alternates: {
    canonical: 'https://second-innings.in/refund-policy',
  },
  openGraph: {
    title: 'Refund & Engagement Policy — Second Innings',
    description: 'Engagement policy for Second Innings. Introductory conversations are currently complimentary.',
    url: 'https://second-innings.in/refund-policy',
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="w-full">
      <div className="page-x pt-28 md:pt-36 pb-28 md:pb-40">
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs items={[{ name: 'Refund Policy', href: '/refund-policy' }]} />
          {/* Header */}
          <div className="border-b border-line pb-10 mb-12 mt-8">
            <span className="meta text-signal mb-4 block">Fair Practice Notice</span>
            <h1 className="font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.95] tracking-[-0.02em] text-ink mb-6">
              Engagement &amp; Refund Policy
            </h1>
            <p className="meta text-muted">
              Last Updated: October 2026
            </p>
          </div>

          {/* Core Policy Statement */}
          <div className="rounded-[1.75rem] border border-line bg-paper-2 p-8 md:p-12 space-y-6">
            <h2 className="font-serif text-[clamp(1.5rem,2.5vw,2rem)] text-ink leading-snug">
              Complimentary Introductory Conversations
            </h2>
            <p className="text-[1.125rem] leading-[1.75] text-ink-2">
              The introductory conversation is currently complimentary. Terms applicable to any future paid engagement will be communicated clearly before payment.
            </p>
            <p className="text-[0.9375rem] text-muted leading-relaxed">
              We believe meaningful mentoring begins with trust, transparency, and clarity. There are no surprise fees or automatic commitments.
            </p>
            <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-4">
              <Button href="/book">Start a Conversation</Button>
              <Link href="/contact" className="meta text-ink underline decoration-ink/20 hover:decoration-signal">
                Have a question? Write to secondinnings136@gmail.com →
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-between">
            <Link href="/" className="meta text-muted hover:text-ink">
              ← Return to Home
            </Link>
            <Link href="/privacy-boundaries" className="meta text-muted hover:text-ink">
              Privacy &amp; Boundaries →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
