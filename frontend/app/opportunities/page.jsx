'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import Arrow from '../../components/ui/Arrow';
import PageHero from '../../components/ui/PageHero';
import SectionHead from '../../components/ui/SectionHead';
import { Reveal, RevealGroup, RevealItem } from '../../components/ui/Reveal';
import { getOpportunities } from '../../lib/api';

const categories = [
  "All", "Internships", "Fellowships", "Scholarships", 
  "Courses", "Higher Education", "Entrepreneurship", 
  "Social Impact", "Professional Exposure"
];

const CURATED_OPPORTUNITIES = [
  {
    _id: "curated-1",
    name: "LAMP Fellowship (PRS Legislative Research)",
    category: "fellowships",
    bestFor: "Graduates & young professionals interested in law, governance, and public policy",
    eligibility: "Undergraduate degree in any discipline, age 25 or below",
    whatItOffers: "11-month intensive mentorship attached to a Member of Parliament in New Delhi, real-time legislative research, and ₹20,000/month stipend.",
    locationMode: "physical",
    location: "New Delhi",
    costFunding: "Stipend (Paid)",
    officialSource: "https://prsindia.org/lamp",
    whyUseful: "Unmatched direct exposure to national policymaking, bill drafting, parliamentary debates, and a lifelong alumni network.",
    suggestedNextStep: "Prepare a 500-word statement on a recent public policy debate and review past fellows' backgrounds.",
    isFeatured: true
  },
  {
    _id: "curated-2",
    name: "Tata Trusts Scholarships",
    category: "scholarships",
    bestFor: "Students pursuing undergraduate and postgraduate studies across India",
    eligibility: "Meritorious students across medical, engineering, design, and humanities streams with demonstrated need",
    whatItOffers: "Comprehensive financial assistance covering tuition fees, academic resources, and living expenses.",
    locationMode: "physical",
    location: "Pan-India",
    costFunding: "Scholarship",
    officialSource: "https://www.tatatrusts.org/our-work/individual-grants-programme/education-grants",
    whyUseful: "Alleviates financial burdens and connects scholars to one of India's most respected philanthropic networks.",
    suggestedNextStep: "Gather academic marksheets from the last two years and family income verification.",
    isFeatured: true
  },
  {
    _id: "curated-3",
    name: "Young India Fellowship (Ashoka University)",
    category: "higher-education",
    bestFor: "Recent graduates and young professionals seeking multidisciplinary perspectives",
    eligibility: "Recognized undergraduate degree in any field, open to all disciplines",
    whatItOffers: "1-year residential postgraduate diploma in Liberal Studies taught by world-class global faculty with substantial need-based scholarships.",
    locationMode: "physical",
    location: "Sonipat, NCR",
    costFunding: "Paid (Need-based Scholarships)",
    officialSource: "https://www.ashoka.edu.in/yif",
    whyUseful: "Breaks academic silos, teaches critical thinking, communication, and builds a powerful alumni network across corporates, NGOs, and academia.",
    suggestedNextStep: "Draft answers for the YIF reflective essay questions focusing on what drives your intellectual curiosity.",
    isFeatured: true
  },
  {
    _id: "curated-4",
    name: "NITI Aayog Internship Scheme",
    category: "internships",
    bestFor: "College and university students interested in governance, economics, and national strategy",
    eligibility: "Undergraduate/Postgraduate students scoring 85%+ in Class 12, currently enrolled in recognized universities",
    whatItOffers: "Unpaid 6-week to 6-month placement embedded within specialized verticals of India's premier policy think tank.",
    locationMode: "physical",
    location: "New Delhi",
    costFunding: "Unpaid / Official Certificate",
    officialSource: "https://niti.gov.in/internship",
    whyUseful: "Firsthand understanding of state-level policy formulation, flagship schemes execution, and national data analysis.",
    suggestedNextStep: "Applications open strictly on the 1st to 10th of every month. Align your vertical choice with your degree.",
    isFeatured: false
  },
  {
    _id: "curated-5",
    name: "Ashoka Young Changemakers",
    category: "social-impact",
    bestFor: "Teenagers and school students who have initiated real-world community solutions",
    eligibility: "Under 20 years of age with a demonstrated track record of leading a social initiative or community project",
    whatItOffers: "Global community membership, media exposure, peer mentorship, and scaling support from seasoned entrepreneurs.",
    locationMode: "hybrid",
    location: "Global / India",
    costFunding: "Free",
    officialSource: "https://www.ashoka.org/en-in/program/ashoka-young-changemakers",
    whyUseful: "Validates young leadership at a global level and builds lifelong agency and empathy.",
    suggestedNextStep: "Document the quantifiable community impact of your initiative and gather recommendations.",
    isFeatured: true
  },
  {
    _id: "curated-6",
    name: "Teach For India Fellowship",
    category: "fellowships",
    bestFor: "Graduates and young professionals wanting to develop frontline leadership skills",
    eligibility: "Bachelor's degree completed by start of fellowship, strong English proficiency",
    whatItOffers: "2-year full-time fellowship teaching in under-resourced schools, monthly stipend (~₹23,000/mo), and housing allowance.",
    locationMode: "physical",
    location: "Multiple Indian Cities",
    costFunding: "Stipend (Paid)",
    officialSource: "https://www.teachforindia.org/fellowship",
    whyUseful: "Develops deep emotional intelligence, grit, stakeholder management, and direct social understanding.",
    suggestedNextStep: "Review the multi-stage selection process and prepare for the 30-minute telephonic interview.",
    isFeatured: true
  },
  {
    _id: "curated-7",
    name: "Narotam Sekhsaria Post-Graduate Scholarships",
    category: "scholarships",
    bestFor: "Students pursuing Master's and Doctorate degrees at top global and Indian universities",
    eligibility: "Indian nationals graduating with top academic honors, aged below 30",
    whatItOffers: "Interest-free loan scholarship up to ₹20 lakhs with continuous mentoring throughout the degree.",
    locationMode: "hybrid",
    location: "Global / India",
    costFunding: "Interest-Free Loan Scholarship",
    officialSource: "https://pg.nsfoundation.co.in/",
    whyUseful: "Provides essential funding for high-cost top-tier global Master's programs without burdensome bank interest.",
    suggestedNextStep: "Confirm your target university admissions cycle and prepare a concise SOP on your academic vision.",
    isFeatured: false
  },
  {
    _id: "curated-8",
    name: "Startup India Seed Fund Scheme (SISFS)",
    category: "entrepreneurship",
    bestFor: "Early-stage student, graduate, and faculty innovators with proof of concept",
    eligibility: "DPIIT-recognized startup incorporated within the last 2 years with viable market application",
    whatItOffers: "Up to ₹20 lakhs in grants for validation and proof of concept; up to ₹50 lakhs in convertible debentures.",
    locationMode: "online",
    location: "Pan-India",
    costFunding: "Govt Grant & Seed Funding",
    officialSource: "https://seedfund.startupindia.gov.in/",
    whyUseful: "Crucial non-dilutive early capital that allows young founders to build prototypes without giving away equity prematurely.",
    suggestedNextStep: "Register your startup on Startup India and apply through an approved university business incubator.",
    isFeatured: false
  },
  {
    _id: "curated-9",
    name: "SBI Youth for India Fellowship",
    category: "social-impact",
    bestFor: "Young minds seeking grounded perspective on rural India before MBA, UPSC, or social enterprise",
    eligibility: "Bachelor's degree holder aged 21–32, citizen of India or Overseas Citizen",
    whatItOffers: "13-month rural placement with trusted NGOs, living allowance (₹16,000/mo), health insurance, and completion bonus.",
    locationMode: "physical",
    location: "Rural India",
    costFunding: "Stipend + Completion Bonus",
    officialSource: "https://youthforindia.org/",
    whyUseful: "A life-altering perspective on ground realities that shapes authentic leadership, empathy, and problem solving.",
    suggestedNextStep: "Explore past fellow project reports across water, education, and women's self-help groups.",
    isFeatured: true
  },
  {
    _id: "curated-10",
    name: "CII Young Indians (Yi)",
    category: "professional-exposure",
    bestFor: "Young professionals, corporate executives, and young family business successors (age 21–40)",
    eligibility: "Professional engagement or enterprise ownership, commitment to nation-building initiatives",
    whatItOffers: "Active participation in national industry committees, youth summits, bilateral international delegations.",
    locationMode: "hybrid",
    location: "All Major Indian Cities",
    costFunding: "Annual Membership",
    officialSource: "https://youngindians.net/",
    whyUseful: "Builds senior corporate relationships, peer learning, and civic engagement across Indian industry leaders.",
    suggestedNextStep: "Connect with the local city chapter (e.g. Jaipur, Delhi, Bengaluru) for an introductory mixer.",
    isFeatured: false
  },
  {
    _id: "curated-11",
    name: "Prime Minister's Research Fellowship (PMRF)",
    category: "scholarships",
    bestFor: "High-performing STEM undergraduates aspiring for direct PhD entry",
    eligibility: "Top 20% in B.Tech/M.Sc from IITs, IISc, NITs, or qualifying GATE score with 8.0+ CGPA",
    whatItOffers: "Monthly stipend of ₹70,000–₹80,000 plus an annual research grant of ₹2 lakhs for 5 years.",
    locationMode: "physical",
    location: "IITs / IISc / IISERs",
    costFunding: "Prestige Fellowship",
    officialSource: "https://www.pmrf.in/",
    whyUseful: "The premier research fellowship in India, enabling students to pursue cutting-edge research without leaving the country.",
    suggestedNextStep: "Identify research professors whose papers align with your undergraduate thesis.",
    isFeatured: false
  },
  {
    _id: "curated-12",
    name: "IIM Bangalore Online Management Series (IIMBx)",
    category: "courses",
    bestFor: "Students from engineering, sciences, and arts wanting foundational commercial and business acumen",
    eligibility: "Open to all students and working professionals",
    whatItOffers: "Self-paced high-rigor video courses on Strategy, Marketing, Accounting, and Entrepreneurship with IIMB certification.",
    locationMode: "online",
    location: "Online",
    costFunding: "Affordable / Audit Free",
    officialSource: "https://iimbx.edu.in/",
    whyUseful: "Builds practical business vocabulary and managerial perspective to supplement technical degrees.",
    suggestedNextStep: "Start with 'Do Your Venture: Entrepreneurship for Everyone' to test practical business concepts.",
    isFeatured: false
  }
];

export default function OpportunitiesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [opportunities, setOpportunities] = useState(CURATED_OPPORTUNITIES);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    async function fetchOpps() {
      try {
        const catQuery = activeCategory === 'All' ? undefined : activeCategory.toLowerCase().replace(/ /g, '-');
        const data = await getOpportunities({ category: catQuery });
        if (Array.isArray(data) && data.length > 0) {
          setOpportunities(data);
        } else {
          if (activeCategory === 'All') {
            setOpportunities(CURATED_OPPORTUNITIES);
          } else {
            const slug = activeCategory.toLowerCase().replace(/ /g, '-');
            const filtered = CURATED_OPPORTUNITIES.filter(o => o.category === slug);
            setOpportunities(filtered.length > 0 ? filtered : CURATED_OPPORTUNITIES);
          }
        }
      } catch (error) {
        if (activeCategory === 'All') {
          setOpportunities(CURATED_OPPORTUNITIES);
        } else {
          const slug = activeCategory.toLowerCase().replace(/ /g, '-');
          setOpportunities(CURATED_OPPORTUNITIES.filter(o => o.category === slug));
        }
      }
    }
    fetchOpps();
  }, [activeCategory]);

  return (
    <div className="w-full">
      <PageHero
        meta={['Curated Knowledge Bank', 'Hand-Selected', 'Verified Pathways']}
        title="Curated opportunities. Not random links."
        lede="Every opportunity here is hand-selected for relevance to your mentoring journey. We help you understand fit, eligibility, and the practical next step."
      />

      {/* S2: Filter Chips */}
      <section className="sticky top-20 z-30 border-b border-line bg-paper/90 backdrop-blur-md py-4">
        <div className="page-x flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors duration-300 ${
                  isSelected
                    ? 'bg-ink text-paper'
                    : 'border border-line bg-paper text-ink hover:border-ink'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* S3: Callout Notice */}
      <section className="page-x pt-12 pb-6">
        <div className="rounded-[1.75rem] border border-line bg-paper-2 p-6 md:p-8">
          <p className="meta text-signal mb-2">How to use this bank</p>
          <p className="text-[1.0625rem] text-ink leading-relaxed">
            These opportunities support your 7-Day Next Step. If you would like help understanding which pathway matches your strengths and goals, <Link href="/book" className="underline decoration-ink/40 underline-offset-4 hover:decoration-signal font-medium">start a conversation</Link>.
          </p>
        </div>
      </section>

      {/* S4: Opportunity Cards (Hairline Grid) */}
      <section className="page-x py-12 md:py-20 min-h-[50vh]">
        <div className="hairline-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opp, idx) => {
            const isExpanded = expandedId === opp._id;
            return (
              <div 
                key={opp._id || idx} 
                className="group flex flex-col justify-between p-8 transition-colors duration-500 ease-editorial hover:bg-paper-2"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="meta text-signal">
                      {opp.category}
                    </span>
                    {opp.costFunding && (
                      <span className="meta">
                        {opp.costFunding}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-[1.5rem] leading-snug text-ink mb-2">
                    {opp.name}
                  </h3>

                  <p className="meta text-muted mb-4 normal-case tracking-normal text-xs font-sans">
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted block mb-1">Best for</span>
                    {opp.bestFor}
                  </p>

                  <p className="text-[0.9375rem] text-muted line-clamp-3 mb-6 leading-relaxed">
                    {opp.whatItOffers}
                  </p>
                </div>

                <div className="pt-4 border-t border-line">
                  {isExpanded && (
                    <div className="space-y-4 mb-6 text-xs text-muted">
                      {opp.eligibility && (
                        <div>
                          <p className="meta mb-1 text-ink">Eligibility</p>
                          <p className="leading-relaxed">{opp.eligibility}</p>
                        </div>
                      )}
                      {opp.whyUseful && (
                        <div>
                          <p className="meta mb-1 text-ink">Why it matters</p>
                          <p className="leading-relaxed">{opp.whyUseful}</p>
                        </div>
                      )}
                      {opp.suggestedNextStep && (
                        <div className="border border-line bg-paper-3 p-3 rounded-xl">
                          <p className="meta mb-1 text-signal">Suggested next step</p>
                          <p className="text-ink leading-relaxed">{opp.suggestedNextStep}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : opp._id)}
                      className="meta text-ink hover:text-signal transition-colors"
                    >
                      {isExpanded ? '− Less' : '+ Details'}
                    </button>

                    {opp.officialSource && (
                      <a
                        href={opp.officialSource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="meta text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-signal"
                      >
                        Official site ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* S5: Bottom CTA */}
      <section className="border-t border-line bg-paper-2">
        <div className="page-x py-32 md:py-44">
          <RevealGroup className="max-w-[56rem]">
            <RevealItem as="p" className="meta mb-6">Personal evaluation</RevealItem>
            <RevealItem as="h2" className="font-serif text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.95] text-ink">
              Unsure which opportunity fits you best?
            </RevealItem>
            <RevealItem as="p" className="lede mt-6 text-[1.125rem]">
              We don&apos;t simply forward links. In a mentoring conversation, we help you evaluate fit, timing, and personal readiness.
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
