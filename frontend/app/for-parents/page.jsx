import React from 'react';
import Link from 'next/link';
import { Heart, Ear, Rocket, Star, BookOpen, MessageCircle, HelpCircle, Eye, ShieldCheck, Map, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'For Parents | Second Innings',
  description: 'Guiding parents to support their children through modern career transitions and challenges.',
};

const principles = [
  { icon: Heart, title: "Accept Before You Advise", text: "Children open up when they feel accepted without the immediate fear of judgment or comparison." },
  { icon: Ear, title: "Listen Before You Solve", text: "Young people usually seek understanding and validation before they are ready for solutions." },
  { icon: Rocket, title: "Encourage Growth, Not Perfection", text: "Celebrate honest effort, resilience, and curiosity rather than just test scores." },
  { icon: Star, title: "Build Character Before Career", text: "Integrity, empathy, discipline, and emotional balance are permanent lifelong assets." },
  { icon: BookOpen, title: "Become a Learning Parent", text: "The most effective parents learn alongside their children in an ever-evolving world." }
];

const concerns = [
  "My child doesn't open up to me about their future plans",
  "I don't understand these new-age careers and AI roles",
  "I want to guide and protect them without being controlling",
  "How do I balance high expectations with their independence?",
  "Is my child genuinely ready for university life or adulthood?"
];

export default function ForParentsPage() {
  return (
    <div className="min-h-screen font-sans">
      {/* S1: Hero */}
      <section className="bg-gradient-to-br from-charcoal-blue via-[#263747] to-midnight-violet text-white py-24 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-golden-pollen/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-tea-green text-xs font-semibold uppercase tracking-wider mb-6">
            Supporting Without Controlling
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif">You Want the Best for Your Child. So Do We.</h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-200 font-light max-w-3xl mx-auto">
            The world your child is entering looks very different from the one you grew up in. We help bridge that gap together.
          </p>
          <Link href="/book" className="inline-block bg-golden-pollen text-charcoal-blue font-bold py-3.5 px-8 rounded-full text-lg shadow-lg hover:bg-secondary-hover transition-all">
            Start a Conversation About Your Child
          </Link>
        </div>
      </section>

      {/* S2: The Changing Landscape */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-golden-pollen/20 text-[#734A00] text-xs font-bold uppercase tracking-wider mb-3">
            Evolving Realities
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif text-charcoal-blue">The World Has Changed. Parenting Has To Evolve Too.</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            New-age careers, artificial intelligence, global pathways, social media pressures, and shifting workplace realities. Parents care deeply but often feel uncertain how best to guide their children. The path forward is no longer a single straight line, and having an external trusted perspective helps families navigate these transitions with calm confidence.
          </p>
        </div>
      </section>

      {/* S3: How Parents Can Support */}
      <section className="py-20 bg-slate-50 px-6 md:px-12 border-t border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-charcoal-blue">5 Core Principles for Guiding Your Child</h2>
            <p className="text-gray-500 mt-2">Tested foundations for healthy parent-child conversations.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((item, idx) => (
              <div key={idx} className="bg-white p-7 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full hover:border-tea-green transition-all">
                <div className="mb-4 p-3 bg-tea-green/30 text-charcoal-blue rounded-xl self-start">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-charcoal-blue">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S4: Common Concerns */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-charcoal-blue">Does This Sound Familiar?</h2>
            <p className="text-gray-500 mt-2">Every parent encounters these moments of uncertainty.</p>
          </div>
          <div className="space-y-4">
            {concerns.map((concern, idx) => (
              <div key={idx} className="flex items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-golden-pollen/50 transition-all">
                <div className="w-8 h-8 rounded-full bg-golden-pollen/20 text-[#734A00] flex items-center justify-center mr-4 flex-shrink-0">
                  <MessageCircle size={18} />
                </div>
                <p className="text-base md:text-lg text-charcoal-blue font-medium">"{concern}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S5: Parent-Mentor Partnership Triangle */}
      <section className="py-24 bg-gradient-to-br from-midnight-violet via-[#2F1C27] to-charcoal-blue px-6 text-white text-center overflow-hidden relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-tea-green text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
            Collaborative Framework
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-16 font-serif">The Partnership Triangle</h2>
          
          <div className="relative min-h-[320px] max-w-lg mx-auto flex items-center justify-center">
            {/* Top Vertex: Parents */}
            <div className="absolute top-0 flex flex-col items-center w-48 text-center -mt-4">
              <div className="w-12 h-12 rounded-2xl bg-golden-pollen text-charcoal-blue flex items-center justify-center mb-2 shadow-lg">
                <ShieldCheck size={26} />
              </div>
              <p className="font-bold text-golden-pollen text-base">Parents</p>
              <p className="text-xs text-gray-300">Values & Emotional Security</p>
            </div>
            
            {/* Bottom Left: Institutions */}
            <div className="absolute bottom-0 left-0 flex flex-col items-center w-48 text-center -mb-4 -ml-4">
              <div className="w-12 h-12 rounded-2xl bg-tea-green text-charcoal-blue flex items-center justify-center mb-2 shadow-lg">
                <BookOpen size={26} />
              </div>
              <p className="font-bold text-tea-green text-base">Institutions</p>
              <p className="text-xs text-gray-300">Education & Structure</p>
            </div>
            
            {/* Bottom Right: Mentors */}
            <div className="absolute bottom-0 right-0 flex flex-col items-center w-48 text-center -mb-4 -mr-4">
              <div className="w-12 h-12 rounded-2xl bg-white text-charcoal-blue flex items-center justify-center mb-2 shadow-lg">
                <Map size={26} />
              </div>
              <p className="font-bold text-white text-base">Mentors</p>
              <p className="text-xs text-gray-300">Perspective & Trusted Space</p>
            </div>

            {/* Center Box */}
            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20 z-10 max-w-xs shadow-xl my-16">
              <p className="font-medium text-base leading-snug text-white">When these three forces align, the young mind thrives with clarity and confidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* S6: What to Expect */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-charcoal-blue">How Parents Can Engage</h2>
            <p className="text-gray-500 mt-2">Flexible pathways tailored to your family's needs.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start hover:border-tea-green transition-all">
              <div className="w-10 h-10 rounded-xl bg-tea-green/30 text-charcoal-blue flex items-center justify-center mr-4 flex-shrink-0">
                <Eye size={20} />
              </div>
              <div>
                <h4 className="font-bold text-charcoal-blue mb-1">Refer Your Child</h4>
                <p className="text-gray-600 text-sm">Schedule a neutral, safe conversation for your child to speak with Deepak Sir.</p>
              </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start hover:border-golden-pollen transition-all">
              <div className="w-10 h-10 rounded-xl bg-golden-pollen/25 text-charcoal-blue flex items-center justify-center mr-4 flex-shrink-0">
                <Eye size={20} />
              </div>
              <div>
                <h4 className="font-bold text-charcoal-blue mb-1">Parent Perspective Session</h4>
                <p className="text-gray-600 text-sm">Participate in a 1-on-1 dialogue on modern careers, expectations, and transition support.</p>
              </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start hover:border-midnight-violet/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-midnight-violet/10 text-midnight-violet flex items-center justify-center mr-4 flex-shrink-0">
                <Eye size={20} />
              </div>
              <div>
                <h4 className="font-bold text-charcoal-blue mb-1">Understand the Methodology</h4>
                <p className="text-gray-600 text-sm">Learn how the 7-Step approach and 7-Day Next Step anchor student responsibility.</p>
              </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start hover:border-tea-green transition-all">
              <div className="w-10 h-10 rounded-xl bg-tea-green/30 text-charcoal-blue flex items-center justify-center mr-4 flex-shrink-0">
                <Eye size={20} />
              </div>
              <div>
                <h4 className="font-bold text-charcoal-blue mb-1">Joint Transition Planning</h4>
                <p className="text-gray-600 text-sm">Get perspective on preparing your child for university independence and adulthood.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* S7: CTA */}
      <section className="py-20 bg-slate-50 text-center px-6 border-t border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold font-serif text-charcoal-blue mb-4">Start With an Open Conversation</h3>
          <p className="text-gray-600 mb-8">No pressure or pre-packaged formulas: just thoughtful, practical perspective.</p>
          <Link href="/book" className="inline-block bg-golden-pollen text-charcoal-blue font-bold py-4 px-10 rounded-full text-lg shadow-lg hover:bg-secondary-hover transition-all">
            Start a Conversation About Your Child
          </Link>
        </div>
      </section>
    </div>
  );
}
