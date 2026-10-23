'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Mail,
  KeyRound,
  User as UserIcon,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext';
import GoogleSignInButton from '../../components/GoogleSignInButton';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/dashboard';

  const {
    user,
    isAuthenticated,
    isOnboarded,
    loginWithGoogle,
    requestEmailOtp,
    verifyEmailOtpAndLogin
  } = useUserAuth();

  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [devOtpHint, setDevOtpHint] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      if (!isOnboarded) {
        router.replace(`/onboarding?next=${encodeURIComponent(nextPath)}`);
      } else {
        router.replace(nextPath);
      }
    }
  }, [isAuthenticated, isOnboarded, user, router, nextPath]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleGoogleSuccess = async ({ credential, accessToken }) => {
    setError('');
    setSubmitting(true);
    try {
      const res = await loginWithGoogle({ credential, accessToken });
      if (!res.user?.onboardingCompleted) {
        router.push(`/onboarding?next=${encodeURIComponent(nextPath)}`);
      } else {
        router.push(nextPath);
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError('');
    setInfoMsg('');
    setDevOtpHint('');
    setSubmitting(true);

    try {
      const res = await requestEmailOtp({ email, name });
      setStep('otp');
      setCooldown(45);
      setInfoMsg(res.message || `6-digit verification code sent to ${email}`);
      if (res.devOtpPreview) {
        setDevOtpHint(res.devOtpPreview);
      }
    } catch (err) {
      setError(err.message || 'Could not send verification OTP. Please check your email.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await verifyEmailOtpAndLogin({ email, otp, name });
      if (!res.user?.onboardingCompleted) {
        router.push(`/onboarding?next=${encodeURIComponent(nextPath)}`);
      } else {
        router.push(nextPath);
      }
    } catch (err) {
      setError(err.message || 'Invalid verification code.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper pt-28 pb-20 md:pt-36">
      <div className="container-editorial max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Why One-Time Account */}
          <div className="lg:col-span-6 space-y-6">
            <p className="eyebrow">Mentee Account &amp; Continuity</p>
            <h1 className="font-serif text-4xl md:text-5xl text-ink leading-[1.08]">
              Sign in once. <br />
              <span className="italic text-signal">Never re-fill the form again.</span>
            </h1>
            <p className="text-ink-2 leading-relaxed text-base md:text-lg">
              Your Second Innings account remembers your background, links all your past and upcoming mentoring conversations, tracks your <strong>7-Day Next Steps</strong>, and lets you book future sessions in one click.
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl border border-line bg-paper-2 flex items-start gap-3.5">
                <CheckCircle2 className="w-5 h-5 text-sprout shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-ink text-sm">One-Time Profile Onboarding</h3>
                  <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">
                    Answer the background &amp; safeguarding questions just once right after signup. Future bookings only ask what you want to talk about today.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-line bg-paper-2 flex items-start gap-3.5">
                <Calendar className="w-5 h-5 text-signal shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-ink text-sm">Complete Past Session History &amp; 7-Day Actions</h3>
                  <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">
                    Review every past session, mentor notes shared by Deepak Sir, and update your 7-Day Next Step progress before your next conversation.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-line bg-paper-2 flex items-start gap-3.5">
                <Sparkles className="w-5 h-5 text-signal shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-ink text-sm">Monthly Subscription (4 Sessions / Month) &amp; Multi-Packs</h3>
                  <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">
                    Subscribe once to a 4-session monthly rhythm or 8-session pack and book any slot in 1 click using your session credits.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Google Login + Email OTP Verification Card */}
          <div className="lg:col-span-6">
            <div className="card-editorial bg-white p-7 md:p-9">
              <div className="border-b border-line pb-4 mb-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal block">
                  Second Innings Portal
                </span>
                <h2 className="font-serif text-2xl md:text-3xl text-ink mt-0.5">
                  Sign In or Create Account
                </h2>
              </div>

              {/* Google Sign-In */}
              <div className="space-y-3 mb-6">
                <GoogleSignInButton
                  text="Continue with Google (1-Click)"
                  onSuccess={handleGoogleSuccess}
                  onError={(msg) => setError(msg)}
                  onFallbackClick={() => {
                    const emailInput = document.getElementById('auth-email-input');
                    emailInput?.focus();
                  }}
                />
              </div>

              <div className="relative flex py-2 items-center mb-6">
                <div className="flex-grow border-t border-line"></div>
                <span className="flex-shrink mx-3 text-[11px] font-mono uppercase tracking-widest text-muted">
                  Or continue with Email OTP
                </span>
                <div className="flex-grow border-t border-line"></div>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-signal/10 border border-signal/30 text-signal text-xs font-medium">
                  {error}
                </div>
              )}

              {infoMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-sprout/10 border border-sprout/30 text-sprout text-xs font-medium">
                  {infoMsg}
                  {devOtpHint && (
                    <span className="block mt-1 font-mono font-bold text-ink">
                      Local Dev OTP Code: {devOtpHint}
                    </span>
                  )}
                </div>
              )}

              {step === 'email' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-ink-2 mb-1.5">
                      Your Name (Optional if returning)
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Aarav Sharma"
                        className="field pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-ink-2 mb-1.5">
                      Email Address <span className="text-signal">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="auth-email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="field pl-10"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-editorial w-full justify-center py-3.5 text-sm disabled:opacity-50"
                  >
                    <span>
                      {submitting ? 'Sending 6-Digit OTP...' : 'Send Verification OTP to Email'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-muted bg-paper-2 p-3 rounded-xl border border-line">
                    <span>
                      OTP sent to <strong className="text-ink">{email}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setStep('email');
                        setOtp('');
                        setError('');
                        setInfoMsg('');
                      }}
                      className="text-signal font-semibold hover:underline"
                    >
                      Change Email
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-ink-2 mb-1.5">
                      Enter 6-Digit Verification OTP <span className="text-signal">*</span>
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="\d{6}"
                        maxLength={6}
                        required
                        autoFocus
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        className="field pl-10 font-mono text-lg tracking-[0.35em] font-bold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || otp.length !== 6}
                    className="btn-editorial w-full justify-center py-3.5 text-sm disabled:opacity-50"
                  >
                    <span>{submitting ? 'Verifying OTP...' : 'Verify OTP & Continue'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      disabled={cooldown > 0 || submitting}
                      onClick={handleSendOtp}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink disabled:opacity-50"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>
                        {cooldown > 0
                          ? `Resend OTP in ${cooldown}s`
                          : 'Resend Verification OTP'}
                      </span>
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6 pt-4 border-t border-line flex items-center justify-between text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sprout" />
                  Past sessions with your email auto-sync
                </span>
                <Link href="/book" className="text-signal hover:underline font-medium">
                  Back to Booking →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper pt-36 pb-24 flex items-center justify-center">
          <p className="text-sm text-ink-2 font-mono">Loading account portal...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
