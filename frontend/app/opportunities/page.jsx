'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ExternalLink, ArrowRight, Info, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { getOpportunities } from '../../lib/api';

const categories = [
  "All", "Internships", "Fellowships", "Scholarships", 
  "Courses", "Higher Education", "Entrepreneurship", 
  "Social Impact", "Professional Exposure"
];

export default function OpportunitiesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    async function fetchOpps() {
      setLoading(true);
      try {
        const catQuery = activeCategory === 'All' ? undefined : activeCategory.toLowerCase().replace(/ /g, '-');
        const data = await getOpportunities({ category: catQuery });
        setOpportunities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch opportunities", error);
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOpps();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* S1: Hero */}
      <section className="bg-gradient-to-br from-charcoal-blue via-[#263747] to-midnight-violet text-white py-20 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-tea-green/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-tea-green text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles size={14} className="text-golden-pollen" />
            Curated Knowledge Bank
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">Curated Opportunities. Not Random Links.</h1>
          <p className="text-xl text-gray-200 font-light max-w-3xl mx-auto">
            Every opportunity here is hand-selected for relevance to your mentoring journey. We help you understand fit, eligibility, and the practical next step.
          </p>
        </div>
      </section>

      {/* S2: Category Filter Bar */}
      <section className="sticky top-[72px] z-20 bg-white border-b border-slate-200 shadow-sm py-4 px-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex space-x-2 w-max md:w-auto md:flex-wrap md:justify-center">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all mb-1 whitespace-nowrap ${
                  isSelected
                    ? 'bg-charcoal-blue text-golden-pollen shadow-sm ring-2 ring-golden-pollen/50'
                    : 'bg-slate-100 text-charcoal-blue/80 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* S4: How to Use This (Callout) */}
      <section className="px-6 mt-10 mb-8">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-tea-green/20 via-golden-pollen/15 to-white border border-tea-green/50 rounded-2xl p-6 flex items-start shadow-sm">
          <Info className="w-6 h-6 text-charcoal-blue mr-4 flex-shrink-0 mt-0.5" />
          <p className="text-charcoal-blue font-medium text-sm md:text-base leading-relaxed">
            These opportunities support your 7-Day Next Step. If you would like help understanding which pathway matches your strengths and goals, <Link href="/book" className="text-charcoal-blue font-bold underline decoration-golden-pollen decoration-2 underline-offset-2 hover:text-midnight-violet">start a conversation</Link>.
          </p>
        </div>
      </section>

      {/* S3: Opportunity Cards Grid */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto min-h-[50vh]">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="bg-white rounded-2xl h-64 animate-pulse shadow-sm p-6 border border-slate-100">
                <div className="h-4 bg-slate-200 w-1/3 rounded mb-4"></div>
                <div className="h-6 bg-slate-200 w-3/4 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 w-1/2 rounded mb-8"></div>
                <div className="h-4 bg-slate-200 w-full rounded mb-2"></div>
              </div>
            ))}
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 max-w-xl mx-auto shadow-sm">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-charcoal-blue mb-2 font-serif">No opportunities in this category yet</h3>
            <p className="text-gray-500 text-sm">Deepak Sir continuously curates high-impact openings. Check back soon or request a specific category.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => {
              const oppId = opp._id || opp.id;
              const isExpanded = expandedId === oppId;
              const fundingText = opp.costOrFunding || opp.costFunding || opp.funding;

              return (
                <div key={oppId} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:border-tea-green hover:shadow-md transition-all">
                  <div className="p-6 md:p-7 flex-grow">
                    <div className="flex justify-between items-start gap-2 mb-4">
                      <span className="inline-block px-3 py-1 bg-tea-green/35 text-charcoal-blue text-xs font-bold uppercase tracking-wider rounded-full border border-tea-green/40">
                        {opp.category?.replace(/-/g, ' ')}
                      </span>
                      {fundingText && (
                        <span className="inline-block px-3 py-1 bg-golden-pollen/25 text-[#734A00] border border-golden-pollen/50 text-xs font-bold rounded-full">
                          {fundingText}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-charcoal-blue mb-2 font-serif leading-snug">
                      {opp.name || opp.title}
                    </h3>
                    
                    {opp.bestFor && (
                      <p className="text-xs font-bold text-midnight-violet uppercase tracking-wide mb-3">
                        Best For: <span className="font-medium capitalize text-gray-700">{opp.bestFor}</span>
                      </p>
                    )}

                    <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-3">
                      {opp.whatItOffers || opp.description}
                    </p>
                    
                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-gray-500">
                      {(opp.location || opp.locationMode) && (
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-charcoal-blue" />
                          <span className="capitalize">{opp.locationMode} {opp.location ? `• ${opp.location}` : ''}</span>
                        </div>
                      )}
                      {opp.deadline && (
                        <div className="flex items-center gap-2 text-[#734A00] font-semibold">
                          <Calendar size={14} />
                          <span>Deadline: {new Date(opp.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expandable Section */}
                  <div className="border-t border-slate-100 bg-slate-50/70 p-5 pt-3">
                    {isExpanded && (
                      <div className="pt-2 pb-4 text-xs text-gray-700 space-y-3">
                        {opp.eligibility && (
                          <div>
                            <strong className="text-charcoal-blue block mb-0.5">Eligibility:</strong>
                            <p className="leading-relaxed text-gray-600">{opp.eligibility}</p>
                          </div>
                        )}
                        {opp.whyUseful && (
                          <div>
                            <strong className="text-charcoal-blue block mb-0.5">Why It's Useful:</strong>
                            <p className="leading-relaxed text-gray-600">{opp.whyUseful}</p>
                          </div>
                        )}
                        {opp.suggestedNextStep && (
                          <div className="bg-golden-pollen/15 p-2.5 rounded-xl border border-golden-pollen/40">
                            <strong className="text-[#734A00] block mb-0.5">Suggested Next Step:</strong>
                            <p className="leading-relaxed text-charcoal-blue">{opp.suggestedNextStep}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : oppId)}
                        className="text-xs font-bold text-charcoal-blue hover:text-midnight-violet"
                      >
                        {isExpanded ? 'Show Less ↑' : 'Learn More ↓'}
                      </button>

                      {opp.officialSource && (
                        <a
                          href={opp.officialSource}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-bold text-charcoal-blue hover:text-midnight-violet gap-1"
                        >
                          Official Source <ExternalLink size={12} className="text-golden-pollen" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* S5: Bottom CTA */}
      <section className="mt-20 py-16 bg-white border-t border-slate-200 text-center px-6">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold font-serif text-charcoal-blue mb-3">Unsure Which Opportunity Fits Your Path?</h3>
          <p className="text-gray-600 text-sm mb-6">Let's look at your interests, timeline, and strengths together in a 30-minute mentoring conversation.</p>
          <Link
            href="/book"
            className="inline-block bg-golden-pollen text-charcoal-blue font-bold px-8 py-3.5 rounded-full hover:bg-secondary-hover shadow-md transition-all text-base"
          >
            Start a Conversation
          </Link>
        </div>
      </section>
    </div>
  );
}
