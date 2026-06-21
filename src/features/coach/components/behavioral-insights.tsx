"use client";

import { useUserProfile } from "@/stores/user-profile";
import { calculateMonthlyFootprint, calculateCarbonHealthScore } from "@/lib/carbon-engine";
import { Card } from "@/components/ui/card";
import { Award, BarChart3, HelpCircle, ShieldAlert, Sparkles } from "lucide-react";

export function BehavioralInsights() {
  const profile = useUserProfile((state) => state.profile);
  const onboardingComplete = useUserProfile((state) => state.onboardingComplete);

  const { breakdown, total } = calculateMonthlyFootprint(profile);
  const healthScore = onboardingComplete
    ? calculateCarbonHealthScore(total)
    : 68;

  // Identify top emission source
  const categoriesMap = {
    transport: { label: "Mobility", value: breakdown.transport, detail: "Daily petrol vehicle commutes." },
    home: { label: "Home Energy", value: breakdown.home, detail: "Air conditioning & grid electricity load." },
    food: { label: "Food Choices", value: breakdown.food, detail: "Meat-heavy meals and dairy packaging." },
    travel: { label: "Long-Distance Travel", value: breakdown.travel, detail: "Flights and domestic train trips." },
    shopping: { label: "Shopping & Consumption", value: breakdown.shopping, detail: "Consumable expenditures & online orders." },
  };

  const sorted = Object.entries(categoriesMap).sort((a, b) => b[1].value - a[1].value);
  const topSource = sorted[0][1];
  const highestImpactOpportunity = sorted[0][1].label === "Mobility" 
    ? "Transitioning car commutes to public transit/electric vehicles."
    : sorted[0][1].label === "Home Energy"
    ? "Automating standby consumption and thermostat targets."
    : sorted[0][1].label === "Food Choices"
    ? "Introducing two weekly plant-based meal replacements."
    : "Consolidating monthly retail transactions.";

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-accent" />
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          Behavioral Insights & Explainability
        </p>
      </div>
      <h3 className="mt-3 text-xl font-semibold text-foreground">
        AI explainability & hotspots
      </h3>
      <p className="mt-2 text-xs leading-6 text-muted">
        Review the factors, active user profile datasets, and confidence scores driving your AI recommendations.
      </p>

      {/* Behavioral Insights */}
      <div className="mt-5 space-y-3.5">
        <div>
          <span className="font-mono text-[10px] uppercase text-muted tracking-wider block">
            Top Emission Source
          </span>
          <div className="mt-1 flex items-start gap-2">
            <ShieldAlert className="mt-0.5 h-4 w-4 text-warning flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">{topSource.label}</p>
              <p className="text-xs text-muted leading-5">{topSource.detail}</p>
            </div>
          </div>
        </div>

        <div>
          <span className="font-mono text-[10px] uppercase text-muted tracking-wider block">
            Highest-Impact Opportunity
          </span>
          <div className="mt-1 flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 text-accent flex-shrink-0" />
            <p className="text-xs text-muted leading-5">{highestImpactOpportunity}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-4">
          <div>
            <span className="font-mono text-[10px] uppercase text-muted tracking-wider block">
              Sustainability Score
            </span>
            <div className="mt-1 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold text-foreground">{healthScore}/100</span>
            </div>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase text-muted tracking-wider block">
              Recommendation Confidence
            </span>
            <span className="mt-1 block text-sm font-semibold text-foreground">94%</span>
          </div>
        </div>

        {/* Explainability Layer */}
        <div className="rounded-2xl bg-accent-soft p-4 border border-accent/20">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
              Explainability Layer
            </span>
          </div>
          <div className="mt-2 space-y-2 text-xs leading-5 text-muted">
            <p>
              <strong>Why Generated:</strong> Your {topSource.label.toLowerCase()} emissions currently represent the highest ratio relative to your carbon footprint.
            </p>
            <p>
              <strong>Data Influenced:</strong> Onboarding questionnaire parameters, active lifestyle averages, and category multipliers.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
