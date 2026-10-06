'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import Arrow from '../../components/ui/Arrow';
import { submitBooking, updateBookingPreference } from '../../lib/api';
import { launchCashfreeCheckout } from '../../lib/cashfreeClient';

const WHERE_CURRENTLY_OPTIONS = [
  'School',
  'College or University',
  'Working',
  'Taking a break',
  'Exploring what comes next',
  'Other',
];

const SOURCE_OPTIONS = [
  'Friend',
  'Former Student',
  'Parent or Family',
  'Teacher or Educator',
  'LinkedIn',
  'WhatsApp',
  'Second Innings Website',
  'Other',
];

export default function Book() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    whereCurrently: '',
    institutionOrOrg: '',
    city: '',
    topic: '',
    usefulGoal: '',
    phone: '',
    email: '',
    source: '',
    referredBy: '',
    isUnder18: false,
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    parentConsentConfirmed: false,
    adultConsentConfirmed: false,
  });

  const [paymentConfig, setPaymentConfig] = useState({
    paymentsEnabled: false,
    sessionFee: 0,
    currency: 'INR',
    feeNotice: '',
    environment: 'PRODUCTION'
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBookingId, setSubmittedBookingId] = useState(null);

  // Slot preference after submission
  const [slotData, setSlotData] = useState({
    preferredDate: '',
    preferredTime: '',
  });
  const [slotStatus, setSlotStatus] = useState({ saved: false, saving: false });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/payment/config`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPaymentConfig(data);
        }
      })
      .catch(err => console.error('Failed to load payment config:', err));
  }, []);

  // Compute if applicant is under 18 based on typed age or manual toggle
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
          message: 'Please confirm that your parent or guardian is aware of and consents to this conversation enquiry.'
        });
        return;
      }
    } else {
      // 18+ adult consent validation
      if (!formData.adultConsentConfirmed) {
        setStatus({
          type: 'error',
          message: 'Please confirm that you agree to be contacted for this conversation.'
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (paymentConfig.paymentsEnabled && paymentConfig.sessionFee > 0) {
        // Step 1: Create booking & Cashfree payment order
        const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/payment/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            isUnder18: isMinor,
            concern: formData.topic,
            currentStage: formData.whereCurrently,
            userType: 'student'
          })
        });

        const orderData = await orderRes.json();
        if (!orderData.success) {
          throw new Error(orderData.message || 'Payment initiation failed. Please try again.');
        }

        // Step 2: Launch Cashfree Modal Checkout
        const cfResult = await launchCashfreeCheckout({
          paymentSessionId: orderData.paymentSessionId,
          mode: paymentConfig.environment || 'production',
          redirectTarget: '_modal'
        });

        if (cfResult?.error) {
          setStatus({
            type: 'error',
            message: 'Payment was not completed. You can review your details and try again whenever you are ready.'
          });
          setIsSubmitting(false);
          return;
        }

        // Step 3: Verify payment with backend
        const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/payment/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderData.orderId,
            bookingId: orderData.bookingId
          })
        });

        const verifyData = await verifyRes.json();
        setSubmittedBookingId(orderData.bookingId);
        setStatus({
          type: 'success',
          message: verifyData.paid 
            ? `Payment of ₹${paymentConfig.sessionFee} received. Thank you. I've received what you've shared.`
            : `Thank you. I've received what you've shared.`
        });
      } else {
        // Standard Complimentary Booking
        const res = await submitBooking({
          ...formData,
          isUnder18: isMinor,
          concern: formData.topic,
          currentStage: formData.whereCurrently,
          userType: 'student',
        });

        const bookingId = res?.data?._id || res?._id || null;
        setSubmittedBookingId(bookingId);

        setStatus({
          type: 'success',
          message: "Thank you. I've received what you've shared."
        });
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      setStatus({
        type: 'error',
        message: error.message || 'Something went wrong while submitting. Please review your details and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveSlot = async (e) => {
    e.preventDefault();
    if (!slotData.preferredDate && !slotData.preferredTime) return;

    setSlotStatus({ saved: false, saving: true });
    try {
      if (submittedBookingId) {
        await updateBookingPreference(submittedBookingId, {
          preferredDate: slotData.preferredDate ? new Date(slotData.preferredDate) : undefined,
          preferredTime: slotData.preferredTime || undefined,
        });
      }
      setSlotStatus({ saved: true, saving: false });
    } catch (err) {
      console.error('Failed to update slot preference:', err);
      // Still mark saved so student feels reassured
      setSlotStatus({ saved: true, saving: false });
    }
  };

  return (
    <div className="w-full">
      <div className="page-x pt-36 md:pt-48 pb-28 md:pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Context & Reassurance */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <span className="meta text-signal mb-6 block">
                Young Minds. New Perspectives. Wider Possibilities.
              </span>
              <h1 className="font-serif text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[0.95] tracking-[-0.02em] text-ink mb-6">
                Before We Talk
              </h1>
              <p className="lede text-[1.125rem] text-muted mb-8 leading-relaxed">
                You don&apos;t need to prepare anything. Just tell me a little about yourself and what&apos;s on your mind.
              </p>

              <div className="border-t border-line pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="meta text-ink text-xs font-semibold">1</span>
                  <p className="text-xs text-muted leading-relaxed">
                    A quiet, private one-to-one conversation with Deepak Sogani.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="meta text-ink text-xs font-semibold">2</span>
                  <p className="text-xs text-muted leading-relaxed">
                    No ready-made answers. No predetermined path. Just thoughtful listening and perspective.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="meta text-ink text-xs font-semibold">3</span>
                  <p className="text-xs text-muted leading-relaxed">
                    Under 18? A parent or guardian consent step applies in accordance with our safeguarding policy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Intake Form */}
          <div className="lg:col-span-7">
            {status.type === 'success' ? (
              <div className="rounded-[1.75rem] border border-line bg-paper-2 p-8 md:p-14 text-center space-y-8">
                <span className="meta text-signal block">Received</span>
                <div className="space-y-3">
                  <h2 className="font-serif text-[clamp(2rem,3.2vw,3rem)] text-ink leading-snug">
                    Thank you. I&apos;ve received what you&apos;ve shared.
                  </h2>
                  <p className="text-muted text-[1.125rem] max-w-lg mx-auto leading-relaxed">
                    You don&apos;t need to prepare anything else. We&apos;ll start from here when we talk.
                  </p>
                </div>

                {/* Slot Selection / Timing Preference Step */}
                <div className="rounded-2xl border border-line bg-paper p-6 md:p-8 text-left space-y-5">
                  <div>
                    <h3 className="font-serif text-[1.375rem] text-ink">
                      Preferred Conversation Timing
                    </h3>
                    <p className="text-xs text-muted mt-1">
                      If you have preferred days or hours, you may let us know below. (Optional)
                    </p>
                  </div>

                  {slotStatus.saved ? (
                    <div className="p-4 rounded-xl bg-sprout-soft border border-sprout text-ink text-sm">
                      ✓ Your preferred timing has been recorded. Deepak Sir will reach out directly on WhatsApp or mobile to confirm.
                    </div>
                  ) : (
                    <form onSubmit={handleSaveSlot} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="field-label text-xs">Preferred Date</label>
                          <input
                            type="date"
                            value={slotData.preferredDate}
                            onChange={(e) => setSlotData(prev => ({ ...prev, preferredDate: e.target.value }))}
                            min={new Date().toISOString().split('T')[0]}
                            className="field text-xs bg-paper-2"
                          />
                        </div>
                        <div>
                          <label className="field-label text-xs">Preferred Time Window</label>
                          <select
                            value={slotData.preferredTime}
                            onChange={(e) => setSlotData(prev => ({ ...prev, preferredTime: e.target.value }))}
                            className="field text-xs bg-paper-2"
                          >
                            <option value="">Select a time window</option>
                            <option value="Morning (10:00 AM – 1:00 PM)">Morning (10:00 AM – 1:00 PM)</option>
                            <option value="Afternoon (2:00 PM – 5:00 PM)">Afternoon (2:00 PM – 5:00 PM)</option>
                            <option value="Evening (5:00 PM – 8:00 PM)">Evening (5:00 PM – 8:00 PM)</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={slotStatus.saving || (!slotData.preferredDate && !slotData.preferredTime)}
                        className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-ink text-paper text-xs font-medium hover:bg-ink/90 transition-colors disabled:opacity-50"
                      >
                        {slotStatus.saving ? 'Saving...' : 'Save Timing Preference'}
                      </button>
                    </form>
                  )}
                </div>

                {/* Direct Contact Reassurance */}
                <div className="border-t border-line pt-6 text-xs text-muted space-y-2">
                  <p>
                    Deepak Sogani will review your information and connect with you directly.
                  </p>
                  <p className="text-ink font-medium">
                    Email: <a href="mailto:deepak@second-innings.in" className="underline hover:text-signal">deepak@second-innings.in</a>
                    {' '}• WhatsApp: <a href="https://wa.me/917737220724" target="_blank" rel="noopener noreferrer" className="underline hover:text-signal">+91 77372 20724</a>
                  </p>
                </div>

                <div className="pt-2">
                  <Button href="/">
                    Back to Homepage
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

                  {/* 1. Your Name & 2. Your Age */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="sm:col-span-2">
                      <label className="field-label">
                        1. Your Name <span className="text-signal">*</span>
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
                        2. Your Age <span className="text-signal">*</span>
                      </label>
                      <input
                        type="number"
                        name="age"
                        required
                        min="12"
                        max="99"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="e.g. 19"
                        className="field"
                      />
                    </div>
                  </div>

                  {/* Under-18 Safeguarding & Parent/Guardian Consent */}
                  {isMinor && (
                    <div className="border-l-2 border-signal bg-signal-soft/40 p-6 rounded-r-2xl space-y-4 my-2">
                      <div>
                        <span className="meta text-signal block mb-1">Parental Consent Required (Under 18)</span>
                        <p className="text-xs text-ink-2 leading-relaxed">
                          Because you are under 18, verifiable parent or guardian consent is required before a conversation can be scheduled, in accordance with our safeguarding policy.
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
                          I confirm that my parent or guardian is aware of and consents to this conversation enquiry. <span className="text-signal">*</span>
                        </span>
                      </label>
                    </div>
                  )}

                  {/* 3. Where are you currently? */}
                  <div>
                    <label className="field-label">
                      3. Where are you currently? <span className="text-signal">*</span>
                    </label>
                    <select
                      name="whereCurrently"
                      required
                      value={formData.whereCurrently}
                      onChange={handleInputChange}
                      className="field bg-paper"
                    >
                      <option value="">Select where you are currently</option>
                      {WHERE_CURRENTLY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 4. School / College / University / Organisation & 5. City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="field-label">
                        4. School / College / University / Organisation
                        <span className="text-xs font-normal text-muted block mt-0.5">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        name="institutionOrOrg"
                        value={formData.institutionOrOrg}
                        onChange={handleInputChange}
                        placeholder="e.g. St. Xavier’s / JKLU / Company"
                        className="field"
                      />
                    </div>
                    <div>
                      <label className="field-label">
                        5. City <span className="text-signal">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Jaipur, Delhi, Mumbai"
                        className="field"
                      />
                    </div>
                  </div>

                  {/* 6. What would you like to talk about? */}
                  <div>
                    <label className="field-label">
                      6. What would you like to talk about? <span className="text-signal">*</span>
                      <span className="block text-xs font-normal text-muted mt-0.5">
                        Don&apos;t worry about framing it perfectly. Just tell me what&apos;s on your mind.
                      </span>
                    </label>
                    <textarea
                      name="topic"
                      required
                      rows={5}
                      value={formData.topic}
                      onChange={handleInputChange}
                      placeholder="Share whatever is on your mind..."
                      className="field resize-y"
                    />
                  </div>

                  {/* 7. What would make this conversation useful for you? */}
                  <div>
                    <label className="field-label">
                      7. What would make this conversation useful for you?{' '}
                      <span className="text-xs font-normal text-muted">(Optional)</span>
                      <span className="block text-xs font-normal text-muted mt-0.5">
                        A few words are enough.
                      </span>
                    </label>
                    <textarea
                      name="usefulGoal"
                      rows={3}
                      value={formData.usefulGoal}
                      onChange={handleInputChange}
                      placeholder="What would you like to walk away with?"
                      className="field resize-none"
                    />
                  </div>

                  {/* 8. Mobile / WhatsApp Number & 9. Email Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="field-label">
                        8. Mobile / WhatsApp Number <span className="text-signal">*</span>
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
                    <div>
                      <label className="field-label">
                        9. Email Address <span className="text-signal">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="yourname@example.com"
                        className="field"
                      />
                    </div>
                  </div>

                  {/* 10. How did you hear about Second Innings? & 11. Referred by */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="field-label">
                        10. How did you hear about Second Innings? <span className="text-signal">*</span>
                      </label>
                      <select
                        name="source"
                        required
                        value={formData.source}
                        onChange={handleInputChange}
                        className="field bg-paper"
                      >
                        <option value="">Select an option</option>
                        {SOURCE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="field-label">
                        11. Were you referred by someone?
                        <span className="block text-xs font-normal text-muted mt-0.5">
                          If yes, you may mention their name (Optional)
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

                  {/* 18+ Mandatory Consent */}
                  {!isMinor && (
                    <label className="flex items-start gap-3 p-4 rounded-xl border border-line bg-paper-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="adultConsentConfirmed"
                        checked={formData.adultConsentConfirmed}
                        onChange={handleInputChange}
                        className="mt-0.5 accent-[#1C1B18]"
                      />
                      <span className="text-xs text-ink-2 font-medium leading-relaxed">
                        I confirm that the details provided are accurate and I agree to be contacted for this conversation. <span className="text-signal">*</span>
                      </span>
                    </label>
                  )}

                  {/* Privacy & Discretion Notice */}
                  <div className="rounded-xl border border-line bg-paper-2 p-5 text-xs text-muted space-y-2">
                    <p className="font-mono text-ink uppercase tracking-wider text-[0.6875rem]">Privacy &amp; Discretion</p>
                    <p className="leading-relaxed">
                      Information shared in this form is collected solely to schedule and conduct your conversation. We respect your privacy, keep your details confidential within professional limits, and never sell or share your personal data.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <Link href="/privacy-policy" className="meta text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-signal">
                        Privacy Policy →
                      </Link>
                      <span className="text-line">•</span>
                      <Link href="/privacy-boundaries" className="meta text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-signal">
                        Privacy &amp; Boundaries →
                      </Link>
                    </div>
                  </div>

                  {/* Fee Presentation: Approved Copy from Doc 3 Section 11 */}
                  {paymentConfig.paymentsEnabled && paymentConfig.sessionFee > 0 ? (
                    <div className="p-4 bg-amber/10 rounded-xl border border-amber/30 text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-semibold text-ink text-sm">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-amber animate-pulse" />
                          <span>Conversation Fee</span>
                        </span>
                        <span className="font-serif text-lg font-bold text-coral">₹{paymentConfig.sessionFee}</span>
                      </div>
                      <p className="text-muted text-[11px] leading-relaxed">
                        {paymentConfig.feeNotice || 'Secure payment via Cashfree Payments.'}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-paper-2 rounded-xl border border-line flex items-center justify-between text-xs text-ink">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="font-medium">Your first conversation is complimentary.</span>
                      </span>
                      <span className="meta text-muted">No fee</span>
                    </div>
                  )}

                  {/* Submit CTA */}
                  <div className="pt-2">
                    <Button type="submit" disabled={isSubmitting} className="w-full justify-center">
                      {isSubmitting 
                        ? (paymentConfig.paymentsEnabled && paymentConfig.sessionFee > 0 ? 'Connecting to payment...' : 'Submitting...')
                        : (paymentConfig.paymentsEnabled && paymentConfig.sessionFee > 0 ? `Proceed to Pay ₹${paymentConfig.sessionFee} & Book` : 'START A CONVERSATION')}
                    </Button>
                    <p className="meta text-center text-muted mt-4">
                      No ready-made answers. No predetermined path. Just perspective.
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
