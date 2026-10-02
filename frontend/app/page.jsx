'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Compass, Users, Building, ShieldCheck, Search, Lightbulb, Map, ArrowRight, ArrowUpRight, GraduationCap, CheckCircle2, MessageCircle } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* S1: Hero Section */}
      <section className="relative bg-gradient-to-br from-charcoal-blue via-[#263747] to-midnight-violet text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:24px_24px]"></div>
        
        {/* Decorative subtle ambient glows using brand colors */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-tea-green/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-golden-pollen/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-tea-green text-xs md:text-sm font-medium tracking-wide mb-6">
            <span className="w-2 h-2 rounded-full bg-golden-pollen animate-pulse"></span>
            A Human-Led Mentoring & Perspective Platform
          </div>

          <motion.h1 
            initial="hidden" animate="visible" variants={fadeIn}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight font-serif text-white tracking-tight"
          >
            Navigating What Comes Next — With Clarity, Not Confusion.
          </motion.h1>

          <motion.p 
            initial="hidden" animate="visible" variants={fadeIn}
            className="text-lg md:text-xl text-gray-200 mb-10 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Second Innings is a mentoring platform for young people aged 16–25. We help you think clearly, see possibilities, and take your next step with confidence.
          </motion.p>

          <motion.div 
            initial="hidden" animate="visible" variants={fadeIn}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              href="/book" 
              className="w-full sm:w-auto bg-golden-pollen text-charcoal-blue px-8 py-3.5 rounded-full font-bold hover:bg-[#ffbe3b] active:scale-[0.98] shadow-lg hover:shadow-xl transition-all text-lg duration-200 text-center"
            >
              Start a Conversation
            </Link>
            <Link 
              href="/how-it-works" 
              className="w-full sm:w-auto bg-white/10 border-2 border-white/30 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/20 active:scale-[0.98] transition-all text-lg backdrop-blur-sm duration-200 text-center"
            >
              See How It Works
            </Link>
          </motion.div>
        </div>
      </section>

      {/* S2: The Problem */}
      <section className="py-20 bg-slate-50 text-center border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <div className="inline-block px-3 py-1 rounded-full bg-tea-green/30 text-charcoal-blue text-xs font-bold uppercase tracking-wider mb-4">
              The Reality
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif text-charcoal-blue">Information Is Everywhere. Perspective Is Not.</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We live in a world overflowing with data, opinions, and advice. Yet, when faced with critical choices about education, careers, and life paths, young people often feel overwhelmed. The gap isn't a lack of information; it's a lack of context, self-understanding, and unbiased perspective to make sense of that information.
            </p>
          </motion.div>
        </div>
      </section>

      {/* S3: The Gap (3 Columns) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif text-charcoal-blue">The Space Between Education and Life</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Academic ability alone does not automatically create life readiness.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-slate-50 border border-slate-100 p-8 rounded-2xl hover:border-tea-green/60 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-xl bg-tea-green/30 text-charcoal-blue flex items-center justify-center mb-6">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-charcoal-blue">Students are informed</h3>
              <p className="text-gray-600 leading-relaxed">But information does not automatically become perspective, judgement or ownership. Many struggle to filter noise from reality.</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-slate-50 border border-slate-100 p-8 rounded-2xl hover:border-golden-pollen/60 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-xl bg-golden-pollen/25 text-charcoal-blue flex items-center justify-center mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-charcoal-blue">Parents are invested</h3>
              <p className="text-gray-600 leading-relaxed">Adolescence, new-age careers, and university transitions create unfamiliar questions. Parents care deeply but need modern perspective.</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-slate-50 border border-slate-100 p-8 rounded-2xl hover:border-midnight-violet/40 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-xl bg-midnight-violet/10 text-midnight-violet flex items-center justify-center mb-6">
                <Building className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-charcoal-blue">Institutions are evolving</h3>
              <p className="text-gray-600 leading-relaxed">Academic structures excel at curriculum delivery, but an additional human-led mentoring layer prepares students for the world beyond marks.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* S4: The Approach */}
      <section className="py-20 bg-slate-50 text-center border-t border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <div className="inline-block px-3 py-1 rounded-full bg-golden-pollen/20 text-[#734A00] text-xs font-bold uppercase tracking-wider mb-4">
              Our Core Philosophy
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif text-charcoal-blue">What Second Innings Does Differently</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We do not tell you what career to choose. We do not prescribe ready-made answers. Instead, we listen first, help you understand the story behind your questions, explore realistic possibilities, compare trade-offs, and encourage you to take ownership of your decisions.
            </p>
            <Link href="/how-it-works" className="inline-flex items-center text-charcoal-blue font-bold hover:text-midnight-violet transition-colors text-lg group">
              See How It Works <ArrowRight className="ml-2 w-5 h-5 text-golden-pollen group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* S5: 7-Step Methodology */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 font-serif text-charcoal-blue">The 7-Step Mentoring Methodology</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">A structured human process designed to turn confusion into clarity and clarity into action.</p>
          </motion.div>
          
          <div className="hidden lg:flex justify-between items-start relative mb-16">
            <div className="absolute top-8 left-6 right-6 h-1 bg-slate-200 -z-0"></div>
            {[
              { num: '1', title: 'LISTEN', desc: 'Create safety. Hear the story without rushing to solutions.' },
              { num: '2', title: 'UNDERSTAND', desc: 'Clarify context, strengths, constraints and assumptions.' },
              { num: '3', title: 'EXPLORE', desc: 'Open realistic possibilities and questions worth investigating.' },
              { num: '4', title: 'PERSPECTIVE', desc: 'Help compare fit, trade-offs, consequences and evidence.' },
              { num: '5', title: 'CONNECT', desc: 'Bridge to relevant people, experiences and resources.' },
              { num: '6', title: 'ACT', desc: 'Agree on practical, time-bound next steps.' },
              { num: '7', title: 'REVIEW', desc: 'Follow up on what happened and what changes next.' }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1 px-2 group relative z-10">
                <div className="w-16 h-16 rounded-full bg-white border-4 border-slate-200 flex items-center justify-center text-lg font-bold text-charcoal-blue group-hover:border-golden-pollen group-hover:bg-golden-pollen/10 transition-all mb-4 shadow-sm">
                  {step.num}
                </div>
                <h4 className="font-bold text-charcoal-blue mb-1 text-xs tracking-wider uppercase">{step.title}</h4>
                <p className="text-xs text-gray-500 text-center leading-tight">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="lg:hidden space-y-4 mb-16">
             {[
              { num: '1', title: 'LISTEN', desc: 'Create safety. Hear the story without rushing to solutions.' },
              { num: '2', title: 'UNDERSTAND', desc: 'Clarify context, strengths, constraints and assumptions.' },
              { num: '3', title: 'EXPLORE', desc: 'Open realistic possibilities and questions worth investigating.' },
              { num: '4', title: 'PERSPECTIVE', desc: 'Help compare fit, trade-offs, consequences and evidence.' },
              { num: '5', title: 'CONNECT', desc: 'Bridge to relevant people, experiences and resources.' },
              { num: '6', title: 'ACT', desc: 'Agree on practical, time-bound next steps.' },
              { num: '7', title: 'REVIEW', desc: 'Follow up on what happened and what changes next.' }
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-golden-pollen/30 border border-golden-pollen flex items-center justify-center font-bold text-charcoal-blue text-sm">
                  {step.num}
                </div>
                <div>
                   <h4 className="font-bold text-charcoal-blue text-sm uppercase tracking-wide">{step.title}</h4>
                   <p className="text-sm text-gray-600 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-gradient-to-r from-charcoal-blue/5 via-tea-green/20 to-golden-pollen/15 border border-tea-green/40 p-6 md:p-8 rounded-2xl text-center shadow-sm">
             <p className="text-lg md:text-xl font-medium text-charcoal-blue">
               Every meaningful conversation should lead to one practical action. We call this the <strong className="text-charcoal-blue font-bold underline decoration-golden-pollen decoration-4 underline-offset-4">7-Day Next Step</strong>.
             </p>
          </motion.div>
        </div>
      </section>

      {/* S6: Who It's For (3 Audience Cards) */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif text-charcoal-blue">Who Is Second Innings For?</h2>
            <p className="text-gray-500">Tailored perspectives designed for each key stage of growth.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full hover:border-tea-green transition-all">
              <div className="w-12 h-12 rounded-xl bg-tea-green/30 text-charcoal-blue flex items-center justify-center mb-5">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-charcoal-blue">Students (16–25)</h3>
              <p className="text-gray-600 mb-6 flex-grow leading-relaxed">Navigating career uncertainty, building confidence, making decisions, seeking exposure, and managing transition from classroom to adult life.</p>
              <Link href="/for-students" className="text-charcoal-blue font-semibold hover:text-midnight-violet inline-flex items-center mt-auto group">
                For Students <ArrowUpRight className="ml-1 w-4 h-4 text-golden-pollen group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full hover:border-golden-pollen transition-all">
              <div className="w-12 h-12 rounded-xl bg-golden-pollen/25 text-charcoal-blue flex items-center justify-center mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-charcoal-blue">Parents</h3>
              <p className="text-gray-600 mb-6 flex-grow leading-relaxed">Supporting without controlling, understanding new-age careers, improving communication, and balancing expectations with responsibility.</p>
              <Link href="/for-parents" className="text-charcoal-blue font-semibold hover:text-midnight-violet inline-flex items-center mt-auto group">
                For Parents <ArrowUpRight className="ml-1 w-4 h-4 text-golden-pollen group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full hover:border-midnight-violet transition-all">
              <div className="w-12 h-12 rounded-xl bg-midnight-violet/10 text-midnight-violet flex items-center justify-center mb-5">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-charcoal-blue">Institutions</h3>
              <p className="text-gray-600 mb-6 flex-grow leading-relaxed">Adding a structured student-development layer, individual & small-group mentoring, campus leadership, and school-to-life transition.</p>
              <Link href="/for-institutions" className="text-charcoal-blue font-semibold hover:text-midnight-violet inline-flex items-center mt-auto group">
                For Institutions <ArrowUpRight className="ml-1 w-4 h-4 text-golden-pollen group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* S7: Student Outcomes */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif text-charcoal-blue">What Students Walk Away With</h2>
            <p className="text-gray-500">Measurable shifts in personal and professional readiness.</p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { icon: Search, title: 'Clarity', desc: 'Clearer understanding of the next step', badge: 'bg-tea-green/30' },
              { icon: ShieldCheck, title: 'Confidence', desc: 'Greater willingness to participate and approach opportunities', badge: 'bg-golden-pollen/25' },
              { icon: Map, title: 'Exposure', desc: 'Interaction with people and pathways previously unknown', badge: 'bg-midnight-violet/10' },
              { icon: ArrowRight, title: 'Action', desc: 'Completion of agreed exploration or development actions', badge: 'bg-tea-green/30' },
              { icon: Lightbulb, title: 'Ownership', desc: 'Increasingly evidence-based decisions made by the student', badge: 'bg-golden-pollen/25' }
            ].map((outcome, idx) => (
              <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center p-4">
                <div className={`w-16 h-16 mx-auto ${outcome.badge} rounded-2xl flex items-center justify-center mb-4 text-charcoal-blue shadow-sm`}>
                  <outcome.icon className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-charcoal-blue mb-1 text-base">{outcome.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{outcome.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* S8: About Deepak Teaser */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="flex flex-col md:flex-row items-center gap-12 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-44 h-44 md:w-56 md:h-56 flex-shrink-0 relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100">
              <img 
                src="/deepaksogani.jpeg" 
                alt="Deepak Sogani - Founder, Second Innings" 
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500" 
              />
            </div>
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-tea-green/35 text-charcoal-blue text-xs font-bold uppercase tracking-wider mb-3">
                Experience Behind the Mentor
              </div>
              <h2 className="text-3xl font-bold mb-4 font-serif text-charcoal-blue">Deepak Sogani</h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                35+ years across corporate leadership, entrepreneurship, and higher education — including 5 years leading Student Affairs at JK Lakshmipat University. Now dedicating this experience to mentoring young minds and empowering parents.
              </p>
              <blockquote className="border-l-4 border-golden-pollen bg-slate-50 pl-4 py-3 italic text-charcoal-blue mb-8 font-serif text-lg rounded-r-xl">
                "The best years of my life are not behind me. They are the years in which I can help others discover theirs."
              </blockquote>
              <Link href="/about" className="inline-flex items-center bg-charcoal-blue text-white px-6 py-2.5 rounded-full hover:bg-primary-hover transition-colors font-medium shadow-sm">
                Read Deepak's Full Story <ArrowRight className="ml-2 w-4 h-4 text-golden-pollen" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* S9: Institutional Value */}
      <section className="py-20 bg-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <div className="inline-block px-3 py-1 rounded-full bg-midnight-violet/10 text-midnight-violet text-xs font-bold uppercase tracking-wider mb-3">
              For Schools & Colleges
            </div>
            <h2 className="text-3xl font-bold mb-6 font-serif text-charcoal-blue">Complementing Academic Excellence With Life Readiness</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We partner with institutions through a tested 90-day pilot model. We listen first, understand what already exists, identify 2–3 genuine priorities, and demonstrate observable student movement before recommending any larger integration.
            </p>
            <Link href="/for-institutions" className="inline-flex items-center border-2 border-charcoal-blue text-charcoal-blue px-8 py-3 rounded-full font-semibold hover:bg-charcoal-blue hover:text-white transition-colors text-lg">
              Explore Institutional Framework
            </Link>
          </motion.div>
        </div>
      </section>

      {/* S10: Opportunities Teaser */}
      <section className="py-20 bg-slate-50 text-center border-t border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <div className="inline-block px-3 py-1 rounded-full bg-golden-pollen/20 text-[#734A00] text-xs font-bold uppercase tracking-wider mb-3">
              Opportunity Knowledge Bank
            </div>
            <h2 className="text-3xl font-bold mb-4 font-serif text-charcoal-blue">Curated Opportunities That Support Mentoring</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Internships, fellowships, scholarships, and courses — curated for student relevance, verified, and mapped to practical next steps.
            </p>
             <Link href="/opportunities" className="inline-flex items-center text-charcoal-blue font-bold hover:text-midnight-violet transition-colors text-lg group">
              Explore Knowledge Bank <ArrowRight className="ml-2 w-5 h-5 text-golden-pollen group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* S11: Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-midnight-violet via-[#301c28] to-charcoal-blue text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-golden-pollen/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">Ready to Start?</h2>
            <p className="text-xl text-gray-200 mb-10 font-light">
              A conversation is the first step. No commitment, no pressure — just perspective.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/book" 
                className="w-full sm:w-auto bg-golden-pollen text-charcoal-blue px-8 py-3.5 rounded-full font-bold hover:bg-secondary-hover transition-all text-lg shadow-xl hover:shadow-2xl"
              >
                Start a Conversation
              </Link>
              <a 
                href="https://wa.me/919314072153" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full sm:w-auto bg-white/10 border-2 border-white/40 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/20 transition-all text-lg flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <MessageCircle size={20} className="text-tea-green" />
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
