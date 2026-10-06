import Link from 'next/link';
import Button from '../../components/ui/Button';
import Arrow from '../../components/ui/Arrow';
import PageHero from '../../components/ui/PageHero';
import SectionHead from '../../components/ui/SectionHead';
import { Reveal, RevealGroup, RevealItem } from '../../components/ui/Reveal';

export const metadata = {
  title: 'How It Works | One Conversation Can Be a Beginning — Second Innings',
  description:
    'Discover how every Second Innings conversation unfolds: Talk, Understand, Explore, Choose Your Next Step, and Follow Through. Listening first, followed by clear, owned actions.',
  keywords: [
    'how Second Innings works',
    'youth perspective framework',
    'student conversation stages',
    'human led approach',
    'career guidance process India',
    'next step action',
  ],
  alternates: {
    canonical: 'https://second-innings.in/how-it-works',
  },
  openGraph: {
    title: 'How It Works — Second Innings',
    description:
      'Listening and perspective before prescription. Explore the five-stage journey that turns uncertainty into clarity and action.',
    url: 'https://second-innings.in/how-it-works',
  },
};

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    name: 'Talk',
    tagline: "What's on your mind?",
    description: 'You don\'t need to arrive with a perfectly framed question. Sometimes even "I am confused" is enough to begin.',
    detail: 'We start by creating a respectful, non-judgmental space where you can share your thoughts openly without worrying about being graded, evaluated or judged.',
  },
  {
    step: '02',
    name: 'Understand',
    tagline: 'We look beyond the immediate question.',
    description: 'What matters to you? What are you experiencing? What are your concerns? What might be influencing your thinking? Understanding comes before advice.',
    detail: 'We take the time to explore your strengths, pressures, values and real context before jumping to any conclusions or premature suggestions.',
  },
  {
    step: '03',
    name: 'Explore',
    tagline: "There may be possibilities you haven't considered yet.",
    description: 'Together, we explore different perspectives, alternatives, opportunities and questions worth thinking about.',
    detail: 'We look at wider pathways, internships, fellowships, new-age disciplines and options you may not have been exposed to yet.',
  },
  {
    step: '04',
    name: 'Choose your next step',
    tagline: "The objective isn't for someone else to make the decision for you.",
    description: 'It is to help you move towards a next step that makes sense to you and that you are willing to own.',
    detail: 'Your life, your choices. Our role is to help you see clearly so that you make decisions based on evidence and personal conviction.',
  },
  {
    step: '05',
    name: 'Follow through',
    tagline: 'Where appropriate, we reconnect.',
    description: 'What did you try? What happened? What did you discover? What should happen next? Because a meaningful conversation becomes more valuable when it leads to action.',
    detail: 'Conversations gain true power when they translate into a tangible, practical next step and thoughtful review.',
  },
];

const COMPARISON_ITEMS = [
  { is: 'A space to talk.', isNot: 'A coaching institute.' },
  { is: 'An opportunity to think.', isNot: 'A motivational programme.' },
  { is: 'A place to explore possibilities.', isNot: 'A conventional career-selection service.' },
  { is: 'A source of new perspectives.', isNot: 'A substitute for professional mental-health support.' },
  { is: 'A conversation that can lead to action.', isNot: 'A place where somebody else decides your future for you.' },
  { is: "A journey towards greater ownership of one's choices.", isNot: 'A system that tells you what you should become.' },
];

export default function HowItWorks() {
  return (
    <div className="w-full">
      <PageHero
        meta={['The Approach', 'Methodology', '5 Stages']}
        title="One conversation can be a beginning."
        lede="Second Innings does not begin with a presentation, a questionnaire full of scores or a predetermined solution. It begins with you."
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <Button href="/book">Start a Conversation</Button>
          <Button href="#methodology" variant="link" arrow="down">See the 5 stages</Button>
        </div>
      </PageHero>

      {/* 5-Step Methodology */}
      <section id="methodology" className="scroll-mt-24 border-t border-line bg-paper-2">
        <div className="page-x py-28 md:py-40">
          <SectionHead
            meta="How it works"
            title="From confusion to practical action"
            lede="Understanding comes before suggestion. Exploration comes before decision."
          />

          <div className="mt-16 md:mt-24 space-y-6">
            <RevealGroup>
              {HOW_IT_WORKS_STEPS.map((s) => (
                <RevealItem
                  key={s.step}
                  className="mb-6 rounded-[1.75rem] border border-line bg-paper p-8 md:p-12 transition-colors duration-500 ease-editorial"
                >
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
                    <div className="md:col-span-3 flex flex-col justify-between">
                      <span className="meta">Step {s.step}</span>
                      <p aria-hidden="true" className="text-outline font-serif text-[clamp(4.5rem,8vw,7rem)] leading-[0.8] mt-4">
                        {s.step}
                      </p>
                    </div>
                    <div className="md:col-span-9 flex flex-col justify-center">
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                        <h3 className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] text-ink">
                          {s.name}
                        </h3>
                        <span className="font-serif italic text-muted text-lg">— {s.tagline}</span>
                      </div>
                      <p className="mt-4 text-[1.125rem] text-ink font-medium leading-relaxed">
                        {s.description}
                      </p>
                      <p className="mt-3 text-[0.9375rem] text-muted leading-relaxed">
                        {s.detail}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          {/* Benchmark Quote */}
          <Reveal className="mt-16 rounded-[1.75rem] border border-line bg-paper p-8 md:p-12 text-center max-w-3xl mx-auto">
            <p className="meta text-signal mb-4">The benchmark for every conversation</p>
            <p className="font-serif italic text-[clamp(1.5rem,2.4vw,2.125rem)] text-ink leading-snug">
              &ldquo;After speaking with Mr. Deepak Sogani, I understand myself better and I know what I should do next.&rdquo;
            </p>
          </Reveal>
        </div>
      </section>

      {/* What It Is / What It Is Not: Swiss Table */}
      <section className="border-t border-line">
        <div className="page-x py-28 md:py-40">
          <SectionHead
            meta="Expectations and boundaries"
            title="What Second Innings is, and isn't"
            lede="Clear boundaries create trusted spaces."
          />

          <div className="mt-16 border-t border-ink">
            <div className="grid grid-cols-2 border-b border-line py-4">
              <p className="meta text-ink">Second Innings is</p>
              <p className="meta pl-4 md:pl-8">Second Innings is not</p>
            </div>
            <RevealGroup>
              {COMPARISON_ITEMS.map((row) => (
                <RevealItem key={row.is} className="grid grid-cols-2 border-b border-line">
                  <p className="py-6 pr-4 font-serif text-[clamp(1.25rem,2.2vw,1.875rem)] leading-[1.15] text-ink md:py-8">
                    {row.is}
                  </p>
                  <p className="border-l border-line py-6 pl-4 text-[0.9375rem] leading-[1.5] text-muted md:py-8 md:pl-8 md:text-[1.0625rem]">
                    <span className="strike-signal">{row.isNot}</span>
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <Reveal className="mt-12 text-center">
            <Link
              href="/privacy-boundaries"
              className="meta text-muted hover:text-ink transition-colors underline decoration-ink/20 underline-offset-4"
            >
              Read our full Privacy, Safety &amp; Professional Boundaries statement →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line bg-paper-2">
        <div className="page-x py-32 md:py-44">
          <RevealGroup className="max-w-[56rem]">
            <RevealItem as="p" className="meta mb-6">Start here</RevealItem>
            <RevealItem as="h2" className="font-serif text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.95] text-ink">
              Start with a single conversation.
            </RevealItem>
            <RevealItem as="p" className="lede mt-6 text-[1.125rem]">
              No preparation needed. You don&apos;t need to arrive with an answer: you can begin with the question.
            </RevealItem>
            <RevealItem className="mt-10">
              <Button href="/book">Start a Conversation</Button>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>
    </div>
  );
}
