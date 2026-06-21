# 🌿 Hack2Skill AI Evaluator Project Audit: CarbonTwin AI

This audit evaluates the current state of **CarbonTwin AI** against strict enterprise-level hackathon evaluation criteria. The project has undergone security, testing, and observability updates, but several crucial architectural issues must be resolved to secure a near-perfect score.

---

## 📊 AI Evaluator Scores

| Category | Initial Score | Current Score | Key Evaluation Notes |
| :--- | :---: | :---: | :--- |
| **Code Quality** | 97.5/100 | **98.0/100** | Structured modular components under `src/features/*`. Strict TypeScript configurations, clean state management with Zustand, and React Query integration. Custom hooks are well-isolated. |
| **Security** | 94.0/100 | **97.0/100** | Strict CSP headers in `next.config.ts`, sliding-window rate limiting in middleware, and Zod input validation schemas. Minor vulnerability remains in the stateful nature of the rate limiter. |
| **Efficiency** | 98.0/100 | **98.5/100** | Proper static-site optimizations, optimized font imports, React Query cache-refreshing strategies, and `useDeferredValue` UI throttle controls in the Simulator. |
| **Testing** | 92.5/100 | **96.0/100** | Unit tests cover 56 core assertions, including carbon math functions, Zod schemas, React hooks, and component mounts with Vitest. Playwright E2E coverage validates basic navigation flows. |
| **Accessibility** | 98.5/100 | **98.5/100** | Accessible form labeling, semantic HTML containers, interactive widgets, focus-state visibility, and transition adapters. Screen-reader current route indicators (`aria-current`) are correctly configured. |
| **Problem Statement Alignment** | 99.0/100 | **99.0/100** | Direct solution mapping to digital carbon twins. Complete with onboarding, "what-if" simulator forecasting, LLM OCR receipt scanning, and AI-driven coaching suggestions. |

### 📈 Current Composite Score: **97.83 / 100**

---

## 🏆 Top 5 Remaining Gaps (Obstacles to Score >98.5)

The following 5 technical items represent the remaining high-impact engineering issues in the project. Addressing these will ensure maximum stability, security, and enterprise-grade performance.

### 1. Ephemeral In-Memory Rate Limiting in Serverless Deployments
> [!CAUTION]
> **Impact**: High | **Category**: Security & Efficiency
> **File**: [middleware.ts](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon%20Footprint/src/middleware.ts#L20)
* **Reason**: The sliding-window rate limiter relies on an in-memory javascript `Map` (`rateLimitStore`). Next.js middleware in production runs on stateless Serverless or Edge functions. These environments spin up multiple isolated instances and recycle memory frequently. Consequently, the in-memory map will reset constantly and will not share count state across requests, making the rate limiter easy to bypass under high traffic.
* **Remediation**: Transition from the in-memory Map to a distributed, stateless key-value database such as Upstash Redis or Cloudflare KV to track client tokens consistently.

---

### 2. Client-Side Theme Flashing (FOUC) during SSR Hydration
> [!WARNING]
> **Impact**: Medium-High | **Category**: Code Quality & Accessibility
> **File**: [use-theme.ts](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon%20Footprint/src/hooks/use-theme.ts#L40-L56)
* **Reason**: Theme syncing is performed client-side inside a React `useEffect` in the client provider. Because Next.js server-side renders the page before the client bundle is loaded, the server returns the page in default light mode. Once the client bundle hydates, the `useEffect` runs, detects the stored dark mode or system preference, and appends the `.dark` class to `<html>`. This causes a visual theme "flash" (FOUC) on load for dark mode users.
* **Remediation**: Inject a small, blocking inline `<script>` in the `<head>` of the root [layout.tsx](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon%20Footprint/src/app/layout.tsx) that synchronously reads `localStorage` or `prefers-color-scheme` and adds the `.dark` class before the browser paints the initial HTML structure.

---

### 3. Lack of Timeout/Abort Controller on Upstream Gemini API Requests
> [!IMPORTANT]
> **Impact**: Medium | **Category**: Efficiency & Reliability
> **File**: [gemini.ts](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon%20Footprint/src/lib/gemini.ts#L39)
* **Reason**: Native `fetch` requests inside `callGeminiText` and `callGeminiVision` lack any timeout configurations. If the Gemini API experiences network congestion or transient hang, the connection will block until the cloud platform serverless function execution timeout is reached (often 10s-60s). This stalls client requests, hangs Node event loop cycles, and wastes serverless execution budgets.
* **Remediation**: Use an `AbortController` signal inside the `fetch` configurations to throw a timeout error after 8–10 seconds, forcing the route handlers to drop back to the configured offline local mock data.

---

### 4. Unvalidated File Sizes in Base64 Receipt Scanner
> [!WARNING]
> **Impact**: Medium | **Category**: Security & Code Quality
> **Files**: [receipt-scanner-panel.tsx](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon%20Footprint/src/features/receipts/components/receipt-scanner-panel.tsx#L82) & [schemas.ts](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon%20Footprint/src/features/receipts/schemas.ts#L9)
* **Reason**: The frontend reads uploaded file assets as raw base64 strings and pushes them directly to `/api/platform/receipt` within the JSON body without checking the file size. If a user uploads a high-resolution smartphone image (>4.5MB), the server hosting platform (like Vercel serverless functions) will reject the payload with an HTTP 413 Payload Too Large error, crash the route request, and leave the client application hanging.
* **Remediation**: Implement a file-size validation check on the client input element (rejecting anything larger than 3MB) or add image compression/down-scaling using HTML Canvas before base64 string conversion.

---

### 5. Missing Route-Specific SEO Metadata Overrides
> [!NOTE]
> **Impact**: Low-Medium | **Category**: Accessibility & SEO
> **Directory**: [src/app/(platform)](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon%20Footprint/src/app/(platform))
* **Reason**: Sub-routes like `/simulator`, `/challenges`, `/ai-coach`, and `/forecast` do not export Next.js `metadata` configurations. Consequently, search engine crawlers and browser headers fallback to the generic metadata defined in the root layout. This reduces search crawl rank, ignores social-media card preview optimizations for specific features, and limits browser tab accessibility for multi-tab users.
* **Remediation**: Export custom Next.js `Metadata` blocks on the `page.tsx` entries of all sub-routes to specify descriptive titles (e.g. `"What-If Carbon Simulator | CarbonTwin AI"`).
