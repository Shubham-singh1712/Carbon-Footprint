import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";
import { getSupabaseBrowserConfig } from "@/lib/env";

const protectedPaths = [
  "/dashboard",
  "/ai-coach",
  "/receipt-scanner",
  "/simulator",
  "/forecast",
  "/challenges",
  "/impact",
];

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();
const LIMIT = 15;
const WINDOW_MS = 60 * 1000;

function getClientIdentifier(request: NextRequest): string {
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    return `session:${authHeader}`;
  }

  const token = request.cookies.get("sb-access-token")?.value;
  if (token) {
    return `session:${token}`;
  }

  const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
  return `ip:${ip}`;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isRateLimitedRoute = pathname === "/api/platform/coach" || pathname === "/api/platform/receipt";

  if (isRateLimitedRoute) {
    const key = `${getClientIdentifier(request)}:${pathname}`;
    const now = Date.now();
    const windowStart = now - WINDOW_MS;

    const record = rateLimitStore.get(key) || { timestamps: [] };
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (record.timestamps.length >= LIMIT) {
      const oldestTimestamp = record.timestamps[0];
      const retryAfterSeconds = Math.max(1, Math.ceil((oldestTimestamp + WINDOW_MS - now) / 1000));

      return new NextResponse(
        JSON.stringify({
          error: "Rate limit exceeded",
          retryAfter: retryAfterSeconds,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfterSeconds),
          },
        }
      );
    }

    record.timestamps.push(now);
    rateLimitStore.set(key, record);
  }

  const config = getSupabaseBrowserConfig();

  /* Demo mode — allow all routes */
  if (!config) {
    return NextResponse.next();
  }

  /* Supabase configured — refresh session */
  const response = await updateSupabaseSession(request);

  /* Check if user is visiting a protected path */
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (isProtected) {
    /* The session was already refreshed in updateSupabaseSession.
     * For actual enforcement, the getUser call in the middleware
     * refresh handles token validation. If the user has no valid
     * session, Supabase returns null — but we don't block because
     * demo mode is the default experience. When teams need strict
     * auth, they can add redirect logic here. */
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
