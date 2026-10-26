const mongoose = require('mongoose');

const sessionSummarySchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    participantKey: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    studentName: {
      type: String,
      trim: true,
      required: true
    },
    studentEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    mentorName: {
      type: String,
      default: 'Mr. Deepak Sogani'
    },
    sessionNumber: {
      type: Number,
      default: 1
    },
    sessionDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'ready', 'failed', 'reviewed'],
      default: 'pending',
      index: true
    },
    sourceType: {
      type: String,
      enum: ['google_meet_notes', 'google_meet_transcript', 'mentor_notes', 'hybrid'],
      default: 'mentor_notes'
    },
    // Consent & Privacy tracking
    consentRecorded: {
      type: Boolean,
      default: false
    },
    consentMode: {
      type: String,
      enum: ['ai_notes_consented', 'mentor_notes_fallback'],
      default: 'mentor_notes_fallback'
    },
    // Original raw input (access-controlled: never sent to students)
    rawSourceText: {
      type: String,
      select: false,
      default: ''
    },
    sourceHash: {
      type: String,
      index: true,
      default: ''
    },

    // =========================================================================
    // 9 Required Structured Summary Sections (Non-Hallucinating)
    // =========================================================================
    // 1. Session Date & Session Number are stored above (`sessionDate`, `sessionNumber`)

    // 2. Student's goals and concerns explicitly discussed
    goalsAndConcernsDiscussed: {
      type: String,
      default: 'Unavailable — not explicitly recorded in session notes.'
    },
    // 3. Key topics and perspectives explored
    keyTopicsAndPerspectives: {
      type: String,
      default: 'Unavailable — not explicitly recorded in session notes.'
    },
    // 4. Important observations (distinguishing factual statements from interpretations)
    importantObservations: {
      factualStatements: {
        type: String,
        default: 'Unavailable — not explicitly recorded in session notes.'
      },
      mentorInterpretations: {
        type: String,
        default: 'Unavailable — not explicitly recorded in session notes.'
      }
    },
    // 5. Goals or actions agreed upon by the student
    agreedActions: {
      type: String,
      default: 'Unavailable — not explicitly recorded in session notes.'
    },
    // 6. Progress reported on actions from the previous session
    progressFromPreviousSession: {
      type: String,
      default: 'Unavailable — no previous session action progress recorded.'
    },
    // 7. Unresolved questions and topics to revisit
    unresolvedQuestions: {
      type: String,
      default: 'Unavailable — not explicitly recorded in session notes.'
    },
    // 8. Suggested opening questions for the next session
    suggestedOpeningQuestions: [
      {
        type: String
      }
    ],
    // 9. Short private mentor preparation brief (Strictly private to mentor/admin)
    privateMentorPrepBrief: {
      type: String,
      default: 'Unavailable — not explicitly recorded in session notes.'
    },

    // Review & Approval Workflow
    isApproved: {
      type: Boolean,
      default: false
    },
    reviewedByAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    },
    generationMethod: {
      type: String,
      enum: ['deterministic_structured', 'gemini_assisted', 'manual_mentor_edit'],
      default: 'deterministic_structured'
    },
    lastError: {
      type: String,
      default: null
    },
    retentionExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 12-month default retention
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SessionSummary', sessionSummarySchema);
