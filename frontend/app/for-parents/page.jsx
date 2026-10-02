import React from 'react';
import Link from 'next/link';
import { Heart, Ear, Rocket, Star, BookOpen, MessageCircle, ShieldCheck, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'For Parents | Second Innings',
  description: 'Second Innings seeks to complement, not replace, the role of parents, teachers, and institutions.',
};

const principles = [
  { 
    icon: Heart, 
    title: "Accept Before You Advise", 
    text: "Children open up when they feel accepted without the immediate fear of judgment or comparison." 
  },
  { 
    icon: Ear, 
    title: "Listen Before You Solve", 
    text: "Young people usually seek understanding and validation before they are ready for solutions." 
  },
  { 
    icon: Rocket, 
    title: "Encourage Growth, Not Perfection", 
    text: "Celebrate honest effort, resilience, and curiosity rather than just test scores." 
  },
  { 
    icon: Star, 
    title: "Build Character Before Career", 
    text: "Integrity, empathy, discipline, and emotional balance are permanent lifelong assets." 
  },
  { 
    icon: BookOpen, 
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

export default function ForParentsPage() {
  return (
    <div className="min-h-screen font-sans bg-white text-gray-800">
      {/* Hero */}
      <section className="bg-gradient-to-br from-charcoal-blue via-[#263747] to-midnight-violet text-white py-24 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-tea-green text-xs font-semibold uppercase tracking-wider">
            Second Innings For Parents
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight">
            Every parent wants their child to make thoughtful choices and build a meaningful future.
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed">
            Second Innings seeks to complement, not replace, the role of parents, teachers, educational institutions or qualified professionals.
          </p>
          <div className="pt-2">
            <Link 
              href="/book" 
              className="inline-block bg-golden-pollen text-charcoal-blue font-bold py-3.5 px-8 rounded-full text-base sm:text-lg shadow-lg hover:bg-secondary-hover transition-all uppercase tracking-wider"
            >
              Start a Conversation
            </Link>
          </div>
        </div>
      </section>

      {/* The Core Role */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200 space-y-5 leading-relaxed text-gray-700 text-base sm:text-lg">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-blue mb-2">
            A Space for Perspective and Exploration
          </h2>
          <p>
            As young people grow, they also need opportunities to question, explore and gradually take ownership of their decisions.
          </p>
          <p>
            The objective is not to decide a young person's future for them.
          </p>
          <p>
            It is to provide an additional space for thoughtful conversation, broader perspective and exploration: helping young people become more confident in making choices they understand and own.
          </p>
          <p className="p-4 rounded-xl bg-white border border-tea-green/60 text-charcoal-blue font-serif italic shadow-sm">
            "Where appropriate, parents may also become part of the broader conversation while respecting the young person's privacy and independence."
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 bg-slate-50 px-6 md:px-12 border-t border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-primary/70 font-semibold mb-2">Guiding Principles</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-blue">
              How Parents Can Support
            </h2>
            <p className="text-gray-500 mt-2">Tested foundations for healthy parent-child conversations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((item, idx) => (
              <div key={idx} className="bg-white p-7 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full hover:border-golden-pollen/50 transition-all">
                <div className="mb-4 p-3 bg-tea-green/30 text-charcoal-blue rounded-xl self-start">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-charcoal-blue font-serif">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Concerns */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-primary/70 font-semibold mb-2">Empathy & Understanding</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-blue">
            Does This Sound Familiar?
          </h2>
          <p className="text-gray-500 mt-2">Every parent encounters these moments of uncertainty.</p>
        </div>
        <div className="space-y-4">
          {concerns.map((concern, idx) => (
            <div key={idx} className="flex items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-golden-pollen/40 transition-all">
              <div className="w-8 h-8 rounded-full bg-golden-pollen/20 text-charcoal-blue flex items-center justify-center mr-4 flex-shrink-0">
                <MessageCircle size={18} />
              </div>
              <p className="text-base sm:text-lg text-charcoal-blue font-medium">"{concern}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Confidentiality & Safeguarding */}
      <section className="py-12 px-6 max-w-4xl mx-auto">
        <div className="p-6 rounded-2xl bg-white border border-gray-200 flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-charcoal-blue flex-shrink-0 mt-1" />
          <div className="space-y-2 text-sm text-gray-600">
            <h4 className="font-bold text-charcoal-blue">Safety and Professional Boundaries</h4>
            <p>
              For participants below the age of 18, appropriate parental/guardian consent and safeguarding requirements always apply. Second Innings is committed to providing a responsible and transparent environment.
            </p>
            <Link href="/privacy-boundaries" className="inline-flex items-center text-primary font-bold hover:underline pt-1 text-xs">
              Read our full Privacy & Boundaries Policy <ArrowRight size={12} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-charcoal-blue via-[#263747] to-midnight-violet text-white text-center px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold">
            Start a Conversation About Your Child
          </h2>
          <p className="text-gray-200 font-light">
            We are here to listen, offer perspective, and partner in your child's growth.
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
