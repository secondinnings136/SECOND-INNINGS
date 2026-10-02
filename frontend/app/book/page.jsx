'use client'

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { submitBooking } from '../../lib/api';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function Book() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    currentStage: '',
    city: '',
    email: '',
    phone: '',
    topic: '',
    usefulGoal: '',
    source: '',
    referredBy: '',
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
        concern: formData.topic,
        userType: 'student',
      });

      setStatus({
        type: 'success',
        message: 'Thank you. We have received your details and will get in touch with you shortly to schedule our conversation.'
      });
      setFormData({
        name: '',
        age: '',
        currentStage: '',
        city: '',
        email: '',
        phone: '',
        topic: '',
        usefulGoal: '',
        source: '',
        referredBy: '',
      });
    } catch (error) {
      console.error('Booking submission error:', error);
      setStatus({
        type: 'error',
        message: 'Something went wrong while submitting. Please feel free to reach out directly via WhatsApp or phone.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-charcoal-blue via-[#263747] to-midnight-violet text-white py-16 sm:py-20 px-6 text-center relative overflow-hidden">
        <div className="container mx-auto max-w-3xl relative z-10">
          <p className="text-xs uppercase tracking-widest text-tea-green font-semibold mb-3">
            Second Innings
          </p>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-4xl sm:text-5xl font-bold mb-4 font-serif tracking-tight"
          >
            What's on your mind?
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-lg sm:text-xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed"
          >
            Every meaningful conversation starts somewhere. There is nothing to prepare and no need to know exactly what you want to discuss. Tell us a little about yourself and what you would like to talk about.
          </motion.p>
        </div>
      </section>

      {/* Main Container */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {status.type === 'success' ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-tea-green text-center space-y-6"
          >
            <div className="w-16 h-16 bg-tea-green/30 text-charcoal-blue rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9 text-charcoal-blue" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-blue font-serif">
              {status.message}
            </h2>
            <p className="text-gray-600 max-w-lg mx-auto">
              Your first step doesn't have to be a big one. Sometimes, it can simply be a conversation.
            </p>
            <div className="pt-4">
              <a
                href="https://wa.me/919314072153?text=Hi%20Deepak%20Sir,%20I%20just%20submitted%20the%20form%20on%20Second%20Innings."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-golden-pollen text-charcoal-blue font-bold px-8 py-3.5 rounded-full hover:bg-secondary-hover transition-all shadow-md text-sm sm:text-base"
              >
                <MessageCircle className="mr-2" size={18} />
                Message on WhatsApp for Immediate Contact
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {status.type === 'error' && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  {status.message}
                </div>
              )}

              {/* Name & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-charcoal-blue mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-charcoal-blue/20 focus:border-charcoal-blue transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-blue mb-2">
                    Age
                  </label>
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="e.g. 19"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-charcoal-blue/20 focus:border-charcoal-blue transition-all text-sm"
                  />
                </div>
              </div>

              {/* School / College / Stage & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-charcoal-blue mb-2">
                    School / College / University / Current Stage
                  </label>
                  <input
                    type="text"
                    name="currentStage"
                    value={formData.currentStage}
                    onChange={handleInputChange}
                    placeholder="e.g. 2nd Year B.Tech or 12th Grade"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-charcoal-blue/20 focus:border-charcoal-blue transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-blue mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Jaipur, Delhi, Mumbai"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-charcoal-blue/20 focus:border-charcoal-blue transition-all text-sm"
                  />
                </div>
              </div>

              {/* Email & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-charcoal-blue mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="yourname@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-charcoal-blue/20 focus:border-charcoal-blue transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-blue mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-charcoal-blue/20 focus:border-charcoal-blue transition-all text-sm"
                  />
                </div>
              </div>

              {/* What would you like to talk about */}
              <div>
                <label className="block text-sm font-semibold text-charcoal-blue mb-2">
                  What would you like to talk about?
                  <span className="block text-xs font-normal text-gray-500 mt-0.5">
                    Write it in your own words. A few lines are enough.
                  </span>
                </label>
                <textarea
                  name="topic"
                  rows={4}
                  value={formData.topic}
                  onChange={handleInputChange}
                  placeholder="Share whatever is on your mind..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-charcoal-blue/20 focus:border-charcoal-blue transition-all text-sm"
                />
              </div>

              {/* What would make this conversation useful */}
              <div>
                <label className="block text-sm font-semibold text-charcoal-blue mb-2">
                  What would make this conversation useful for you?{' '}
                  <span className="text-xs font-normal text-gray-500">(Optional)</span>
                </label>
                <textarea
                  name="usefulGoal"
                  rows={2}
                  value={formData.usefulGoal}
                  onChange={handleInputChange}
                  placeholder="What would you like to walk away with?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-charcoal-blue/20 focus:border-charcoal-blue transition-all text-sm"
                />
              </div>

              {/* Source & Referral */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-charcoal-blue mb-2">
                    How did you hear about Second Innings?
                  </label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-charcoal-blue/20 focus:border-charcoal-blue transition-all text-sm bg-white"
                  >
                    <option value="">Select an option</option>
                    <option value="Friend">Friend</option>
                    <option value="Former Student">Former Student</option>
                    <option value="Parent or Family">Parent or Family</option>
                    <option value="Teacher or Educator">Teacher or Educator</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-blue mb-2">
                    Were you referred by someone?
                    <span className="block text-xs font-normal text-gray-500 mt-0.5">
                      If yes, you may mention their name
                    </span>
                  </label>
                  <input
                    type="text"
                    name="referredBy"
                    value={formData.referredBy}
                    onChange={handleInputChange}
                    placeholder="Referrer's name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-charcoal-blue/20 focus:border-charcoal-blue transition-all text-sm"
                  />
                </div>
              </div>

              {/* Confidentiality Callout */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3.5 text-xs text-gray-600">
                <ShieldCheck className="w-5 h-5 text-charcoal-blue flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-charcoal-blue">Your Conversation Matters</p>
                  <p>
                    Second Innings aims to provide a respectful and non-judgmental space where young people can speak openly. Personal information and conversations are treated with discretion and respect for privacy, subject to appropriate safety, safeguarding and legal responsibilities.
                  </p>
                  <Link
                    href="/privacy-boundaries"
                    className="inline-flex items-center text-primary font-medium hover:underline pt-1"
                  >
                    Read Privacy & Professional Boundaries <ArrowRight size={12} className="ml-1" />
                  </Link>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-golden-pollen text-charcoal-blue font-bold px-10 py-4 rounded-full hover:bg-secondary-hover transition-all text-base shadow-md disabled:opacity-50 tracking-wide uppercase"
                >
                  {isSubmitting ? 'Submitting...' : 'Start a Conversation'}
                </button>
                <p className="text-xs text-gray-500 mt-3 font-light">
                  Your first step doesn't have to be a big one. Sometimes, it can simply be a conversation.
                </p>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
