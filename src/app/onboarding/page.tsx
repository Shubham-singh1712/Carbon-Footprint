import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { BrandMark } from "@/components/layout/brand-mark";
import Link from "next/link";

const OnboardingWizard = dynamic(
  () =>
    import("@/features/onboarding/components/onboarding-wizard").then(
      (m) => m.OnboardingWizard,
    )
);

export const metadata: Metadata = {
  title: "Onboarding — CarbonTwin AI",
  description:
    "Tell us about your lifestyle and get your personalized Carbon Health Score in under 5 minutes.",
};

export default function OnboardingPage() {
  return (
    <main className="page-shell min-h-screen py-8">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" aria-label="Back to home">
          <BrandMark />
        </Link>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-muted hover:text-foreground"
        >
          Skip to demo →
        </Link>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
          Build your Digital Carbon Twin
        </h1>
        <p className="mt-3 text-base leading-8 text-muted">
          Answer a few questions about your lifestyle. It takes under 5 minutes.
        </p>
      </div>

      <OnboardingWizard />
    </main>
  );
}
