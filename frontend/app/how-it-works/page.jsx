'use client'

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function HowItWorks() {
  return (
    <div className="flex flex-col w-full">
      {/* S1: Page Hero */}
      <section className="bg-gradient-to-br from-charcoal-blue via-[#263747] to-midnight-violet text-white py-20 md:py-28 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-tea-green/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-tea-green text-xs md:text-sm font-medium tracking-wide mb-6">
            <Sparkles size={14} className="text-golden-pollen" />
            Human-Led · Evidence-Based · Student-Owned
          </div>
          <motion.h1 
            initial="hidden" animate="visible" variants={fadeIn}
            className="text-4xl md:text-5xl font-bold mb-6 font-serif tracking-tight"
          >
            Listening and Perspective Before Prescription
          </motion.h1>
          <motion.p 
            initial="hidden" animate="visible" variants={fadeIn}
            className="text-xl text-gray-200 font-light max-w-2xl mx-auto"
          >
            This is how every Second Innings conversation works.
          </motion.p>
        </div>
      </section>

      {/* S2: What It Is / What It Is Not */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-serif text-charcoal-blue">Clarity of Purpose</h2>
            <p className="text-gray-500 mt-2">Setting clear expectations from the very first conversation.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* What It IS */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-slate-50 border-2 border-tea-green/60 p-8 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3 border-b border-tea-green/40 pb-4 mb-6">
                <span className="w-3 h-3 rounded-full bg-tea-green"></span>
                <h3 className="text-2xl font-bold text-charcoal-blue font-serif">What Second Innings IS</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "A mentoring and perspective platform",
                  "A place for thoughtful conversations around choices and transitions",
                  "A bridge to relevant people, experiences, and resources",
                  "Human-led and technology-enabled"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-tea-green/50 text-charcoal-blue flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            {/* What It IS NOT */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-slate-50 border-2 border-midnight-violet/20 p-8 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3 border-b border-midnight-violet/15 pb-4 mb-6">
                <span className="w-3 h-3 rounded-full bg-midnight-violet"></span>
                <h3 className="text-2xl font-bold text-charcoal-blue font-serif">What Second Innings IS NOT</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Therapy or psychological counselling",
                  "Exam preparation, coaching, or tuition",
                  "An authority telling you what career to choose",
                  "Motivational speaking or pep talks",
                  "An AI bot or app replacing human mentors"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-midnight-violet/15 text-midnight-violet flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <XCircle className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* S3: 7-Stage Methodology (Full Detail) */}
      <section className="py-20 bg-slate-50 border-t border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-golden-pollen/20 text-[#734A00] text-xs font-bold uppercase tracking-wider mb-3">
              Step-by-Step
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-charcoal-blue">The 7-Stage Methodology in Detail</h2>
            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">Each stage represents a deliberate shift in the conversation and in the student's own internal clarity.</p>
          </motion.div>

          <div className="space-y-6">
            {[
              { num: '1', title: 'LISTEN', mentor: 'Create safety. Hear the story without rushing to solutions.', student: 'Shares context, concerns, and current state.' },
              { num: '2', title: 'UNDERSTAND', mentor: 'Clarify context, strengths, constraints and assumptions.', student: 'Gains clarity on their own situation.' },
              { num: '3', title: 'EXPLORE', mentor: 'Open realistic possibilities and questions worth investigating.', student: 'Sees options beyond immediate assumptions.' },
              { num: '4', title: 'PERSPECTIVE', mentor: 'Help compare fit, trade-offs, consequences and evidence.', student: 'Evaluates options objectively.' },
              { num: '5', title: 'CONNECT', mentor: 'Bridge to relevant people, experiences and resources.', student: 'Accesses networks and tools for the next step.' },
              { num: '6', title: 'ACT', mentor: 'Agree on practical, time-bound next steps.', student: 'Commits to a specific action.' },
              { num: '7', title: 'REVIEW', mentor: 'Follow up on what happened and what changes next.', student: 'Reflects on action and prepares for the next cycle.' }
            ].map((step, idx) => (
              <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-start hover:border-tea-green transition-all">
                <div className="w-14 h-14 flex-shrink-0 rounded-2xl bg-golden-pollen/20 text-charcoal-blue text-2xl font-bold flex items-center justify-center border border-golden-pollen/40 font-serif">
                  {step.num}
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-charcoal-blue mb-3 tracking-wide">{step.title}</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <strong className="text-charcoal-blue font-semibold block mb-1">Mentor Role:</strong>
                      <p className="text-gray-600 leading-relaxed">{step.mentor}</p>
                    </div>
                    <div className="bg-tea-green/15 p-4 rounded-xl border border-tea-green/30">
                      <strong className="text-charcoal-blue font-semibold block mb-1">Student Movement:</strong>
                      <p className="text-gray-600 leading-relaxed">{step.student}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* S4: 7-Day Next Step */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <div className="inline-block px-3 py-1 rounded-full bg-tea-green/35 text-charcoal-blue text-xs font-bold uppercase tracking-wider mb-3">
              The Anchor of Mentoring
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 font-serif text-charcoal-blue">Every Conversation Should Lead to One Practical Action</h2>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-12 text-sm font-semibold text-charcoal-blue">
              <div className="bg-slate-50 px-5 py-3 rounded-xl border border-slate-200 shadow-sm w-full md:w-auto">1. Conversation</div>
              <ArrowRight className="hidden md:block text-golden-pollen" size={20} />
              <div className="bg-golden-pollen/20 px-5 py-3 rounded-xl border border-golden-pollen/50 shadow-sm w-full md:w-auto">2. One Agreed Action</div>
              <ArrowRight className="hidden md:block text-golden-pollen" size={20} />
              <div className="bg-tea-green/30 px-5 py-3 rounded-xl border border-tea-green/60 shadow-sm w-full md:w-auto">3. 7-Day Review</div>
              <ArrowRight className="hidden md:block text-golden-pollen" size={20} />
              <div className="bg-midnight-violet/10 text-midnight-violet px-5 py-3 rounded-xl border border-midnight-violet/20 shadow-sm w-full md:w-auto">4. Next Step</div>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl text-left border border-slate-200">
              <h3 className="text-xl font-bold mb-4 text-charcoal-blue">The 5 Reflection Questions for Every Review:</h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 text-base md:text-lg">
                <li><span className="font-medium text-charcoal-blue">What did you do?</span></li>
                <li><span className="font-medium text-charcoal-blue">What happened?</span></li>
                <li><span className="font-medium text-charcoal-blue">What did you learn?</span></li>
                <li><span className="font-medium text-charcoal-blue">What stopped you, if you did not act?</span></li>
                <li><span className="font-medium text-charcoal-blue">What will you do next?</span></li>
              </ol>
            </div>
          </motion.div>
        </div>
      </section>

      {/* S5: Working Standard */}
      <section className="py-20 bg-slate-50 border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
             <blockquote className="text-2xl md:text-3xl font-serif text-charcoal-blue italic mb-6 leading-relaxed border-l-4 border-golden-pollen bg-white p-8 rounded-2xl shadow-sm">
               "After speaking with Deepak Sir, I understand myself better and I know what I should do next."
             </blockquote>
             <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">This is the benchmark for every conversation.</p>
           </motion.div>
        </div>
      </section>

      {/* S6: CTA */}
      <section className="py-24 bg-gradient-to-br from-charcoal-blue via-[#263747] to-midnight-violet text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6">Ready to Experience the Process?</h2>
          <p className="text-lg text-gray-200 mb-8 max-w-xl mx-auto">Book a 30-minute introductory conversation to see where you are and explore what comes next.</p>
          <Link 
            href="/book" 
            className="inline-block bg-golden-pollen text-charcoal-blue px-8 py-4 rounded-full font-bold hover:bg-secondary-hover transition-all text-xl shadow-xl hover:shadow-2xl"
          >
            Start a Conversation
          </Link>
        </div>
      </section>
    </div>
  );
}
