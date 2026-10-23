'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  submitBooking,
  getPaymentConfig,
  createPaymentOrder,
  bookWithSubscriptionCredit,
  generateIdempotencyKey
} from '../../lib/api';
import { openCashfreeCheckout } from '../../lib/cashfreeClient';
import { useUserAuth } from '../../context/UserAuthContext';
import GoogleSignInButton from '../../components/GoogleSignInButton';
import Reveal from '../../components/ui/Reveal';
import {
  ArrowUpRight,
  CheckCircle2,
  MessageCircle,
  Mail,
  Phone,
  ShieldCheck,
  CreditCard,
  Lock,
  HeartHandshake,
  Sparkles,
  Calendar,
  Layers,
  UserCheck,
  Edit3
} from 'lucide-react';

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

const TOPIC_PROMPTS = [
  'Confusion about stream, course or career',
  'Postgraduate study vs work',
  'Confidence or communication',
  'How to make better use of college life',
  'Preparing for work or interviews',
  'Handling family expectations',
  'Finding direction when feeling stuck',
];

const PRESET_AMOUNTS = [250, 500, 1000, 1500];

const TIME_SLOTS = [
  'Morning (10:00 AM – 12:00 PM)',
  'Afternoon (2:00 PM – 5:00 PM)',
  'Evening (5:00 PM – 8:00 PM)',
  'Weekend Slot (Flexible)'
];

export default function BookPage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isOnboarded,
    remainingCredits,
    activeSubscription,
    sessionCount,
    loginWithGoogle,
    refreshUser
  } = useUserAuth();

  // Synchronous ref lock to block rapid double-clicks before React state re-renders
  const isSubmittingRef = useRef(false);
  const currentIdempotencyKeyRef = useRef(null);

  const [selectedRole, setSelectedRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    parentConsentConfirmed: false,
    whereCurrently: '',
    institutionOrOrg: '',
    city: '',
    topic: '',
    usefulGoal: '',
    phone: '',
    email: '',
    source: '',
    referredBy: '',
    userType: 'student',
    preferredDate: '',
    preferredTime: ''
  });

  // Booking Factor / Plan Mode:
  // 'CREDIT' (use 1 active subscription credit) | 'SINGLE_SESSION' | 'MONTHLY_4' | 'QUARTERLY_8'
  const [selectedBookingFactor, setSelectedBookingFactor] = useState('SINGLE_SESSION');

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
    confirmedBooking: null
  });

  const [paymentConfig, setPaymentConfig] = useState({
    paymentsEnabled: false,
    sessionFee: 500,
    currency: 'INR',
    plans: [],
    loaded: false
  });

  // Direct Support / Session Fee Widget State
  const [payWidget, setPayWidget] = useState({
    amount: 500,
    customAmount: '',
    isCustom: false,
    name: '',
    phone: '',
    email: '',
    loading: false,
    error: null
  });

  useEffect(() => {
    getPaymentConfig()
      .then((res) => {
        if (res?.data) {
          const fee = res.data.sessionFee ?? 500;
          setPaymentConfig({
            paymentsEnabled: Boolean(res.data.paymentsEnabled),
            sessionFee: fee,
            currency: res.data.currency || 'INR',
            plans: res.data.plans || [],
            loaded: true
          });
          setPayWidget((prev) => ({
            ...prev,
            amount: fee > 0 ? fee : 500
          }));
        }
      })
      .catch(() => {
        setPaymentConfig((prev) => ({ ...prev, loaded: true }));
      });
  }, []);

  // Automatically select 'CREDIT' mode if user has active subscription credits
  useEffect(() => {
    if (isAuthenticated && remainingCredits > 0) {
      setSelectedBookingFactor('CREDIT');
    } else if (selectedBookingFactor === 'CREDIT' && remainingCredits === 0) {
      setSelectedBookingFactor('SINGLE_SESSION');
    }
  }, [isAuthenticated, remainingCredits, selectedBookingFactor]);

  // Pre-fill form Data from logged-in user profile
  useEffect(() => {
    if (user) {
      setSelectedRole(user.userType || 'student');
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        age: user.age ? String(user.age) : prev.age,
        parentName: user.parentName || prev.parentName,
        parentPhone: user.parentPhone || prev.parentPhone,
        parentEmail: user.parentEmail || prev.parentEmail,
        parentConsentConfirmed: Boolean(user.parentConsentConfirmed),
        whereCurrently: user.whereCurrently || prev.whereCurrently,
        institutionOrOrg: user.institutionOrOrg || prev.institutionOrOrg,
        city: user.city || prev.city,
        source: user.source || prev.source,
        referredBy: user.referredBy || prev.referredBy,
        userType: user.userType || 'student'
      }));
    }
  }, [user]);

  // Reset idempotency key when topic or booking factor changes
  useEffect(() => {
    currentIdempotencyKeyRef.current = generateIdempotencyKey('book');
  }, [formData.topic, selectedBookingFactor, formData.preferredDate, formData.preferredTime]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData((prev) => ({
      ...prev,
      userType: role
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTopicPrompt = (promptText) => {
    setFormData((prev) => {
      const current = prev.topic.trim();
      const updated = current ? `${current}; ${promptText}` : promptText;
      return { ...prev, topic: updated };
    });
  };

  const numericAge = Number(formData.age);
  const isUnder18 =
    !isOnboarded &&
    selectedRole === 'student' &&
    formData.age !== '' &&
    !isNaN(numericAge) &&
    numericAge < 18;

  const selectedPlanObj = (paymentConfig.plans || []).find(
    (p) => p.code === selectedBookingFactor
  );

  // Direct Support / Session Fee Checkout Handler
  const handleDirectPayment = async (e) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    const finalAmount = payWidget.isCustom ? Number(payWidget.customAmount) : Number(payWidget.amount);
    if (!finalAmount || isNaN(finalAmount) || finalAmount < 1) {
      setPayWidget((prev) => ({ ...prev, error: 'Please enter a valid amount (minimum ₹1).' }));
      return;
    }
    const cleanPhone = (user?.phone || payWidget.phone || formData.phone || '').trim();
    if (!cleanPhone || cleanPhone.replace(/[^0-9]/g, '').length < 10) {
      setPayWidget((prev) => ({ ...prev, error: 'Please enter your 10-digit WhatsApp / mobile number.' }));
      return;
    }

    isSubmittingRef.current = true;
    setPayWidget((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const idempKey = generateIdempotencyKey('support');
      const orderRes = await createPaymentOrder(
        {
          purpose: 'support_contribution',
          customAmount: finalAmount,
          bookingData: {
            name: (user?.name || payWidget.name || formData.name || 'Second Innings Supporter').trim(),
            phone: cleanPhone,
            email: (user?.email || payWidget.email || formData.email || 'mentoring@second-innings.in').trim(),
            userType: selectedRole || 'student',
            topic: formData.topic || 'Support / Session Contribution'
          }
        },
        idempKey
      );

      const { paymentSessionId, environment, alreadyPaid, orderId } = orderRes.data;
      if (alreadyPaid) {
        router.push(`/book/status?order_id=${orderId}`);
        return;
      }
      await openCashfreeCheckout(paymentSessionId, environment);
    } catch (err) {
      setPayWidget((prev) => ({
        ...prev,
        loading: false,
        error: err.message || 'Unable to open payment gateway. Please try again.'
      }));
    } finally {
      isSubmittingRef.current = false;
    }
  };

  // Main Session / Subscription Booking Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingRef.current || status.loading) return;

    if (!formData.topic.trim()) {
      setStatus({
        loading: false,
        success: false,
        error: 'Please share in a few lines what you would like to focus on in this conversation.',
        confirmedBooking: null
      });
      return;
    }

    // Validate guest fields only if user hasn't completed 1-time onboarding
    if (!isOnboarded) {
      if (selectedRole === 'student' && (!formData.age || numericAge < 10 || numericAge > 99)) {
        setStatus({
          loading: false,
          success: false,
          error: 'Please enter a valid age.',
          confirmedBooking: null
        });
        return;
      }

      if (isUnder18) {
        if (!formData.parentName.trim() || !formData.parentPhone.trim() || !formData.parentConsentConfirmed) {
          setStatus({
            loading: false,
            success: false,
            error: 'Since you are under 18, please share a parent or guardian’s name, phone number, and confirm their consent.',
            confirmedBooking: null
          });
          return;
        }
      }
    }

    isSubmittingRef.current = true;
    setStatus({ loading: true, success: false, error: null, confirmedBooking: null });

    if (!currentIdempotencyKeyRef.current) {
      currentIdempotencyKeyRef.current = generateIdempotencyKey('book');
    }
    const idempKey = currentIdempotencyKeyRef.current;

    try {
      // =====================================================================
      // CASE A: REDEEM 1 CREDIT FROM ACTIVE SUBSCRIPTION (1-CLICK, ₹0 CHECKOUT)
      // =====================================================================
      if (selectedBookingFactor === 'CREDIT' && isAuthenticated && remainingCredits > 0) {
        const creditRes = await bookWithSubscriptionCredit(
          {
            topic: formData.topic,
            usefulGoal: formData.usefulGoal,
            preferredDate: formData.preferredDate || undefined,
            preferredTime: formData.preferredTime || undefined
          },
          idempKey
        );

        await refreshUser();
        setStatus({
          loading: false,
          success: true,
          error: null,
          confirmedBooking: creditRes.data
        });
        return;
      }

      // =====================================================================
      // CASE B: SUBSCRIBE TO MULTI-SESSION / MONTHLY PLAN (E.G. 4 SESSIONS/MONTH)
      // =====================================================================
      if (selectedBookingFactor === 'MONTHLY_4' || selectedBookingFactor === 'QUARTERLY_8') {
        if (!isAuthenticated) {
          router.push(`/login?next=/book`);
          return;
        }

        const orderRes = await createPaymentOrder(
          {
            purpose: 'subscription_purchase',
            planCode: selectedBookingFactor,
            bookingData: {
              topic: formData.topic,
              usefulGoal: formData.usefulGoal,
              preferredDate: formData.preferredDate || undefined,
              preferredTime: formData.preferredTime || undefined
            }
          },
          idempKey
        );

        const { paymentSessionId, environment, alreadyPaid, orderId } = orderRes.data;
        if (alreadyPaid) {
          await refreshUser();
          router.push(`/book/status?order_id=${orderId}`);
          return;
        }
        await openCashfreeCheckout(paymentSessionId, environment);
        return;
      }

      // =====================================================================
      // CASE C: SINGLE SESSION (PAID IF PAYMENTS ENABLED, ELSE COMPLIMENTARY)
      // =====================================================================
      let computedAgeGroup = 'other';
      const effectiveAge = user?.age || numericAge;
      if (selectedRole === 'parent') computedAgeGroup = 'parent';
      else if (effectiveAge >= 16 && effectiveAge <= 18) computedAgeGroup = '16-18';
      else if (effectiveAge >= 19 && effectiveAge <= 21) computedAgeGroup = '19-21';
      else if (effectiveAge >= 22 && effectiveAge <= 25) computedAgeGroup = '22-25';

      const payload = {
        ...formData,
        age: effectiveAge || undefined,
        ageGroup: computedAgeGroup,
        isUnder18: Boolean(user?.isUnder18 ?? isUnder18),
        concern: formData.topic,
        currentStage: user?.whereCurrently || formData.whereCurrently
      };

      if (paymentConfig.paymentsEnabled && paymentConfig.sessionFee > 0) {
        const orderRes = await createPaymentOrder(
          {
            purpose: 'single_booking',
            planCode: 'SINGLE_SESSION',
            bookingData: payload
          },
          idempKey
        );

        const { paymentSessionId, environment, alreadyPaid, orderId } = orderRes.data;
        if (alreadyPaid) {
          router.push(`/book/status?order_id=${orderId}`);
          return;
        }
        await openCashfreeCheckout(paymentSessionId, environment);
        return;
      }

      // Complimentary First Session
      const freeRes = await submitBooking(payload, idempKey);
      await refreshUser();
      setStatus({
        loading: false,
        success: true,
        error: null,
        confirmedBooking: freeRes.data
      });
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.message || 'Failed to submit request. Please try again.',
        confirmedBooking: null
      });
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* S1: Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 border-b border-stone">
        <div className="container-editorial">
          <Reveal>
            <p className="eyebrow mb-4">Start a Conversation</p>
            <h1 className="font-serif text-display-lg text-ink max-w-4xl mb-6">
              You do not need to have everything <span className="italic text-terracotta">figured out</span> before reaching out.
            </h1>
            <p className="text-lg md:text-xl text-charcoal max-w-2xl leading-relaxed">
              {isAuthenticated && isOnboarded
                ? `Welcome back, ${user.name.split(' ')[0]}. Your profile is already saved—just pick your session plan or credit below and share what you want to focus on today.`
                : 'Sign in once with Google to save your profile, book single sessions or a 4-session monthly mentorship plan, and keep a complete record of every conversation.'}
            </p>
          </Reveal>
        </div>
      </section>

      {/* S2: Main Content */}
      <section className="section-padding">
        <div className="container-editorial">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column: What happens next + Support widget */}
            <div className="lg:col-span-4">
              <Reveal>
                {/* Mentee Account Quick Card */}
                {isAuthenticated ? (
                  <div className="p-6 rounded-2xl bg-white border border-stone/60 mb-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-sage font-bold">
                        <UserCheck className="w-4 h-4" />
                        Signed In
                      </span>
                      <Link
                        href="/dashboard"
                        className="text-xs font-semibold text-terracotta hover:underline"
                      >
                        View Past Sessions ({sessionCount}) →
                      </Link>
                    </div>
                    <div>
                      <p className="font-serif text-xl text-ink">{user.name}</p>
                      <p className="text-xs text-charcoal mt-0.5">
                        {user.whereCurrently || 'Mentee'}
                        {user.institutionOrOrg ? ` • ${user.institutionOrOrg}` : ''}
                        {user.city ? ` • ${user.city}` : ''}
                      </p>
                    </div>
                    {remainingCredits > 0 && (
                      <div className="p-3 rounded-xl bg-sage/10 border border-sage/30 flex items-center justify-between">
                        <span className="text-xs font-semibold text-ink">
                          Active Subscription Credits
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-sage text-white font-mono text-xs font-bold">
                          {remainingCredits} Left
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-white border-2 border-terracotta/30 mb-6 shadow-sm space-y-4">
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-terracotta">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>One-Time Login • Recommended</span>
                    </div>
                    <h3 className="font-serif text-2xl text-ink leading-snug">
                      Already spoke with us or hate filling forms twice?
                    </h3>
                    <p className="text-xs text-charcoal leading-relaxed">
                      Sign in with Google once. We remember your profile forever, show all your past sessions &amp; 7-Day Next Steps, and unlock the <strong>4 Sessions / Month</strong> subscription plan.
                    </p>
                    <GoogleSignInButton
                      text="Sign in with Google"
                      onSuccess={async ({ credential, accessToken }) => {
                        const res = await loginWithGoogle({ credential, accessToken });
                        if (!res.user?.onboardingCompleted) {
                          router.push('/onboarding?next=/book');
                        }
                      }}
                      onFallbackClick={() => router.push('/login?next=/book')}
                    />
                    <div className="text-center">
                      <Link
                        href="/login?next=/book"
                        className="text-xs font-semibold text-terracotta hover:underline"
                      >
                        Or sign in / register with Email →
                      </Link>
                    </div>
                  </div>
                )}

                <div className="p-6 rounded-xl bg-warm border border-stone/40 mb-6">
                  <p className="font-mono text-xs uppercase tracking-widest text-terracotta mb-3">
                    How It Works
                  </p>
                  <ul className="space-y-2.5 text-sm text-charcoal">
                    <li className="flex items-start gap-2">
                      <span className="text-terracotta font-mono">01.</span>
                      <span>Sign in once &amp; complete your 1-time profile</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-terracotta font-mono">02.</span>
                      <span>Choose Single Session, 4 Sessions/Month, or use 1 Credit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-terracotta font-mono">03.</span>
                      <span>1-on-1 conversation (30–45 minutes)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-terracotta font-mono">04.</span>
                      <span>Track your 7-Day Next Step in your Dashboard</span>
                    </li>
                  </ul>
                </div>

                {/* Direct Contact Fallback */}
                <div className="pt-6 border-t border-stone">
                  <p className="font-mono text-xs uppercase tracking-widest text-ash mb-4">
                    Prefer to Reach Out Directly?
                  </p>
                  <div className="space-y-3 text-sm">
                    <a
                      href="https://wa.me/917737220724"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-charcoal hover:text-terracotta transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-terracotta" />
                      <span>WhatsApp: +91 77372 20724</span>
                    </a>
                    <a
                      href="mailto:secondinnings136@gmail.com"
                      className="flex items-center gap-3 text-charcoal hover:text-terracotta transition-colors"
                    >
                      <Mail className="w-4 h-4 text-terracotta" />
                      <span>secondinnings136@gmail.com</span>
                    </a>
                    <a
                      href="tel:+917737220724"
                      className="flex items-center gap-3 text-charcoal hover:text-terracotta transition-colors"
                    >
                      <Phone className="w-4 h-4 text-terracotta" />
                      <span>+91 77372 20724</span>
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Column: Smart Booking Engine */}
            <div className="lg:col-span-8">
              <Reveal delay={0.1}>
                <div className="card-editorial bg-white p-8 md:p-12">
                  {status.success ? (
                    <div className="py-10 text-center max-w-lg mx-auto">
                      <div className="w-16 h-16 rounded-full bg-sage/15 text-sage flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="font-serif text-3xl text-ink mb-3">
                        {status.confirmedBooking?.bookingMode === 'subscription_credit'
                          ? `Session #${status.confirmedBooking.sessionNumber || ''} Confirmed!`
                          : 'Thank You for Reaching Out.'}
                      </h3>
                      <p className="text-charcoal leading-relaxed mb-8">
                        {status.confirmedBooking?.bookingMode === 'subscription_credit'
                          ? `1 credit has been redeemed from your subscription plan. You now have ${remainingCredits} session ${
                              remainingCredits === 1 ? 'credit' : 'credits'
                            } remaining.`
                          : 'We have received your session request and recorded it in your Mentee Account. We will get in touch with you shortly via WhatsApp or email to confirm your slot.'}
                      </p>

                      <div className="p-6 rounded-xl bg-warm border border-stone/40 text-left mb-8">
                        <p className="font-mono text-xs uppercase tracking-widest text-terracotta mb-2">
                          Session Summary
                        </p>
                        <p className="text-sm text-charcoal leading-relaxed">
                          <strong>Focus:</strong> {status.confirmedBooking?.topic || formData.topic}
                        </p>
                        {(status.confirmedBooking?.preferredDate || formData.preferredDate) && (
                          <p className="text-xs text-charcoal mt-2">
                            <strong>Preferred Slot:</strong>{' '}
                            {new Date(
                              status.confirmedBooking?.preferredDate || formData.preferredDate
                            ).toLocaleDateString('en-IN')}{' '}
                            {status.confirmedBooking?.preferredTime || formData.preferredTime}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {isAuthenticated ? (
                          <Link href="/dashboard" className="btn-editorial">
                            <span>Open My Mentee Dashboard</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        ) : (
                          <Link href="/login" className="btn-editorial">
                            <span>Create Account to Track This Session</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              topic: '',
                              usefulGoal: '',
                              preferredDate: '',
                              preferredTime: ''
                            }));
                            setStatus({ loading: false, success: false, error: null, confirmedBooking: null });
                          }}
                          className="btn-editorial-outline"
                        >
                          Book Another Session
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* ===================================================== */}
                      {/* STEP 1: CHOOSE BOOKING FACTOR / SUBSCRIPTION MODEL     */}
                      {/* ===================================================== */}
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone/50 pb-3">
                          <div>
                            <span className="font-mono text-[10px] uppercase tracking-widest text-terracotta block">
                              Step 1 • Flexible Booking Factor
                            </span>
                            <h2 className="font-serif text-2xl text-ink">
                              Choose How You Want to Book
                            </h2>
                          </div>
                          {isAuthenticated && (
                            <span className="text-xs text-sage font-semibold flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              {remainingCredits > 0
                                ? `${remainingCredits} Subscription Credits Available`
                                : 'Multi-Session Plans Available'}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                          {/* Option 0: Redeem Active Subscription Credit (shown when user has credits) */}
                          {isAuthenticated && remainingCredits > 0 && (
                            <button
                              type="button"
                              onClick={() => setSelectedBookingFactor('CREDIT')}
                              className={`md:col-span-3 p-4 rounded-xl border-2 text-left transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                selectedBookingFactor === 'CREDIT'
                                  ? 'border-sage bg-sage/10 shadow-sm'
                                  : 'border-stone/60 bg-paper/60 hover:border-sage/50'
                              }`}
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="px-2.5 py-0.5 rounded-full bg-sage text-white text-[10px] font-mono uppercase font-bold">
                                    1-Click Instant Booking
                                  </span>
                                  <span className="font-serif text-lg text-ink font-semibold">
                                    Use 1 Credit from {activeSubscription?.planName || 'Your Subscription'}
                                  </span>
                                </div>
                                <p className="text-xs text-charcoal mt-1">
                                  You have <strong>{remainingCredits} sessions remaining</strong>. No payment checkout needed—confirms immediately.
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="font-serif text-2xl text-sage font-bold">₹0 Due</span>
                                <span className="block text-[10px] font-mono text-charcoal">
                                  1 Credit Redeemed
                                </span>
                              </div>
                            </button>
                          )}

                          {/* Option 1: Single Session */}
                          <button
                            type="button"
                            onClick={() => setSelectedBookingFactor('SINGLE_SESSION')}
                            className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                              selectedBookingFactor === 'SINGLE_SESSION'
                                ? 'border-ink bg-ink text-paper shadow-sm'
                                : 'border-stone/60 bg-paper/50 text-ink hover:border-ink/40'
                            }`}
                          >
                            <div>
                              <span
                                className={`text-[10px] font-mono uppercase tracking-wider block ${
                                  selectedBookingFactor === 'SINGLE_SESSION' ? 'text-paper/70' : 'text-ash'
                                }`}
                              >
                                Single Conversation
                              </span>
                              <p className="font-serif text-xl mt-0.5">1 Session</p>
                              <p
                                className={`text-xs mt-1 leading-snug ${
                                  selectedBookingFactor === 'SINGLE_SESSION' ? 'text-paper/80' : 'text-charcoal'
                                }`}
                              >
                                One focused 30–45 min conversation + 7-Day Next Step
                              </p>
                            </div>
                            <div className="mt-4 pt-2.5 border-t border-current/15 flex items-baseline justify-between">
                              <span className="font-serif text-xl">
                                {paymentConfig.paymentsEnabled ? `₹${paymentConfig.sessionFee}` : 'Complimentary'}
                              </span>
                              <span className="text-[10px] font-mono opacity-75">Pay once</span>
                            </div>
                          </button>

                          {/* Option 2: Monthly Subscription (4 Sessions / Month) */}
                          <button
                            type="button"
                            onClick={() => setSelectedBookingFactor('MONTHLY_4')}
                            className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between relative ${
                              selectedBookingFactor === 'MONTHLY_4'
                                ? 'border-terracotta bg-terracotta text-white shadow-sm'
                                : 'border-terracotta/40 bg-warm/40 text-ink hover:border-terracotta'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1">
                                <span
                                  className={`text-[10px] font-mono uppercase tracking-wider ${
                                    selectedBookingFactor === 'MONTHLY_4' ? 'text-white/85' : 'text-terracotta font-bold'
                                  }`}
                                >
                                  Monthly Subscription
                                </span>
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold ${
                                    selectedBookingFactor === 'MONTHLY_4'
                                      ? 'bg-white/20 text-white'
                                      : 'bg-terracotta/15 text-terracotta'
                                  }`}
                                >
                                  Popular
                                </span>
                              </div>
                              <p className="font-serif text-xl mt-0.5">4 Sessions / Month</p>
                              <p
                                className={`text-xs mt-1 leading-snug ${
                                  selectedBookingFactor === 'MONTHLY_4' ? 'text-white/85' : 'text-charcoal'
                                }`}
                              >
                                Weekly mentoring rhythm (1/week) + 1-click credit booking
                              </p>
                            </div>
                            <div className="mt-4 pt-2.5 border-t border-current/15 flex items-baseline justify-between">
                              <span className="font-serif text-xl">
                                ₹{selectedPlanObj?.code === 'MONTHLY_4' ? selectedPlanObj.price : 1600}
                              </span>
                              <span className="text-[10px] font-mono opacity-85">Save 20%</span>
                            </div>
                          </button>

                          {/* Option 3: Deep Transition Pack (8 Sessions / 3 Months) */}
                          <button
                            type="button"
                            onClick={() => setSelectedBookingFactor('QUARTERLY_8')}
                            className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                              selectedBookingFactor === 'QUARTERLY_8'
                                ? 'border-ink bg-ink text-paper shadow-sm'
                                : 'border-stone/60 bg-paper/50 text-ink hover:border-ink/40'
                            }`}
                          >
                            <div>
                              <span
                                className={`text-[10px] font-mono uppercase tracking-wider block ${
                                  selectedBookingFactor === 'QUARTERLY_8' ? 'text-paper/70' : 'text-ash'
                                }`}
                              >
                                90-Day Pack
                              </span>
                              <p className="font-serif text-xl mt-0.5">8 Sessions / 3 Mo</p>
                              <p
                                className={`text-xs mt-1 leading-snug ${
                                  selectedBookingFactor === 'QUARTERLY_8' ? 'text-paper/80' : 'text-charcoal'
                                }`}
                              >
                                Complete career, college &amp; confidence transition pack
                              </p>
                            </div>
                            <div className="mt-4 pt-2.5 border-t border-current/15 flex items-baseline justify-between">
                              <span className="font-serif text-xl">
                                ₹{selectedPlanObj?.code === 'QUARTERLY_8' ? selectedPlanObj.price : 2800}
                              </span>
                              <span className="text-[10px] font-mono opacity-75">Save 30%</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* ===================================================== */}
                      {/* STEP 2: PROFILE DETAILS (SKIPPED IF ONBOARDED!)        */}
                      {/* ===================================================== */}
                      {isAuthenticated && isOnboarded ? (
                        <div className="p-4 rounded-xl bg-warm/50 border border-stone/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-sage/15 text-sage flex items-center justify-center font-bold text-sm shrink-0">
                              ✓
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-ink">
                                Profile Auto-Filled from Your One-Time Onboarding
                              </p>
                              <p className="text-xs text-charcoal">
                                {user.name} • {user.whereCurrently || 'Mentee'} • {user.city || 'India'} • {user.phone}
                              </p>
                            </div>
                          </div>
                          <Link
                            href="/onboarding?next=/book"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-terracotta hover:underline shrink-0"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Profile</span>
                          </Link>
                        </div>
                      ) : isAuthenticated && !isOnboarded ? (
                        <div className="p-5 rounded-xl bg-terracotta/10 border border-terracotta/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-ink">
                              Complete your 60-second One-Time Profile so you never have to fill these fields again!
                            </p>
                            <p className="text-xs text-charcoal mt-0.5">
                              Signed in as {user.email}
                            </p>
                          </div>
                          <Link
                            href="/onboarding?next=/book"
                            className="btn-editorial text-xs py-2.5 px-5 shrink-0"
                          >
                            <span>Complete 1-Time Setup</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      ) : (
                        /* Guest Intake Fields (Only shown if user chose not to sign in yet) */
                        <div className="space-y-6 pt-2 border-t border-stone/40">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-ash">
                              Participant Details (Or{' '}
                              <Link href="/login?next=/book" className="text-terracotta underline">
                                Sign In Once
                              </Link>{' '}
                              to skip next time)
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-mono uppercase tracking-wider text-charcoal mb-2">
                                1. Your Name <span className="text-terracotta">*</span>
                              </label>
                              <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Full name"
                                className="w-full px-4 py-3 rounded-lg border border-stone bg-paper text-ink focus:outline-none focus:border-ink transition-colors text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-mono uppercase tracking-wider text-charcoal mb-2">
                                2. Your Age {selectedRole === 'student' && <span className="text-terracotta">*</span>}
                              </label>
                              <input
                                type="number"
                                name="age"
                                min="10"
                                max="99"
                                required={selectedRole === 'student'}
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="e.g., 19"
                                className="w-full px-4 py-3 rounded-lg border border-stone bg-paper text-ink focus:outline-none focus:border-ink transition-colors text-sm"
                              />
                            </div>
                          </div>

                          {/* Conditional Under-18 Safeguarding Fields */}
                          {isUnder18 && (
                            <div className="p-6 rounded-xl bg-warm border border-terracotta/30 space-y-4">
                              <div className="flex items-start gap-3">
                                <ShieldCheck className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                                <div>
                                  <h4 className="font-serif text-lg text-ink">
                                    Parent / Guardian Details (Under 18)
                                  </h4>
                                  <p className="text-xs text-charcoal leading-relaxed mt-1">
                                    Since you are under 18, please share a parent or guardian’s contact details and confirm that they are aware you are reaching out.
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
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
                                    Parent Phone / WhatsApp <span className="text-terracotta">*</span>
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
                                  My parent or guardian is aware that I am reaching out to Second Innings and consents to an introductory conversation. <span className="text-terracotta">*</span>
                                </span>
                              </label>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                                4. School / College / Org
                              </label>
                              <input
                                type="text"
                                name="institutionOrOrg"
                                value={formData.institutionOrOrg}
                                onChange={handleChange}
                                placeholder="e.g., JKLU"
                                className="w-full px-4 py-3 rounded-lg border border-stone bg-paper text-ink focus:outline-none focus:border-ink transition-colors text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-mono uppercase tracking-wider text-charcoal mb-2">
                                5. City <span className="text-terracotta">*</span>
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
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-xs font-mono uppercase tracking-wider text-charcoal mb-2">
                                Mobile / WhatsApp Number <span className="text-terracotta">*</span>
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                                className="w-full px-4 py-3 rounded-lg border border-stone bg-paper text-ink focus:outline-none focus:border-ink transition-colors text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-mono uppercase tracking-wider text-charcoal mb-2">
                                Email Address
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-lg border border-stone bg-paper text-ink focus:outline-none focus:border-ink transition-colors text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ===================================================== */}
                      {/* STEP 3: SESSION FOCUS & PREFERRED SLOT (ALWAYS SHOWN)  */}
                      {/* ===================================================== */}
                      <div className="space-y-6 pt-2 border-t border-stone/40">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-charcoal mb-1.5">
                            What would you like to focus on in this session? <span className="text-terracotta">*</span>
                          </label>
                          <p className="text-xs text-ash mb-3">
                            Click any prompt below or write 2–3 lines in your own words.
                          </p>

                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {TOPIC_PROMPTS.map((prompt) => (
                              <button
                                key={prompt}
                                type="button"
                                onClick={() => handleAddTopicPrompt(prompt)}
                                className="text-[11px] px-2.5 py-1 rounded-full border border-stone bg-warm/50 text-charcoal hover:border-terracotta hover:text-terracotta transition-colors"
                              >
                                + {prompt}
                              </button>
                            ))}
                          </div>

                          <textarea
                            name="topic"
                            rows={3}
                            maxLength={1000}
                            required
                            value={formData.topic}
                            onChange={handleChange}
                            placeholder="Write 2–3 lines about what is on your mind or what changed since your last session..."
                            className="w-full px-4 py-3 rounded-lg border border-stone bg-paper text-ink focus:outline-none focus:border-ink transition-colors text-sm resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-charcoal mb-2">
                            What would make this conversation useful for you? (Optional)
                          </label>
                          <textarea
                            name="usefulGoal"
                            rows={2}
                            maxLength={500}
                            value={formData.usefulGoal}
                            onChange={handleChange}
                            placeholder="e.g., Clarity on my next 7-day step, comparing two options..."
                            className="w-full px-4 py-3 rounded-lg border border-stone bg-paper text-ink focus:outline-none focus:border-ink transition-colors text-sm resize-none"
                          />
                        </div>

                        {/* Preferred Date & Time Slot */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-xs font-mono uppercase tracking-wider text-charcoal mb-2">
                              Preferred Date (Optional)
                            </label>
                            <input
                              type="date"
                              name="preferredDate"
                              min={new Date().toISOString().split('T')[0]}
                              value={formData.preferredDate}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg border border-stone bg-paper text-ink focus:outline-none focus:border-ink transition-colors text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono uppercase tracking-wider text-charcoal mb-2">
                              Preferred Time Window (Optional)
                            </label>
                            <select
                              name="preferredTime"
                              value={formData.preferredTime}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg border border-stone bg-paper text-ink focus:outline-none focus:border-ink transition-colors text-sm"
                            >
                              <option value="">Flexible / Any Time</option>
                              {TIME_SLOTS.map((slot) => (
                                <option key={slot} value={slot}>
                                  {slot}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {status.error && (
                        <div className="p-4 rounded-lg bg-terracotta/10 border border-terracotta/30 text-terracotta text-sm">
                          {status.error}
                        </div>
                      )}

                      {/* Submit Button Summary */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={status.loading}
                          className="btn-editorial w-full md:w-auto disabled:opacity-50 py-3.5 px-8"
                        >
                          {selectedBookingFactor === 'CREDIT' && remainingCredits > 0 ? (
                            <>
                              <Sparkles className="w-4 h-4" />
                              <span>
                                {status.loading
                                  ? 'Confirming Session...'
                                  : `Confirm Session Using 1 Credit (${remainingCredits} Left)`}
                              </span>
                              <ArrowUpRight className="w-4 h-4" />
                            </>
                          ) : selectedBookingFactor === 'MONTHLY_4' ? (
                            <>
                              <CreditCard className="w-4 h-4" />
                              <span>
                                {status.loading
                                  ? 'Initiating Secure Payment...'
                                  : `Subscribe (4 Sessions / Month • ₹${
                                      selectedPlanObj?.code === 'MONTHLY_4' ? selectedPlanObj.price : 1600
                                    }) & Book Session #1`}
                              </span>
                              <ArrowUpRight className="w-4 h-4" />
                            </>
                          ) : selectedBookingFactor === 'QUARTERLY_8' ? (
                            <>
                              <CreditCard className="w-4 h-4" />
                              <span>
                                {status.loading
                                  ? 'Initiating Secure Payment...'
                                  : `Activate 8-Session Pack (₹${
                                      selectedPlanObj?.code === 'QUARTERLY_8' ? selectedPlanObj.price : 2800
                                    }) & Book Session #1`}
                              </span>
                              <ArrowUpRight className="w-4 h-4" />
                            </>
                          ) : paymentConfig.paymentsEnabled && paymentConfig.sessionFee > 0 ? (
                            <>
                              <CreditCard className="w-4 h-4" />
                              <span>
                                {status.loading
                                  ? 'Initiating Secure Payment...'
                                  : `Proceed to Pay ₹${paymentConfig.sessionFee} & Book Session`}
                              </span>
                              <ArrowUpRight className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              <span>{status.loading ? 'Submitting...' : 'Confirm Session Request'}</span>
                              <ArrowUpRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* ========================================================= */}
                {/* DIRECT SUPPORT / SESSION CONTRIBUTION CARD                */}
                {/* ========================================================= */}
                <div className="mt-10 rounded-2xl border-2 border-terracotta/30 bg-gradient-to-br from-white via-paper to-warm p-7 md:p-10 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone/60">
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-terracotta/15 text-terracotta flex items-center justify-center shrink-0 mt-0.5">
                        <HeartHandshake className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-mono text-[11px] uppercase tracking-widest text-terracotta block mb-1">
                          Instant Online Payment · Cashfree PG
                        </span>
                        <h3 className="font-serif text-2xl md:text-3xl text-ink">
                          Pay Session Fee or Support Second Innings
                        </h3>
                        <p className="text-xs md:text-sm text-charcoal mt-1 leading-relaxed">
                          Already spoke with Deepak Sir or wish to contribute directly? Pay via UPI, Google Pay, PhonePe, Cards, or NetBanking.
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono text-sage bg-sage/10 px-3 py-1.5 rounded-full shrink-0 self-start md:self-center">
                      <Lock className="w-3.5 h-3.5" />
                      100% Secure UPI / Card
                    </div>
                  </div>

                  <form onSubmit={handleDirectPayment} className="pt-6 space-y-5">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-charcoal mb-2.5">
                        Select Contribution / Session Amount (INR)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {PRESET_AMOUNTS.map((amt) => {
                          const isSelected = !payWidget.isCustom && Number(payWidget.amount) === amt;
                          return (
                            <button
                              key={amt}
                              type="button"
                              onClick={() =>
                                setPayWidget((prev) => ({
                                  ...prev,
                                  amount: amt,
                                  isCustom: false,
                                  error: null
                                }))
                              }
                              className={`py-3 px-4 rounded-xl font-serif text-lg border transition-all ${
                                isSelected
                                  ? 'bg-ink text-paper border-ink shadow-sm'
                                  : 'bg-white text-ink border-stone hover:border-ink/50'
                              }`}
                            >
                              ₹{amt}
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() =>
                            setPayWidget((prev) => ({
                              ...prev,
                              isCustom: true,
                              error: null
                            }))
                          }
                          className={`py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all ${
                            payWidget.isCustom
                              ? 'bg-terracotta text-white border-terracotta shadow-sm'
                              : 'bg-white text-charcoal border-stone hover:border-terracotta/50'
                          }`}
                        >
                          Custom ₹
                        </button>
                      </div>
                    </div>

                    {payWidget.isCustom && (
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-charcoal mb-1.5">
                          Enter Custom Amount (₹)
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          placeholder="e.g., 750"
                          value={payWidget.customAmount}
                          onChange={(e) =>
                            setPayWidget((prev) => ({ ...prev, customAmount: e.target.value }))
                          }
                          className="w-full sm:w-64 px-4 py-2.5 rounded-lg border border-stone bg-white text-ink text-base font-semibold focus:outline-none focus:border-ink"
                        />
                      </div>
                    )}

                    {!isAuthenticated && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-charcoal mb-1">
                            Your Name
                          </label>
                          <input
                            type="text"
                            placeholder={formData.name || 'Full name'}
                            value={payWidget.name}
                            onChange={(e) =>
                              setPayWidget((prev) => ({ ...prev, name: e.target.value }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-lg border border-stone bg-white text-ink text-sm focus:outline-none focus:border-ink"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-charcoal mb-1">
                            Mobile / WhatsApp <span className="text-terracotta">*</span>
                          </label>
                          <input
                            type="tel"
                            required={!formData.phone}
                            placeholder={formData.phone || '+91 98765 43210'}
                            value={payWidget.phone}
                            onChange={(e) =>
                              setPayWidget((prev) => ({ ...prev, phone: e.target.value }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-lg border border-stone bg-white text-ink text-sm focus:outline-none focus:border-ink"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-charcoal mb-1">
                            Email (Optional)
                          </label>
                          <input
                            type="email"
                            placeholder={formData.email || 'you@example.com'}
                            value={payWidget.email}
                            onChange={(e) =>
                              setPayWidget((prev) => ({ ...prev, email: e.target.value }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-lg border border-stone bg-white text-ink text-sm focus:outline-none focus:border-ink"
                          />
                        </div>
                      </div>
                    )}

                    {payWidget.error && (
                      <div className="p-3 rounded-lg bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs">
                        {payWidget.error}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                      <p className="text-xs text-ash">
                        Instant receipt generated upon payment completion.
                      </p>
                      <button
                        type="submit"
                        disabled={payWidget.loading}
                        className="btn-editorial disabled:opacity-50 shrink-0"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>
                          {payWidget.loading
                            ? 'Opening Cashfree...'
                            : `Pay ₹${
                                payWidget.isCustom ? payWidget.customAmount || '0' : payWidget.amount
                              } Now`}
                        </span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
