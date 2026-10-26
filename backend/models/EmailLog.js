const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema(
  {
    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    workflow: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    recipient: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    from: {
      type: String,
      trim: true
    },
    replyTo: {
      type: String,
      trim: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    provider: {
      type: String,
      default: 'resend'
    },
    providerMessageId: {
      type: String,
      trim: true,
      default: null
    },
    status: {
      type: String,
      enum: [
        'sent',
        'failed',
        'skipped_unverified_domain',
        'skipped_missing_key',
        'skipped_invalid_recipient'
      ],
      required: true,
      index: true
    },
    fallbackSenderUsed: {
      type: Boolean,
      default: false
    },
    attempts: {
      type: Number,
      default: 1
    },
    errorMessage: {
      type: String,
      default: null
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('EmailLog', emailLogSchema);
