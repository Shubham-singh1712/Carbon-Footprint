import type { Metadata } from "next";
import dynamic from "next/dynamic";

const LandingPageClient = dynamic(
  () => import("@/components/landing/landing-page-client")
);

export const metadata: Metadata = {
  title: "CarbonTwin AI — Understand. Predict. Reduce.",
  description:
    "Build your Digital Carbon Twin and discover personalized ways to reduce your environmental impact through AI coaching, forecasting, and simulation.",
  keywords: [
    "carbon footprint",
    "sustainability",
    "AI",
    "carbon twin",
    "climate",
    "emissions tracker",
  ],
  openGraph: {
    title: "CarbonTwin AI — Understand. Predict. Reduce.",
    description:
      "An AI-powered sustainability platform for forecasting, coaching, and reducing climate impact.",
    type: "website",
  },
};

export default function LandingPage() {
  return <LandingPageClient />;
}
