import React from 'react';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import Arrow from '../../components/ui/Arrow';
import PageHero from '../../components/ui/PageHero';
import SectionHead from '../../components/ui/SectionHead';
import { Reveal, RevealGroup, RevealItem } from '../../components/ui/Reveal';

export const metadata = {
  title: 'For Schools & Universities | Student Development Layer & 90-Day Pilot — Second Innings',
  description:
    'A student development layer that complements academic systems without disrupting them. Individual mentoring, student leadership workshops, and structured 90-day pilots for schools, colleges, and universities.',
  keywords: [
    'student development program for colleges',
    'mentoring programs for higher education institutions',
    'school to university transition workshop',
    'student affairs leadership program',
    'holistic student mentoring pilot',
    'career exposure workshops for schools',
    'student mental clarity and leadership',
    'institution student retention and engagement',
    '90 day student development pilot',
  ],
  alternates: {
    canonical: 'https://second-innings.in/for-institutions',
  },
  openGraph: {
    title: 'For Schools & Universities — Second Innings',
    description:
      'Complements your academic and counseling systems with experienced student affairs mentorship. Discover our 90-day institutional pilot.',
    url: 'https://second-innings.in/for-institutions',
  },
};

const models = [
  { title: "Individual Mentoring", text: "One-to-one conversations on career direction, confidence, transition, and self-understanding." },
  { title: "Small-Group Conversations", text: "Structured cohort sessions around common adolescent and career decision concerns." },
  { title: "Student Leadership Development", text: "Using councils, clubs, and peer activities as practical leadership laboratories." },
  { title: "Career & Higher-Ed Exposure", text: "Candid, grounded interactions with seasoned professionals, alumni, and academics." },
  { title: "Parent Engagement", text: "Constructive forums helping parents understand modern career dynamics without friction." },
  { title: "School-to-Life Transition", text: "Preparing senior students for personal independence, campus life, and emotional readiness." },
  { title: "Professional Exposure", text: "Connecting students with curated internships, fellowships, and real-world pathways." },
  { title: "Student Development Insights", text: "Evidence-based, aggregate reporting on student needs, concerns, and observable movement." }
];

const dimensions = [
  { name: "Clarity", evidence: "More definitive, research-backed choices about electives, streams, and career paths." },
  { name: "Confidence", evidence: "Increased voluntary participation in classroom discussions and campus initiatives." },
  { name: "Exposure", evidence: "Higher uptake of external competitions, national fellowships, and curated internships." },
  { name: "Action", evidence: "Consistent completion of personal 7-Day action steps and initiative follow-through." },
  { name: "Ownership", evidence: "Students taking personal responsibility rather than relying purely on parental prompting." },
  { name: "Continuity", evidence: "Smoother year-to-year transitions with lower disengagement and drop-off anxiety." },
  { name: "Institutional Value", evidence: "Enhanced institutional reputation, stronger parent trust, and positive word-of-mouth." }
];

const pilotPhases = [
  {
    period: "Days 1–30",
    title: "Understand & Listen",
    desc: "Immerse into institutional culture, existing student services, and identify 2–3 genuine priority focus areas."
  },
  {
    period: "Days 31–60",
    title: "Pilot & Engage",
    desc: "Deliver pilot 1-on-1 conversations, small-group sessions, and parent dialogues based on initial findings."
  },
  {
    period: "Days 61–90",
    title: "Integrate & Review",
    desc: "Present documented qualitative and quantitative movement to leadership for informed joint decision-making."
  }
];

export default function ForInstitutionsPage() {
  return (
    <div className="w-full">
      <PageHero
        meta={['For Schools, Colleges & Universities', 'Campus Partnership', 'Student Development Layer']}
        title="A student development layer that complements what you already do."
        lede="Second Innings works alongside your academic, counselling and administrative systems, not instead of them."
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <Button href="/contact">Talk to Us About Your Institution</Button>
          <Button href="#pilot" variant="link" arrow="down">See the 90-day pilot</Button>
        </div>
      </PageHero>

      {/* S2: Value Cycle */}
      <section className="border-t border-line bg-paper-2">
        <div className="page-x py-28 md:py-40 text-center">
          <SectionHead
            meta="Potential institutional value"
            title="The virtuous cycle of student development"
            lede="How a dedicated mentoring presence compounds institutional trust and student ownership over time."
            className="max-w-3xl mx-auto"
          />

          <div className="mt-16 flex flex-wrap justify-center items-center gap-3 md:gap-4 max-w-5xl mx-auto">
            {['Better Student Experience', 'Stronger Parent Trust', 'Positive Word of Mouth', 'Enhanced Campus Culture', 'Sustained Engagement'].map((step, idx, arr) => (
              <React.Fragment key={idx}>
                <div className="rounded-full border border-line bg-paper px-6 py-3.5 font-serif text-[1.125rem] text-ink">
                  {step}
                </div>
                {idx < arr.length - 1 && (
                  <span className="text-muted text-sm hidden md:inline">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* S3: Engagement Models (8 Hairline Grid cells) */}
      <section className="border-t border-line">
        <div className="page-x py-28 md:py-40">
          <SectionHead
            meta="Frameworks"
            title="8 engagement frameworks for your campus"
            lede="Tailored modules that integrate smoothly with your existing academic calendar."
          />

          <RevealGroup className="hairline-grid mt-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {models.map((model, idx) => (
              <RevealItem
                key={idx}
                className="group flex min-h-[17rem] flex-col justify-between p-8 transition-colors duration-500 ease-editorial hover:bg-paper-2"
              >
                <span className="meta">{String(idx + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-serif text-[1.5rem] leading-snug text-ink mb-3">
                    {model.title}
                  </h3>
                  <p className="text-[0.9375rem] text-muted leading-relaxed">
                    {model.text}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* S4: 90-Day Pilot */}
      <section id="pilot" className="scroll-mt-24 border-t border-line bg-paper-2">
        <div className="page-x py-28 md:py-40">
          <SectionHead
            meta="Risk-free validation"
            title="Start small. Understand first. Demonstrate value. Then decide."
            lede="Our structured 90-day pilot model is designed to explore your campus environment, observe student engagement, and determine what measurable value emerges before any long-term commitment."
          />

          <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            {pilotPhases.map((phase, idx) => (
              <Reveal key={idx} delay={idx * 0.1} className="rounded-[1.75rem] border border-line bg-paper p-8 flex flex-col justify-between min-h-[18rem]">
                <div>
                  <span className="meta text-signal">{phase.period}</span>
                  <h3 className="font-serif text-[1.75rem] text-ink mt-4 mb-3">
                    {phase.title}
                  </h3>
                  <p className="text-[0.9375rem] text-muted leading-relaxed">
                    {phase.desc}
                  </p>
                </div>
                <div className="pt-6 border-t border-line mt-6">
                  <span className="meta">Phase {idx + 1} of 3</span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16 rounded-[1.75rem] border border-ink bg-paper p-8 md:p-12 text-center max-w-3xl mx-auto">
            <p className="meta text-signal mb-3">The Day-90 Question</p>
            <p className="font-serif italic text-[clamp(1.5rem,2.5vw,2.25rem)] text-ink leading-snug">
              &ldquo;Has Deepak&apos;s presence created meaningful additional value for your institution and its students?&rdquo;
            </p>
          </Reveal>
        </div>
      </section>

      {/* S5: Measurable Outcomes */}
      <section className="border-t border-line">
        <div className="page-x py-28 md:py-40">
          <SectionHead
            meta="Observable metrics"
            title="7 dimensions of measurable movement"
            lede="Clear observable benchmarks we track across the engagement."
          />

          <div className="mt-16 border-t border-ink">
            <RevealGroup>
              {dimensions.map((dim, idx) => (
                <RevealItem key={dim.name} className="grid grid-cols-1 md:grid-cols-12 border-b border-line py-7 md:py-8 items-baseline gap-4">
                  <div className="md:col-span-3 flex items-baseline gap-4">
                    <span className="meta">{String(idx + 1).padStart(2, '0')}</span>
                    <h3 className="font-serif text-[1.625rem] text-ink">{dim.name}</h3>
                  </div>
                  <div className="md:col-span-9">
                    <p className="text-[1.0625rem] text-muted leading-relaxed">{dim.evidence}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* S6: CTA */}
      <section className="border-t border-line bg-paper-2">
        <div className="page-x py-32 md:py-44">
          <RevealGroup className="max-w-[56rem]">
            <RevealItem as="p" className="meta mb-6">Discovery</RevealItem>
            <RevealItem as="h2" className="font-serif text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.95] text-ink">
              Start with an institutional discovery call.
            </RevealItem>
            <RevealItem as="p" className="lede mt-6 text-[1.125rem]">
              We will discuss your campus dynamics, student priorities, and explore a low-friction pilot.
            </RevealItem>
            <RevealItem className="mt-10">
              <Button href="/contact">Talk to Us About Your Institution</Button>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>
    </div>
  );
}
