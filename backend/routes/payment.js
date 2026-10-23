const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const Booking = require('../models/Booking');
const Setting = require('../models/Setting');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const UserSubscription = require('../models/UserSubscription');
const PaymentTransaction = require('../models/PaymentTransaction');
const WebhookEvent = require('../models/WebhookEvent');
const { protectAdmin, optionalAuth } = require('../middleware/auth');
const {
  paymentLimiter,
  getTrustedFrontendOrigin,
  computeDedupFingerprint
} = require('../middleware/security');
const { ensureDefaultPlans } = require('./subscriptions');
const {
  createCashfreeOrder,
  fetchCashfreeOrder,
  fetchCashfreeOrderPayments,
  verifyWebhookSignature
} = require('../services/cashfree');

/**
 * Helper to read payment settings from MongoDB with defaults
 */
async function getPaymentSettings() {
  const [enabledDoc, feeDoc] = await Promise.all([
    Setting.findOne({ key: 'paymentsEnabled' }),
    Setting.findOne({ key: 'sessionFee' })
  ]);

  return {
    paymentsEnabled: enabledDoc ? Boolean(enabledDoc.value) : false,
    sessionFee: feeDoc && Number(feeDoc.value) >= 0 ? Number(feeDoc.value) : 500
  };
}

/**
 * Unified Atomic Order Reconciliation Engine
 * Prevents race conditions between browser /verify and server /webhook,
 * enforces amount & currency verification, detects duplicate payments across multiple orders,
 * and atomically activates subscriptions / bookings.
 */
async function reconcileOrderPayment(orderId, verifiedBySource = 'verify_endpoint') {
  const cleanOrderId = String(orderId || '').trim();
  if (!cleanOrderId) {
    const err = new Error('orderId is required');
    err.statusCode = 400;
    throw err;
  }

  // 1. Fetch live status directly from Cashfree (Single Source of Truth)
  const [payments, orderData] = await Promise.all([
    fetchCashfreeOrderPayments(cleanOrderId),
    fetchCashfreeOrder(cleanOrderId)
  ]);

  const tx = await PaymentTransaction.findOne({ cashfreeOrderId: cleanOrderId });
  let booking = tx?.bookingId
    ? await Booking.findById(tx.bookingId).select('+slotUpdateToken')
    : await Booking.findOne({
        $or: [{ cashfreeOrderId: cleanOrderId }, { orderHistory: cleanOrderId }]
      }).select('+slotUpdateToken');

  const userSub = tx?.userSubscriptionId
    ? await UserSubscription.findById(tx.userSubscriptionId)
    : await UserSubscription.findOne({ cashfreeOrderId: cleanOrderId });

  const paidPayment = Array.isArray(payments)
    ? payments.find((p) => p.payment_status === 'SUCCESS')
    : null;

  const isOrderPaid = Boolean(paidPayment) || orderData?.order_status === 'PAID';

  if (!isOrderPaid) {
    // Check if failed or dropped
    const failedPayment = Array.isArray(payments)
      ? payments.find((p) => p.payment_status === 'FAILED' || p.payment_status === 'USER_DROPPED')
      : null;

    if (failedPayment && tx && tx.status !== 'PAID') {
      tx.status = failedPayment.payment_status === 'USER_DROPPED' ? 'USER_DROPPED' : 'FAILED';
      await tx.save();
    }
    if (failedPayment && booking && booking.paymentStatus === 'pending') {
      booking.paymentStatus = 'failed';
      await booking.save();
    }

    return {
      isPaid: false,
      orderStatus: orderData?.order_status || 'ACTIVE',
      booking,
      subscription: userSub,
      transaction: tx
    };
  }

  // 2. Verify Amount & Currency Integrity
  const actualPaidAmount = Number(paidPayment?.payment_amount ?? orderData?.order_amount ?? 0);
  const actualCurrency = String(paidPayment?.payment_currency ?? orderData?.order_currency ?? 'INR').toUpperCase();
  const expectedAmount = Number(tx?.expectedAmount ?? booking?.paymentAmount ?? userSub?.amountPaid ?? 0);

  if (actualCurrency !== 'INR' || (expectedAmount > 0 && actualPaidAmount < expectedAmount)) {
    if (tx) {
      tx.status = 'AMOUNT_MISMATCH_HOLD';
      tx.paidAmount = actualPaidAmount;
      tx.rawGatewaySummary = { orderStatus: orderData?.order_status, actualPaidAmount, expectedAmount };
      await tx.save();
    }
    const mismatchErr = new Error(
      `Payment amount/currency mismatch detected (Expected INR ${expectedAmount}, got ${actualCurrency} ${actualPaidAmount})`
    );
    mismatchErr.statusCode = 400;
    throw mismatchErr;
  }

  const cfPaymentId = paidPayment?.cf_payment_id ? String(paidPayment.cf_payment_id) : `CF_${cleanOrderId}`;
  const paymentMethod = paidPayment?.payment_group || 'ONLINE';
  const paidTime = paidPayment?.payment_completion_time
    ? new Date(paidPayment.payment_completion_time)
    : new Date();

  // 3. Check if this Booking was ALREADY paid by a DIFFERENT orderId (Double-Payment Detection!)
  if (
    booking &&
    booking.paymentStatus === 'paid' &&
    booking.cashfreeOrderId &&
    booking.cashfreeOrderId !== cleanOrderId
  ) {
    if (tx && tx.status !== 'DUPLICATE_PAID_NEEDS_REFUND') {
      tx.status = 'DUPLICATE_PAID_NEEDS_REFUND';
      tx.cashfreePaymentId = cfPaymentId;
      tx.paidAmount = actualPaidAmount;
      tx.paymentMethod = paymentMethod;
      tx.paidAt = paidTime;
      tx.verifiedBy = verifiedBySource;
      await tx.save();
    }
    return {
      isPaid: true,
      duplicatePaymentDetected: true,
      orderStatus: 'PAID',
      booking,
      subscription: userSub,
      transaction: tx
    };
  }

  // 4. Atomically update PaymentTransaction ledger
  if (tx && tx.status !== 'PAID') {
    await PaymentTransaction.findOneAndUpdate(
      { _id: tx._id, status: { $ne: 'PAID' } },
      {
        $set: {
          status: 'PAID',
          cashfreePaymentId: cfPaymentId,
          paidAmount: actualPaidAmount,
          paymentMethod,
          paidAt: paidTime,
          verifiedBy: verifiedBySource,
          rawGatewaySummary: {
            orderStatus: orderData?.order_status,
            cfPaymentId,
            paymentGroup: paymentMethod
          }
        }
      }
    );
  }

  // 5. If this is a Subscription Purchase, atomically activate UserSubscription & credits
  let activatedSub = userSub;
  if (userSub) {
    const planDoc = userSub.planId ? await SubscriptionPlan.findById(userSub.planId) : null;
    const durationDays = planDoc?.durationDays || (userSub.planCode === 'QUARTERLY_8' ? 90 : 30);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

    const hasInitialBooking = Boolean(
      userSub.pendingInitialBookingData && userSub.pendingInitialBookingData.topic
    );
    const initialCreditsUsed = hasInitialBooking ? 1 : 0;
    const initialRemaining = Math.max(0, userSub.totalCredits - initialCreditsUsed);

    const initialLedger = [
      {
        action: 'CREDITED',
        creditsDelta: userSub.totalCredits,
        balanceAfter: userSub.totalCredits,
        note: `Purchased ${userSub.planName} (${cleanOrderId})`,
        timestamp: now
      }
    ];

    const subTransitioned = await UserSubscription.findOneAndUpdate(
      { _id: userSub._id, status: 'pending_payment' },
      {
        $set: {
          status: initialRemaining > 0 ? 'active' : 'exhausted',
          usedCredits: initialCreditsUsed,
          remainingCredits: initialRemaining,
          startsAt: now,
          expiresAt,
          cashfreePaymentId: cfPaymentId,
          creditLedger: initialLedger
        }
      },
      { new: true }
    );

    if (subTransitioned) {
      activatedSub = subTransitioned;

      // If user also filled out their first session topic while purchasing the subscription, create/confirm that session now!
      if (hasInitialBooking && !subTransitioned.initialBookingId) {
        const initData = subTransitioned.pendingInitialBookingData;
        const prevCount = await Booking.countDocuments({
          userId: subTransitioned.userId,
          status: { $ne: 'cancelled' }
        });
        const generatedSlotToken = crypto.randomBytes(24).toString('hex');

        const createdBooking = await Booking.create({
          userId: subTransitioned.userId,
          sessionNumber: prevCount + 1,
          bookingMode: 'subscription_credit',
          userSubscriptionId: subTransitioned._id,
          planCode: subTransitioned.planCode,
          name: initData.name,
          email: initData.email,
          phone: initData.phone,
          whatsapp: initData.whatsapp || initData.phone,
          userType: initData.userType || 'student',
          age: initData.age,
          ageGroup: initData.ageGroup,
          isUnder18: initData.isUnder18,
          parentName: initData.parentName,
          parentPhone: initData.parentPhone,
          parentEmail: initData.parentEmail,
          parentConsentConfirmed: initData.parentConsentConfirmed,
          whereCurrently: initData.whereCurrently,
          currentStage: initData.whereCurrently,
          institutionOrOrg: initData.institutionOrOrg,
          city: initData.city,
          source: initData.source || `Subscription (${subTransitioned.planName})`,
          referredBy: initData.referredBy,
          topic: initData.topic,
          concern: initData.topic,
          usefulGoal: initData.usefulGoal || '',
          preferredDate: initData.preferredDate || undefined,
          preferredTime: initData.preferredTime || undefined,
          slotUpdateToken: generatedSlotToken,
          status: 'confirmed',
          paymentRequired: true,
          paymentStatus: 'paid',
          paymentAmount: actualPaidAmount,
          cashfreeOrderId: cleanOrderId,
          cashfreePaymentId: cfPaymentId,
          paymentMode: `${paymentMethod} (${subTransitioned.planCode})`,
          paymentTime: paidTime
        });

        subTransitioned.initialBookingId = createdBooking._id;
        subTransitioned.creditLedger.push({
          action: 'CONSUMED',
          bookingId: createdBooking._id,
          creditsDelta: -1,
          balanceAfter: initialRemaining,
          note: `Session #${createdBooking.sessionNumber} auto-booked on plan purchase`,
          timestamp: now
        });
        await subTransitioned.save();
        booking = createdBooking;
      }
    } else {
      activatedSub = await UserSubscription.findById(userSub._id);
      if (activatedSub?.initialBookingId && !booking) {
        booking = await Booking.findById(activatedSub.initialBookingId).select('+slotUpdateToken');
      }
    }
  }

  // 6. Atomically transition Single Booking to 'paid' & 'confirmed'
  if (booking && booking.paymentStatus !== 'paid') {
    const slotToken = booking.slotUpdateToken || crypto.randomBytes(24).toString('hex');
    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: booking._id, paymentStatus: { $ne: 'paid' } },
      {
        $set: {
          paymentStatus: 'paid',
          status: 'confirmed',
          cashfreeOrderId: cleanOrderId,
          cashfreePaymentId: cfPaymentId,
          paymentMode: paymentMethod,
          paymentTime: paidTime,
          slotUpdateToken: slotToken
        }
      },
      { new: true }
    ).select('+slotUpdateToken');

    if (updatedBooking) {
      booking = updatedBooking;
    } else {
      booking = await Booking.findById(booking._id).select('+slotUpdateToken');
    }
  }

  return {
    isPaid: true,
    orderStatus: 'PAID',
    booking,
    subscription: activatedSub,
    transaction: tx,
    paymentDetails: {
      orderId: cleanOrderId,
      cfPaymentId,
      amount: actualPaidAmount,
      paymentMethod,
      paymentTime: paidTime
    }
  };
}

// @route   GET /api/payment/config
// @desc    Get public payment configuration + active subscription plans
// @access  Public
router.get('/config', async (req, res, next) => {
  try {
    await ensureDefaultPlans();
    const [settings, plans] = await Promise.all([
      getPaymentSettings(),
      SubscriptionPlan.find({ isActive: true }).sort({ sortOrder: 1 })
    ]);

    res.status(200).json({
      success: true,
      data: {
        paymentsEnabled: settings.paymentsEnabled,
        sessionFee: settings.sessionFee,
        currency: 'INR',
        plans
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/payment/create-order
// @desc    Create a Cashfree order with full Idempotency, Live Pre-Check & Duplicate Prevention
// @access  Public / Authenticated User
router.post('/create-order', paymentLimiter, optionalAuth, async (req, res, next) => {
  try {
    await ensureDefaultPlans();
    const settings = await getPaymentSettings();
    const {
      bookingId,
      bookingData = {},
      purpose: rawPurpose,
      planCode,
      customAmount,
      idempotencyKey: bodyIdempKey
    } = req.body;

    const headerIdempKey = req.headers['x-idempotency-key'];
    const rawIdempKey = String(headerIdempKey || bodyIdempKey || '').trim().slice(0, 120);

    // Resolve user identity (Sign-in & 1-Time Onboarding required!)
    const user = req.user || null;
    if (!user && !req.admin) {
      return res.status(401).json({
        success: false,
        error: 'Please sign in to your Second Innings account before booking or making a payment.'
      });
    }
    if (user && !user.onboardingCompleted) {
      return res.status(400).json({
        success: false,
        error: 'Please complete your one-time profile setup right after login before booking.'
      });
    }
    const customerName = String(user?.name || bookingData.name || 'Second Innings Participant').trim();
    const customerPhone = String(user?.phone || bookingData.phone || '').trim();
    const customerEmail = String(user?.email || bookingData.email || 'mentoring@second-innings.in').trim().toLowerCase();

    if (!customerPhone || customerPhone.replace(/[^0-9]/g, '').length < 10) {
      return res.status(400).json({
        success: false,
        error: 'A valid 10-digit mobile / WhatsApp number is required to initiate payment.'
      });
    }

    // Determine payment purpose & exact server-side amount (NEVER trust client price for plans/sessions!)
    let purpose = rawPurpose || 'single_booking';
    let resolvedAmount = settings.sessionFee > 0 ? settings.sessionFee : 500;
    let selectedPlan = null;

    if (planCode && planCode !== 'SINGLE_SESSION') {
      selectedPlan = await SubscriptionPlan.findOne({ code: String(planCode).toUpperCase(), isActive: true });
      if (!selectedPlan) {
        return res.status(404).json({
          success: false,
          error: 'Selected subscription plan is not available.'
        });
      }
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Please sign in to purchase a multi-session or monthly subscription plan.'
        });
      }
      purpose = 'subscription_purchase';
      resolvedAmount = Number(selectedPlan.price);
    } else if (purpose === 'support_contribution' || (customAmount && Number(customAmount) >= 1)) {
      purpose = 'support_contribution';
      resolvedAmount = Number(customAmount);
    } else {
      purpose = 'single_booking';
      const singlePlan = await SubscriptionPlan.findOne({ code: 'SINGLE_SESSION' });
      resolvedAmount = settings.sessionFee > 0
        ? settings.sessionFee
        : (singlePlan?.price || 500);
    }

    if (!resolvedAmount || isNaN(resolvedAmount) || resolvedAmount < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment amount.'
      });
    }

    // Compute 5-minute deduplication fingerprint to block double-clicks even if client changes idempotencyKey
    const fiveMinBucket = Math.floor(Date.now() / (5 * 60 * 1000));
    const dedupFingerprint = computeDedupFingerprint([
      user?._id || customerPhone,
      purpose,
      selectedPlan?.code || 'SINGLE',
      resolvedAmount,
      bookingData.topic || '',
      fiveMinBucket
    ]);

    const effectiveIdempKey = rawIdempKey || `IDEMP_${dedupFingerprint}`;

    // =========================================================================
    // STEP 1: CHECK FOR EXISTING TRANSACTION (IDEMPOTENCY & LIVE PRE-CHECK)
    // =========================================================================
    const existingTx = await PaymentTransaction.findOne({
      $or: [
        { idempotencyKey: effectiveIdempKey },
        {
          dedupFingerprint,
          createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) },
          status: { $in: ['CREATED', 'ACTIVE', 'PAID'] }
        },
        ...(bookingId ? [{ bookingId, status: { $in: ['CREATED', 'ACTIVE', 'PAID'] } }] : [])
      ]
    }).sort({ createdAt: -1 });

    if (existingTx) {
      try {
        const reconciled = await reconcileOrderPayment(existingTx.cashfreeOrderId, 'precheck_reconcile');
        if (reconciled.isPaid) {
          return res.status(200).json({
            success: true,
            alreadyPaid: true,
            message: 'Payment for this session/plan has already been completed!',
            data: {
              alreadyPaid: true,
              bookingId: reconciled.booking?._id || existingTx.bookingId,
              subscriptionId: reconciled.subscription?._id || existingTx.userSubscriptionId,
              orderId: existingTx.cashfreeOrderId,
              amount: existingTx.expectedAmount,
              environment: process.env.CASHFREE_ENVIRONMENT || 'PRODUCTION'
            }
          });
        }

        // If the Cashfree order is still ACTIVE and matches the expected amount, reuse the same session!
        if (
          reconciled.orderStatus === 'ACTIVE' &&
          existingTx.cashfreePaymentSessionId &&
          Number(existingTx.expectedAmount) === Number(resolvedAmount)
        ) {
          return res.status(200).json({
            success: true,
            reusedExistingOrder: true,
            data: {
              bookingId: existingTx.bookingId,
              subscriptionId: existingTx.userSubscriptionId,
              orderId: existingTx.cashfreeOrderId,
              paymentSessionId: existingTx.cashfreePaymentSessionId,
              amount: existingTx.expectedAmount,
              environment: process.env.CASHFREE_ENVIRONMENT || 'PRODUCTION'
            }
          });
        }
      } catch (precheckErr) {
        console.warn('Pre-check on existing Cashfree order warning:', precheckErr.message);
      }
    }

    // =========================================================================
    // STEP 2: CREATE OR PREPARE TARGET RECORD (SUBSCRIPTION OR BOOKING)
    // =========================================================================
    let booking = null;
    let userSub = null;
    let entityShortId = '';

    if (purpose === 'subscription_purchase' && selectedPlan && user) {
      const initialTopic = bookingData.topic ? String(bookingData.topic).trim() : '';
      userSub = await UserSubscription.create({
        userId: user._id,
        planId: selectedPlan._id,
        planCode: selectedPlan.code,
        planName: selectedPlan.name,
        planType: selectedPlan.planType,
        totalCredits: selectedPlan.sessionsCount,
        usedCredits: 0,
        remainingCredits: selectedPlan.sessionsCount,
        amountPaid: resolvedAmount,
        status: 'pending_payment',
        pendingInitialBookingData: initialTopic
          ? {
              name: user.name,
              email: user.email,
              phone: user.phone,
              whatsapp: user.whatsapp || user.phone,
              userType: user.userType || 'student',
              age: user.age,
              ageGroup: user.ageGroup,
              isUnder18: user.isUnder18,
              parentName: user.parentName,
              parentPhone: user.parentPhone,
              parentEmail: user.parentEmail,
              parentConsentConfirmed: user.parentConsentConfirmed,
              whereCurrently: user.whereCurrently,
              institutionOrOrg: user.institutionOrOrg,
              city: user.city,
              source: user.source,
              referredBy: user.referredBy,
              topic: initialTopic,
              usefulGoal: bookingData.usefulGoal || '',
              preferredDate: bookingData.preferredDate || undefined,
              preferredTime: bookingData.preferredTime || undefined
            }
          : null
      });
      entityShortId = userSub._id.toString().slice(-8);
    } else {
      if (bookingId) {
        booking = await Booking.findById(bookingId).select('+slotUpdateToken');
        if (!booking) {
          return res.status(404).json({ success: false, error: 'Booking not found' });
        }
        if (booking.paymentStatus === 'paid') {
          return res.status(200).json({
            success: true,
            alreadyPaid: true,
            data: {
              alreadyPaid: true,
              bookingId: booking._id,
              orderId: booking.cashfreeOrderId,
              amount: booking.paymentAmount,
              environment: process.env.CASHFREE_ENVIRONMENT || 'PRODUCTION'
            }
          });
        }
        booking.paymentRequired = true;
        booking.paymentStatus = 'pending';
        booking.paymentAmount = resolvedAmount;
        await booking.save();
      } else {
        // Compute session number if logged in
        const prevCount = user
          ? await Booking.countDocuments({ userId: user._id, status: { $ne: 'cancelled' } })
          : 0;

        const resolvedUserType = user?.userType || bookingData.userType || 'student';
        const parsedAge = user?.age || (bookingData.age ? Number(bookingData.age) : undefined);
        const isUnder18 = resolvedUserType === 'student' && parsedAge && parsedAge < 18;

        booking = await Booking.create({
          userId: user ? user._id : null,
          sessionNumber: prevCount + 1,
          bookingMode: purpose === 'support_contribution' ? 'support_contribution' : 'single_paid',
          planCode: 'SINGLE_SESSION',
          idempotencyKey: effectiveIdempKey,
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          whatsapp: user?.whatsapp || bookingData.whatsapp || customerPhone,
          userType: resolvedUserType,
          age: parsedAge,
          ageGroup: user?.ageGroup || bookingData.ageGroup || 'other',
          isUnder18: Boolean(user?.isUnder18 ?? isUnder18),
          parentName: user?.parentName || bookingData.parentName,
          parentPhone: user?.parentPhone || bookingData.parentPhone,
          parentEmail: user?.parentEmail || bookingData.parentEmail,
          parentConsentConfirmed: Boolean(user?.parentConsentConfirmed ?? bookingData.parentConsentConfirmed),
          whereCurrently: user?.whereCurrently || bookingData.whereCurrently || '',
          currentStage: user?.whereCurrently || bookingData.whereCurrently || '',
          institutionOrOrg: user?.institutionOrOrg || bookingData.institutionOrOrg || '',
          city: user?.city || bookingData.city || '',
          topic: bookingData.topic || bookingData.concern || 'Mentoring Session',
          concern: bookingData.topic || bookingData.concern || 'Mentoring Session',
          usefulGoal: bookingData.usefulGoal || '',
          preferredDate: bookingData.preferredDate || undefined,
          preferredTime: bookingData.preferredTime || undefined,
          source: user?.source || bookingData.source || '',
          referredBy: user?.referredBy || bookingData.referredBy || '',
          slotUpdateToken: crypto.randomBytes(24).toString('hex'),
          paymentRequired: true,
          paymentStatus: 'pending',
          paymentAmount: resolvedAmount,
          status: 'pending'
        });
      }
      entityShortId = booking._id.toString().slice(-8);
    }

    // =========================================================================
    // STEP 3: CREATE CASHFREE ORDER & RECORD IN PAYMENT TRANSACTION LEDGER
    // =========================================================================
    const randomSuffix = crypto.randomBytes(3).toString('hex');
    const orderId = `SI_${entityShortId}_${randomSuffix}`;
    const frontendOrigin = getTrustedFrontendOrigin(req);

    const statusParams = new URLSearchParams({ order_id: orderId });
    if (booking) statusParams.set('booking_id', booking._id.toString());
    if (userSub) statusParams.set('subscription_id', userSub._id.toString());

    const returnUrl = `${frontendOrigin}/book/status?${statusParams.toString()}`;

    const cfOrder = await createCashfreeOrder({
      orderId,
      amount: resolvedAmount,
      customerId: user ? `usr_${user._id}` : `cust_${entityShortId}`,
      customerName,
      customerPhone,
      customerEmail,
      returnUrl,
      orderNote:
        purpose === 'subscription_purchase'
          ? `Second Innings - ${selectedPlan.name} (${selectedPlan.sessionsCount} Sessions)`
          : 'Second Innings Mentoring Session'
    });

    if (booking) {
      booking.cashfreeOrderId = cfOrder.order_id;
      booking.cashfreePaymentSessionId = cfOrder.payment_session_id;
      if (!Array.isArray(booking.orderHistory)) booking.orderHistory = [];
      booking.orderHistory.push(cfOrder.order_id);
      await booking.save();
    }

    if (userSub) {
      userSub.cashfreeOrderId = cfOrder.order_id;
      await userSub.save();
    }

    await PaymentTransaction.create({
      idempotencyKey: effectiveIdempKey,
      dedupFingerprint,
      cashfreeOrderId: cfOrder.order_id,
      cashfreePaymentSessionId: cfOrder.payment_session_id,
      userId: user ? user._id : null,
      bookingId: booking ? booking._id : null,
      userSubscriptionId: userSub ? userSub._id : null,
      purpose,
      planCode: selectedPlan ? selectedPlan.code : 'SINGLE_SESSION',
      customerName,
      customerPhone,
      customerEmail,
      expectedAmount: resolvedAmount,
      currency: 'INR',
      status: 'ACTIVE'
    });

    res.status(201).json({
      success: true,
      data: {
        bookingId: booking ? booking._id : null,
        subscriptionId: userSub ? userSub._id : null,
        orderId: cfOrder.order_id,
        paymentSessionId: cfOrder.payment_session_id,
        amount: resolvedAmount,
        purpose,
        planCode: selectedPlan ? selectedPlan.code : 'SINGLE_SESSION',
        environment: process.env.CASHFREE_ENVIRONMENT || 'PRODUCTION'
      }
    });
  } catch (error) {
    console.error('Cashfree Create Order Error:', error?.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error?.response?.data?.message || error.message || 'Failed to initiate payment order'
    });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify payment status with Cashfree after checkout redirect or popup completion
// @access  Public / Authenticated User
router.post('/verify', optionalAuth, async (req, res, next) => {
  try {
    const { orderId, bookingId } = req.body;

    let targetOrderId = orderId;
    if (!targetOrderId && bookingId) {
      const b = await Booking.findById(bookingId);
      targetOrderId = b?.cashfreeOrderId;
    }

    if (!targetOrderId) {
      return res.status(400).json({
        success: false,
        error: 'orderId is required to verify payment'
      });
    }

    const result = await reconcileOrderPayment(targetOrderId, 'verify_endpoint');

    const safeBooking = result.booking ? result.booking.toObject() : null;
    const slotUpdateToken = safeBooking?.slotUpdateToken || null;
    if (safeBooking) {
      delete safeBooking.notes;
    }

    res.status(200).json({
      success: true,
      isPaid: result.isPaid,
      duplicatePaymentDetected: Boolean(result.duplicatePaymentDetected),
      orderStatus: result.orderStatus,
      data: safeBooking,
      subscription: result.subscription || null,
      slotUpdateToken,
      paymentDetails: result.paymentDetails || null
    });
  } catch (error) {
    console.error('Cashfree Verify Order Error:', error?.response?.data || error.message);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error?.response?.data?.message || error.message || 'Failed to verify payment status'
    });
  }
});

// @route   PATCH /api/payment/slot-preference/:bookingId
// @desc    Save preferred date & time slot after payment confirmation (Authenticated by user token OR slotUpdateToken)
// @access  Protected (Owner or Slot Token)
router.patch('/slot-preference/:bookingId', optionalAuth, async (req, res, next) => {
  try {
    const { preferredDate, preferredTime, topic, slotUpdateToken } = req.body;

    if (!preferredDate || !preferredTime) {
      return res.status(400).json({
        success: false,
        error: 'Please select both a preferred date and time slot.'
      });
    }

    const booking = await Booking.findById(req.params.bookingId).select('+slotUpdateToken');
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking record not found.'
      });
    }

    // Strict Ownership Check: Must match slotUpdateToken, logged-in userId, or Admin
    const isOwnerByUser = req.user && booking.userId && String(booking.userId) === String(req.user._id);
    const isOwnerByToken =
      slotUpdateToken &&
      booking.slotUpdateToken &&
      crypto.timingSafeEqual(
        Buffer.from(String(slotUpdateToken)),
        Buffer.from(String(booking.slotUpdateToken))
      );
    const isAdmin = Boolean(req.admin);

    if (!isOwnerByUser && !isOwnerByToken && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Not authorized to modify this booking slot.'
      });
    }

    booking.preferredDate = preferredDate;
    booking.preferredTime = String(preferredTime).trim().slice(0, 100);
    if (topic && (!booking.topic || booking.topic === 'Mentoring Session' || booking.topic === 'Support / Session Contribution')) {
      booking.topic = String(topic).trim().slice(0, 1000);
      booking.concern = String(topic).trim().slice(0, 1000);
    }

    await booking.save();

    const safeBooking = booking.toObject();
    delete safeBooking.notes;
    delete safeBooking.slotUpdateToken;

    res.status(200).json({
      success: true,
      message: 'Preferred session slot saved successfully.',
      data: safeBooking
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/payment/webhook
// @desc    Cashfree server-to-server webhook with mandatory raw-body HMAC verification & replay protection
// @access  Cashfree Signed Server Webhook Only
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];
    const rawBody = req.rawBody;

    // 1. Mandatory Header & Raw Body Presence Check
    if (!signature || !timestamp || !rawBody) {
      console.warn('Rejected Cashfree webhook: Missing signature, timestamp, or rawBody');
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Missing webhook signature headers'
      });
    }

    // 2. Replay Attack Window Check (Reject webhooks older than 10 minutes)
    const webhookTimeMs = Number(timestamp);
    if (!isNaN(webhookTimeMs) && webhookTimeMs > 1000000000000) {
      const driftMs = Math.abs(Date.now() - webhookTimeMs);
      if (driftMs > 10 * 60 * 1000) {
        console.warn('Rejected Cashfree webhook: Timestamp outside 10-minute replay window');
        return res.status(401).json({
          success: false,
          error: 'Unauthorized: Webhook timestamp expired'
        });
      }
    }

    // 3. Cryptographic HMAC-SHA256 Verification on Exact Raw Buffer
    const isValid = verifyWebhookSignature(signature, rawBody, timestamp);
    if (!isValid) {
      console.warn('Rejected Cashfree webhook: Invalid cryptographic HMAC signature');
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid webhook signature'
      });
    }

    const eventData = req.body;
    const eventType = eventData?.type || 'UNKNOWN';
    const orderId = eventData?.data?.order?.order_id;
    const cfPaymentId = eventData?.data?.payment?.cf_payment_id || 'none';

    if (!orderId) {
      return res.status(200).json({ received: true, ignored: true });
    }

    // 4. Deduplicate Webhook Event via Unique Key
    const eventKey = `${orderId}_${eventType}_${cfPaymentId}`;
    const existingEvent = await WebhookEvent.findOne({ eventKey });
    if (existingEvent) {
      return res.status(200).json({ received: true, duplicateEvent: true });
    }

    let processedResult = 'IGNORED';
    if (eventType === 'PAYMENT_SUCCESS_WEBHOOK' || eventType === 'ORDER_PAID') {
      const reconciled = await reconcileOrderPayment(orderId, 'webhook');
      processedResult = reconciled.duplicatePaymentDetected
        ? 'DUPLICATE_PAID_FLAGGED'
        : reconciled.isPaid
        ? 'RECONCILED_PAID'
        : 'NOT_PAID';
    } else if (eventType === 'PAYMENT_FAILED_WEBHOOK' || eventType === 'PAYMENT_USER_DROPPED_WEBHOOK') {
      await reconcileOrderPayment(orderId, 'webhook');
      processedResult = 'MARKED_FAILED_OR_DROPPED';
    }

    await WebhookEvent.create({
      eventKey,
      cashfreeOrderId: orderId,
      cashfreePaymentId: String(cfPaymentId),
      eventType,
      signatureVerified: true,
      webhookTimestamp: String(timestamp),
      processedResult,
      payloadSummary: {
        orderAmount: eventData?.data?.order?.order_amount,
        paymentStatus: eventData?.data?.payment?.payment_status
      }
    });

    res.status(200).json({ received: true, status: processedResult });
  } catch (error) {
    console.error('Cashfree Webhook Error:', error.message);
    res.status(500).json({ received: false, error: 'Webhook processing error' });
  }
});

// @route   GET /api/payment/admin/settings
// @desc    Get payment settings, transaction ledger, subscription plans & revenue summary for Admin Panel
// @access  Private (Admin)
router.get('/admin/settings', protectAdmin, async (req, res, next) => {
  try {
    await ensureDefaultPlans();
    const settings = await getPaymentSettings();

    const [
      paidBookings,
      pendingPaymentBookings,
      recentPaymentBookings,
      plans,
      subscriptions,
      recentTransactions,
      duplicateAlerts
    ] = await Promise.all([
      Booking.find({ paymentStatus: 'paid' }).sort({ paymentTime: -1, updatedAt: -1 }),
      Booking.countDocuments({ paymentStatus: 'pending', paymentRequired: true }),
      Booking.find({
        $or: [
          { paymentRequired: true },
          { paymentStatus: { $in: ['paid', 'pending', 'failed', 'refunded', 'credit_redeemed'] } }
        ]
      })
        .sort({ createdAt: -1 })
        .limit(100),
      SubscriptionPlan.find().sort({ sortOrder: 1 }),
      UserSubscription.find({ status: { $in: ['active', 'exhausted', 'expired'] } })
        .populate('userId', 'name email phone city')
        .sort({ createdAt: -1 })
        .limit(100),
      PaymentTransaction.find().sort({ createdAt: -1 }).limit(100),
      PaymentTransaction.find({ status: { $in: ['DUPLICATE_PAID_NEEDS_REFUND', 'AMOUNT_MISMATCH_HOLD'] } }).sort({
        createdAt: -1
      })
    ]);

    const paidTransactions = recentTransactions.filter((t) => t.status === 'PAID');
    const bookingRevenue = paidBookings.reduce((sum, b) => sum + (Number(b.paymentAmount) || 0), 0);
    const txRevenue = paidTransactions.reduce((sum, t) => sum + (Number(t.paidAmount) || 0), 0);
    const totalRevenue = Math.max(bookingRevenue, txRevenue);

    const totalBookingsCount = await Booking.countDocuments();
    const freeBookingsCount = await Booking.countDocuments({
      paymentStatus: { $in: ['not_required', 'credit_redeemed'] }
    });

    const statsObj = {
      totalBookings: totalBookingsCount,
      paidBookings: paidBookings.length,
      freeBookings: freeBookingsCount,
      totalPaidBookings: paidBookings.length,
      totalActiveSubscriptions: subscriptions.filter((s) => s.status === 'active').length,
      pendingPayments: pendingPaymentBookings,
      totalRevenue,
      duplicateAlertsCount: duplicateAlerts.length
    };

    const settingsPayload = {
      paymentsEnabled: settings.paymentsEnabled,
      sessionFee: settings.sessionFee,
      environment: process.env.CASHFREE_ENVIRONMENT || 'PRODUCTION',
      stats: statsObj,
      plans,
      subscriptions,
      duplicateAlerts,
      recentTransactions: recentPaymentBookings,
      gatewayLedger: recentTransactions
    };

    res.status(200).json({
      success: true,
      settings: settingsPayload,
      stats: statsObj,
      gateway: {
        provider: 'Cashfree Payments',
        environment: process.env.CASHFREE_ENVIRONMENT || 'PRODUCTION',
        configured: Boolean(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY)
      },
      data: settingsPayload
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/payment/admin/settings
// @desc    Update payment settings (enable/disable payments & update session fee)
// @access  Private (Admin)
router.put('/admin/settings', protectAdmin, async (req, res, next) => {
  try {
    const { paymentsEnabled, sessionFee } = req.body;

    if (typeof paymentsEnabled === 'boolean') {
      await Setting.findOneAndUpdate(
        { key: 'paymentsEnabled' },
        {
          key: 'paymentsEnabled',
          value: paymentsEnabled,
          description: 'Whether online Cashfree payment is required for session bookings'
        },
        { upsert: true, new: true }
      );
    }

    if (sessionFee !== undefined) {
      const numericFee = Number(sessionFee);
      if (isNaN(numericFee) || numericFee < 0) {
        return res.status(400).json({
          success: false,
          error: 'Session fee must be a valid non-negative number'
        });
      }

      await Setting.findOneAndUpdate(
        { key: 'sessionFee' },
        {
          key: 'sessionFee',
          value: numericFee,
          description: 'Session fee in INR for Second Innings mentoring conversations'
        },
        { upsert: true, new: true }
      );

      // Also sync SINGLE_SESSION plan price
      await SubscriptionPlan.findOneAndUpdate(
        { code: 'SINGLE_SESSION' },
        { price: numericFee, originalPrice: numericFee }
      );
    }

    const updated = await getPaymentSettings();
    res.status(200).json({
      success: true,
      message: 'Payment settings updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
