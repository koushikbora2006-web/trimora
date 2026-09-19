# Trimorva — AI-Powered Digital Salon Platform (Flagship: John Salon)

> **Application Name**: Trimorva  
> **Shop / Salon Name**: John Salon (Kakinada)  
> **Tagline**: *"Your Style. Your Salon. Your AI."*

**Trimorva** is a modern, luxury, full-stack web application platform engineered for premium salons, barbershops, and beauty spa sanctuaries, featuring **John Salon** as its verified flagship atelier. It seamlessly connects guest discovery, grounded RAG conversational AI, the **Trimorva StyleScan** face analysis and hairstyle recommendation engine, and appointment booking with an owner management dashboard.

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

### 5. Customer Relationship Management (CRM) System (`/dashboard/crm`)
- **360° Client Profiles**: Contact details, preferred stylist, visit frequency, lifetime spend, average ticket size, and VIP status.
- **Dynamic Tiering**: Auto-computed badges (`VIP`, `Regular`, `At-Risk`, `New`, `Churned`) based on visit patterns and recency.
- **Client History & Timeline**: Comprehensive appointment history, service records, notes with color tags, and activity feed.
- **CRM Analytics**: VIP retention rates, churn risk alerts, customer acquisition metrics, top spending clients, and revenue breakdowns.
- **Data Export & Actions**: Instant CSV customer export, direct contact options, and quick booking links.

### 6. Brevo Email OTP Authentication (`/login`)
- **Transactional Email Delivery**: Brevo (formerly Sendinblue) v3 SMTP REST API integration.
- **Two-Step Secure Flow**: Enter email -> receive 6-digit numeric OTP with 10-minute expiry -> auto-advancing verification boxes.
- **Dark Luxury Email Template**: Styled HTML email featuring Trimora gold-accented branding, security notices, and expiration timer.
- **Evaluation Demo Access**: 1-click instant login options for administrative testing without waiting for an email.

### 7. Salon Owner Admin Portal (`/dashboard`)
- **Overview**: Real-time KPI summary cards (Total bookings, active clients, monthly revenue, pending reviews) and recent requests.
- **Salon Profile Management**: Edit branding, bio, address, Instagram URL, and weekday opening hours.
- **Service Catalog CRUD**: Add, edit, delete, and toggle active visibility for menu items.
- **Promotions & Offers**: Create and manage limited-time discount codes and expiry dates.
- **Knowledge Base Studio**: Ingest `.txt`, `.md`, `.faq`, `.pdf` documents into vectorized chunks, with a built-in **RAG Test Playground**.
- **Admin Alias (`/admin`)**: Seamlessly redirects administrators directly to the primary operations center.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: Next.js REST Route Handlers (`/api/...`), Node.js runtime.
- **Database & Storage**: Dual-tier architecture featuring zero-config persistent local relational engine and **Supabase (PostgreSQL)** with complete migration schemas and Row Level Security (RLS).
- **Email Delivery**: Brevo REST API v3 for high-deliverability transactional OTP authentication.
- **AI Vector Search**: Cosine similarity & TF-IDF term vectorizer with extension points for OpenAI `text-embedding-3-small` / Google Gemini Embeddings.
- **AI Vision**: Modular `FaceAnalysisEngine` with geometric proportion heuristics and extension points for Gemini 1.5 Flash / GPT-4o Vision.

---

## 🗄️ Database Migrations (Supabase)

Located under `supabase/migrations/`:
1. `001_initial_schema.sql` — Salons, services, offers, appointments, knowledge base schema.
2. `002_customer_crm.sql` — Customers, notes, activities, client preference tables.
3. `003_customer_rls.sql` — Row-Level Security policies ensuring tenant salon data isolation.

---

## 🚀 Quick Start & Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and configure your API keys:
```bash
cp .env.example .env
```

### 3. Start the Development Server
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
| `/login` | 2-step Brevo Email OTP authentication & 1-click evaluation access |
| `/admin` | Administrator redirect to dashboard operations center |
| `/dashboard` | Salon owner admin overview |
| `/dashboard/crm` | Customer Relationship Management (CRM) directory |
| `/dashboard/crm/analytics`| CRM analytics, retention metrics, and VIP insights |
| `/dashboard/crm/new` | Manual customer creation form |
| `/dashboard/crm/[id]` | Comprehensive 360° client profile and history |
| `/dashboard/services` | Service catalog & pricing management |
| `/dashboard/appointments` | Appointment requests & status manager |
| `/dashboard/knowledge` | RAG document ingestion & live retrieval sandbox |
| `/dashboard/offers` | Promotional offers & discounts |
| `/dashboard/profile` | Salon branding, location & operating hours |
