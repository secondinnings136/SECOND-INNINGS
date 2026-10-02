'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { getResources } from '../../lib/api';

const tabs = ['All', 'For Students', 'For Parents', 'Frameworks & Tools'];

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRes() {
      setLoading(true);
      try {
        const catMap = {
          'All': undefined,
          'For Students': 'for-students',
          'For Parents': 'for-parents',
          'Frameworks & Tools': 'frameworks-tools'
        };
        const catQuery = catMap[activeTab];
        const data = await getResources(catQuery);
        setResources(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch resources", error);
        setResources([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRes();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* S1: Hero */}
      <section className="bg-gradient-to-br from-charcoal-blue via-[#263747] to-midnight-violet text-white py-20 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-tea-green/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-tea-green text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles size={14} className="text-golden-pollen" />
            Articles & Frameworks
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">Perspectives, Frameworks & Insights</h1>
          <p className="text-xl text-gray-200 font-light">
            Ideas, reflection models, and mental frameworks to help you think, decide, and grow.
          </p>
        </div>
      </section>

      {/* S2: Category Tabs */}
      <section className="border-b border-slate-200 bg-white sticky top-[72px] z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex overflow-x-auto space-x-6">
            {tabs.map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 whitespace-nowrap font-medium text-sm md:text-base border-b-2 transition-all ${
                    isSelected
                      ? 'border-golden-pollen text-charcoal-blue font-bold'
                      : 'border-transparent text-gray-500 hover:text-charcoal-blue'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* S3: Article Cards Grid */}
      <section className="max-w-5xl mx-auto px-6 py-16 min-h-[50vh]">
        {loading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-white rounded-3xl h-56 animate-pulse shadow-sm p-8 border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="h-4 bg-slate-200 w-24 rounded-full mb-4"></div>
                  <div className="h-6 bg-slate-200 w-full rounded mb-2"></div>
                  <div className="h-6 bg-slate-200 w-2/3 rounded"></div>
                </div>
                <div className="h-4 bg-slate-200 w-1/3 rounded"></div>
              </div>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 max-w-md mx-auto shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-charcoal-blue mb-2 font-serif">Articles Coming Soon</h3>
            <p className="text-gray-500 text-sm mb-6">Deepak Sir is writing initial essays and frameworks. In the meantime, start a conversation directly!</p>
            <Link href="/book" className="text-charcoal-blue font-bold underline decoration-golden-pollen decoration-2 underline-offset-4 hover:text-midnight-violet text-sm">
              Start a conversation →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {resources.map((res) => (
              <Link 
                href={`/resources/${res.slug}`} 
                key={res._id || res.slug} 
                className="group bg-white rounded-3xl shadow-sm border border-slate-200 p-8 hover:shadow-md hover:border-tea-green transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-charcoal-blue bg-tea-green/35 border border-tea-green/40 px-3 py-1 rounded-full uppercase tracking-wider">
                      {res.category?.replace(/-/g, ' ')}
                    </span>
                    {(res.readingTime || res.readTime) && (
                      <span className="flex items-center text-gray-400 text-xs font-medium">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {res.readingTime || res.readTime} min read
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-charcoal-blue mb-3 group-hover:text-midnight-violet transition-colors leading-snug">
                    {res.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-3">
                    {res.excerpt}
                  </p>
                </div>
                <div className="flex items-center text-charcoal-blue font-bold text-sm pt-4 border-t border-slate-100">
                  Read Article <ArrowRight className="w-4 h-4 ml-2 text-golden-pollen group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* S4: CTA */}
      <section className="bg-slate-100/80 py-16 text-center px-6 border-t border-slate-200">
        <h2 className="text-xl md:text-2xl font-bold font-serif text-charcoal-blue mb-3">Want to Discuss Any of These Ideas?</h2>
        <p className="text-gray-600 text-sm mb-6">Every article represents a real-world theme we explore in 1-on-1 mentoring.</p>
        <Link 
          href="/book" 
          className="inline-block bg-golden-pollen text-charcoal-blue font-bold py-3.5 px-8 rounded-full shadow-md hover:bg-secondary-hover transition-all text-base"
        >
          Start a Conversation
        </Link>
      </section>
    </div>
  );
}
