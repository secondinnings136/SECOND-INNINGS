'use client'

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    name: 'TALK',
    tagline: 'What\'s on your mind?',
    description: 'You don\'t need to arrive with a perfectly framed question. Sometimes even "I am confused" is enough to begin.',
    detail: 'We start by creating a respectful, non-judgmental space where you can share your thoughts openly without worrying about being graded, evaluated or judged.',
  },
  {
    step: '02',
    name: 'UNDERSTAND',
    tagline: 'We look beyond the immediate question.',
    description: 'What matters to you? What are you experiencing? What are your concerns? What might be influencing your thinking? Understanding comes before advice.',
    detail: 'We take the time to explore your strengths, pressures, values and real context before jumping to any conclusions or premature suggestions.',
  },
  {
    step: '03',
    name: 'EXPLORE',
    tagline: 'There may be possibilities you haven\'t considered yet.',
    description: 'Together, we explore different perspectives, alternatives, opportunities and questions worth thinking about.',
    detail: 'We look at wider pathways, internships, fellowships, new-age disciplines and options you may not have been exposed to yet.',
  },
  {
    step: '04',
    name: 'CHOOSE YOUR NEXT STEP',
    tagline: 'The objective isn\'t for someone else to make the decision for you.',
    description: 'It is to help you move towards a next step that makes sense to you and that you are willing to own.',
    detail: 'Your life, your choices. Our role is to help you see clearly so that you make decisions based on evidence and personal conviction.',
  },
  {
    step: '05',
    name: 'FOLLOW THROUGH',
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
  { is: 'A journey towards greater ownership of one\'s choices.', isNot: 'A system that tells you what you should become.' },
];

export default function HowItWorks() {
  return (
    <div className="flex flex-col w-full text-gray-800">
      {/* Hero */}
      <section className="bg-gradient-to-br from-charcoal-blue via-[#263747] to-midnight-violet text-white py-20 sm:py-28 text-center relative overflow-hidden px-6">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <p className="text-xs uppercase tracking-widest text-tea-green font-semibold mb-3">
            The Approach
          </p>
          <motion.h1 
            initial="hidden" animate="visible" variants={fadeIn}
            className="text-4xl sm:text-5xl font-bold mb-6 font-serif tracking-tight"
          >
            One Conversation Can Be a Beginning
          </motion.h1>
          <motion.p 
            initial="hidden" animate="visible" variants={fadeIn}
            className="text-lg sm:text-xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed"
          >
            Second Innings does not begin with a presentation, a questionnaire full of scores or a predetermined solution. It begins with you.
          </motion.p>
        </div>
      </section>

      {/* 5-Step Methodology */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-primary/70 font-semibold mb-2">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-blue">
              From Confusion to Practical Action
            </h2>
          </div>

          <div className="space-y-6">
            {HOW_IT_WORKS_STEPS.map((s) => (
              <div 
                key={s.step}
                className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start gap-6 hover:border-golden-pollen/50 transition-all"
              >
                <div className="text-3xl sm:text-4xl font-serif font-extrabold text-golden-pollen sm:w-16 flex-shrink-0">
                  {s.step}
                </div>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <h3 className="text-xl font-bold text-charcoal-blue uppercase tracking-wider">{s.name}</h3>
                    <span className="text-sm font-serif italic text-gray-500">— {s.tagline}</span>
                  </div>
                  <p className="text-gray-700 font-medium text-base sm:text-lg leading-relaxed">
                    {s.description}
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed pt-1">
                    {s.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Benchmark Quote */}
          <div className="mt-12 p-8 rounded-3xl bg-tea-green/20 border border-tea-green/40 text-center max-w-3xl mx-auto">
            <p className="font-serif italic text-xl text-charcoal-blue mb-2">
              "After speaking with Deepak Sir, I understand myself better and I know what I should do next."
            </p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              The benchmark for every conversation
            </p>
          </div>
        </div>
      </section>

      {/* What It Is / What It Is Not */}
      <section className="py-20 sm:py-28 bg-slate-50 border-t border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-primary/70 font-semibold mb-2">Expectations & Boundaries</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-blue">
              What Second Innings Is — And Isn't
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto mt-2 text-sm sm:text-base">
              Clear boundaries create trusted spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider font-bold text-emerald-800 bg-emerald-50 px-4 py-2.5 rounded-xl text-center">
                Second Innings IS
              </h3>
              {COMPARISON_ITEMS.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white border border-gray-100 flex items-center gap-3 text-sm text-gray-800 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>{item.is}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider font-bold text-rose-800 bg-rose-50 px-4 py-2.5 rounded-xl text-center">
                Second Innings IS NOT
              </h3>
              {COMPARISON_ITEMS.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white border border-gray-100 flex items-center gap-3 text-sm text-gray-700 shadow-sm">
                  <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  <span>{item.isNot}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/privacy-boundaries"
              className="inline-flex items-center text-xs text-primary font-semibold hover:underline"
            >
              <ShieldCheck size={14} className="mr-1.5" />
              Read our full Privacy, Safety & Professional Boundaries statement
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-charcoal-blue via-[#263747] to-midnight-violet text-white text-center px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold">
            Start with a single conversation.
          </h2>
          <p className="text-gray-200 font-light">
            No preparation needed. You don't need to arrive with an answer: you can begin with the question.
          </p>
          <div>
            <Link
              href="/book"
              className="inline-flex items-center bg-golden-pollen text-charcoal-blue font-bold px-8 py-3.5 rounded-full hover:bg-secondary-hover shadow-lg transition-all text-sm uppercase tracking-wider"
            >
              Start a Conversation <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
