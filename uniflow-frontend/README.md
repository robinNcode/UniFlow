# UniFlow Frontend

Student-facing web application for the **UAMP (University Admission Management Platform)** — Bangladesh.

Enables prospective university students to apply for admission, reserve seats under quota-based allocation, complete payment, download admit cards, and track their live merit list ranking.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Build | Vite 8 |
| Framework | React 19 (functional components + hooks only) |
| Language | TypeScript 6 (strict mode) |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 (data router / `createBrowserRouter`) |
| Server state | TanStack Query v5 |
| Client state | Zustand |
| Forms | React Hook Form + Zod |
| HTTP | Axios (centralized instance with interceptors) |
| i18n | react-i18next (English + Bengali scaffolded) |
| Icons | lucide-react |
| Date/time | date-fns |
| Toasts | sonner |
| Tests | Vitest + Testing Library |
| Virtualization | @tanstack/react-virtual |

---

## Setup

### Prerequisites
- Node.js v22 (use `nvm use 22`)
- Backend running at the URL configured in `.env`

### Install

```bash
nvm use 22
npm install
```

### Environment

```bash
cp .env.example .env
# Edit VITE_API_BASE_URL to point to your backend
```

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:5000/api/v1` | Backend REST API base URL |
| `VITE_MERIT_LIST_POLL_INTERVAL_MS` | `12000` | Merit list refetch interval (ms) |
| `VITE_PAYMENT_POLL_INTERVAL_MS` | `3000` | Payment status poll interval (ms) |
| `VITE_PAYMENT_POLL_TIMEOUT_MS` | `300000` | Max payment polling duration before prompting user (ms) |
| `VITE_RESERVATION_WARNING_THRESHOLD_SECONDS` | `120` | Seconds before reservation expiry at which urgent styling kicks in |

### Run

```bash
npm run dev      # Dev server on :3000 with proxy to backend
npm run build    # Production build
npm run test     # Unit tests (Vitest)
```

---

## Polling Architecture

This app is built around polling/refetch strategies rather than static fetch-once-and-render, because several core domain values (merit list rank, seat reservation expiry, payment status) change without user action.

| Screen | Polling interval | Stop condition |
|---|---|---|
| Merit List | `VITE_MERIT_LIST_POLL_INTERVAL_MS` (default 12s) | Paused when tab hidden; resumes + immediate refetch on return |
| Payment Status | `VITE_PAYMENT_POLL_INTERVAL_MS` (default 3s) | Stops at `confirmed` or `failed`, or after `VITE_PAYMENT_POLL_TIMEOUT_MS` |
| Seat Reservation Status | 5s | Stops at `expired` or `completed` |
| Application Status | 10s | Stops at terminal states (`confirmed`, `rejected`, `withdrawn`, `expired`) |

All polling intervals are configurable via `.env` so they can be tuned under real load without a code change.

---

## Countdown Timer Design

The `useCountdown(expiresAt)` hook and `CountdownTimer` component:

1. Update every second client-side (no network call per tick)
2. Re-sync against server-provided `expiresAt` on mount
3. Re-sync on `document.visibilitychange` — client clocks drift and cannot be trusted for 15-minute windows
4. On `isExpired`, the UI immediately disables payment actions even before a server round-trip confirms it

This is the single most critical UX correctness requirement — a stale "Proceed to Payment" button after expiry has real financial and admission consequences.

---

## Project Structure

```
src/
├── api/                  # Axios instance + typed endpoint modules + domain types
├── components/
│   ├── common/           # Button, Input, Card, Badge, Modal, Skeleton, CountdownTimer
│   └── layout/           # AppShell, Header, MobileNav, Footer
├── config/               # env.ts, queryClient.ts
├── hooks/                # useCountdown, useAuth, useSeatReservationStatus, useMeritListPolling
├── i18n/                 # react-i18next config + en.json + bn.json (Bengali scaffolded)
├── pages/                # One folder per feature domain
├── routes/               # createBrowserRouter + ProtectedRoute
├── stores/               # Zustand auth store
├── utils/                # formatters, phoneValidation, constants
└── validators/           # Zod schemas (auth, application, payment)
```

---

## i18n

All user-facing strings are keyed through `react-i18next`. Bengali translation keys are scaffolded in `src/i18n/locales/bn.json`. To add Bengali translations, populate the values there — no component changes required.

---

## Phone Number Handling

BD phone numbers are normalized to E.164 (`+8801XXXXXXXXX`) via `normalizeBdPhoneNumber()` in `src/utils/phoneValidation.ts` before API calls. Unit-tested in `src/__tests__/phoneValidation.test.ts` — run with `npm run test`.

---

## Quota Types

| Value | Label |
|---|---|
| `general` | General |
| `freedom_fighter` | Freedom Fighter |
| `tribal` | Tribal |
| `district_quota` | District Quota |
| `physically_challenged` | Physically Challenged |

Non-general quotas require a `supportingDocumentUrl` — enforced by Zod schema at the quota selection step.
