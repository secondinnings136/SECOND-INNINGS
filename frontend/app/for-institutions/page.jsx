import React from 'react';
import Link from 'next/link';
import { Users, Presentation, Target, Compass, Heart, GraduationCap, Briefcase, BarChart, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'For Institutions | Second Innings',
  description: 'A student development layer that complements academic systems.',
};

const models = [
  { icon: Users, title: "Individual Mentoring", text: "One-to-one conversations on career direction, confidence, transition, and self-understanding." },
  { icon: Presentation, title: "Small-Group Conversations", text: "Structured cohort sessions around common adolescent and career decision concerns." },
  { icon: Target, title: "Student Leadership Development", text: "Using councils, clubs, and peer activities as practical leadership laboratories." },
  { icon: Compass, title: "Career & Higher-Ed Exposure", text: "Candid, grounded interactions with seasoned professionals, alumni, and academics." },
  { icon: Heart, title: "Parent Engagement", text: "Constructive forums helping parents understand modern career dynamics without friction." },
  { icon: GraduationCap, title: "School-to-Life Transition", text: "Preparing senior students for personal independence, campus life, and emotional readiness." },
  { icon: Briefcase, title: "Professional Exposure", text: "Connecting students with curated internships, fellowships, and real-world pathways." },
  { icon: BarChart, title: "Student Development Insights", text: "Evidence-based, aggregate reporting on student needs, concerns, and observable movement." }
];

const dimensions = [
  { name: "Clarity", evidence: "More definitive, research-backed choices about electives, streams, and career paths." },
  { name: "Confidence", evidence: "Increased voluntary participation in classroom discussions and campus initiatives." },
  { name: "Exposure", evidence: "Higher uptake of external competitions, national fellowships, and curated internships." },
  { name: "Action", evidence: "Consistent completion of personal 7-Day action steps and initiative follow-through." },
  { name: "Ownership", evidence: "Students taking personal responsibility rather than relying purely on parental prompting." },
  { name: "Continuity", evidence: "Smoother year-to-year transitions with lower disengagement and drop-off anxiety." },
  { name: "Institutional Value", evidence: "Enhanced institutional reputation, stronger parent trust, and positive word-of-mouth." }
];

export default function ForInstitutionsPage() {
  return (
    <div className="min-h-screen font-sans">
      {/* S1: Hero */}
      <section className="bg-gradient-to-br from-charcoal-blue via-[#263747] to-midnight-violet text-white py-24 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-tea-green/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-tea-green text-xs font-semibold uppercase tracking-wider mb-6">
            Institutional Partnership
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-serif leading-tight">
            A Student Development Layer That Complements What You Already Do
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-200 font-light max-w-3xl mx-auto">
            Second Innings works alongside your academic, counselling and administrative systems, not instead of them.
          </p>
          <Link href="/contact" className="inline-block bg-golden-pollen text-charcoal-blue font-bold py-3.5 px-8 rounded-full text-lg shadow-lg hover:bg-secondary-hover transition-all">
            Talk to Us About Your Institution
          </Link>
        </div>
      </section>

      {/* S2: Value Cycle */}
      <section className="py-24 bg-white px-6 md:px-12 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-tea-green/35 text-charcoal-blue text-xs font-bold uppercase tracking-wider mb-3">
            Institutional Impact
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif text-charcoal-blue">The Virtuous Cycle of Student Development</h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-16">How a dedicated mentoring presence compounds institutional reputation over time.</p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 lg:gap-4 flex-wrap">
            {['Better Student Experience', 'Stronger Parent Confidence', 'Positive Word of Mouth', 'Stronger Reputation', 'Admissions & Retention'].map((step, idx, arr) => (
              <React.Fragment key={idx}>
                <div className="bg-slate-50 border-2 border-slate-100 hover:border-tea-green text-charcoal-blue font-bold py-4 px-6 rounded-2xl shadow-sm text-center w-full md:w-auto flex-1 min-w-[180px] transition-all">
                  {step}
                </div>
                {idx < arr.length - 1 && (
                  <ArrowRight className="hidden md:block w-5 h-5 text-golden-pollen flex-shrink-0" />
                )}
                {idx < arr.length - 1 && (
                  <div className="block md:hidden w-1 h-5 bg-golden-pollen rounded my-1"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* S3: Engagement Models */}
      <section className="py-20 bg-slate-50 px-6 md:px-12 border-t border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-charcoal-blue">8 Engagement Frameworks for Your Campus</h2>
            <p className="text-gray-500 mt-2">Tailored modules that integrate smoothly with your existing academic calendar.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {models.map((model, idx) => (
              <div key={idx} className="bg-white p-7 rounded-2xl shadow-sm border border-slate-100 hover:border-golden-pollen transition-all flex flex-col h-full">
                <div className="mb-4 text-charcoal-blue p-3 bg-tea-green/30 inline-block rounded-xl self-start">
                  <model.icon size={24} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-charcoal-blue leading-tight">{model.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mt-auto">{model.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S4: 90-Day Pilot */}
      <section className="py-24 bg-white px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-golden-pollen/20 text-[#734A00] text-xs font-bold uppercase tracking-wider mb-3">
            Risk-Free Validation
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif text-charcoal-blue">Start Small. Understand First. Demonstrate Value. Then Decide.</h2>
          <p className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto">Our structured 90-day pilot model is built to validate tangible impact before any long-term commitment.</p>
          
          <div className="relative border-l-4 md:border-l-0 md:border-t-4 border-slate-200 md:flex md:justify-between pt-8 pb-12 ml-4 md:ml-0 md:pl-0 pl-8 space-y-12 md:space-y-0">
            {/* Phase 1 */}
            <div className="relative md:w-1/3 md:-mt-12 text-left md:text-center px-4">
              <div className="absolute -left-10 md:left-1/2 md:-ml-3 -top-1 md:-top-11 w-6 h-6 rounded-full bg-tea-green border-4 border-white shadow"></div>
              <h4 className="font-bold text-charcoal-blue mb-1 text-sm uppercase tracking-wider">Days 1–30</h4>
              <h3 className="text-xl font-bold text-charcoal-blue mb-2 font-serif">UNDERSTAND & LISTEN</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Immerse into institutional culture, existing student services, and identify 2–3 genuine priority focus areas.</p>
            </div>
            {/* Phase 2 */}
            <div className="relative md:w-1/3 md:-mt-12 text-left md:text-center px-4">
              <div className="absolute -left-10 md:left-1/2 md:-ml-3 -top-1 md:-top-11 w-6 h-6 rounded-full bg-golden-pollen border-4 border-white shadow"></div>
              <h4 className="font-bold text-[#734A00] mb-1 text-sm uppercase tracking-wider">Days 31–60</h4>
              <h3 className="text-xl font-bold text-charcoal-blue mb-2 font-serif">PILOT & ENGAGE</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Deliver pilot 1-on-1 conversations, small-group sessions, and parent dialogues based on initial findings.</p>
            </div>
            {/* Phase 3 */}
            <div className="relative md:w-1/3 md:-mt-12 text-left md:text-center px-4">
              <div className="absolute -left-10 md:left-1/2 md:-ml-3 -top-1 md:-top-11 w-6 h-6 rounded-full bg-midnight-violet border-4 border-white shadow"></div>
              <h4 className="font-bold text-midnight-violet mb-1 text-sm uppercase tracking-wider">Days 61–90</h4>
              <h3 className="text-xl font-bold text-charcoal-blue mb-2 font-serif">INTEGRATE & REVIEW</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Present documented qualitative and quantitative movement to leadership for informed joint decision-making.</p>
            </div>
          </div>
          
          <div className="bg-golden-pollen/15 border-2 border-golden-pollen/50 p-8 rounded-3xl max-w-3xl mx-auto mt-6 shadow-sm">
            <h3 className="text-lg font-bold text-charcoal-blue mb-2 uppercase tracking-wider">The Day-90 Question:</h3>
            <p className="text-xl md:text-2xl italic font-serif text-charcoal-blue">"Has Deepak's presence created meaningful additional value for your institution and its students?"</p>
          </div>
        </div>
      </section>

      {/* S5: Measurable Outcomes */}
      <section className="py-20 bg-slate-50 px-6 md:px-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-charcoal-blue">7 Dimensions of Measurable Movement</h2>
            <p className="text-gray-500 mt-2">Clear observable benchmarks we track across the engagement.</p>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {dimensions.map((dim, idx) => (
              <div key={idx} className="p-6 md:flex items-center hover:bg-slate-50/80 transition-colors">
                <div className="md:w-1/3 mb-2 md:mb-0 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-golden-pollen flex-shrink-0"></span>
                  <span className="font-bold text-charcoal-blue text-lg">{dim.name}</span>
                </div>
                <div className="md:w-2/3">
                  <p className="text-gray-600 text-sm leading-relaxed">{dim.evidence}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S6: CTA */}
      <section className="py-24 bg-gradient-to-br from-charcoal-blue via-[#263747] to-midnight-violet text-white text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">Start With an Institutional Discovery Call</h2>
          <p className="text-gray-200 text-lg mb-8 max-w-xl mx-auto font-light">We will discuss your campus dynamics, student priorities, and explore a low-friction pilot.</p>
          <Link href="/contact" className="inline-block bg-golden-pollen text-charcoal-blue font-bold py-4 px-10 rounded-full text-lg shadow-xl hover:bg-secondary-hover transition-all">
            Talk to Us About Your Institution
          </Link>
        </div>
      </section>
    </div>
  );
}
