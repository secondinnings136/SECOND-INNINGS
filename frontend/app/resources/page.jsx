'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import Arrow from '../../components/ui/Arrow';
import PageHero from '../../components/ui/PageHero';
import SectionHead from '../../components/ui/SectionHead';
import { Reveal, RevealGroup, RevealItem } from '../../components/ui/Reveal';
import { getResources } from '../../lib/api';
import { CURATED_ARTICLES } from '../../lib/curatedArticles';

const tabs = ['All', 'For Students', 'For Parents', 'Frameworks & Tools'];

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [resources, setResources] = useState(CURATED_ARTICLES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRes() {
      try {
        const catMap = {
          'All': undefined,
          'For Students': 'for-students',
          'For Parents': 'for-parents',
          'Frameworks & Tools': 'frameworks-tools'
        };
        const catQuery = catMap[activeTab];
        const data = await getResources(catQuery);
        if (Array.isArray(data) && data.length > 0) {
          setResources(data);
        } else {
          if (activeTab === 'All') {
            setResources(CURATED_ARTICLES);
          } else {
            const filtered = CURATED_ARTICLES.filter(a => a.category === catQuery);
            setResources(filtered.length > 0 ? filtered : CURATED_ARTICLES);
          }
        }
      } catch (error) {
        const catMap = {
          'All': undefined,
          'For Students': 'for-students',
          'For Parents': 'for-parents',
          'Frameworks & Tools': 'frameworks-tools'
        };
        const catQuery = catMap[activeTab];
        if (catQuery) {
          setResources(CURATED_ARTICLES.filter(a => a.category === catQuery));
        } else {
          setResources(CURATED_ARTICLES);
        }
      }
    }
    fetchRes();
  }, [activeTab]);

  return (
    <div className="w-full">
      <PageHero
        meta={['Perspectives', 'Frameworks', 'Articles']}
        title="Perspectives, frameworks &amp; insights."
        lede="Ideas, reflection models, and practical frameworks to help you think, decide, and grow."
      />

      {/* S2: Category Tabs */}
      <section className="sticky top-20 z-30 border-b border-line bg-paper/90 backdrop-blur-md py-4">
        <div className="page-x flex items-center gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors duration-300 ${
                  isSelected
                    ? 'bg-ink text-paper'
                    : 'border border-line bg-paper text-ink hover:border-ink'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </section>

      {/* S3: Article Rows (Editorial Index) */}
      <section className="page-x py-16 md:py-24 min-h-[50vh]">
        <div className="border-t border-ink">
          {resources.map((item, idx) => (
            <Link
              key={item.slug || item._id || idx}
              href={`/resources/${item.slug}`}
              className="group block border-b border-line py-8 md:py-12 transition-colors duration-500 ease-editorial hover:bg-paper-2 -mx-5 px-5 md:-mx-10 md:px-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
                <div className="md:col-span-3 flex flex-wrap items-center gap-3">
                  <span className="meta text-signal">{item.category?.replace(/-/g, ' ')}</span>
                  <span className="meta text-muted">• {item.readingTime || 5} min</span>
                </div>
                <div className="md:col-span-8">
                  <h3 className="font-serif text-[clamp(1.5rem,2.5vw,2.25rem)] text-ink group-hover:text-signal transition-colors duration-300 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[0.9375rem] text-muted leading-relaxed mt-3 max-w-[65ch]">
                    {item.excerpt}
                  </p>
                </div>
                <div className="md:col-span-1 text-right hidden md:block">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line group-hover:bg-ink group-hover:text-paper group-hover:border-ink transition-colors duration-300">
                    <Arrow className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* S4: Bottom CTA */}
      <section className="border-t border-line bg-paper-2">
        <div className="page-x py-32 md:py-44">
          <RevealGroup className="max-w-[56rem]">
            <RevealItem as="p" className="meta mb-6">Dialogue</RevealItem>
            <RevealItem as="h2" className="font-serif text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.95] text-ink">
              Want to discuss any of these ideas?
            </RevealItem>
            <RevealItem as="p" className="lede mt-6 text-[1.125rem]">
              Reading gives you the framework. A conversation helps you apply it to your personal situation.
            </RevealItem>
            <RevealItem className="mt-10">
              <Button href="/book">Start a Conversation</Button>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>
    </div>
  );
}
