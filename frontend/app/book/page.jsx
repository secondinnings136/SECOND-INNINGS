'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import Arrow from '../../components/ui/Arrow';
import { submitBooking } from '../../lib/api';

export default function Book() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    isUnder18: false,
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    parentConsentConfirmed: false,
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

  // Compute if applicant is a minor based on typed age or manual toggle
  const numericAge = parseInt(formData.age, 10);
  const isMinor = formData.isUnder18 || (!isNaN(numericAge) && numericAge < 18 && numericAge > 0);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => {
        const updated = { ...prev, [name]: value };
        if (name === 'age') {
          const num = parseInt(value, 10);
          if (!isNaN(num) && num < 18 && num > 0) {
            updated.isUnder18 = true;
          } else if (!isNaN(num) && num >= 18) {
            updated.isUnder18 = false;
          }
        }
        return updated;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    // Under-18 verification validation
    if (isMinor) {
      if (!formData.parentName.trim()) {
        setStatus({
          type: 'error',
          message: 'Because you are under 18, please provide your parent or guardian’s name.'
        });
        return;
      }
      if (!formData.parentPhone.trim()) {
        setStatus({
          type: 'error',
          message: 'Because you are under 18, please provide your parent or guardian’s phone number.'
        });
        return;
      }
      if (!formData.parentConsentConfirmed) {
        setStatus({
          type: 'error',
          message: 'Please confirm that your parent or guardian is aware of and consents to this enquiry.'
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await submitBooking({
        ...formData,
        isUnder18: isMinor,
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
        isUnder18: false,
        parentName: '',
        parentPhone: '',
        parentEmail: '',
        parentConsentConfirmed: false,
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
    <div className="w-full">
      <div className="page-x pt-36 md:pt-48 pb-28 md:pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Context & Direct Info */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <span className="meta text-signal mb-6 block">Intake &amp; Conversation</span>
              <h1 className="font-serif text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[0.95] tracking-[-0.02em] text-ink mb-6">
                What&apos;s on your mind?
              </h1>
              <p className="lede text-[1.125rem] text-muted mb-10">
                Every meaningful conversation starts somewhere. There is nothing to prepare and no need to know exactly what you want to discuss. Tell us a little about yourself and what you would like to talk about.
              </p>

              <div className="border-t border-line pt-8 space-y-6">
                <div>
                  <p className="meta text-muted mb-2">Prefer to reach out directly?</p>
                  <p className="text-[0.9375rem] text-ink-2">
                    Write to <a href="mailto:deepak@second-innings.in" className="text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-signal">deepak@second-innings.in</a>
                  </p>
                </div>
                <div>
                  <p className="meta text-muted mb-2">Direct call or message</p>
                  <div className="flex flex-wrap items-center gap-4 text-[0.9375rem]">
                    <a href="https://wa.me/917737220724" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-signal transition-colors">
                      WhatsApp ↗
                    </a>
                    <span className="text-line">•</span>
                    <a href="tel:+917737220724" className="font-mono text-ink text-[0.875rem]">
                      +91 77372 20724
                    </a>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-muted leading-relaxed">
                    Under 18? A parent or guardian consent step is required in compliance with Indian safeguarding guidelines.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form Object */}
          <div className="lg:col-span-7">
            {status.type === 'success' ? (
              <div className="rounded-[1.75rem] border border-line bg-paper-2 p-8 md:p-14 text-center space-y-6">
                <span className="meta text-signal block">Submission Confirmed</span>
                <h2 className="font-serif text-[clamp(2rem,3vw,3rem)] text-ink leading-snug">
                  {status.message}
                </h2>
                <p className="text-muted text-[1.0625rem] max-w-lg mx-auto leading-relaxed">
                  Your first step doesn&apos;t have to be a big one. Sometimes, it can simply be a conversation.
                </p>
                <div className="pt-4">
                  <Button
                    href="https://wa.me/917737220724?text=Hi%20Deepak%20Sir,%20I%20just%20submitted%20a%20conversation%20enquiry%20on%20Second%20Innings."
                    arrow="up-right"
                  >
                    Message on WhatsApp
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-[1.75rem] border border-line bg-paper p-7 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {status.type === 'error' && (
                    <div className="p-4 rounded-xl border border-signal/30 bg-signal-soft text-signal text-sm">
                      {status.message}
                    </div>
                  )}

                  {/* Name & Age */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="sm:col-span-2">
                      <label className="field-label">
                        Your Name <span className="text-signal">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="field"
                      />
                    </div>
                    <div>
                      <label className="field-label">
                        Age <span className="text-signal">*</span>
                      </label>
                      <input
                        type="number"
                        name="age"
                        required
                        min="14"
                        max="35"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="e.g. 19"
                        className="field"
                      />
                    </div>
                  </div>

                  {/* Under-18 Safeguarding Notice & Parent Details */}
                  {isMinor && (
                    <div className="border-l-2 border-signal bg-signal-soft/40 p-6 rounded-r-2xl space-y-4 my-2">
                      <div>
                        <span className="meta text-signal block mb-1">Parental Consent Required (Under 18)</span>
                        <p className="text-xs text-ink-2 leading-relaxed">
                          Because you are under 18, verifiable parent or guardian consent is required before a mentoring conversation can be scheduled, in accordance with our safeguarding policy and India&apos;s Digital Personal Data Protection (DPDP) Act.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <div>
                          <label className="field-label text-xs">
                            Parent / Guardian Name <span className="text-signal">*</span>
                          </label>
                          <input
                            type="text"
                            name="parentName"
                            required={isMinor}
                            value={formData.parentName}
                            onChange={handleInputChange}
                            placeholder="e.g. Rajesh Sharma"
                            className="field text-xs bg-paper"
                          />
                        </div>
                        <div>
                          <label className="field-label text-xs">
                            Parent / Guardian Phone <span className="text-signal">*</span>
                          </label>
                          <input
                            type="tel"
                            name="parentPhone"
                            required={isMinor}
                            value={formData.parentPhone}
                            onChange={handleInputChange}
                            placeholder="+91 98765 43210"
                            className="field text-xs bg-paper"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="field-label text-xs">
                          Parent / Guardian Email <span className="text-muted font-normal">(Optional)</span>
                        </label>
                        <input
                          type="email"
                          name="parentEmail"
                          value={formData.parentEmail}
                          onChange={handleInputChange}
                          placeholder="parent@example.com"
                          className="field text-xs bg-paper"
                        />
                      </div>

                      <label className="flex items-start gap-3 pt-1 cursor-pointer">
                        <input
                          type="checkbox"
                          name="parentConsentConfirmed"
                          checked={formData.parentConsentConfirmed}
                          onChange={handleInputChange}
                          className="mt-0.5 accent-[#1C1B18]"
                        />
                        <span className="text-xs text-ink-2 font-medium">
                          I confirm that my parent or guardian is aware of and consents to this mentoring conversation enquiry.
                        </span>
                      </label>
                    </div>
                  )}

                  {/* School / College & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="field-label">
                        School / College / Current Stage
                      </label>
                      <input
                        type="text"
                        name="currentStage"
                        value={formData.currentStage}
                        onChange={handleInputChange}
                        placeholder="e.g. 2nd Year B.Tech or 12th Grade"
                        className="field"
                      />
                    </div>
                    <div>
                      <label className="field-label">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Jaipur, Delhi, Mumbai"
                        className="field"
                      />
                    </div>
                  </div>

                  {/* Email & Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="field-label">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="yourname@example.com"
                        className="field"
                      />
                    </div>
                    <div>
                      <label className="field-label">
                        Mobile Number <span className="text-signal">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="field"
                      />
                    </div>
                  </div>

                  {/* Topic */}
                  <div>
                    <label className="field-label">
                      What would you like to talk about?
                      <span className="block text-xs font-normal text-muted mt-0.5">
                        Write it in your own words. A few lines are enough.
                      </span>
                    </label>
                    <textarea
                      name="topic"
                      rows={4}
                      value={formData.topic}
                      onChange={handleInputChange}
                      placeholder="Share whatever is on your mind..."
                      className="field resize-none"
                    />
                  </div>

                  {/* Useful Goal */}
                  <div>
                    <label className="field-label">
                      What would make this conversation useful for you?{' '}
                      <span className="text-xs font-normal text-muted">(Optional)</span>
                    </label>
                    <textarea
                      name="usefulGoal"
                      rows={2}
                      value={formData.usefulGoal}
                      onChange={handleInputChange}
                      placeholder="What would you like to walk away with?"
                      className="field resize-none"
                    />
                  </div>

                  {/* Source & Referral */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="field-label">
                        How did you hear about Second Innings?
                      </label>
                      <select
                        name="source"
                        value={formData.source}
                        onChange={handleInputChange}
                        className="field bg-paper"
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
                      <label className="field-label">
                        Were you referred by someone?
                        <span className="block text-xs font-normal text-muted mt-0.5">
                          If yes, you may mention their name
                        </span>
                      </label>
                      <input
                        type="text"
                        name="referredBy"
                        value={formData.referredBy}
                        onChange={handleInputChange}
                        placeholder="Referrer's name"
                        className="field"
                      />
                    </div>
                  </div>

                  {/* Confidentiality Callout */}
                  <div className="rounded-xl border border-line bg-paper-2 p-5 text-xs text-muted space-y-2">
                    <p className="font-mono text-ink uppercase tracking-wider text-[0.6875rem]">Privacy &amp; Boundaries</p>
                    <p className="leading-relaxed">
                      Information shared in this form is collected solely to schedule and conduct your mentoring conversation. For individuals under 18, parental or guardian consent applies. We never sell or share your personal data with third parties.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <Link href="/privacy-policy" className="meta text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-signal">
                        Privacy Policy (DPDP) →
                      </Link>
                      <span className="text-line">•</span>
                      <Link href="/privacy-boundaries" className="meta text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-signal">
                        Mentoring Boundaries →
                      </Link>
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2">
                    <Button type="submit" disabled={isSubmitting} className="w-full justify-center">
                      {isSubmitting ? 'Submitting...' : 'Start a Conversation'}
                    </Button>
                    <p className="meta text-center text-muted mt-4">
                      No commitment, no pressure. Just perspective.
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
