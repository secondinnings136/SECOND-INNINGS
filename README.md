# SECOND INNINGS

> **"Mentoring Young Minds. Preparing Them for Life Beyond the Classroom."**

A human-led mentoring and perspective platform founded by **Mr. Deepak Sogani** (former Head of Student Affairs at JK Lakshmipat University, 35+ years corporate and entrepreneurial leadership).

---

## 🏗️ Architecture

Second Innings is built as a modular architecture ready for two-part Vercel deployment:

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend:** Express.js API, MongoDB Atlas (Mongoose ODM), Cashfree PG SDK, JWT Authentication, Helmet, Morgan.

---

## 🎨 Brand Design System

- **Dark Slate / Carbon Ink (`#111720`):** Primary brand authority, navigation, headers, dark surfaces.
- **Warm Saffron / Amber (`#D97724`):** Primary action CTAs, highlights, active step indicators, logo accent.
- **Warm Paper (`#FAF7F0`):** Clean editorial canvas and readable background surfaces.
- **Emerald Accent (`#10B981`):** Verified states, confirmed bookings, active indicators.

---

## 🚀 Two-Part Vercel Deployment Guide

### Part 1: Deploy Backend on Vercel
1. On Vercel, click **Add New Project** → Import repository.
2. In **Project Settings**, set **Root Directory** to `backend`.
3. Configure the following **Environment Variables** in the Vercel Dashboard (never commit secret values to Git):
   - `MONGODB_URI`: `<your-mongodb-atlas-connection-string>`
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `<generate-a-secure-random-secret>`
   - `FRONTEND_URL`: `https://<your-frontend-domain>.vercel.app`
   - `CASHFREE_APP_ID`: `<your-cashfree-app-id>`
   - `CASHFREE_SECRET_KEY`: `<your-cashfree-secret-key>`
   - `CASHFREE_ENVIRONMENT`: `PRODUCTION`
4. Click **Deploy**. Copy your backend URL (e.g., `https://api.second-innings.in` or `https://second-innings-backend.vercel.app`).

### Part 2: Deploy Frontend on Vercel
1. On Vercel, click **Add New Project** → Import repository again.
2. In **Project Settings**, set **Root Directory** to `frontend`.
3. Configure the following **Environment Variable**:
   - `NEXT_PUBLIC_API_URL`: `https://<your-backend-domain>.vercel.app/api`
4. Click **Deploy**.

---

## 🛡️ Admin Portal

Platform management portal for Second Innings:
- **URL:** `/admin/login`
- Access is restricted to authorized platform administrators.

### Core Features:
- **Payment & Fee Switch:** Turn mentoring consultation fees ON/OFF dynamically with 1-click.
- **Bookings Management:** Track mentee session requests and 7-day follow-up actions.
- **Curated Opportunities Bank:** Add, edit, feature, and categorize internships, scholarships, and fellowships.
- **Resources & Frameworks:** Publish guidance articles for students and parents.
- **Student & Parent Testimonials:** Review and feature mentee testimonials on the live site.
- **Inquiries & Contacts:** Unified hub for student, parent, and institutional inquiries.
- **Newsletter Subscribers:** View and export subscriber lists.

---

## 💻 Local Development

### 1. Backend Setup
1. Copy `.env.example` to `.env`:
   ```bash
   cd backend
   cp .env.example .env
   ```
2. Fill in your local/cloud database URI and secrets in `.env`.
3. Install dependencies and start server:
   ```bash
   npm install
   npm run dev
   # Running on http://localhost:5000
   ```

### 2. Frontend Setup
1. Install dependencies and start client:
   ```bash
   cd frontend
   npm install
   npm run dev
   # Running on http://localhost:3000
   ```
