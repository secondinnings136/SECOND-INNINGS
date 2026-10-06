import React from 'react';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import Arrow from '../../components/ui/Arrow';
import PageHero from '../../components/ui/PageHero';
import SectionHead from '../../components/ui/SectionHead';
import { Reveal, RevealGroup, RevealItem } from '../../components/ui/Reveal';
import Breadcrumbs from '../../components/ui/Breadcrumbs';

export const metadata = {
  title: 'Guidance for Parents | Supporting Young Adults Without Pressure — Second Innings',
  description:
    'Constructive guidance for parents supporting young adults through modern career choices and transitions. Complementing family trust with independent perspective.',
  keywords: [
    'how to support child career choice',
    'how to talk to teenager about future without arguing',
    'guidance for parents of college students',
    'parent child communication about career',
    'mentor for my teenage son daughter',
    'helping child choose career without pressure',
    'new age careers advice for parents',
    'understanding modern career options India',
    'parenting young adults transition',
  ],
  alternates: {
    canonical: 'https://second-innings.in/for-parents',
  },
  openGraph: {
    title: 'Guidance for Parents — Second Innings',
    description:
      'You want the best for your child. So do we. Bridging the conversation between parent expectations and student aspirations.',
    url: 'https://second-innings.in/for-parents',
  },
};

const principles = [
  { 
    title: "Accept Before You Advise", 
    text: "Children open up when they feel accepted without the immediate fear of judgment or comparison." 
  },
  { 
    title: "Listen Before You Solve", 
    text: "Young people usually seek understanding and validation before they are ready for solutions." 
  },
  { 
    title: "Encourage Growth, Not Perfection", 
    text: "Celebrate honest effort, resilience, and curiosity rather than just test scores." 
  },
  { 
    title: "Build Character Before Career", 
    text: "Integrity, empathy, discipline, and emotional balance are permanent lifelong assets." 
  },
  { 
    title: "Become a Learning Parent", 
    text: "The most effective parents learn alongside their children in an ever-evolving world." 
  }
];

const concerns = [
  "My child doesn't open up to me about their future plans",
  "I don't understand these new-age careers and AI roles",
  "I want to guide and protect them without being controlling",
  "How do I balance high expectations with their independence?",
  "Is my child genuinely ready for university life or adulthood?"
];

const PARENT_FAQS = [
  {
    q: 'How does Second Innings support parents?',
    a: 'Second Innings provides an independent, trusted space that helps bridge generational communication. We help young people explore their aspirations clearly while helping parents understand new-age opportunities with calm and confidence.'
  },
  {
    q: 'Does Second Innings replace parents, teachers, or professional counsellors?',
    a: 'No. Second Innings seeks to complement, not replace, the role of parents, educators, educational institutions, or qualified medical/mental health professionals.'
  },
  {
    q: 'Can parents start a conversation about their child?',
    a: 'Yes. Parents can reach out to discuss their child’s transitions, explore guiding principles, or arrange a private conversation for their child. For young people under 18, parental consent is always mandatory.'
  }
];

export default function ForParentsPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: PARENT_FAQS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <div className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="page-x pt-28 md:pt-36">
        <Breadcrumbs items={[{ name: 'For Parents', href: '/for-parents' }]} />
      </div>

      <PageHero
        meta={['For Parents', 'Family & Perspective', 'Intergenerational Dialogue']}
        title="Every parent wants their child to make thoughtful choices and build a meaningful future."
        lede="Second Innings seeks to complement, not replace, the role of parents, teachers, educational institutions or qualified professionals."
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <Button href="/book">Start a Conversation About Your Child</Button>
          <Button href="#principles" variant="link" arrow="down">Explore Guiding Principles</Button>
        </div>
      </PageHero>

      {/* The Core Role: Editorial Split */}
      <section className="border-t border-line bg-paper-2">
        <div className="page-x grid grid-cols-1 gap-12 py-28 md:grid-cols-12 md:py-40">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-32">
              <SectionHead
                meta="The parent-mentor bridge"
                title="A space for perspective and exploration"
              />
            </div>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <RevealGroup className="space-y-6">
              <RevealItem as="p" className="lede">
                As young people grow, they also need opportunities to question, explore and gradually take ownership of their decisions.
              </RevealItem>
              <RevealItem as="p" className="lede">
                The objective is not to decide a young person&apos;s future for them.
              </RevealItem>
              <RevealItem as="p" className="lede">
                It is to provide an additional space for thoughtful conversation, broader perspective and exploration: helping young people become more confident in making choices they understand and own.
              </RevealItem>
              <RevealItem as="blockquote" className="mt-8 border-l-2 border-signal pl-6 font-serif italic text-[1.25rem] text-ink leading-relaxed">
                &ldquo;Where appropriate, parents may also become part of the broader conversation while respecting the young person&apos;s privacy and independence.&rdquo;
              </RevealItem>
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* Principles: Hairline Grid */}
      <section id="principles" className="scroll-mt-24 border-t border-line">
        <div className="page-x py-28 md:py-40">
          <SectionHead
            meta="Guiding principles"
            title="How parents can support"
            lede="A few principles that can make parent-child conversations more constructive."
          />

          <RevealGroup className="hairline-grid mt-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {principles.map((item, idx) => (
              <RevealItem
                key={idx}
                className="group flex min-h-[16rem] flex-col justify-between p-8 transition-colors duration-500 ease-editorial hover:bg-paper-2"
              >
                <span className="meta">{String(idx + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-serif text-[1.625rem] text-ink mb-3 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[0.9375rem] text-muted leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </RevealItem>
            ))}
            <RevealItem className="!bg-ink text-paper flex flex-col justify-between p-8">
              <span className="meta text-paper/60">Perspective</span>
              <div>
                <p className="font-serif italic text-[1.375rem] leading-snug text-paper">
                  Every generation navigates a world the previous one did not inhabit.
                </p>
                <p className="text-[0.875rem] text-paper/70 mt-3">
                  Patience and listening anchor long-term trust.
                </p>
              </div>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      {/* Common Concerns: Editorial List */}
      <section className="border-t border-line bg-paper-2">
        <div className="page-x py-28 md:py-40">
          <SectionHead
            meta="Empathy and understanding"
            title="Does this sound familiar?"
            lede="Every parent encounters these moments of uncertainty."
          />

          <div className="mt-16 border-t border-ink">
            <RevealGroup>
              {concerns.map((concern, idx) => (
                <RevealItem
                  key={idx}
                  className="grid grid-cols-12 border-b border-line py-7 md:py-8 items-baseline gap-4"
                >
                  <span className="meta col-span-2 md:col-span-1">{String(idx + 1).padStart(2, '0')}</span>
                  <p className="col-span-10 md:col-span-11 font-serif italic text-[clamp(1.25rem,2.2vw,1.875rem)] text-ink">
                    &ldquo;{concern}&rdquo;
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* Parent FAQs Section */}
      <section className="border-t border-line">
        <div className="page-x py-24 md:py-36">
          <SectionHead
            meta="Parent inquiries"
            title="Questions Parents Frequently Ask"
            lede="Reassurance and clarity on how we collaborate with families."
          />

          <div className="mt-16 max-w-4xl mx-auto space-y-6">
            <RevealGroup>
              {PARENT_FAQS.map((faq, idx) => (
                <RevealItem
                  key={idx}
                  className="rounded-2xl border border-line bg-paper-2 p-6 md:p-8"
                >
                  <h4 className="font-serif text-[1.25rem] text-ink mb-3">{faq.q}</h4>
                  <p className="text-[0.9375rem] text-muted leading-relaxed">{faq.a}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* Confidentiality & Safeguarding */}
      <section className="border-t border-line bg-paper-2">
        <div className="page-x py-20 md:py-24">
          <Reveal className="rounded-[1.75rem] border border-line bg-paper p-8 md:p-12 max-w-4xl mx-auto">
            <p className="meta text-signal mb-3">Safeguarding &amp; ethics</p>
            <h4 className="font-serif text-[1.75rem] text-ink mb-4">Safety and Professional Boundaries</h4>
            <p className="text-[1.0625rem] text-muted leading-relaxed">
              For participants below the age of 18, appropriate parental/guardian consent and safeguarding requirements always apply. Second Innings is committed to providing a responsible and transparent environment.
            </p>
            <div className="mt-6">
              <Link href="/privacy-boundaries" className="meta text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-signal">
                Read our full Privacy &amp; Boundaries Policy →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line bg-paper">
        <div className="page-x py-32 md:py-44">
          <RevealGroup className="max-w-[56rem]">
            <RevealItem as="p" className="meta mb-6">Partnering together</RevealItem>
            <RevealItem as="h2" className="font-serif text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.95] text-ink">
              Start a conversation about your child.
            </RevealItem>
            <RevealItem as="p" className="lede mt-6 text-[1.125rem]">
              We are here to listen, offer perspective, and partner in your child&apos;s growth.
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
