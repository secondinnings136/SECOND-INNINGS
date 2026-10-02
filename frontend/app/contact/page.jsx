'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageCircle, Linkedin, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { submitContact, submitInstitutionalEnquiry } from '../../lib/api';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Contact() {
  const [activeTab, setActiveTab] = useState('general'); // 'general' or 'institutional'
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  // General Form State
  const [generalForm, setGeneralForm] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });

  // Institutional Form State
  const [instForm, setInstForm] = useState({
    institutionName: '', institutionType: 'School', contactPerson: '',
    designation: '', email: '', phone: '', city: '', state: '',
    studentStrength: '', enquiryNature: '', interestedIn: []
  });

  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await submitContact(generalForm);
      setStatus({ type: 'success', message: 'Thank you! Your message has been received. We will get back to you shortly.' });
      setGeneralForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Failed to send message. Please contact us directly via WhatsApp or phone.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInstitutionalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await submitInstitutionalEnquiry(instForm);
      setStatus({ type: 'success', message: 'Institutional enquiry submitted successfully. Deepak Sir will reach out for a discovery conversation.' });
      setInstForm({
        institutionName: '', institutionType: 'School', contactPerson: '',
        designation: '', email: '', phone: '', city: '', state: '',
        studentStrength: '', enquiryNature: '', interestedIn: []
      });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Failed to submit enquiry. Please email or message us directly.' });
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (item) => {
    const slug = item.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setInstForm(prev => {
      const exists = prev.interestedIn.includes(slug);
      return {
        ...prev,
        interestedIn: exists ? prev.interestedIn.filter(s => s !== slug) : [...prev.interestedIn, slug]
      };
    });
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50">
      {/* S1: Hero */}
      <section className="bg-gradient-to-br from-charcoal-blue via-[#263747] to-midnight-violet text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-tea-green/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="container mx-auto max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-tea-green text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles size={14} className="text-golden-pollen" />
            Let's Connect
          </div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeIn} className="text-4xl md:text-5xl font-bold mb-4 font-serif">
            Get in Touch
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeIn} className="text-lg md:text-xl text-gray-200 font-light max-w-xl mx-auto">
            Direct, human perspective for students, parents, and educational institutions.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* S2: Contact Methods (4 cards) */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <a href="mailto:deepaksogani18@gmail.com" className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center text-center hover:border-golden-pollen hover:shadow-md transition-all group">
            <div className="w-14 h-14 bg-golden-pollen/20 text-[#734A00] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Mail size={24} />
            </div>
            <h3 className="font-bold text-charcoal-blue mb-1">Email</h3>
            <p className="text-xs text-gray-500 break-all">deepaksogani18@gmail.com</p>
          </a>

          <a href="https://wa.me/919314072153" target="_blank" rel="noopener noreferrer" className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center text-center hover:border-tea-green hover:shadow-md transition-all group">
            <div className="w-14 h-14 bg-tea-green/35 text-charcoal-blue rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <MessageCircle size={24} />
            </div>
            <h3 className="font-bold text-charcoal-blue mb-1">WhatsApp</h3>
            <p className="text-xs text-gray-500">+91 93140 72153</p>
          </a>

          <a href="tel:+919314072153" className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center text-center hover:border-charcoal-blue hover:shadow-md transition-all group">
            <div className="w-14 h-14 bg-charcoal-blue/10 text-charcoal-blue rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Phone size={24} />
            </div>
            <h3 className="font-bold text-charcoal-blue mb-1">Phone</h3>
            <p className="text-xs text-gray-500">+91 93140 72153</p>
          </a>

          <a href="https://linkedin.com/in/deepak-sogani" target="_blank" rel="noopener noreferrer" className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center text-center hover:border-midnight-violet hover:shadow-md transition-all group">
            <div className="w-14 h-14 bg-midnight-violet/10 text-midnight-violet rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Linkedin size={24} />
            </div>
            <h3 className="font-bold text-charcoal-blue mb-1">LinkedIn</h3>
            <p className="text-xs text-gray-500">linkedin.com/in/deepak-sogani</p>
          </a>
        </motion.div>

        {/* Forms Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button 
              type="button"
              className={`flex-1 py-4 font-bold text-center text-sm md:text-base transition-all ${
                activeTab === 'general' 
                  ? 'bg-charcoal-blue text-golden-pollen shadow-sm' 
                  : 'bg-slate-50 text-gray-500 hover:bg-slate-100'
              }`}
              onClick={() => setActiveTab('general')}
            >
              General Message
            </button>
            <button 
              type="button"
              className={`flex-1 py-4 font-bold text-center text-sm md:text-base transition-all ${
                activeTab === 'institutional' 
                  ? 'bg-charcoal-blue text-golden-pollen shadow-sm' 
                  : 'bg-slate-50 text-gray-500 hover:bg-slate-100'
              }`}
              onClick={() => setActiveTab('institutional')}
            >
              Institutional Enquiry (Schools & Colleges)
            </button>
          </div>

          <div className="p-8 md:p-12">
            {status.message && (
              <div className={`mb-8 p-4 rounded-2xl border text-sm flex items-center gap-3 ${
                status.type === 'success' 
                  ? 'bg-tea-green/30 text-charcoal-blue border-tea-green' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {status.type === 'success' && <CheckCircle2 size={18} className="text-charcoal-blue" />}
                {status.message}
              </div>
            )}

            {/* General Contact Form */}
            {activeTab === 'general' && (
              <form onSubmit={handleGeneralSubmit} className="space-y-6 max-w-3xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-blue uppercase tracking-wider mb-2">Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={generalForm.name}
                      onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-golden-pollen focus:border-transparent outline-none text-sm text-charcoal-blue" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal-blue uppercase tracking-wider mb-2">Email *</label>
                    <input 
                      type="email" 
                      required 
                      value={generalForm.email}
                      onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-golden-pollen focus:border-transparent outline-none text-sm text-charcoal-blue" 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-blue uppercase tracking-wider mb-2">Phone (Optional)</label>
                    <input 
                      type="tel" 
                      value={generalForm.phone}
                      onChange={(e) => setGeneralForm({ ...generalForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-golden-pollen focus:border-transparent outline-none text-sm text-charcoal-blue" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal-blue uppercase tracking-wider mb-2">Subject</label>
                    <input 
                      type="text" 
                      value={generalForm.subject}
                      onChange={(e) => setGeneralForm({ ...generalForm, subject: e.target.value })}
                      placeholder="e.g. Student mentoring inquiry"
                      className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-golden-pollen focus:border-transparent outline-none text-sm text-charcoal-blue" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-blue uppercase tracking-wider mb-2">Message *</label>
                  <textarea 
                    rows="4" 
                    required 
                    value={generalForm.message}
                    onChange={(e) => setGeneralForm({ ...generalForm, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-golden-pollen focus:border-transparent outline-none resize-none text-sm text-charcoal-blue"
                  ></textarea>
                </div>

                <div className="text-center pt-2">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-golden-pollen text-charcoal-blue px-10 py-3.5 rounded-full font-bold hover:bg-secondary-hover shadow-md transition-all text-base disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}

            {/* Institutional Enquiry */}
            {activeTab === 'institutional' && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-serif font-bold text-charcoal-blue mb-2">Institutional Partnership Enquiry</h2>
                  <p className="text-gray-500 text-sm">For schools, colleges and universities interested in our 90-day pilot framework.</p>
                </div>

                <form onSubmit={handleInstitutionalSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-charcoal-blue uppercase tracking-wider mb-2">Institution Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={instForm.institutionName}
                        onChange={(e) => setInstForm({ ...instForm, institutionName: e.target.value })}
                        placeholder="e.g. DPS International / Modern College"
                        className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-golden-pollen outline-none text-sm text-charcoal-blue" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-charcoal-blue uppercase tracking-wider mb-2">Institution Type</label>
                      <select 
                        value={instForm.institutionType}
                        onChange={(e) => setInstForm({ ...instForm, institutionType: e.target.value })}
                        className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-golden-pollen outline-none bg-white text-sm text-charcoal-blue"
                      >
                        <option value="school">School (Senior Secondary)</option>
                        <option value="college">Undergraduate College</option>
                        <option value="university">University</option>
                        <option value="other">Other Educational Organization</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-charcoal-blue uppercase tracking-wider mb-2">Contact Person *</label>
                      <input 
                        type="text" 
                        required 
                        value={instForm.contactPerson}
                        onChange={(e) => setInstForm({ ...instForm, contactPerson: e.target.value })}
                        placeholder="Name of Principal, Dean, or Coordinator"
                        className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-golden-pollen outline-none text-sm text-charcoal-blue" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-charcoal-blue uppercase tracking-wider mb-2">Designation</label>
                      <input 
                        type="text" 
                        value={instForm.designation}
                        onChange={(e) => setInstForm({ ...instForm, designation: e.target.value })}
                        placeholder="e.g. Dean of Student Welfare / Principal"
                        className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-golden-pollen outline-none text-sm text-charcoal-blue" 
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-charcoal-blue uppercase tracking-wider mb-2">Email *</label>
                      <input 
                        type="email" 
                        required 
                        value={instForm.email}
                        onChange={(e) => setInstForm({ ...instForm, email: e.target.value })}
                        placeholder="official.email@institution.edu"
                        className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-golden-pollen outline-none text-sm text-charcoal-blue" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-charcoal-blue uppercase tracking-wider mb-2">Phone *</label>
                      <input 
                        type="tel" 
                        required 
                        value={instForm.phone}
                        onChange={(e) => setInstForm({ ...instForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-golden-pollen outline-none text-sm text-charcoal-blue" 
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-charcoal-blue uppercase tracking-wider mb-2">City, State</label>
                      <input 
                        type="text" 
                        value={instForm.city}
                        onChange={(e) => setInstForm({ ...instForm, city: e.target.value })}
                        placeholder="e.g. Jaipur, Rajasthan"
                        className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-golden-pollen outline-none text-sm text-charcoal-blue" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-charcoal-blue uppercase tracking-wider mb-2">Approximate Student Strength</label>
                      <input 
                        type="text" 
                        value={instForm.studentStrength}
                        onChange={(e) => setInstForm({ ...instForm, studentStrength: e.target.value })}
                        placeholder="e.g. 500+ senior students"
                        className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-golden-pollen outline-none text-sm text-charcoal-blue" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-blue uppercase tracking-wider mb-3">Interested In (Select all that apply)</label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        "Individual Mentoring", "Small-Group Conversations", 
                        "Student Leadership", "Career/Higher-Ed Exposure", 
                        "Parent Engagement", "School-to-Life Transition", 
                        "Professional Exposure", "Student Development Insights"
                      ].map((item, i) => (
                        <label key={i} className="flex items-center space-x-3 text-xs md:text-sm text-gray-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:border-golden-pollen">
                          <input 
                            type="checkbox" 
                            onChange={() => toggleInterest(item)}
                            className="w-4 h-4 text-golden-pollen rounded border-gray-300 focus:ring-golden-pollen" 
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-blue uppercase tracking-wider mb-2">Nature of Enquiry *</label>
                    <textarea 
                      rows="4" 
                      required 
                      value={instForm.enquiryNature}
                      onChange={(e) => setInstForm({ ...instForm, enquiryNature: e.target.value })}
                      placeholder="Briefly describe what your institution is looking to achieve for your students."
                      className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-golden-pollen outline-none resize-none text-sm text-charcoal-blue"
                    ></textarea>
                  </div>

                  <div className="text-center pt-2">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="bg-golden-pollen text-charcoal-blue px-10 py-3.5 rounded-full font-bold hover:bg-secondary-hover shadow-md transition-all text-base disabled:opacity-50"
                    >
                      {loading ? 'Submitting...' : 'Submit Institutional Enquiry'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </motion.div>

        {/* S5: Location */}
        <div className="mt-16 text-center text-gray-500 flex items-center justify-center gap-2 text-sm">
          <MapPin size={18} className="text-charcoal-blue" />
          <span>Jaipur, Rajasthan, India</span>
        </div>
      </div>
    </div>
  );
}
