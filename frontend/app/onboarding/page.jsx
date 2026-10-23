'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  UserCheck,
  Phone,
  RotateCcw,
  Check,
  AlertCircle
} from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext';
import { sendPhoneOtp, verifyPhoneOtp } from '../../lib/api';

const CURRENT_STAGE_OPTIONS = [
  'School (Class 11–12)',
  'College (UG)',
  'Postgraduate',
  'Working',
  'Taking a gap / figuring things out',
  'Other',
];

const SOURCE_OPTIONS = [
  'Friend / Classmate',
  'Parent / Family',
  'LinkedIn',
  'Instagram / Social Media',
  'School / College / University',
  'Search / Website',
  'Other',
];

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/book';

  const { user, loading, isAuthenticated, completeOnboarding } = useUserAuth();

  const [formData, setFormData] = useState({
    name: '',
    userType: 'student',
    age: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    parentRelation: 'Parent / Guardian',
    parentConsentConfirmed: false,
    whereCurrently: '',
    institutionOrOrg: '',
    city: '',
    phone: '',
    source: '',
    referredBy: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Phone OTP Verification State
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpCode, setPhoneOtpCode] = useState('');
  const [sendingPhoneOtp, setSendingPhoneOtp] = useState(false);
  const [verifyingPhoneOtp, setVerifyingPhoneOtp] = useState(false);
  const [phoneOtpError, setPhoneOtpError] = useState('');
  const [phoneOtpSuccess, setPhoneOtpSuccess] = useState('');
  const [phoneCooldown, setPhoneCooldown] = useState(0);
  const [phoneDevOtp, setPhoneDevOtp] = useState('');
  const otpTimerRef = useRef(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
    }
  }, [loading, isAuthenticated, router, nextPath]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        userType: user.userType || prev.userType,
        age: user.age ? String(user.age) : prev.age,
        parentName: user.parentName || prev.parentName,
        parentPhone: user.parentPhone || prev.parentPhone,
        parentEmail: user.parentEmail || prev.parentEmail,
        parentConsentConfirmed: Boolean(user.parentConsentConfirmed),
        whereCurrently: user.whereCurrently || prev.whereCurrently,
        institutionOrOrg: user.institutionOrOrg || prev.institutionOrOrg,
        city: user.city || prev.city,
        phone: user.phone || prev.phone,
        source: user.source || prev.source,
        referredBy: user.referredBy || prev.referredBy
      }));
      if (user.phoneVerified && user.phone) {
        setPhoneVerified(true);
      }
    }
  }, [user]);

  useEffect(() => {
    if (phoneCooldown > 0) {
      otpTimerRef.current = setTimeout(() => {
        setPhoneCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(otpTimerRef.current);
    }
  }, [phoneCooldown]);

  const numericAge = Number(formData.age);
  const isUnder18 =
    formData.userType === 'student' &&
    formData.age !== '' &&
    !isNaN(numericAge) &&
    numericAge < 18;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'phone') {
      const cleanInput = value.replace(/[^0-9]/g, '');
      const userClean = (user?.phone || '').replace(/[^0-9]/g, '');
      if (user?.phoneVerified && cleanInput === userClean && cleanInput.length === 10) {
        setPhoneVerified(true);
      } else {
        setPhoneVerified(false);
      }
      setPhoneOtpSent(false);
      setPhoneOtpError('');
      setPhoneOtpSuccess('');
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSendPhoneOtp = async () => {
    setPhoneOtpError('');
    setPhoneOtpSuccess('');
    const cleanPhone = (formData.phone || '').replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setPhoneOtpError('Please enter a valid 10-digit mobile number first.');
      return;
    }
    setSendingPhoneOtp(true);
    try {
      const res = await sendPhoneOtp({ phone: formData.phone });
      setPhoneOtpSent(true);
      setPhoneCooldown(45);
      setPhoneOtpSuccess(res.message || 'OTP sent successfully to your mobile number!');
      if (res.devOtpPreview) {
        setPhoneDevOtp(res.devOtpPreview);
      }
    } catch (err) {
      setPhoneOtpError(err.message || 'Failed to send OTP to this phone number.');
    } finally {
      setSendingPhoneOtp(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    setPhoneOtpError('');
    setPhoneOtpSuccess('');
    const cleanCode = phoneOtpCode.trim();
    if (!/^\d{6}$/.test(cleanCode)) {
      setPhoneOtpError('Please enter the 6-digit OTP code.');
      return;
    }
    setVerifyingPhoneOtp(true);
    try {
      const res = await verifyPhoneOtp({ phone: formData.phone, otp: cleanCode });
      setPhoneVerified(true);
      setPhoneOtpSent(false);
      setPhoneOtpCode('');
      setPhoneDevOtp('');
      setPhoneOtpSuccess(res.message || 'Mobile number verified successfully!');
    } catch (err) {
      setPhoneOtpError(err.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setVerifyingPhoneOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.userType === 'student' && (!formData.age || numericAge < 10 || numericAge > 99)) {
      setError('Please enter a valid age between 10 and 99.');
      return;
    }

    if (!phoneVerified) {
      setError('Please verify your 10-digit mobile number with the 6-digit OTP code before completing your profile.');
      return;
    }

    if (isUnder18) {
      if (!formData.parentName.trim() || !formData.parentPhone.trim() || !formData.parentConsentConfirmed) {
        setError(
          'Since you are under 18, please share a parent or guardian’s name, phone number, and confirm their consent.'
        );
        return;
      }
    }

    setSubmitting(true);
    try {
      await completeOnboarding({
        ...formData,
        age: formData.age ? Number(formData.age) : undefined
      });
      router.push(nextPath);
    } catch (err) {
      setError(err.message || 'Could not save your profile. Please check the fields.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-paper pt-36 pb-24 flex items-center justify-center">
        <p className="text-sm text-charcoal font-mono">Preparing your one-time profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper pt-36 pb-20 md:pt-44">
      <div className="container-editorial max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage/15 text-sage text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>One-Time Profile Setup • Asked Only Once</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-ink leading-tight">
            Welcome, {user.name.split(' ')[0]}. <br />
            <span className="italic text-terracotta">Tell us a little about yourself once.</span>
          </h1>
          <p className="text-charcoal text-sm md:text-base mt-3 leading-relaxed">
            We save these details to your Mentee Profile so that every time you book a session—whether a single session or part of a 4-session monthly plan—you can book in seconds without re-filling forms.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card-editorial bg-white p-7 md:p-10 space-y-6">
          {/* Role Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-charcoal mb-2.5">
              I am joining Second Innings as a: <span className="text-terracotta">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'student', title: 'Young Person / Student (16–25)', desc: 'School, college, PG, early work, or figuring things out' },
                { id: 'parent', title: 'Parent / Guardian', desc: 'Exploring mentoring support for my son or daughter' }
              ].map((role) => {
                const active = formData.userType === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, userType: role.id }))}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      active
                        ? 'border-ink bg-ink text-paper shadow-sm'
                        : 'border-stone/60 bg-paper/60 text-ink hover:border-ink/40'
                    }`}
                  >
                    <p className="font-semibold text-sm">{role.title}</p>
                    <p className={`text-xs mt-1 ${active ? 'text-paper/75' : 'text-charcoal'}`}>
                      {role.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* 1. Name */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-charcoal mb-2">
                1. Your Full Name <span className="text-terracotta">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-stone bg-paper text-ink focus:outline-none focus:border-ink transition-colors text-sm"
              />
            </div>

            {/* 2. Age */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-charcoal mb-2">
                2. {formData.userType === 'parent' ? "Your Child's Age" : 'Your Age'}{' '}
                <span className="text-terracotta">*</span>
              </label>
              <input
                type="number"
                name="age"
                min="10"
                max="99"
                required={formData.userType === 'student'}
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g., 19"
                className="w-full px-4 py-3 rounded-lg border border-stone bg-paper text-ink focus:outline-none focus:border-ink transition-colors text-sm"
              />
            </div>
          </div>

          {/* Under-18 Safeguarding Block */}
          {isUnder18 && (
            <div className="p-5 rounded-xl bg-warm border border-terracotta/30 space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-lg text-ink">
                    Parent / Guardian Consent (Under 18 Safeguarding)
                  </h4>
                  <p className="text-xs text-charcoal leading-relaxed mt-1">
                    Since you are under 18, we keep a one-time parent or guardian consent record on your profile for your safety.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-charcoal mb-1.5">
                    Parent / Guardian Name <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="text"
                    name="parentName"
                    required={isUnder18}
                    value={formData.parentName}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone bg-paper text-ink text-sm focus:outline-none focus:border-ink"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-charcoal mb-1.5">
                    Parent Mobile / WhatsApp <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="tel"
                    name="parentPhone"
                    required={isUnder18}
                    value={formData.parentPhone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone bg-paper text-ink text-sm focus:outline-none focus:border-ink"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-charcoal mb-1.5">
                    Parent Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={handleChange}
                    placeholder="parent@email.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone bg-paper text-ink text-sm focus:outline-none focus:border-ink"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  name="parentConsentConfirmed"
                  checked={formData.parentConsentConfirmed}
                  onChange={handleChange}
                  className="mt-1 rounded border-stone text-terracotta focus:ring-terracotta"
                />
                <span className="text-xs text-ink font-medium leading-relaxed">
                  My parent or guardian is aware that I am creating a Second Innings mentoring account and consents to these conversations. <span className="text-terracotta">*</span>
                </span>
              </label>
            </div>
          )}

          {/* 3 & 4: Current Stage & Institution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-charcoal mb-2">
                3. Where are you currently? <span className="text-terracotta">*</span>
              </label>
              <select
                name="whereCurrently"
                required
                value={formData.whereCurrently}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-stone bg-paper text-ink focus:outline-none focus:border-ink transition-colors text-sm"
              >
                <option value="">Select current stage</option>
                {CURRENT_STAGE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-charcoal mb-2">
                4. School / College / Organisation
              </label>
              <input
                type="text"
                name="institutionOrOrg"
                value={formData.institutionOrOrg}
                onChange={handleChange}
                placeholder="e.g., JKLU, St. Xavier's, etc."
                className="w-full px-4 py-3 rounded-lg border border-stone bg-paper text-ink focus:outline-none focus:border-ink transition-colors text-sm"
              />
            </div>
          </div>

          {/* 5 & 6: City & WhatsApp Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-charcoal mb-2">
                5. Which city are you in? <span className="text-terracotta">*</span>
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g., Jaipur"
                className="w-full px-4 py-3 rounded-lg border border-stone bg-paper text-ink focus:outline-none focus:border-ink transition-colors text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal">
                  6. Mobile / WhatsApp Number <span className="text-terracotta">*</span>
                </label>
                {phoneVerified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sage/15 text-sage text-[11px] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-terracotta/10 text-terracotta text-[10px] font-mono">
                    OTP Required
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-lg border border-stone bg-paper text-ink focus:outline-none focus:border-ink transition-colors text-sm"
                />
                {!phoneVerified && (
                  <button
                    type="button"
                    onClick={handleSendPhoneOtp}
                    disabled={sendingPhoneOtp || phoneCooldown > 0 || (formData.phone || '').replace(/[^0-9]/g, '').length < 10}
                    className="shrink-0 px-4 py-3 rounded-lg bg-ink text-paper text-xs font-semibold hover:bg-ink/90 disabled:opacity-50 transition-all"
                  >
                    {sendingPhoneOtp
                      ? 'Sending...'
                      : phoneCooldown > 0
                      ? `Resend (${phoneCooldown}s)`
                      : phoneOtpSent
                      ? 'Resend OTP'
                      : 'Send OTP'}
                  </button>
                )}
              </div>

              {/* Inline OTP Verification Box */}
              {!phoneVerified && phoneOtpSent && (
                <div className="mt-3 p-4 rounded-xl bg-warm/80 border border-stone/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-ink flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-terracotta" />
                      Enter 6-Digit OTP sent to your phone:
                    </span>
                    {phoneCooldown > 0 && (
                      <span className="text-[11px] text-ash font-mono">
                        Resend in {phoneCooldown}s
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={phoneOtpCode}
                      onChange={(e) => setPhoneOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="e.g. 123456"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-stone bg-paper text-ink text-sm font-mono tracking-widest text-center focus:outline-none focus:border-ink"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyPhoneOtp}
                      disabled={verifyingPhoneOtp || phoneOtpCode.trim().length !== 6}
                      className="px-5 py-2.5 rounded-lg bg-terracotta text-paper text-xs font-semibold hover:bg-terracotta/90 disabled:opacity-50 transition-all shrink-0"
                    >
                      {verifyingPhoneOtp ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  </div>

                  {phoneDevOtp && (
                    <div className="p-2 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-mono">
                      Dev/Preview OTP: <strong>{phoneDevOtp}</strong>
                    </div>
                  )}

                  {phoneOtpError && (
                    <p className="text-xs text-terracotta font-medium">{phoneOtpError}</p>
                  )}
                  {phoneOtpSuccess && (
                    <p className="text-xs text-sage font-medium">{phoneOtpSuccess}</p>
                  )}
                </div>
              )}

              {phoneVerified && (
                <p className="text-[11px] text-sage mt-1.5 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Your phone number is verified and ready for instant booking.
                </p>
              )}
            </div>
          </div>

          {/* 7 & 8: How did you hear & Referred by */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-charcoal mb-2">
                7. How did you hear about Second Innings?
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-stone bg-paper text-ink focus:outline-none focus:border-ink transition-colors text-sm"
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
              <label className="block text-xs font-mono uppercase tracking-wider text-charcoal mb-2">
                8. Did someone suggest you speak with us?
              </label>
              <input
                type="text"
                name="referredBy"
                value={formData.referredBy}
                onChange={handleChange}
                placeholder="Name of teacher, friend, or parent (optional)"
                className="w-full px-4 py-3 rounded-lg border border-stone bg-paper text-ink focus:outline-none focus:border-ink transition-colors text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs font-medium">
              {error}
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-ash flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-sage" />
              Saved to {user.email} — editable anytime in Dashboard
            </span>

            <button
              type="submit"
              disabled={submitting}
              className="btn-editorial w-full sm:w-auto justify-center py-3.5 px-8 text-sm disabled:opacity-50"
            >
              <span>{submitting ? 'Saving Profile...' : 'Save Profile & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper pt-36 pb-24 flex items-center justify-center">
          <p className="text-sm text-charcoal font-mono">Loading onboarding...</p>
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
