const mongoose = require('mongoose');

const googleIntegrationSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'primary_mentor_calendar',
      unique: true,
      index: true
    },
    status: {
      type: String,
      enum: ['disconnected', 'connected', 'revoked_or_expired', 'error'],
      default: 'disconnected'
    },
    connectedEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    connectedName: {
      type: String,
      trim: true,
      default: ''
    },
    calendarId: {
      type: String,
      trim: true,
      default: 'primary'
    },
    scopes: [
      {
        type: String
      }
    ],
    // Encrypted OAuth tokens (AES-256-GCM) — never selected by default
    refreshTokenEncrypted: {
      type: String,
      select: false,
      default: null
    },
    accessTokenEncrypted: {
      type: String,
      select: false,
      default: null
    },
    tokenExpiryDate: {
      type: Date,
      default: null
    },
    // Short-lived CSRF OAuth state nonce hash
    pendingOAuthStateHash: {
      type: String,
      select: false,
      default: null
    },
    pendingOAuthStateExpiresAt: {
      type: Date,
      default: null
    },
    pendingOAuthRedirectUri: {
      type: String,
      default: null
    },
    connectedByAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null
    },
    connectedAt: {
      type: Date,
      default: null
    },
    lastUsedAt: {
      type: Date,
      default: null
    },
    lastError: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('GoogleIntegration', googleIntegrationSchema);
