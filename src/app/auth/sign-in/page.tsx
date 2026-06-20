import { BrandMark } from "@/components/layout/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="page-shell flex min-h-screen items-center py-10">
      <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="bg-gradient-to-br from-accent to-accent-strong p-8 text-white sm:p-10">
          <BrandMark />
          <Badge className="mt-8 bg-white/16 text-white" variant="neutral">
            Supabase Authentication
          </Badge>
          <h1 className="mt-5 text-4xl font-semibold">
            Connect your live identity layer and continue into CarbonTwin AI.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-white/82">
            The app is wired for Supabase SSR auth. Drop your project keys into `.env.local` and this sign-in flow becomes live immediately.
          </p>
        </Card>
        <Card className="p-8 sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Welcome back
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-foreground">
            Sign in to your carbon command center
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="font-medium text-accent hover:underline">
              Create an account
            </Link>
          </p>
          <div className="mt-8">
            <SignInForm />
          </div>
        </Card>
      </div>
    </main>
  );
}
