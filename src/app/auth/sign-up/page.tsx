import { BrandMark } from "@/components/layout/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="page-shell flex min-h-screen items-center py-10">
      <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="bg-gradient-to-br from-accent to-accent-strong p-8 text-white sm:p-10">
          <BrandMark />
          <Badge className="mt-8 bg-white/16 text-white" variant="neutral">
            Join CarbonTwin
          </Badge>
          <h1 className="mt-5 text-4xl font-semibold">
            Create your account and start building your Digital Carbon Twin.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-white/82">
            Track, predict, and reduce your carbon footprint with AI-powered
            coaching and personalized recommendations.
          </p>
        </Card>
        <Card className="p-8 sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Get started
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-foreground">
            Create your account
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="font-medium text-accent hover:underline">
              Sign in
            </Link>
          </p>
          <div className="mt-8">
            <SignUpForm />
          </div>
        </Card>
      </div>
    </main>
  );
}
