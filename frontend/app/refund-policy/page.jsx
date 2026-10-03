import Link from 'next/link';
import Button from '../../components/ui/Button';

export const metadata = {
  title: 'Cancellation & Refund Policy | Second Innings',
  description: 'Transparent cancellation, rescheduling, and refund terms for Second Innings mentoring sessions.',
};

const TOC = [
  { id: 'section-1', title: '1. Philosophy of Transparency' },
  { id: 'section-2', title: '2. Introductory & Discovery Conversations' },
  { id: 'section-3', title: '3. Rescheduling Policy' },
  { id: 'section-4', title: '4. Cancellation & Refund Eligibility' },
  { id: 'section-5', title: '5. Multi-Session Packages' },
  { id: 'section-6', title: '6. Mentor-Initiated Cancellations' },
  { id: 'section-7', title: '7. Refund Processing Timeline' },
  { id: 'section-8', title: '8. Institutional Pilot Projects' },
  { id: 'section-9', title: '9. How to Request a Refund' },
];

export default function RefundPolicyPage() {
  return (
    <div className="w-full">
      <div className="page-x pt-36 md:pt-48 pb-28 md:pb-40">
        {/* Header */}
        <div className="border-b border-line pb-12 mb-16">
          <span className="meta text-signal mb-4 block">Fair Practice Notice</span>
          <h1 className="font-serif text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.95] tracking-[-0.02em] text-ink mb-6">
            Cancellation &amp; Refund Policy
          </h1>
          <p className="meta text-muted mb-6">
            Last Updated: October 2026 • Clear, Fair &amp; Transparent Terms
          </p>
          <p className="lede text-[1.125rem]">
            At Second Innings, we believe that any relationship founded on mentoring must begin with integrity and mutual trust. Our cancellation and refund policy is built to be fair, simple, and devoid of hidden clauses.
          </p>
        </div>

        {/* Two-Column Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Sticky Table of Contents */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-32 space-y-4">
              <p className="meta text-ink mb-4">Table of Contents</p>
              <ul className="space-y-2.5 border-l border-line pl-4 text-xs font-mono uppercase tracking-wider">
                {TOC.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-muted hover:text-ink transition-colors block py-1"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Right: Policy Content */}
          <div className="lg:col-span-8 max-w-[68ch] space-y-16 text-[1.0625rem] leading-[1.75] text-ink-2">
            {/* Section 1 */}
            <section id="section-1" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-[2rem] text-ink leading-snug">
                1. Philosophy of Transparency
              </h2>
              <p>
                We do not believe in locking students or parents into rigid financial traps. Young people need clarity and perspective, not commercial anxiety. Every engagement with Mr. Deepak Sogani is conducted with clear expectations set upfront.
              </p>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-[2rem] text-ink leading-snug">
                2. Introductory &amp; Discovery Conversations
              </h2>
              <p>
                Initial 30-minute discovery conversations booked through our platform carry <strong>no lock-in obligations</strong>. If a session is complimentary or subsidized, there is zero fee to cancel or reschedule at any time.
              </p>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="scroll-mt-32 rounded-[1.75rem] border border-line bg-paper-2 p-8 space-y-4">
              <span className="meta text-sprout block">Flexibility First</span>
              <h2 className="font-serif text-[1.75rem] text-ink leading-snug">
                3. Rescheduling Policy
              </h2>
              <p className="text-[0.9375rem] text-ink-2 leading-relaxed">
                We understand that academic exams, university schedules, and family situations can change unexpectedly.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[0.875rem] text-muted">
                <li>
                  <strong>Notice of 24 Hours or More:</strong> You can reschedule any one-to-one mentoring session at no additional cost by contacting us via WhatsApp or email.
                </li>
                <li>
                  <strong>Notice within 24 Hours:</strong> We accommodate one emergency reschedule free of charge. Subsequent same-day cancellations may require re-booking to respect the mentor&apos;s allocated calendar slot.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-[2rem] text-ink leading-snug">
                4. Cancellation &amp; Refund Eligibility
              </h2>
              <p>For paid individual mentoring sessions:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl border border-line bg-paper-2">
                  <p className="font-mono text-xs uppercase tracking-wider text-sprout font-bold mb-1">100% Full Refund</p>
                  <p className="text-xs text-muted leading-relaxed">
                    If you cancel your scheduled session with at least 24 hours advance notice prior to the meeting time.
                  </p>
                </div>
                <div className="p-5 rounded-2xl border border-line bg-paper-2">
                  <p className="font-mono text-xs uppercase tracking-wider text-coral font-bold mb-1">Late Cancellations</p>
                  <p className="text-xs text-muted leading-relaxed">
                    Cancellations made within 4 hours of the slot without request to reschedule may be subject to a nominal 20% slot-holding deduction.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-[2rem] text-ink leading-snug">
                5. Multi-Session Packages &amp; Cohorts
              </h2>
              <p>
                If you have enrolled in a multi-session mentoring journey (e.g., transition guidance across 3 or 5 sessions) and choose not to proceed after starting:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[0.9375rem] text-muted">
                <li>
                  You are entitled to a <strong>pro-rata refund for all unconducted sessions</strong> with zero penalty.
                </li>
                <li>
                  Simply notify us via email at <a href="mailto:secondinnings136@gmail.com" className="text-ink underline">secondinnings136@gmail.com</a> stating your request to discontinue.
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="section-6" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-[2rem] text-ink leading-snug">
                6. Mentor-Initiated Cancellations
              </h2>
              <p>
                In the rare event that Mr. Deepak Sogani must cancel or postpone a session due to illness, travel disruptions, or unforeseen circumstances:
              </p>
              <p className="text-[0.9375rem] text-muted">
                You will be given the option of an immediate priority reschedule at your convenience, or a <strong>100% full refund immediately</strong>, whichever you prefer.
              </p>
            </section>

            {/* Section 7 */}
            <section id="section-7" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-[2rem] text-ink leading-snug">
                7. Refund Processing Timeline
              </h2>
              <p>
                Once approved, all refunds are initiated directly to the original bank account, UPI ID, or card used during payment.
              </p>
              <div className="p-4 rounded-xl border border-line bg-paper-2 font-mono text-xs text-ink space-y-1">
                <p>• Initiation Window: 24 to 48 business hours</p>
                <p>• Bank Processing / Credit Window: 5 to 7 business days (per banking gateway cycles)</p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="section-8" className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-[2rem] text-ink leading-snug">
                8. Institutional Pilot Projects
              </h2>
              <p>
                Institutional partnerships, school workshops, and 90-day pilots are governed by the milestone terms detailed in their signed Institutional MoU. Fees tied to specific delivery milestones that have not yet commenced are refundable per the agreed MoU termination clauses.
              </p>
            </section>

            {/* Section 9 */}
            <section id="section-9" className="scroll-mt-32 rounded-[1.75rem] border border-line bg-paper-2 p-8 space-y-3">
              <span className="meta text-signal block">Easy Redressal</span>
              <h2 className="font-serif text-[1.75rem] text-ink leading-snug">
                9. How to Request a Cancellation or Refund
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                To request a reschedule, cancellation, or refund, contact us directly with your booking name or phone number:
              </p>
              <div className="text-xs sm:text-sm text-ink-2 font-mono space-y-1.5 pt-2">
                <p><strong>Email:</strong> <a href="mailto:secondinnings136@gmail.com" className="underline hover:text-signal">secondinnings136@gmail.com</a> (Subject: &ldquo;Refund / Reschedule Request&rdquo;)</p>
                <p><strong>WhatsApp Support:</strong> <a href="https://wa.me/917737220724" target="_blank" rel="noopener noreferrer" className="underline hover:text-signal">+91 77372 20724</a></p>
                <p><strong>Address:</strong> Second Innings, Jaipur, Rajasthan, India</p>
              </div>
            </section>

            {/* Bottom Nav */}
            <div className="border-t border-line pt-8 flex flex-wrap items-center justify-between gap-4">
              <Link href="/" className="meta text-muted hover:text-ink">
                ← Return to Home
              </Link>
              <div className="flex items-center gap-6">
                <Link href="/terms-and-conditions" className="meta text-muted hover:text-ink">
                  Terms &amp; Conditions →
                </Link>
                <Button href="/book">Start a Conversation</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
