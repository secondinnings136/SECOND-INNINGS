'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Quote, Sparkles, Compass, Lightbulb, Target } from 'lucide-react';
import { getFeaturedTestimonials } from '../../lib/api';

const fallbackTestimonials = [
  {
    category: 'LIFE PREPARATION',
    quote: 'You never just prepared students for university, you prepared us for life. You taught us to take ownership, stay disciplined, think independently, stand by our decisions, and never compromise on our values.',
    name: 'Priya Kaushik',
    role: 'Project Manager | Business Analyst',
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
    <div className="min-h-screen font-sans bg-white text-gray-800">
      {/* 1. Hero: Meet Deepak */}
      <section className="py-20 sm:py-28 px-6 bg-slate-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="w-36 h-36 sm:w-44 sm:h-44 mx-auto relative rounded-3xl overflow-hidden shadow-xl border-4 border-white mb-6">
            <Image 
              src="/deepaksogani.jpeg" 
              alt="Deepak Sogani - Founder, Second Innings" 
              fill
              className="object-cover object-top" 
            />
          </div>
          
          <div className="inline-block px-4 py-1.5 rounded-full bg-tea-green/30 text-charcoal-blue text-xs font-bold uppercase tracking-wider">
            Founder, Second Innings
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-charcoal-blue tracking-tight">
            Meet Deepak Sogani
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Over 35 years across the corporate world, entrepreneurship and higher education, now dedicated to mentoring young minds.
          </p>

          <blockquote className="text-xl sm:text-2xl italic text-charcoal-blue font-serif leading-relaxed max-w-2xl mx-auto border-l-4 border-golden-pollen pl-6 py-4 bg-white rounded-r-2xl shadow-sm text-left my-8">
            "I am not here to decide a young person's future. I want to help them understand themselves, see possibilities and make choices they can own."
            <footer className="text-xs font-sans not-italic font-semibold text-gray-500 mt-2">
              — Deepak Sogani
            </footer>
          </blockquote>
        </div>
      </section>

      {/* 2. The Journey & Higher Education Experience */}
      <section className="py-20 sm:py-28 px-6 max-w-4xl mx-auto space-y-12">
        <div className="space-y-6 text-gray-700 leading-relaxed text-base sm:text-lg">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-blue">
            The Journey to Second Innings
          </h2>
          <p>
            Deepak Sogani brings over 35 years of experience across the corporate world, entrepreneurship and higher education, a journey that has given him the opportunity to work with people across different ages, backgrounds and stages of life.
          </p>
          <p>
            His experience in higher education brought him particularly close to young people: not only through formal responsibilities, but through countless conversations about their aspirations, choices, opportunities, challenges and life beyond the classroom.
          </p>
          <p>
            Over time, he discovered that what he valued most was not telling young people what to do, but helping them think, bringing a different perspective to the conversation and opening their minds to possibilities they may not have considered.
          </p>
          <p>
            This understanding, combined with the perspective gained from his own professional and life journey, became the foundation for Second Innings.
          </p>
          <p>
            Today, he is dedicating this next phase of his journey to creating a space where young people can speak openly, explore widely, think independently and move forward with greater clarity and ownership.
          </p>
        </div>

        {/* Why "Second Innings"? */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-4">
          <p className="text-xs uppercase tracking-wider text-golden-pollen font-bold">The Origin</p>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-blue">
            Why "Second Innings"?
          </h3>
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
            After more than three decades across the corporate world, entrepreneurship and higher education, Deepak chose to dedicate the next phase of his professional life to working with young people.
          </p>
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
            His experience of working closely with university students reinforced something he had come to value deeply: some of the most meaningful contributions happen through conversations that help a young person gain perspective, discover an opportunity, reconsider a choice or take a meaningful next step.
          </p>
          <p className="p-4 rounded-xl bg-white border border-tea-green/60 text-charcoal-blue font-serif italic text-lg shadow-sm">
            "The first innings was about building his own journey. The Second Innings is about using that experience to contribute to the journeys of young people."
          </p>
        </div>
      </section>

      {/* 3. Core Principles */}
      <section className="py-20 sm:py-28 px-6 bg-slate-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <p className="text-xs uppercase tracking-widest text-primary/70 font-semibold">The Philosophy</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-blue">
              What Informs Every Conversation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-tea-green/30 text-charcoal-blue flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-charcoal-blue font-serif">Listen Before Advising</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Young people rarely need another person telling them what to do. They need someone who hears the real story behind the question.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-golden-pollen/25 text-charcoal-blue flex items-center justify-center">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-charcoal-blue font-serif">Wider Possibilities</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Opening doors to paths, opportunities and alternatives that conventional education pathways rarely expose students to.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-midnight-violet/10 text-midnight-violet flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-charcoal-blue font-serif">Action & Ownership</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Every conversation moves towards a practical next step that the young person understands, chooses, and is willing to own.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Student Voices Teaser */}
      <section className="py-20 sm:py-28 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-primary/70 font-semibold mb-2">Student Reflections</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-blue">
            In Their Words
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-gray-100 flex flex-col justify-between">
              <p className="text-sm text-gray-700 italic leading-relaxed mb-4">
                "{item.quote}"
              </p>
              <div>
                <p className="font-bold text-charcoal-blue text-sm">{item.name}</p>
                <p className="text-xs text-gray-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-20 bg-gradient-to-br from-charcoal-blue via-[#263747] to-midnight-violet text-white text-center px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold">
            Ready to start a conversation?
          </h2>
          <p className="text-gray-200 font-light">
            No commitment, no pressure. Just perspective.
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
