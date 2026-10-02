import React from 'react';
import Link from 'next/link';
import { HelpCircle, Clock, TrendingUp, Users, MessageSquare, Globe, GraduationCap, Target, Compass, Search, BookOpen, Lightbulb, PlayCircle, ShieldCheck, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'For Students | Second Innings',
  description: 'Career mentoring, confidence building, and guidance for students navigating their next steps.',
};

const concerns = [
  { icon: HelpCircle, text: "I don't know what career to choose" },
  { icon: Clock, text: "Everyone seems to have a plan except me" },
  { icon: TrendingUp, text: "I'm good at studies but struggle with confidence" },
  { icon: Users, text: "My parents want one thing, I want another" },
  { icon: MessageSquare, text: "I don't know how to communicate in interviews or group settings" },
  { icon: Globe, text: "I have no exposure beyond my classroom" },
  { icon: GraduationCap, text: "I'm about to graduate and I have no idea what comes next" },
  { icon: Target, text: "I want to do something meaningful but don't know where to start" },
];

const areas = [
  { icon: Compass, text: "Career & higher-education uncertainty" },
  { icon: Search, text: "Confidence & self-belief" },
  { icon: BookOpen, text: "Decision-making & ownership" },
  { icon: MessageSquare, text: "Communication & articulation" },
  { icon: Globe, text: "Exposure to people, pathways & opportunities" },
  { icon: Users, text: "Leadership & participation" },
  { icon: Lightbulb, text: "Professional & life readiness" },
  { icon: Target, text: "Finding internships, fellowships, scholarships" },
  { icon: PlayCircle, text: "Transition from education to adult life" },
];

const outcomes = [
  { icon: Lightbulb, title: "Clarity", desc: "Understand your strengths, constraints, and realistic options.", color: "bg-tea-green/35 text-charcoal-blue" },
  { icon: ShieldCheck, title: "Confidence", desc: "Believe in your voice, potential, and informed choices.", color: "bg-golden-pollen/25 text-charcoal-blue" },
  { icon: Globe, title: "Exposure", desc: "Discover pathways, mentors, and networks beyond the classroom.", color: "bg-midnight-violet/10 text-midnight-violet" },
  { icon: PlayCircle, title: "Action", desc: "Take tangible, time-bound steps with a clear 7-day follow-up.", color: "bg-tea-green/35 text-charcoal-blue" },
  { icon: Target, title: "Ownership", desc: "Make evidence-based decisions that you genuinely stand behind.", color: "bg-golden-pollen/25 text-charcoal-blue" },
];

export default function ForStudentsPage() {
  return (
    <div className="min-h-screen font-sans">
      {/* S1: Hero */}
      <section className="bg-gradient-to-br from-charcoal-blue via-[#263747] to-midnight-violet text-white py-24 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-tea-green/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-tea-green text-xs font-semibold uppercase tracking-wider mb-6">
            For Young People Aged 16–25
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif">You Have the Information. What You Need Is Perspective.</h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-200 font-light max-w-3xl mx-auto">
            Career confusion, confidence issues, 'what next' anxiety — you're not alone. Let's figure it out together.
          </p>
          <Link href="/book" className="inline-block bg-golden-pollen text-charcoal-blue font-bold py-3.5 px-8 rounded-full text-lg shadow-lg hover:bg-secondary-hover transition-all">
            Start a Conversation
          </Link>
        </div>
      </section>

      {/* S2: Sound Familiar? */}
      <section className="py-20 bg-slate-50 px-6 md:px-12 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-golden-pollen/20 text-[#734A00] text-xs font-bold uppercase tracking-wider mb-2">
              Common Questions
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-charcoal-blue">Sound Familiar?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {concerns.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:border-golden-pollen transition-all">
                <div className="w-14 h-14 rounded-2xl bg-golden-pollen/20 text-charcoal-blue flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7" />
                </div>
                <p className="text-gray-700 font-medium text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S3: What Mentoring Covers */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-charcoal-blue">What We Can Explore Together</h2>
            <p className="text-gray-500 mt-2">Every conversation is anchored in your unique aspirations and questions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {areas.map((area, idx) => (
              <div key={idx} className="flex items-start space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-tea-green transition-all">
                <div className="w-10 h-10 rounded-xl bg-tea-green/35 text-charcoal-blue flex items-center justify-center flex-shrink-0">
                  <area.icon className="w-5 h-5" />
                </div>
                <p className="text-charcoal-blue font-medium text-sm pt-2">{area.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S4: Ownership Disclaimer */}
      <section className="py-12 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto border-l-4 border-golden-pollen bg-white p-8 md:p-10 rounded-r-3xl shadow-sm border border-slate-100">
          <p className="text-lg md:text-xl text-charcoal-blue italic font-medium leading-relaxed">
            "We won't tell you what career to choose or what decision to make. Your life, your choices. We help you think more clearly so you can decide with confidence."
          </p>
        </div>
      </section>

      {/* S5: Student Outcomes */}
      <section className="py-20 bg-white px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-charcoal-blue">Student Outcomes</h2>
            <p className="text-gray-500 mt-2">The five pillars of development we foster in every engagement.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-center">
            {outcomes.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mb-4 shadow-sm`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-charcoal-blue">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S6: Mini Methodology */}
      <section className="py-20 px-6 md:px-12 bg-slate-50 text-center border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 font-serif text-charcoal-blue">Our 7-Step Mentoring Process</h2>
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 mb-8 text-xs font-bold uppercase tracking-wider">
            {['Listen', 'Understand', 'Explore', 'Perspective', 'Connect', 'Act', 'Review'].map((step, idx, arr) => (
              <React.Fragment key={step}>
                <span className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-full text-charcoal-blue shadow-sm">
                  {step}
                </span>
                {idx < arr.length - 1 && <span className="text-golden-pollen font-bold">→</span>}
              </React.Fragment>
            ))}
          </div>
          <Link href="/how-it-works" className="text-charcoal-blue hover:text-midnight-violet font-semibold inline-flex items-center group">
            See the full methodology <ArrowRight size={16} className="ml-1.5 text-golden-pollen group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* S7: CTA */}
      <section className="py-24 bg-gradient-to-br from-charcoal-blue to-midnight-violet text-white text-center px-6">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/book" className="w-full sm:w-auto bg-golden-pollen text-charcoal-blue font-bold py-3.5 px-8 rounded-full text-lg shadow-lg hover:bg-secondary-hover transition-all">
            Start a Conversation
          </Link>
          <Link href="/opportunities" className="w-full sm:w-auto text-white font-semibold py-3.5 px-8 text-lg border-2 border-white/30 rounded-full hover:bg-white/10 transition-all">
            Explore Opportunities →
          </Link>
        </div>
      </section>
    </div>
  );
}
