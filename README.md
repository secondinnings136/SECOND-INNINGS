# SECOND INNINGS

> **"Mentoring Young Minds. Preparing Them for Life Beyond the Classroom."**

A human-led mentoring and perspective platform founded by **Deepak Sogani** (former Head of Student Affairs at JK Lakshmipat University, 35+ years corporate and entrepreneurial leadership).

---

## 🏗️ Architecture

Second Innings is built as a modular architecture ready for two-part Vercel deployment:

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend:** Express.js API, MongoDB Atlas (Mongoose ODM), JWT Authentication, Helmet, Morgan, Serverless Vercel handler.

---

## 🎨 Brand Color Palette

- **Tea Green (`#BDD9BF`):** Soft growth indicators, outcome pills, verified badges.
- **Charcoal Blue (`#2E4052`):** Primary brand authority, headers, dark cards.
- **Golden Pollen (`#FFC857`):** Primary action CTAs, highlights, active step indicators.
- **White (`#FFFFFF`):** Clean surfaces and readable backgrounds.
- **Midnight Violet (`#412234`):** Gradient terminals and deep quote accents.

---

## 🚀 Two-Part Vercel Deployment Guide

### Part 1: Deploy Backend on Vercel
1. On Vercel, click **Add New Project** → Import `SECOND-INNINGS` repo.
2. In **Project Settings**, set **Root Directory** to `backend`.
3. Add the following **Environment Variables**:
   - `MONGODB_URI`: `mongodb+srv://secondinnings136_db_user:6JZENbgNXijXTlQC@secondinnings.wmknvwb.mongodb.net/secondinnings?retryWrites=true&w=majority`
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `secondinnings_jwt_secret_key_2026_s3cur3`
   - `FRONTEND_URL`: `https://<your-frontend-domain>.vercel.app` (or `*`)
4. Click **Deploy**. Copy your backend URL (e.g., `https://second-innings-backend.vercel.app`).

### Part 2: Deploy Frontend on Vercel
1. On Vercel, click **Add New Project** → Import `SECOND-INNINGS` repo again.
2. In **Project Settings**, set **Root Directory** to `frontend`.
3. Add the following **Environment Variable**:
   - `NEXT_PUBLIC_API_URL`: `https://<your-backend-domain>.vercel.app/api`
4. Click **Deploy**.

---

## 🛡️ Admin Portal

Deepak Sir can manage all platform data without touching any code:
- **URL:** `/admin/login`
- **Default Superadmin:** `deepak@second-innings.in`
- **Password:** `SecondInnings@2026`

Features:
- Bookings management with 7-Day Follow-Up scheduling
- Curated Opportunities Knowledge Bank CRUD
- Mentoring Resources & Articles editor
- Testimonials approvals and reordering
- Newsletter subscriber management with CSV Export

---

## 💻 Local Development

### 1. Backend
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:3000
```
