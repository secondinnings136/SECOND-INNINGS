import React from 'react';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import Arrow from '../../components/ui/Arrow';
import PageHero from '../../components/ui/PageHero';
import SectionHead from '../../components/ui/SectionHead';
import { Reveal, RevealGroup, RevealItem } from '../../components/ui/Reveal';
import StudentOutcomesGrid from '../../components/home/StudentOutcomesGrid';

export const metadata = {
  title: 'Mentoring for Students (Ages 16–25) | Career Clarity & Self-Belief — Second Innings',
  description:
    'Feeling stuck in career choices or college transitions? Second Innings provides independent, non-judgmental one-on-one mentoring for young people aged 16–25 to think clearly and decide with confidence.',
  keywords: [
    'career confusion after 12th',
    'what to do after graduation if confused',
    'career guidance for college students',
    'feeling stuck in college career',
    'how to choose the right career path',
    'life guidance for 20 year olds',
    'how to build confidence for interviews',
    'finding direction in early 20s',
    'peer pressure and career choices',
    'how to talk to parents about career choice',
    'youth mentoring platform India',
    'one on one student mentoring',
  ],
  alternates: {
    canonical: 'https://second-innings.in/for-students',
  },
  openGraph: {
    title: 'Mentoring for Students (16–25) — Second Innings',
    description:
      'You have the information. What you need is perspective. One-on-one mentoring to navigate what comes next.',
    url: 'https://second-innings.in/for-students',
  },
};

const concerns = [
  "I don't know what career to choose",
  "Everyone seems to have a plan except me",
  "I'm good at studies but struggle with confidence",
  "My parents want one thing, I want another",
  "I don't know how to communicate in interviews or group settings",
  "I have no exposure beyond my classroom",
  "I'm about to graduate and I have no idea what comes next",
  "I want to do something meaningful but don't know where to start",
];

const areas = [
  "Career & higher-education uncertainty",
  "Confidence & self-belief",
  "Decision-making & ownership",
  "Communication & articulation",
  "Exposure to people, pathways & opportunities",
  "Leadership & participation",
  "Professional & life readiness",
  "Finding internships, fellowships, scholarships",
  "Transition from education to adult life",
];

const outcomes = [
  { title: "Clarity", desc: "Clearer understanding of the next step and the reasons behind it." },
  { title: "Confidence", desc: "Greater willingness to participate, ask questions, and approach opportunities." },
  { title: "Exposure", desc: "Interaction with people, pathways, and resources previously unfamiliar." },
  { title: "Action", desc: "Completion of agreed exploration or self-development action steps." },
  { title: "Ownership", desc: "Increasingly evidence-based, mature decisions made independently." },
];

export default function ForStudentsPage() {
  return (
    <div className="w-full">
      <PageHero
        meta={['For Young People', 'Ages 16 to 25', 'Student Mentoring']}
        title="You have the information. What you need is perspective."
        lede="Career confusion, confidence issues, and 'what next' anxiety are natural parts of growing up. You do not have to figure it all out alone."
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <Button href="/book">Start a Conversation</Button>
          <Button href="/opportunities" variant="link" arrow="up-right">Explore Opportunities</Button>
        </div>
      </PageHero>

      {/* S2: Sound Familiar? (Hairline Grid) */}
      <section className="border-t border-line bg-paper-2">
        <div className="page-x py-28 md:py-40">
          <SectionHead
            meta="Common questions"
            title="Sound familiar?"
            lede="These are some of the most frequent starting points students bring into our conversations."
          />

          <RevealGroup className="hairline-grid mt-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {concerns.map((text, idx) => (
              <RevealItem
                key={idx}
                className="group flex min-h-[14rem] flex-col justify-between p-7 transition-colors duration-500 ease-editorial hover:bg-paper-3"
              >
                <span className="meta">{String(idx + 1).padStart(2, '0')}</span>
                <p className="font-serif italic text-[1.375rem] leading-[1.2] text-ink">
                  &ldquo;{text}&rdquo;
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* S3: What Mentoring Covers */}
      <section className="border-t border-line">
        <div className="page-x py-28 md:py-40">
          <SectionHead
            meta="Curriculum of conversations"
            title="What we can explore together"
            lede="Mentoring spans both professional direction and personal readiness."
          />

          <RevealGroup className="hairline-grid mt-16 grid-cols-1 md:grid-cols-3">
            {areas.map((area, idx) => (
              <RevealItem
                key={idx}
                className="p-8 transition-colors duration-500 ease-editorial hover:bg-paper-2"
              >
                <span className="meta">{String(idx + 1).padStart(2, '0')}</span>
                <h3 className="font-serif text-[1.5rem] leading-snug text-ink mt-6">
                  {area}
                </h3>
              </RevealItem>
            ))}
          </RevealGroup>

          {/* S4: Ownership Disclaimer Callout */}
          <Reveal className="mt-16 rounded-[1.75rem] border border-ink bg-paper p-8 md:p-12">
            <p className="meta text-signal mb-4">Ownership principle</p>
            <p className="font-serif text-[clamp(1.5rem,2.5vw,2.25rem)] text-ink leading-snug max-w-[45ch]">
              We won&apos;t tell you what career to choose or what decision to make. Your life, your choices. We help you think more clearly so you can decide with confidence.
            </p>
          </Reveal>
        </div>
      </section>

      {/* S5: Student Outcomes */}
      <section className="border-t border-line bg-paper-2">
        <div className="page-x py-28 md:py-40">
          <SectionHead
            meta="Observable growth"
            title="What students walk away with"
            lede="Five pillars that develop through sustained, thoughtful conversations."
          />

          <StudentOutcomesGrid className="mt-16" />
        </div>
      </section>

      {/* S6: Mini Methodology */}
      <section className="border-t border-line">
        <div className="page-x py-24 md:py-32 text-center">
          <RevealGroup className="max-w-3xl mx-auto">
            <RevealItem as="p" className="meta mb-4">Our approach</RevealItem>
            <RevealItem as="h2" className="font-serif text-[clamp(2rem,3.5vw,3rem)] text-ink mb-10">
              Our 7-Step Mentoring Process
            </RevealItem>
            <RevealItem className="flex flex-wrap justify-center items-center gap-2 md:gap-4 mb-8">
              {['Listen', 'Understand', 'Explore', 'Perspective', 'Connect', 'Act', 'Review'].map((step, idx, arr) => (
                <React.Fragment key={step}>
                  <span className="meta rounded-full border border-line bg-paper px-4 py-2 text-ink">
                    {step}
                  </span>
                  {idx < arr.length - 1 && <span className="text-muted text-xs">→</span>}
                </React.Fragment>
              ))}
            </RevealItem>
            <RevealItem>
              <Button href="/how-it-works" variant="link">See the full methodology</Button>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      {/* S7: CTA */}
      <section className="border-t border-line bg-paper-2">
        <div className="page-x py-32 md:py-44">
          <RevealGroup className="max-w-[56rem]">
            <RevealItem as="p" className="meta mb-6">Take the first step</RevealItem>
            <RevealItem as="h2" className="font-serif text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.95] text-ink">
              Ready to explore your possibilities?
            </RevealItem>
            <RevealItem as="p" className="lede mt-6 text-[1.125rem]">
              A 30-minute conversation with Deepak can bring clarity to questions you have been carrying for months.
            </RevealItem>
            <RevealItem className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="/book">Start a Conversation</Button>
              <Button href="/opportunities" variant="secondary" arrow="up-right">Explore Opportunities</Button>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>
    </div>
  );
}
