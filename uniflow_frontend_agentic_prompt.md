# Agentic AI Build Prompt — UniFlow (UAMP Frontend)

**Target consumer**: An autonomous coding agent (e.g., Claude Code) tasked with generating a complete, production-grade frontend codebase. This document is the full specification — treat every section as a binding requirement, not a suggestion. Where the agent must make a judgment call not covered here, it should default to the stated design principles, document the decision in a code comment, and proceed rather than halting for clarification.

---

## 1. Project Context

**Project name**: UniFlow
**Parent system**: UAMP (University Admission Management Platform) — Bangladesh
**Purpose**: A public-facing web application through which prospective university students in Bangladesh apply for admission, reserve seats under quota-based allocation, complete payment, download admit cards, and track their live merit list ranking during high-concurrency admission windows.

**Backend context the agent must design against**: A .NET 8 REST API following a service/repository pattern, backed by PostgreSQL, with the following domain concepts already implemented server-side. The frontend must model its state and API layer around this domain — do not invent a different domain model.

| Domain Concept | Server-Side Behavior the UI Must Respect |
|---|---|
| Admission Cycle | Has a fixed `opens_at` / `closes_at` window; UI must reflect countdown states before/after this window |
| Seat Quota | Finite `total_seats` per quota type (general, freedom_fighter, tribal, district_quota, physically_challenged); can reach exhaustion mid-session |
| Application status | State machine: `pending → seat_reserved → payment_pending → confirmed`, with `expired`, `rejected`, `withdrawn` as terminal side-states |
| Seat Reservation | Time-boxed hold (default 15 minutes) that **expires automatically** — UI must show a live countdown and handle expiry gracefully (not just a stale button) |
| Payment | Asynchronous verification — a payment "started" does not mean "confirmed"; UI must support a pending/polling state |
| Merit List | Recalculated continuously server-side (Redis-backed sorted set); UI must treat rank as a live value, not a static one fetched once |
| Admit Card | A PDF, generated asynchronously after payment confirmation — may not be immediately available even after payment succeeds |
| Notifications | SMS/email dispatched server-side; the UI's role is to reflect notification *history*, not to send anything itself |

**Design implication the agent must internalize**: This is not a CRUD dashboard. Several core screens (seat reservation, merit list, application status) represent **values that change without user action**. The frontend must be built around polling/refetch strategies and optimistic-but-correctable UI, not static fetch-once-and-render patterns. Get this wrong and the product misrepresents live state to students during the highest-stakes moment of the admission process — treat this as the primary design constraint, not a secondary concern.

---

## 2. Technology Stack (Non-Negotiable)

| Layer | Choice | Version constraint |
|---|---|---|
| Build tool | Vite | Latest stable |
| Framework | React | 18.x, functional components + hooks only, no class components |
| Language | TypeScript | Strict mode (`"strict": true` in `tsconfig.json`) — no `any` except at documented third-party boundary points |
| Styling | Tailwind CSS | Latest stable, utility-first — no CSS-in-JS libraries, no separate `.css` module files except for the single global stylesheet |
| Routing | React Router | v6.x (data router API — `createBrowserRouter`, not legacy `<Switch>`) |
| Server state | TanStack Query (React Query) | v5.x — mandatory for all API calls. Do not hand-roll `useEffect` + `fetch` data fetching. This is a project-defining decision because of the polling/live-data requirements in Section 1. |
| Client state | Zustand | For auth session and ephemeral UI state only — server data must live in React Query cache, not duplicated into Zustand |
| Forms | React Hook Form + Zod | Zod schemas double as both form validation and TypeScript type inference source |
| HTTP client | Axios | With a centralized instance, interceptors for auth token attachment and 401 handling |
| PDF handling | Native `<a>` download / `window.open` for admit card PDF — do not render PDFs inline unless explicitly asked; a download-triggering link is sufficient and avoids unnecessary PDF.js dependency weight |
| Icons | lucide-react | Consistent icon set, tree-shakeable |
| Date/time | date-fns | For countdown timers, deadline formatting — do not use moment.js (deprecated, heavier) |
| Toast/notifications (UI feedback, not push notifications) | sonner or react-hot-toast | For transient success/error feedback only |

**Explicitly forbidden**: Redux/Redux Toolkit (React Query + Zustand is sufficient for this scope and avoids the boilerplate overhead Redux would add without proportional benefit), CSS frameworks other than Tailwind (Bootstrap, Material UI — conflicts with the custom design system below), class components, `any` type usage without an inline comment justifying it.

---

## 3. Design System

### 3.1 Visual Identity

The product deals with a high-stress, high-stakes process (admission, quota fairness, payment, deadlines). The visual language must communicate **trust, clarity, and calm under pressure** — not a generic SaaS dashboard aesthetic and not a playful consumer-app aesthetic.

| Token | Value | Rationale |
|---|---|---|
| Primary | `#0F4C5C` (deep teal) | Institutional trust without the coldness of pure navy |
| Primary hover | `#0B3A47` | |
| Accent (CTA / urgency) | `#D97706` (amber) | Reserved exclusively for time-sensitive actions (reservation countdown, payment deadline) — do not use amber decoratively elsewhere, or it dilutes its urgency signal |
| Success | `#15803D` | Confirmed status, successful payment |
| Danger | `#B91C1C` | Expired reservation, rejected application, quota exhausted |
| Neutral background | `#F8FAFC` | |
| Surface (cards) | `#FFFFFF` with `shadow-sm` and `border border-slate-200` | |
| Text primary | `#0F172A` | |
| Text secondary | `#64748B` | |

Define these as Tailwind custom theme colors in `tailwind.config.ts`, not inline hex values in components — every color reference in JSX must use a Tailwind class (`bg-primary`, `text-danger`) sourced from the theme, never an arbitrary value bracket (`bg-[#0F4C5C]`) except for one-off illustration work.

### 3.2 Typography

- Primary font: **Inter** (via `@fontsource/inter` or Google Fonts CDN) — strong Bengali-adjacent glyph support and neutral, legible at small sizes for mobile.
- Bengali text support: verify the chosen font renders Bengali script correctly for any bilingual labels (see Section 3.5); if Inter's Bengali coverage is insufficient, fall back to **Noto Sans Bengali** specifically for Bengali-language text nodes via a `font-bengali` utility class.
- Type scale: use Tailwind's default scale (`text-sm` through `text-4xl`) — do not define a custom scale unless a specific screen demonstrably requires it.

### 3.3 Layout Principles

- **Mobile-first, not mobile-adapted.** Build every component starting from a 360px viewport and scale up with `sm:`, `md:`, `lg:` breakpoints — do not design desktop-first and retrofit responsiveness. This matters concretely here: a large proportion of Bangladeshi admission applicants access these systems primarily via mobile data, often on mid-range Android devices with variable network quality.
- Maximum content width `max-w-3xl` for form-heavy screens (application, payment), `max-w-6xl` for data-dense screens (merit list, admin views) — do not let text lines stretch full-width on large monitors.
- Sticky bottom action bar pattern for primary CTAs on mobile (e.g., "Reserve Seat", "Proceed to Payment") — do not bury primary actions below the fold on small screens.

### 3.4 Component Behavior Standards

- Every async action (reserve seat, submit payment, check status) must have three visually distinct states: idle, loading (disabled button + spinner, not just a spinner replacing the label), and error (inline error message adjacent to the action, not only a toast — toasts disappear and this is high-stakes state the student needs to still see).
- Every countdown/timer component (reservation expiry, admission window close) must update client-side every second without a full re-fetch, but must re-sync against server time on mount and after any window visibility change (`document.visibilitychange`) — client clocks drift and cannot be trusted alone for a 15-minute expiry window.
- Skeleton loaders (not spinners) for initial data fetches on data-dense screens (merit list, application list) — spinners are acceptable only for button-level micro-interactions.

### 3.5 Bilingual Consideration

Bangladeshi students span English-medium and Bangla-medium educational backgrounds. Build the UI with **i18n scaffolding from day one** (using `react-i18next`), even if only English strings are populated initially — do not hardcode strings inline in JSX. Structure all user-facing text through a translation key system (`t('application.reserveSeat.cta')`) so Bengali translation can be added later without a refactor. This is a structural requirement, not a "nice to have" — retrofitting i18n after the fact touches every component.

---

## 4. Project Structure

Generate the following structure exactly. Do not deviate from this organization even if an alternative pattern seems marginally cleaner — consistency with the existing backend's service/repository convention (Robin's established pattern) is a project requirement.

```
uniflow-frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── axiosInstance.ts
│   │   ├── endpoints/
│   │   │   ├── auth.api.ts
│   │   │   ├── application.api.ts
│   │   │   ├── seatReservation.api.ts
│   │   │   ├── payment.api.ts
│   │   │   ├── meritList.api.ts
│   │   │   ├── admitCard.api.ts
│   │   │   └── notification.api.ts
│   │   └── types/
│   │       ├── application.types.ts
│   │       ├── payment.types.ts
│   │       ├── meritList.types.ts
│   │       └── common.types.ts
│   ├── assets/
│   ├── components/
│   │   ├── common/           # Button, Input, Card, Badge, Modal, Skeleton, CountdownTimer
│   │   ├── layout/            # AppShell, Header, MobileNav, Footer
│   │   └── feature/
│   │       ├── application/
│   │       ├── seat-reservation/
│   │       ├── payment/
│   │       ├── merit-list/
│   │       ├── admit-card/
│   │       └── notifications/
│   ├── config/
│   │   ├── env.ts
│   │   └── queryClient.ts
│   ├── hooks/
│   │   ├── useCountdown.ts
│   │   ├── useAuth.ts
│   │   ├── useSeatReservationStatus.ts   # polling hook, see Section 6.2
│   │   └── useMeritListPolling.ts
│   ├── i18n/
│   │   ├── config.ts
│   │   └── locales/
│   │       ├── en.json
│   │       └── bn.json
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── dashboard/
│   │   │   └── StudentDashboardPage.tsx
│   │   ├── programs/
│   │   │   ├── ProgramListPage.tsx
│   │   │   └── ProgramDetailPage.tsx
│   │   ├── application/
│   │   │   ├── ApplicationFormPage.tsx
│   │   │   ├── SeatReservationPage.tsx
│   │   │   └── ApplicationStatusPage.tsx
│   │   ├── payment/
│   │   │   ├── PaymentInitiatePage.tsx
│   │   │   └── PaymentStatusPage.tsx
│   │   ├── merit-list/
│   │   │   └── LiveMeritListPage.tsx
│   │   ├── admit-card/
│   │   │   └── AdmitCardPage.tsx
│   │   └── errors/
│   │       ├── NotFoundPage.tsx
│   │       └── SessionExpiredPage.tsx
│   ├── routes/
│   │   ├── router.tsx
│   │   └── ProtectedRoute.tsx
│   ├── stores/
│   │   └── authStore.ts        # Zustand — token, current student profile only
│   ├── utils/
│   │   ├── formatters.ts        # date, currency, phone number display formatting
│   │   ├── phoneValidation.ts   # BD phone normalization (see Section 8.3)
│   │   └── constants.ts
│   ├── validators/
│   │   ├── application.schema.ts   # Zod schemas
│   │   ├── auth.schema.ts
│   │   └── payment.schema.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

**Naming convention enforcement**: `PascalCase` for components and their files (`SeatReservationCard.tsx`), `camelCase` for hooks/utils (`useCountdown.ts`), `*.api.ts` suffix for API modules, `*.schema.ts` suffix for Zod validators, `*.types.ts` for pure type definition files. Do not mix concerns — a `.api.ts` file must not contain UI logic, a `.schema.ts` file must not contain API calls.

---

## 5. API Integration Contract

The agent must implement the API layer against these exact endpoint shapes. Do not infer or invent alternate response fields — if a field is needed that isn't listed, add a `// TODO: confirm with backend` comment rather than guessing a shape.

### 5.1 Authentication

```
POST /v1/auth/register
POST /v1/auth/login
```

Request/Response for login:
```json
// Request
{ "phone": "+8801712345678", "password": "string" }

// Response 200
{ "token": "jwt...", "student": { "id": "uuid", "fullName": "string", "phone": "string" } }
```

### 5.2 Seat Reservation

```
POST /v1/applications/{id}/reserve-seat
```
```json
// Response 200
{
  "reservationId": "res_01HXYZ",
  "quotaType": "general",
  "expiresAt": "2026-07-06T10:30:00Z",
  "paymentDeadlineMinutes": 15
}

// Response 409 — quota exhausted
{ "error": "QUOTA_EXHAUSTED", "message": "No seats remaining in general quota for this program." }
```

**Frontend requirement**: On `409 QUOTA_EXHAUSTED`, the UI must not present this as a generic error toast — render a dedicated inline state explaining the quota is full and, if the backend exposes it, surface alternate quota eligibility or a waitlist option. A silent generic error here is a critical UX failure given the stakes involved.

### 5.3 Payment

```
POST /v1/payments/initiate
GET  /v1/payments/{id}/status
```

**Frontend requirement**: After initiating payment (redirect to MFS provider or embedded flow, per whatever the backend specifies), the status must be **polled**, not assumed. Use React Query's `refetchInterval` (e.g., every 3 seconds) on the payment status query, with a maximum polling duration (e.g., 5 minutes) after which the UI prompts the student to check back later or contact support rather than polling indefinitely.

### 5.4 Live Merit List

```
GET /v1/cycles/{cycleId}/merit-list?quota=general&page=1
```
```json
{
  "quota": "general",
  "totalCandidates": 4820,
  "results": [
    { "rank": 1, "studentId": "std_...", "meritScore": 98.75, "status": "confirmed" }
  ]
}
```

**Frontend requirement**: This screen must poll on an interval (default every 10–15 seconds, configurable via `.env`) while mounted, and must visibly indicate "Live" status (e.g., a small pulsing dot + "Updated Xs ago" label) so students trust the data is current rather than assuming a stale snapshot. Pause polling when the browser tab is not visible (`document.visibilitychange`) to avoid wasted requests, and resume + immediately refetch on return to foreground.

### 5.5 Admit Card

```
GET /v1/applications/{id}/admit-card
```
```json
// 200 — available
{ "pdfUrl": "https://.../admit-cards/xyz.pdf", "rollNumber": "string", "examDate": "2026-08-01" }

// 202 — not yet generated
{ "status": "PENDING", "message": "Your admit card is being generated." }
```

**Frontend requirement**: Handle the `202` case as a first-class UI state (not an error) — show a "generation in progress" message with an option to refresh, since admit card generation is asynchronous per the backend design in Section 1.

---

## 6. Feature-Specific Implementation Requirements

### 6.1 Application Form

- Multi-step form (personal info → academic history → quota selection → review) using React Hook Form's `useForm` with a single Zod schema split via `.pick()` per step — do not build separate disconnected forms per step, as this fragments validation state.
- Persist in-progress form state to `sessionStorage` (not `localStorage` — this is per-session sensitive PII, should not survive browser restarts) so a student who accidentally navigates away doesn't lose progress.

### 6.2 Seat Reservation & Countdown

- Build a reusable `useCountdown(expiresAt: string)` hook returning `{ minutes, seconds, isExpired }`, re-synced against server time on mount.
- On `isExpired === true`, the UI must **immediately** disable any payment-proceed action and display a clear "Reservation expired — seat released" state with a call-to-action to re-attempt reservation (if quota still has availability) — do not leave a stale "Proceed to Payment" button clickable after client-side expiry, even for the few seconds before a server round-trip confirms it. This is the single most important UX correctness requirement in the entire application, since a student acting on a stale UI state here has real financial and admission consequences.

### 6.3 Payment Status Polling

- Implement `useSeatReservationStatus` and `usePaymentStatus` as dedicated hooks wrapping React Query with `refetchInterval`, not ad hoc polling scattered across components — centralize this logic once and reuse.

### 6.4 Live Merit List

- Virtualize the results list if `totalCandidates` exceeds ~200 rows (use `@tanstack/react-virtual`) to keep mobile scroll performance acceptable — do not render thousands of DOM rows unvirtualized.
- Highlight the current logged-in student's own row distinctly (background tint) so they don't have to hunt for their rank in a long list.

### 6.5 Admit Card

- Download button must trigger a native file download (`<a download>` or `window.open` with the signed URL) — do not attempt to fetch-and-blob the PDF client-side unless the backend requires authenticated PDF retrieval (in which case, fetch as blob via Axios with auth headers, then create an object URL for download).

---

## 7. Error Handling & Resilience

- Global Axios response interceptor: on `401`, clear the Zustand auth store and redirect to `/login` with a return-to path preserved in query params.
- Global Axios response interceptor: on `5xx` or network failure, do not surface raw error messages — map to a generic "Something went wrong, please try again" with a retry action, logging the raw error to console (and to an error-tracking service if one is later integrated).
- React Query global `onError` for mutations should trigger a toast; for queries powering critical live state (merit list, reservation countdown), a failed refetch should **not** silently show stale data indefinitely — after 3 consecutive failed refetch attempts, surface a visible "connection issue, data may be outdated" banner on that screen.

---

## 8. Validation Requirements (Zod Schemas)

### 8.1 Application Schema (excerpt)

```typescript
/**
 * Validation schema for the academic history step of the application form.
 * Merit score fields are read-only/pre-filled from board results where
 * available, but validated defensively in case of manual entry fallback.
 */
export const academicHistorySchema = z.object({
  sscGpa: z.number().min(0).max(5.0),
  hscGpa: z.number().min(0).max(5.0),
  boardName: z.string().min(2, "Board name is required"),
  passingYear: z.number().int().min(2015).max(new Date().getFullYear()),
});
```

### 8.2 Quota Selection Schema

```typescript
export const quotaSelectionSchema = z.object({
  quotaType: z.enum([
    "general",
    "freedom_fighter",
    "tribal",
    "district_quota",
    "physically_challenged",
  ]),
  supportingDocumentUrl: z.string().url().optional(),
}).refine(
  (data) => data.quotaType === "general" || !!data.supportingDocumentUrl,
  { message: "Supporting document is required for non-general quotas", path: ["supportingDocumentUrl"] }
);
```

### 8.3 Phone Number Normalization

The agent must implement a dedicated utility, not inline regex scattered across forms:

```typescript
/**
 * Normalizes a Bangladeshi phone number into E.164 format (+8801XXXXXXXXX).
 * Accepts common input variants: 01XXXXXXXXX, 8801XXXXXXXXX, +8801XXXXXXXXX,
 * and inputs with spaces or dashes.
 *
 * @param rawInput Raw user-entered phone number string.
 * @returns Normalized E.164 string, or null if the input cannot be parsed
 *          as a valid BD mobile number.
 */
export function normalizeBdPhoneNumber(rawInput: string): string | null {
  const digitsOnly = rawInput.replace(/[\s-]/g, "");

  const patterns = [
    /^(\+?880)?1[3-9]\d{8}$/, // covers 01XXXXXXXXX and 880/+880 prefixed
  ];

  const matches = patterns.some((pattern) => pattern.test(digitsOnly));
  if (!matches) return null;

  const localDigits = digitsOnly.replace(/^(\+?880)?/, "");
  return `+880${localDigits}`;
}
```

This function must be unit-tested by the agent (Vitest) against the variant formats listed in the docstring — this is a correctness-critical utility given it underpins identity matching across the entire admission flow.

---

## 9. Accessibility & Performance Baseline

- All interactive elements keyboard-navigable; countdown timers and live-updating regions must use `aria-live="polite"` so screen readers announce changes without being disruptive.
- Lighthouse mobile performance target: **90+** on the Seat Reservation and Merit List pages specifically — these are the highest-traffic, highest-stress screens and must load fast on constrained mobile networks. Use route-based code splitting (`React.lazy` + `Suspense`) per page.
- Form inputs must have explicit `<label>` elements (not placeholder-only labels) — placeholder-as-label is an accessibility anti-pattern and a common React Hook Form implementation mistake to avoid.

---

## 10. Environment Configuration

```
# .env.example
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_MERIT_LIST_POLL_INTERVAL_MS=12000
VITE_PAYMENT_POLL_INTERVAL_MS=3000
VITE_PAYMENT_POLL_TIMEOUT_MS=300000
VITE_RESERVATION_WARNING_THRESHOLD_SECONDS=120
```

Polling intervals and thresholds must be environment-configurable, not hardcoded magic numbers in components — this allows tuning under real load-test observation without a code change.

---

## 11. Explicit Non-Goals (Scope Boundaries for the Agent)

To keep the agent from over-building:

- No admin/university-staff dashboard in this prompt — this document covers the **student-facing** application only. Admin views are a separate, later deliverable.
- No real payment gateway SDK integration — implement against the API contract in Section 5.3 assuming the backend abstracts the actual MFS provider; do not embed bKash/Nagad SDKs directly in the frontend.
- No offline-first / PWA service worker requirements unless explicitly requested later — do not add this speculatively.
- No real-time WebSocket/SignalR connection for the merit list — polling per Section 6.4 is the specified approach for this iteration; do not substitute a different real-time mechanism unprompted.

---

## 12. Deliverable Expectations

The agent should produce a fully buildable Vite + React + TypeScript project matching the structure in Section 4, with:
1. All listed pages scaffolded with realistic (not placeholder-lorem) UI matching the design system in Section 3.
2. The API layer in Section 5 implemented with typed Axios calls and corresponding React Query hooks.
3. Zod schemas from Section 8 wired into React Hook Form on their respective steps.
4. The `normalizeBdPhoneNumber` utility with accompanying Vitest unit tests.
5. A `README.md` in the generated project root documenting setup steps, environment variables, and the polling-interval rationale — so the project is handoff-ready, not just runnable by the person who built it.

If any requirement in this document conflicts with a technical constraint the agent discovers during implementation (e.g., a library incompatibility), the agent should resolve it in favor of the stated design principles in Section 1 and 3, document the deviation with a code comment explaining the trade-off, and continue — not halt for clarification.
