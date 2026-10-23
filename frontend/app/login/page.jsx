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
  Lock,
  User as UserIcon,
  Calendar
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
    loginWithEmail,
    registerWithEmail
  } = useUserAuth();

  const [mode, setMode] = useState('signup'); // 'signup' | 'signin'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [googleHelperNotice, setGoogleHelperNotice] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      if (!isOnboarded) {
        router.replace(`/onboarding?next=${encodeURIComponent(nextPath)}`);
      } else {
        router.replace(nextPath);
      }
    }
  }, [isAuthenticated, isOnboarded, user, router, nextPath]);

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

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGoogleHelperNotice('');
    setSubmitting(true);

    try {
      let res;
      if (mode === 'signup') {
        res = await registerWithEmail({ name, email, password });
      } else {
        res = await loginWithEmail({ email, password });
      }

      if (!res.user?.onboardingCompleted) {
        router.push(`/onboarding?next=${encodeURIComponent(nextPath)}`);
      } else {
        router.push(nextPath);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your details.');
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
              <span className="italic text-terracotta">Never re-fill the form again.</span>
            </h1>
            <p className="text-charcoal leading-relaxed text-base md:text-lg">
              Your Second Innings account remembers your background, links all your past and upcoming mentoring conversations, tracks your <strong>7-Day Next Steps</strong>, and lets you book future sessions in one click.
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl border border-stone/40 bg-warm/30 flex items-start gap-3.5">
                <CheckCircle2 className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-ink text-sm">One-Time Profile Onboarding</h3>
                  <p className="text-xs text-charcoal mt-0.5 leading-relaxed">
                    Answer the background &amp; safeguarding questions just once right after signup. Future bookings only ask what you want to talk about today.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-stone/40 bg-warm/30 flex items-start gap-3.5">
                <Calendar className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-ink text-sm">Complete Past Session History &amp; 7-Day Actions</h3>
                  <p className="text-xs text-charcoal mt-0.5 leading-relaxed">
                    Review every past session, mentor notes shared by Deepak Sir, and update your 7-Day Next Step progress before your next conversation.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-stone/40 bg-warm/30 flex items-start gap-3.5">
                <Sparkles className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-ink text-sm">Monthly Subscription (4 Sessions / Month) &amp; Multi-Packs</h3>
                  <p className="text-xs text-charcoal mt-0.5 leading-relaxed">
                    Subscribe once to a 4-session monthly rhythm or 8-session pack and book any slot in 1 click using your session credits.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Auth Card */}
          <div className="lg:col-span-6">
            <div className="card-editorial bg-white p-7 md:p-9 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone/40 pb-4 mb-6">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-terracotta block">
                    Second Innings Portal
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl text-ink mt-0.5">
                    {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
                  </h2>
                </div>
                <div className="flex rounded-full bg-warm p-1 border border-stone/40 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setError(''); }}
                    className={`px-3.5 py-1.5 rounded-full transition-all ${
                      mode === 'signup' ? 'bg-ink text-paper shadow-sm' : 'text-charcoal hover:text-ink'
                    }`}
                  >
                    New User
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setError(''); }}
                    className={`px-3.5 py-1.5 rounded-full transition-all ${
                      mode === 'signin' ? 'bg-ink text-paper shadow-sm' : 'text-charcoal hover:text-ink'
                    }`}
                  >
                    Sign In
                  </button>
                </div>
              </div>

              {/* Google Sign-In */}
              <div className="space-y-3 mb-6">
                <GoogleSignInButton
                  text={mode === 'signup' ? 'Sign up with Google (1-Click)' : 'Continue with Google'}
                  onSuccess={handleGoogleSuccess}
                  onError={(msg) => setError(msg)}
                  onFallbackClick={() => {
                    setGoogleHelperNotice(
                      'Enter your Google Email below to create or access your account in 10 seconds.'
                    );
                    const emailInput = document.getElementById('auth-email-input');
                    emailInput?.focus();
                  }}
                />
                {googleHelperNotice && (
                  <p className="text-xs text-terracotta bg-terracotta/10 border border-terracotta/20 rounded-lg px-3 py-2 text-center">
                    {googleHelperNotice}
                  </p>
                )}
              </div>

              <div className="relative flex py-2 items-center mb-6">
                <div className="flex-grow border-t border-stone/40"></div>
                <span className="flex-shrink mx-3 text-[11px] font-mono uppercase tracking-widest text-ash">
                  Or continue with email
                </span>
                <div className="flex-grow border-t border-stone/40"></div>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-charcoal mb-1.5">
                      Your Full Name <span className="text-terracotta">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-ash absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Aarav Sharma"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone bg-paper/60 text-ink text-sm focus:outline-none focus:border-ink transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-charcoal mb-1.5">
                    Email Address (Gmail or any email) <span className="text-terracotta">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-ash absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="auth-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="yourname@gmail.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone bg-paper/60 text-ink text-sm focus:outline-none focus:border-ink transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-charcoal mb-1.5">
                    Password <span className="text-terracotta">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-ash absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'signup' ? 'Create a password (min 6 chars)' : 'Enter your password'}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone bg-paper/60 text-ink text-sm focus:outline-none focus:border-ink transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-editorial w-full justify-center py-3.5 text-sm disabled:opacity-50"
                >
                  <span>
                    {submitting
                      ? 'Please wait...'
                      : mode === 'signup'
                      ? 'Continue to 1-Time Profile Setup'
                      : 'Sign In to My Account'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-stone/30 flex items-center justify-between text-xs text-ash">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sage" />
                  Past sessions with your email auto-sync
                </span>
                <Link href="/book" className="text-terracotta hover:underline font-medium">
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
          <p className="text-sm text-charcoal font-mono">Loading account portal...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
