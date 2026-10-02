'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Quote, Sparkles } from 'lucide-react';
import { getFeaturedTestimonials } from '../../lib/api';

const capabilities = [
  "Leadership", "People Management", "Decision-Making", "Communication",
  "Real-World Perspective", "Performance", "Accountability", "Resilience",
  "Professional Networks", "Commercial Awareness"
];

const fallbackTestimonials = [
  {
    _id: "1",
    quote: "Deepak sir changed how I looked at my future. He didn't just give advice; he made me think for myself.",
    name: "Alumni, JK Lakshmipat University",
    role: "Former Student"
  },
  {
    _id: "2",
    quote: "His perspective from the corporate world added a completely grounded, realistic dimension to student growth on campus.",
    name: "Faculty Colleague",
    role: "Academic Leader"
  }
];

export default function AboutPage() {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const data = await getFeaturedTestimonials();
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        }
      } catch (e) {
        // Fallback already set
      }
    }
    loadTestimonials();
  }, []);

  return (
    <div className="min-h-screen font-sans bg-slate-50">
      {/* S1: Hero */}
      <section className="py-24 px-6 md:px-12 bg-white text-center border-b border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="w-40 h-40 mx-auto relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white mb-8 bg-slate-100">
            <img 
              src="/deepaksogani.jpeg" 
              alt="Deepak Sogani - Founder, Second Innings" 
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500" 
            />
          </div>
          <div className="inline-block px-3.5 py-1 rounded-full bg-tea-green/35 text-charcoal-blue text-xs font-bold uppercase tracking-wider mb-4">
            Founder & Lead Mentor
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-8 font-serif text-charcoal-blue">From Corporate Leadership to Mentoring Young Minds</h1>
          <blockquote className="text-xl md:text-2xl italic text-charcoal-blue font-serif leading-relaxed max-w-3xl mx-auto border-l-4 border-golden-pollen pl-6 py-4 bg-slate-50 rounded-r-2xl shadow-sm">
            "The best years of my life are not behind me. They are the years in which I can help others discover theirs."
          </blockquote>
        </div>
      </section>

      {/* S2: The Journey (Timeline) */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-charcoal-blue">The Journey</h2>
            <p className="text-gray-500 mt-2">Over 35 years of real-world leadership, entrepreneurship, and youth engagement.</p>
          </div>
          <div className="relative border-l-2 border-slate-200 ml-4 md:ml-12 space-y-12">
            
            <div className="relative pl-8 md:pl-12">
              <div className="absolute w-4 h-4 bg-tea-green rounded-full -left-[9px] top-1.5 ring-4 ring-slate-50"></div>
              <span className="text-xs font-bold text-golden-pollen uppercase tracking-wider bg-charcoal-blue px-2.5 py-0.5 rounded-full inline-block mb-1">1990s–2000s</span>
              <h4 className="text-lg font-bold text-charcoal-blue mb-1">Pharmaceutical Industry</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Built early foundations in corporate discipline, accountability, field dynamics, strategic thinking, and leadership.</p>
            </div>

            <div className="relative pl-8 md:pl-12">
              <div className="absolute w-4 h-4 bg-tea-green rounded-full -left-[9px] top-1.5 ring-4 ring-slate-50"></div>
              <span className="text-xs font-bold text-golden-pollen uppercase tracking-wider bg-charcoal-blue px-2.5 py-0.5 rounded-full inline-block mb-1">2000s–2010</span>
              <h4 className="text-lg font-bold text-charcoal-blue mb-1">Corporate Leadership</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Held senior roles at Khandelwal Labs, Glenmark, and Hoechst, driving sales strategy, marketing initiatives, and cross-functional teams with consistent Star Performer recognition.</p>
            </div>

            <div className="relative pl-8 md:pl-12">
              <div className="absolute w-4 h-4 bg-tea-green rounded-full -left-[9px] top-1.5 ring-4 ring-slate-50"></div>
              <span className="text-xs font-bold text-golden-pollen uppercase tracking-wider bg-charcoal-blue px-2.5 py-0.5 rounded-full inline-block mb-1">2011–2021</span>
              <h4 className="text-lg font-bold text-charcoal-blue mb-1">Entrepreneurship (Maven Associates)</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Founded and scaled a pharmaceutical distribution enterprise to ₹80 lakh annual turnover, managing 50+ key institutional relationships.</p>
            </div>

            <div className="relative pl-8 md:pl-12">
              <div className="absolute w-4 h-4 bg-golden-pollen rounded-full -left-[9px] top-1.5 ring-4 ring-slate-50"></div>
              <span className="text-xs font-bold text-charcoal-blue uppercase tracking-wider bg-golden-pollen px-2.5 py-0.5 rounded-full inline-block mb-1">2021–2026</span>
              <h4 className="text-lg font-bold text-charcoal-blue mb-1">Leading Student Affairs at JK Lakshmipat University</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Pivoted to youth development. Built Student Affairs from the ground up, mentored thousands of students, and directed large-scale orientation cohorts for 600+ students with 170+ volunteers.</p>
            </div>

            <div className="relative pl-8 md:pl-12">
              <div className="absolute w-5 h-5 bg-midnight-violet rounded-full -left-[11px] top-1 ring-4 ring-golden-pollen animate-pulse"></div>
              <span className="text-xs font-bold text-tea-green uppercase tracking-wider bg-midnight-violet px-2.5 py-0.5 rounded-full inline-block mb-1">2026–Present</span>
              <h4 className="text-lg font-bold text-midnight-violet mb-1 font-serif text-xl">Second Innings</h4>
              <p className="text-charcoal-blue font-medium leading-relaxed">Dedicated entirely to mentoring young minds, preparing them for life beyond the classroom, and empowering parents.</p>
            </div>

          </div>
        </div>
      </section>

      {/* S3: What Five Years Taught Me */}
      <section className="py-20 bg-white px-6 border-t border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-golden-pollen/20 text-[#734A00] text-xs font-bold uppercase tracking-wider mb-4">
            A Crucial Insight
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-charcoal-blue font-serif">What Five Years With Students Taught Me</h2>
          <blockquote className="text-xl md:text-2xl text-charcoal-blue font-serif italic leading-relaxed bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm">
            "Young people do not always need another person telling them what to do. Often, they first need someone who will listen, understand the story behind the question, help them explore possibilities, and encourage them to take responsibility for the next step."
          </blockquote>
        </div>
      </section>

      {/* S4 & S5: Philosophy & Corporate Value */}
      <section className="py-24 px-6 md:px-12 bg-gradient-to-br from-charcoal-blue via-[#263747] to-midnight-violet text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-tea-green text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
              Guiding Principle
            </div>
            <h2 className="text-3xl font-bold mb-6 font-serif text-golden-pollen">Mentoring Philosophy</h2>
            <p className="text-lg text-gray-200 leading-relaxed mb-6 font-light">
              The core belief is simple: empowerment over instruction.
            </p>
            <p className="text-lg text-gray-200 leading-relaxed font-light">
              Young people rarely suffer from lack of information: they are surrounded by data. What they truly need is clarity, perspective, confidence, exposure, and the structured support to act on their own decisions.
            </p>
          </div>
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-golden-pollen text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
              35-Year Advantage
            </div>
            <h2 className="text-3xl font-bold mb-6 font-serif text-tea-green">What the Corporate Journey Adds</h2>
            <p className="text-gray-300 text-sm mb-6">Real-world perspective grounded in executive experience:</p>
            <div className="flex flex-wrap gap-2.5">
              {capabilities.map((cap, idx) => (
                <span key={idx} className="px-4 py-2 bg-white/10 text-tea-green rounded-full text-xs font-semibold border border-white/15 shadow-sm">
                  {cap}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* S6: Student Voice */}
      <section className="py-20 px-6 md:px-12 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-charcoal-blue">Student & Colleague Voices</h2>
            <p className="text-gray-500 mt-2">Reflections from those who have worked closely with Deepak Sir.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {testimonials.map((t) => (
              <div key={t._id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative hover:border-golden-pollen/50 transition-all flex flex-col justify-between">
                <p className="text-base md:text-lg text-charcoal-blue mb-6 italic leading-relaxed">"{t.quote}"</p>
                <div className="border-t border-slate-100 pt-4">
                  <p className="font-bold text-charcoal-blue">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <a 
              href="https://linkedin.com/in/deepak-sogani" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-charcoal-blue hover:text-midnight-violet font-semibold inline-flex items-center group text-base"
            >
              More student reflections on LinkedIn <ArrowRight size={18} className="ml-2 text-golden-pollen group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* S7: CTA */}
      <section className="py-24 bg-gradient-to-br from-midnight-violet to-charcoal-blue text-center px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-4">Start Your Conversation With Deepak</h2>
          <p className="text-gray-200 mb-8 font-light">Whether you are exploring career options, life transitions, or institutional programs.</p>
          <Link href="/book" className="inline-block bg-golden-pollen text-charcoal-blue font-bold py-4 px-10 rounded-full text-lg shadow-xl hover:bg-secondary-hover transition-all">
            Start a Conversation
          </Link>
        </div>
      </section>
    </div>
  );
}
