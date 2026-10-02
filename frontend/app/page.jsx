'use client'

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Sparkles, 
  HelpCircle, 
  Compass, 
  Lightbulb, 
  Target, 
  Repeat,
  HeartHandshake,
  ShieldCheck,
  Quote
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const WHO_IS_IT_FOR = [
  {
    title: 'Trying to understand yourself better',
    desc: 'Your marks, degree or résumé tell only part of your story.',
    icon: Compass,
  },
  {
    title: 'Wondering what comes next',
    desc: 'You have options but aren\'t sure how to think about them.',
    icon: HelpCircle,
  },
  {
    title: 'Exploring education or career possibilities',
    desc: 'Not simply "Which course should I choose?" but also "Why does this choice make sense for me?"',
    icon: Lightbulb,
  },
  {
    title: 'Looking beyond conventional options',
    desc: 'You want to discover opportunities, experiences or paths you may not have encountered before.',
    icon: Sparkles,
  },
  {
    title: 'Preparing for a transition',
    desc: 'School to university. University life. Internships. Projects. First career decisions. Life after graduation.',
    icon: Target,
  },
  {
    title: 'Dealing with a setback or change of plan',
    desc: 'Something hasn\'t worked as expected, and you\'re trying to understand what comes next.',
    icon: Repeat,
  },
  {
    title: 'Carrying a question you haven\'t been able to discuss openly',
    desc: 'Sometimes the starting point isn\'t a career decision at all. It is simply something you need to talk through.',
    icon: MessageSquare,
  },
];

const METHODOLOGY_STEPS = [
  {
    step: '01',
    name: 'TALK',
    subtitle: 'What\'s on your mind?',
    description: 'You don\'t need to arrive with a perfectly framed question. Sometimes even "I am confused" is enough to begin.',
  },
  {
    step: '02',
    name: 'UNDERSTAND',
    subtitle: 'We look beyond the immediate question.',
    description: 'What matters to you? What are you experiencing? What are your concerns? What might be influencing your thinking? Understanding comes before advice.',
  },
  {
    step: '03',
    name: 'EXPLORE',
    subtitle: 'There may be possibilities you haven\'t considered yet.',
    description: 'Together, we explore different perspectives, alternatives, opportunities and questions worth thinking about.',
  },
  {
    step: '04',
    name: 'CHOOSE YOUR NEXT STEP',
    subtitle: 'The objective isn\'t for someone else to make the decision for you.',
    description: 'It is to help you move towards a next step that makes sense to you and that you are willing to own.',
  },
  {
    step: '05',
    name: 'FOLLOW THROUGH',
    subtitle: 'Where appropriate, we reconnect.',
    description: 'What did you try? What happened? What did you discover? What should happen next? Because a meaningful conversation becomes more valuable when it leads to action.',
  },
];

const STUDENT_VOICES = [
  {
    category: 'LIFE PREPARATION',
    quote: 'You never just prepared students for university, you prepared us for life. You taught us to take ownership, stay disciplined, think independently, stand by our decisions, and never compromise on our values.',
    name: 'Priya Kaushik',
    role: 'Project Manager | Business Analyst',
  },
  {
    category: 'LEADERSHIP',
    quote: 'You were the person who saw potential in me before I did... The confidence to take on opportunities, make difficult decisions, and lead people is something I owe to you.',
    name: 'Bismanpreet Singh',
    role: 'Startup Ecosystem Professional | Former Student Council President',
  },
  {
    category: 'PERSPECTIVE',
    quote: 'Whenever I found myself unsure of the next step, your perspective helped me see possibilities I couldn\'t see on my own... every student deserves to have a mentor like you.',
    name: 'Himangi Chaturvedi',
    role: 'Associate Project Manager',
  },
  {
    category: 'DECISION-MAKING',
    quote: 'What I value most is that you never simply gave answers - you helped me learn how to find them myself.',
    name: 'Omprakash Kumawat',
    role: 'Software Engineer',
  },
  {
    category: 'REAL-WORLD READINESS',
    quote: 'The professional world has made us realize exactly why you pushed us so hard. You didn\'t just teach us, you built our character and prepared us for reality.',
    name: 'Jia Soni',
    role: 'HR Manager | Coaching & Mentoring',
  },
  {
    category: 'CONFIDENCE',
    quote: 'You\'ve been more than a mentor - you\'ve been a catalyst... Every conversation with you left me feeling clearer, stronger, and more capable.',
    name: 'Diya Garg',
    role: 'Data Science Student',
  },
];

const WHAT_IT_IS_AND_ISNT = [
  { is: 'A space to talk.', isNot: 'A coaching institute.' },
  { is: 'An opportunity to think.', isNot: 'A motivational programme.' },
  { is: 'A place to explore possibilities.', isNot: 'A conventional career-selection service.' },
  { is: 'A source of new perspectives.', isNot: 'A substitute for professional mental-health support.' },
  { is: 'A conversation that can lead to action.', isNot: 'A place where somebody else decides your future for you.' },
  { is: 'A journey towards greater ownership of one\'s choices.', isNot: 'A system that tells you what you should become.' },
];

export default function Home() {
  return (
    <div className="flex flex-col w-full text-gray-800">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-charcoal-blue via-[#263747] to-midnight-violet text-white py-24 sm:py-32 px-6 overflow-hidden">
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-tea-green/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-golden-pollen/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <p className="text-xs uppercase tracking-widest text-tea-green font-semibold mb-4">
            SECOND INNINGS
          </p>
          <motion.h2 
            initial="hidden" animate="visible" variants={fadeIn}
            className="text-sm sm:text-base uppercase tracking-[0.25em] text-golden-pollen font-semibold mb-6"
          >
            Young Minds. New Perspectives. Wider Possibilities.
          </motion.h2>

          <motion.h1 
            initial="hidden" animate="visible" variants={fadeIn}
            className="text-4xl sm:text-6xl font-bold mb-6 font-serif tracking-tight leading-tight text-white"
          >
            Sometimes, you don't need another answer. You need the right conversation.
          </motion.h1>

          <motion.p 
            initial="hidden" animate="visible" variants={fadeIn}
            className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Second Innings is a space for young people to talk openly, understand themselves better, explore possibilities and find their own way forward.
          </motion.p>

          <motion.div 
            initial="hidden" animate="visible" variants={fadeIn}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              href="/book" 
              className="w-full sm:w-auto bg-golden-pollen text-charcoal-blue px-8 py-3.5 rounded-full font-bold hover:bg-secondary-hover shadow-lg hover:shadow-xl transition-all text-base sm:text-lg text-center"
            >
              Start a Conversation
            </Link>
            <a 
              href="#about-second-innings" 
              className="w-full sm:w-auto bg-white/10 border border-white/20 text-white px-8 py-3.5 rounded-full font-medium hover:bg-white/20 transition-all text-base sm:text-lg backdrop-blur-sm text-center"
            >
              Explore Second Innings
            </a>
          </motion.div>
        </div>
      </section>

      {/* 2. THE HOOK: INFORMATION EVERYWHERE VS CLARITY */}
      <section className="py-20 sm:py-28 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="space-y-6 text-gray-700">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-blue leading-snug">
              Not every question has an obvious answer.
            </h2>
            <p className="text-lg leading-relaxed">
              You have information everywhere. Courses to choose from. Careers to consider. Opportunities to explore. Opinions to listen to. Expectations to meet. And countless stories telling you what success should look like.
            </p>
            <p className="text-lg font-medium text-charcoal-blue">
              But more information doesn't always bring more clarity.
            </p>
            
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 my-6">
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-2">Sometimes, the questions are more personal:</p>
              <ul className="space-y-2 text-base sm:text-lg text-charcoal-blue font-serif italic">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-golden-pollen flex-shrink-0" />
                  What do I really want?
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-golden-pollen flex-shrink-0" />
                  What am I actually good at?
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-golden-pollen flex-shrink-0" />
                  Am I choosing for myself, or following what others expect?
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-golden-pollen flex-shrink-0" />
                  What possibilities am I not even aware of?
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-golden-pollen flex-shrink-0" />
                  And what should I do next?
                </li>
              </ul>
            </div>

            <p className="text-lg leading-relaxed">
              You don't need to have all the answers. Sometimes, you need a space where you can talk openly, think differently and explore without being judged or told what you should become.
            </p>
            <p className="text-lg font-serif font-bold text-charcoal-blue">
              That's where Second Innings begins. A conversation can bring a new perspective. A new perspective can open wider possibilities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. ABOUT SECOND INNINGS */}
      <section id="about-second-innings" className="py-20 sm:py-28 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary/70 font-semibold mb-2">About Second Innings</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-blue mb-4">
                A Space for Perspective, Possibilities and Action
              </h2>
            </div>

            <div className="prose prose-lg text-gray-700 space-y-5 leading-relaxed">
              <p>
                Second Innings is an initiative created to support young people as they navigate the choices, transitions and possibilities that shape their lives beyond the classroom.
              </p>
              <p>
                It is built on the belief that preparing for life requires more than academic achievement or access to information. Young people also benefit from opportunities to understand themselves, broaden their exposure, consider different perspectives and develop the confidence to make choices they can own.
              </p>
              <p>
                Second Innings brings these elements together through individual conversations, meaningful exposure, exploration of opportunities and thoughtful follow-through.
              </p>
              <p>
                It is deliberately different from a conventional counselling, coaching or motivational model. There are no ready-made prescriptions and no attempt to define success for the young person.
              </p>
              <p>
                Instead, the approach is to listen before responding, understand before suggesting, explore before narrowing choices, and encourage action rather than dependence.
              </p>
            </div>

            {/* Purpose Callout */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-golden-pollen font-bold mb-2">The Purpose Is Simple</p>
              <p className="text-xl sm:text-2xl font-serif font-bold text-charcoal-blue">
                To help young people see more, think more clearly and move forward with greater ownership of their choices.
              </p>
            </div>

            {/* Why Second Innings */}
            <div className="pt-6 border-t border-gray-200 space-y-4">
              <h3 className="text-2xl font-serif font-bold text-charcoal-blue">
                Why "Second Innings"?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                After more than three decades across the corporate world, entrepreneurship and higher education, Deepak Sogani chose to dedicate the next phase of his professional life to working with young people.
              </p>
              <p className="text-gray-700 leading-relaxed">
                His experience of working closely with university students reinforced something he had come to value deeply: some of the most meaningful contributions happen through conversations that help a young person gain perspective, discover an opportunity, reconsider a choice or take a meaningful next step.
              </p>
              <p className="p-4 rounded-xl bg-tea-green/20 text-charcoal-blue font-medium italic border border-tea-green/40">
                The first innings was about building his own journey. The Second Innings is about using that experience to contribute to the journeys of young people.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHO IT IS FOR (7 SITUATIONS) */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-primary/70 font-semibold mb-2">Who It Is For</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-blue mb-4">
              You don't need to have everything figured out.
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Second Innings is primarily for young people navigating important questions, choices and transitions in their lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WHO_IS_IT_FOR.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-golden-pollen/50 hover:shadow-sm transition-all flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-tea-green/30 text-charcoal-blue flex items-center justify-center flex-shrink-0 mt-1">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-charcoal-blue mb-1.5">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-charcoal-blue font-serif italic text-lg mb-4">
              You don't need to arrive with an answer. You can begin with the question.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center bg-golden-pollen text-charcoal-blue px-8 py-3.5 rounded-full font-bold hover:bg-secondary-hover shadow-md transition-all text-sm uppercase tracking-wider"
            >
              Start a Conversation <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (5 STEPS) */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-primary/70 font-semibold mb-2">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-blue mb-4">
              One Conversation Can Be a Beginning
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Second Innings does not begin with a presentation, a questionnaire full of scores or a predetermined solution. It begins with you.
            </p>
          </div>

          <div className="space-y-6">
            {METHODOLOGY_STEPS.map((s) => (
              <div 
                key={s.step}
                className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start gap-6"
              >
                <div className="text-3xl sm:text-4xl font-serif font-extrabold text-golden-pollen sm:w-16 flex-shrink-0">
                  {s.step}
                </div>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="text-xl font-bold text-charcoal-blue uppercase tracking-wider">{s.name}</h3>
                    <span className="text-sm font-serif italic text-gray-500">{s.subtitle}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MEET DEEPAK */}
      <section className="py-20 sm:py-28 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-64 h-80 rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <Image
                  src="/deepaksogani.jpeg"
                  alt="Deepak Sogani, Founder of Second Innings"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-7 space-y-4">
              <p className="text-xs uppercase tracking-widest text-primary/70 font-semibold">About Deepak</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-blue">
                Meet Deepak Sogani
              </h2>
              <p className="text-xs uppercase tracking-wider text-golden-pollen font-bold">
                Founder, Second Innings
              </p>
              
              <div className="prose text-gray-600 space-y-3 leading-relaxed text-sm sm:text-base">
                <p>
                  Deepak Sogani brings over 35 years of experience across the corporate world, entrepreneurship and higher education, giving him the opportunity to work with people across different ages, backgrounds and stages of life.
                </p>
                <p>
                  His experience in higher education brought him particularly close to young people: not only through formal responsibilities, but through countless conversations about their aspirations, choices, opportunities, challenges and life beyond the classroom.
                </p>
                <p>
                  Over time, he discovered that what he valued most was not telling young people what to do, but helping them think, bringing a different perspective to the conversation and opening their minds to possibilities they may not have considered.
                </p>
              </div>

              <blockquote className="p-4 rounded-xl bg-slate-50 border-l-4 border-golden-pollen italic text-charcoal-blue font-serif text-base mt-4">
                "I am not here to decide a young person's future. I want to help them understand themselves, see possibilities and make choices they can own."
                <footer className="text-xs font-sans not-italic text-gray-500 mt-2 font-semibold">
                  Deepak Sogani
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* 7. IN THEIR WORDS: STUDENT VOICES */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-primary/70 font-semibold mb-2">In Their Words</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-blue mb-4">
              Student Voices
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Long before Second Innings took shape, young people were already describing the value they found in their interactions with Deepak. These reflections, shared voluntarily by students and alumni on LinkedIn, offer a glimpse of the approach that now informs Second Innings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STUDENT_VOICES.map((t, idx) => (
              <div 
                key={idx}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="inline-block px-2.5 py-1 rounded bg-tea-green/25 text-[11px] font-bold text-charcoal-blue uppercase tracking-wider">
                    {t.category}
                  </div>
                  <p className="text-gray-700 italic text-sm leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <p className="font-bold text-charcoal-blue text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-500 mt-8 font-light">
            These voices come from different experiences, but a common thread runs through them: perspective, confidence, ownership and readiness for life beyond the classroom.
          </p>
        </div>
      </section>

      {/* 8. WHAT SECOND INNINGS IS — AND ISN'T */}
      <section className="py-20 sm:py-28 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-primary/70 font-semibold mb-2">Clarity & Expectations</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-blue mb-4">
              What Second Innings Is - And Isn't
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3">
              <h3 className="text-sm uppercase tracking-wider font-bold text-emerald-800 bg-emerald-50 px-4 py-2 rounded-xl text-center">
                Second Innings IS
              </h3>
              {WHAT_IT_IS_AND_ISNT.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3 text-sm text-gray-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>{item.is}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm uppercase tracking-wider font-bold text-rose-800 bg-rose-50 px-4 py-2 rounded-xl text-center">
                Second Innings IS NOT
              </h3>
              {WHAT_IT_IS_AND_ISNT.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3 text-sm text-gray-700">
                  <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  <span>{item.isNot}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOR PARENTS */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-golden-pollen font-bold text-xs uppercase tracking-wider">
              <HeartHandshake size={18} />
              <span>For Parents</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-blue leading-snug">
              Every parent wants their child to make thoughtful choices and build a meaningful future.
            </h2>

            <div className="space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base">
              <p>
                But as young people grow, they also need opportunities to question, explore and gradually take ownership of their decisions.
              </p>
              <p>
                Second Innings seeks to complement, not replace, the role of parents, teachers, educational institutions or qualified professionals.
              </p>
              <p>
                The objective is not to decide a young person's future for them. It is to provide an additional space for thoughtful conversation, broader perspective and exploration: helping young people become more confident in making choices they understand and own.
              </p>
              <p className="text-xs text-gray-500 pt-2">
                Where appropriate, parents may also become part of the broader conversation while respecting the young person's privacy and independence.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/for-parents"
                className="inline-flex items-center text-primary font-bold hover:text-secondary transition-colors text-sm"
              >
                Know More For Parents <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FINAL INVITATION / START A CONVERSATION */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-charcoal-blue via-[#263747] to-midnight-violet text-white text-center px-6">
        <div className="container mx-auto max-w-3xl space-y-6">
          <p className="text-xs uppercase tracking-widest text-tea-green font-semibold">
            Your First Step
          </p>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
            Your first step doesn't have to be a big one.
          </h2>
          <p className="text-lg sm:text-xl text-gray-200 font-light max-w-xl mx-auto">
            Sometimes, it can simply be a conversation. No commitment, no pressure, just perspective.
          </p>

          <div className="pt-4">
            <Link
              href="/book"
              className="inline-flex items-center bg-golden-pollen text-charcoal-blue font-bold px-10 py-4 rounded-full hover:bg-secondary-hover shadow-xl hover:shadow-2xl transition-all text-base sm:text-lg uppercase tracking-wider"
            >
              Start a Conversation <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>

          <div className="pt-8 flex items-center justify-center gap-2 text-xs text-gray-300">
            <ShieldCheck size={16} className="text-tea-green" />
            <Link href="/privacy-boundaries" className="hover:underline">
              Read our Privacy, Safety & Professional Boundaries
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
