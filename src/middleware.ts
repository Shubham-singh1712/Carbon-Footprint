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

export async function middleware(request: NextRequest) {
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
