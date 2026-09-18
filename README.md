# Trimora — AI-Powered Digital Platform for Salons & Stylists

> **"Your Style. Your Salon. Your AI."**

Trimora is a modern, luxury, full-stack web platform engineered for boutique salons, barbershops, and Instagram-first hair stylists. It connects guest discovery, grounded RAG conversational AI, the **Trimora StyleScan** face analysis and hairstyle recommendation engine, and effortless appointment booking with an owner management dashboard.

---

## 🌟 Core Pillars & Key Features

### 1. Luxury Public Presence & Landing Experience
- **Minimal Luxury Aesthetic**: Warm ivory (`#FAF8F5`), charcoal (`#1C1917`), rich taupe, and brushed bronze/gold (`#C5A880`) styling with glassmorphism and micro-interactions.
- **7 Comprehensive Sections**: Hero with live visual simulations, *How Trimora Works* 4-step journey, *AI Salon Assistant* RAG breakdown, *StyleScan Face AI* showcase, *Salon Management* overview, *Appointment Booking* journey, and *For Salon Owners* ROI breakdown.
- **Dynamic Salon Discovery (`/salon/[slug]`)**: Profile cover banners, logos, categorized service menus with durations and prices, promotional offers with promo codes, verified badges, and client reviews.

### 2. AI RAG Chatbot (Zero-Hallucination Salon Concierge)
- **Strict Grounding Pipeline**: Documents → Text Chunking (with overlap) → Vector Cosine Similarity Search → Context Retrieval → Grounded Response Generation.
- **Anti-Hallucination Guardrails**: Adheres strictly to:
  > *"I don't have that information yet. Please contact the salon for confirmation."*
  Never fabricates unlisted prices, operating hours, or policies.
- **Interactive Conversion**: Automatically triggers contextual `[Book Appointment]` buttons right inside the chat window when booking intent is detected.
- **Floating Widget & Full Window**: Suggested prompt pills, real-time typing indicators, source citations, and clear-chat functionality.

### 3. Trimora StyleScan (AI Face Analysis & Hairstyle Advisor)
- **Privacy-First Ethics**: Clear consent gate before analysis; no permanent photo storage; no biometric tracking or sensitive attribute inferences; instant photo purge button.
- **Dual Capture**: Upload photos or capture directly with live mirrored webcam.
- **Customizable Preferences**: Desired length (Short / Medium / Long / Any), aesthetic vibe (Trendy / Professional / Casual / Traditional), maintenance commitment, and natural hair texture.
- **Hairstyle Recommendation Cards**: Match score percentages, geometric harmony explanations ("Why it suits your features"), styling effort scores, maintenance notes, and direct **"Book This Style"** button that passes consultation notes directly to the reservation.

### 4. Appointment Booking System
- **Customer Reservation Journey**: Service selection, dynamic 14-day date picker, arrival time window selection, contact details, and instant reference code (`TRM-XXXX`).
- **Status Lifecycle**: `Pending` → `Confirmed` → `Completed` → `Cancelled`.
- **Owner Dispatch**: Filter by date and status, 1-click status updates, customer phone/email details, and internal stylist notes.

### 5. Salon Owner Admin Portal (`/dashboard`)
- **Overview**: Real-time KPI summary cards (Total bookings, pending reviews, active services, knowledge chunks) and recent requests.
- **Salon Profile Management**: Edit branding, bio, address, Instagram URL, and weekday opening hours.
- **Service Catalog CRUD**: Add, edit, delete, and toggle active visibility for menu items.
- **Promotions & Offers**: Create and manage limited-time discount codes and expiry dates.
- **Knowledge Base Studio**: Ingest `.txt`, `.md`, `.faq`, `.pdf` documents into vectorized chunks, with a built-in **RAG Test Playground** to simulate client questions and verify retrieved chunks on the spot.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: Next.js REST Route Handlers (`/api/...`), Node.js runtime.
- **Database & Storage**: Relational engine matching Supabase/PostgreSQL schema (`users`, `salons`, `services`, `offers`, `appointments`, `knowledge_documents`, `knowledge_chunks`).
- **AI Vector Search**: Cosine similarity & TF-IDF term vectorizer with extension points for OpenAI `text-embedding-3-small` / Google Gemini Embeddings.
- **AI Vision**: Modular `FaceAnalysisEngine` with geometric proportion heuristics and extension points for Gemini 1.5 Flash / GPT-4o Vision.

---

## 🚀 Quick Start & Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧭 Key Routes

| Route | Description |
|---|---|
| `/` | Modern landing page with all 7 feature sections |
| `/stylescan` | Trimora StyleScan AI face analysis & hairstyle recommendations |
| `/salon/luxe-studio` | Active luxury salon showcase profile with chatbot and booking |
| `/salon/atelier-delacroix` | Empty-state salon demo (test "Add first service" experience) |
| `/dashboard` | Salon owner admin overview |
| `/dashboard/services` | Service catalog & pricing management |
| `/dashboard/appointments` | Appointment requests & status manager |
| `/dashboard/knowledge` | RAG document ingestion & live retrieval sandbox |
| `/dashboard/offers` | Promotional offers & discounts |
| `/dashboard/profile` | Salon branding, location & operating hours |
| `/login` | Authentication & 1-click evaluation demo access |
