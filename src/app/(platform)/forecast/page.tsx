import { PageHero } from "@/components/shared/page-hero";
import { ForecastAnalytics } from "@/features/forecast/components/forecast-analytics";

export default function ForecastPage() {
  return (
    <>
      <PageHero
        eyebrow="Forecast Analytics"
        title="See where your footprint is headed and what will bend the curve."
        description="CarbonTwin AI turns current behavior into a six-month prediction model so you can prioritize interventions with clarity."
      />
      <ForecastAnalytics />
    </>
  );
}
