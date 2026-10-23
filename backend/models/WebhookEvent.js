const mongoose = require('mongoose');

const webhookEventSchema = new mongoose.Schema({
  eventKey: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  cashfreeOrderId: {
    type: String,
    index: true
  },
  cashfreePaymentId: {
    type: String
  },
  eventType: {
    type: String,
    required: true
  },
  signatureVerified: {
    type: Boolean,
    required: true
  },
  webhookTimestamp: {
    type: String
  },
  processedResult: {
    type: String
  },
  payloadSummary: {
    type: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

module.exports = mongoose.model('WebhookEvent', webhookEventSchema);
