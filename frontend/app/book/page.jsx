'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Users, Building, MessageCircle, Phone, Mail, CheckCircle2, Sparkles } from 'lucide-react';
import { submitBooking } from '../../lib/api';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Book() {
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    ageGroup: '19-21',
    message: '',
    preferredDate: '',
    preferredTime: '',
    source: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await submitBooking({
        ...formData,
        concern: formData.message,
        userType: userType || 'student'
      });

      setStatus({ type: 'success', message: 'Thank you! We have received your request and will confirm your slot shortly.' });
      setFormData({
        name: '', phone: '', email: '', ageGroup: '19-21', message: '', preferredDate: '', preferredTime: '', source: ''
      });
    } catch (error) {
      console.error('Booking submission error:', error);
      setStatus({ type: 'error', message: 'Something went wrong while submitting. Please contact us directly via WhatsApp or phone.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50">
      {/* S1: Hero */}
      <section className="bg-gradient-to-br from-charcoal-blue via-[#263747] to-midnight-violet text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-tea-green/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="container mx-auto max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-tea-green text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles size={14} className="text-golden-pollen" />
            30-Minute Mentoring Session
          </div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeIn} className="text-4xl md:text-5xl font-bold mb-4 font-serif">
            Let's Start With a Conversation
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeIn} className="text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto">
            No commitment. No pressure. Just a 30-minute conversation to understand where you are and explore what comes next.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {status.type === 'success' ? (
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="bg-white p-10 md:p-14 rounded-3xl shadow-sm border border-tea-green text-center">
             <div className="w-20 h-20 bg-tea-green/35 text-charcoal-blue rounded-3xl flex items-center justify-center mx-auto mb-6">
               <CheckCircle2 className="w-10 h-10 text-charcoal-blue" />
             </div>
             <h2 className="text-2xl md:text-3xl font-bold text-charcoal-blue font-serif mb-4">{status.message}</h2>
             <p className="text-gray-600 mb-8 max-w-lg mx-auto">What to expect: A focused 30-minute conversation. We listen first. No selling, no prescription — just clarity.</p>
             <a 
               href="https://wa.me/919314072153?text=Hi%20Deepak%20Sir,%20I%20just%20booked%20a%20conversation%20on%20Second%20Innings." 
               target="_blank" 
               rel="noopener noreferrer" 
               className="inline-flex items-center bg-golden-pollen text-charcoal-blue font-bold px-8 py-3.5 rounded-full hover:bg-secondary-hover transition-all shadow-md"
             >
               <MessageCircle className="mr-2" size={20} /> Message on WhatsApp for Immediate Contact
             </a>
          </motion.div>
        ) : (
          <>
            {/* S2: Choose Your Path */}
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-10">
              <h3 className="text-xs font-bold text-center mb-4 text-charcoal-blue uppercase tracking-widest">Select Your Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'student', label: "I'm a Student", icon: GraduationCap },
                  { id: 'parent', label: "I'm a Parent", icon: Users },
                  { id: 'institution', label: "I'm from an Institution", icon: Building }
                ].map((type) => {
                  const isSelected = userType === type.id;
                  return (
                    <button
                      type="button"
                      key={type.id}
                      onClick={() => setUserType(type.id)}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                        isSelected 
                          ? 'border-golden-pollen bg-golden-pollen/15 text-charcoal-blue shadow-sm font-bold ring-2 ring-golden-pollen/50' 
                          : 'border-slate-200 bg-white text-gray-500 hover:border-slate-300'
                      }`}
                    >
                      <type.icon className={`w-8 h-8 ${isSelected ? 'text-charcoal-blue' : 'text-gray-400'}`} />
                      <span className="text-base">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* S3: Booking Form */}
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
              {status.type === 'error' && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm">
                  {status.message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-blue uppercase tracking-wider mb-2">Full Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Aryan Sharma"
                      className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-golden-pollen focus:border-transparent outline-none text-sm text-charcoal-blue" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal-blue uppercase tracking-wider mb-2">Phone / WhatsApp *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      required 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      placeholder="+91 98765 43210"
                      className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-golden-pollen focus:border-transparent outline-none text-sm text-charcoal-blue" 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-blue uppercase tracking-wider mb-2">Email Address (Optional)</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="name@example.com"
                      className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-golden-pollen focus:border-transparent outline-none text-sm text-charcoal-blue" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal-blue uppercase tracking-wider mb-2">Age Group</label>
                    <select 
                      name="ageGroup" 
                      value={formData.ageGroup} 
                      onChange={handleInputChange} 
                      className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-golden-pollen focus:border-transparent outline-none bg-white text-sm text-charcoal-blue"
                    >
                      <option value="16-18">16–18 (High School / Junior College)</option>
                      <option value="19-21">19–21 (Undergraduate)</option>
                      <option value="22-25">22–25 (Postgraduate / Early Career)</option>
                      <option value="Parent">Parent</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-blue uppercase tracking-wider mb-2">In one line, what's on your mind right now?</label>
                  <textarea 
                    name="message" 
                    rows="2" 
                    maxLength="500" 
                    value={formData.message} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Unsure whether to prepare for civil services or take up campus placement."
                    className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-golden-pollen focus:border-transparent outline-none resize-none text-sm text-charcoal-blue"
                  ></textarea>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-blue uppercase tracking-wider mb-2">Preferred Date</label>
                    <input 
                      type="date" 
                      name="preferredDate" 
                      value={formData.preferredDate} 
                      onChange={handleInputChange} 
                      className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-golden-pollen focus:border-transparent outline-none text-sm text-charcoal-blue" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal-blue uppercase tracking-wider mb-2">Preferred Time Slot</label>
                    <select 
                      name="preferredTime" 
                      value={formData.preferredTime} 
                      onChange={handleInputChange} 
                      className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-golden-pollen focus:border-transparent outline-none bg-white text-sm text-charcoal-blue"
                    >
                      <option value="">Any time works</option>
                      <option value="Morning">Morning (10:00 AM – 1:00 PM)</option>
                      <option value="Afternoon">Afternoon (2:00 PM – 5:00 PM)</option>
                      <option value="Evening">Evening (6:00 PM – 8:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full sm:w-auto bg-golden-pollen text-charcoal-blue px-10 py-4 rounded-full font-bold hover:bg-secondary-hover transition-all text-base md:text-lg shadow-lg hover:shadow-xl disabled:opacity-70"
                  >
                    {isSubmitting ? 'Confirming...' : 'Book Your 30-Minute Conversation'}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Direct Contact Cards */}
            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm mb-4">Prefer to reach out directly?</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
                <a 
                  href="https://wa.me/919314072153" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm text-charcoal-blue hover:border-tea-green"
                >
                  <MessageCircle size={16} className="text-tea-green" /> WhatsApp (+91 93140 72153)
                </a>
                <a 
                  href="mailto:deepaksogani18@gmail.com" 
                  className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm text-charcoal-blue hover:border-golden-pollen"
                >
                  <Mail size={16} className="text-golden-pollen" /> deepaksogani18@gmail.com
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
