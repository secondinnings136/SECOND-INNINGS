'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle, RefreshCw, Calendar, ArrowRight, MessageCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const bookingId = searchParams.get('booking_id');

  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId || bookingId) {
      verifyPayment();
    } else {
      setLoading(false);
      setError('No order ID provided in return URL.');
    }
  }, [orderId, bookingId]);

  const verifyPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/payment/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, bookingId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Payment verification failed');
      setVerification(data);
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message || 'Could not verify payment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <RefreshCw className="w-10 h-10 text-amber animate-spin mb-4" />
        <h2 className="text-xl font-serif font-bold text-ink">Verifying Your Payment...</h2>
        <p className="text-sm text-muted mt-1">Please wait while we confirm your transaction with Cashfree.</p>
      </div>
    );
  }

  const isPaid = verification?.paid;
  const booking = verification?.booking;

  return (
    <div className="page-x py-24 sm:py-32">
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-line shadow-sm p-8 sm:p-10 text-center">
        {isPaid ? (
          <div>
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
              Payment Confirmed!
            </h1>
            <p className="text-sm text-ink-2 mt-2 leading-relaxed">
              Thank you, <strong>{booking?.name}</strong>. Your payment of <strong>₹{booking?.paymentAmount}</strong> was successful and your session enquiry is confirmed.
            </p>

            {/* Receipt Summary Box */}
            <div className="mt-8 p-5 bg-paper rounded-xl border border-line text-left text-xs space-y-2.5">
              <div className="flex justify-between py-1 border-b border-line">
                <span className="text-muted">Order ID:</span>
                <span className="font-mono font-medium text-ink">{orderId || booking?.cashfreeOrderId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-line">
                <span className="text-muted">Payment Mode:</span>
                <span className="uppercase font-medium text-ink">{booking?.paymentMode || 'Online (UPI / Card)'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted">Status:</span>
                <span className="font-semibold text-green-700">PAID &amp; CONFIRMED</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <p className="text-xs text-muted">
                Mr. Deepak Sogani will reach out to you via WhatsApp or phone to coordinate the exact time slot.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Button href="/" className="w-full sm:w-auto">
                  Back to Homepage
                </Button>
                <a
                  href={`https://wa.me/917737220724?text=Hi%20Deepak%20Sir,%20I%20have%20completed%20payment%20for%20my%20mentoring%20session.%20Order%20ID:%20${orderId || ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-coral transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <span>Connect on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
              Payment Pending or Incomplete
            </h1>
            <p className="text-sm text-ink-2 mt-2 leading-relaxed">
              We could not verify successful payment for Order <code>{orderId}</code>. If your money was deducted, it will automatically update within a few minutes via webhook.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={verifyPayment}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber hover:bg-amber-600 text-charcoal-blue font-bold rounded-lg text-sm transition-colors"
              >
                Re-check Payment
              </button>
              <Button href="/book" variant="outline" className="w-full sm:w-auto">
                Back to Booking
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-amber animate-spin" />
      </div>
    }>
      <PaymentStatusContent />
    </Suspense>
  );
}
