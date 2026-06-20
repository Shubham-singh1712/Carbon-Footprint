import { describe, expect, it } from "vitest";
import { dashboardOverviewSchema } from "@/features/dashboard/schemas";
import { coachPromptSchema, coachResponseSchema } from "@/features/coach/schemas";
import { receiptAnalysisRequestSchema } from "@/features/receipts/schemas";
import { forecastSchema } from "@/features/forecast/schemas";
import { challengesSchema } from "@/features/challenges/schemas";
import { impactSchema } from "@/features/impact/schemas";
import {
  transportSchema,
  homeSchema,
  foodSchema,
  travelSchema,
  shoppingSchema,
} from "@/features/onboarding/schemas";

/* ------------------------------------------------------------------ */
/*  Dashboard                                                         */
/* ------------------------------------------------------------------ */

describe("dashboardOverviewSchema", () => {
  it("accepts valid data", () => {
    const result = dashboardOverviewSchema.safeParse({
      healthScore: 68,
      summary: [{ label: "Test", value: 10, suffix: "kg", delta: -5 }],
      trend: [{ period: "Jan", actual: 100, target: 120 }],
      breakdown: [{ category: "Mobility", value: 36 }],
      milestones: [{ title: "Test", detail: "Detail", progress: 50 }],
      coachBrief: "Brief text",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing healthScore", () => {
    const result = dashboardOverviewSchema.safeParse({
      summary: [],
      trend: [],
      breakdown: [],
      milestones: [],
      coachBrief: "",
    });
    expect(result.success).toBe(false);
  });
});

/* ------------------------------------------------------------------ */
/*  Coach                                                             */
/* ------------------------------------------------------------------ */

describe("coachPromptSchema", () => {
  it("accepts valid prompt", () => {
    const result = coachPromptSchema.safeParse({ prompt: "How can I reduce my commute?" });
    expect(result.success).toBe(true);
  });

  it("rejects short prompt", () => {
    const result = coachPromptSchema.safeParse({ prompt: "Hi" });
    expect(result.success).toBe(false);
  });
});

describe("coachResponseSchema", () => {
  it("accepts response with recommendations", () => {
    const result = coachResponseSchema.safeParse({
      message: "Here is a plan",
      insights: ["insight 1"],
      nextActions: ["action 1"],
      recommendations: [
        {
          currentBehavior: "Drive daily",
          suggestedAction: "Use bus",
          co2ReductionKg: 18,
          costSavings: "₹1200/month",
          difficulty: "Easy",
          timeRequired: "15 min",
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("accepts response without recommendations", () => {
    const result = coachResponseSchema.safeParse({
      message: "Message",
      insights: [],
      nextActions: [],
    });
    expect(result.success).toBe(true);
  });
});

/* ------------------------------------------------------------------ */
/*  Receipts                                                          */
/* ------------------------------------------------------------------ */

describe("receiptAnalysisRequestSchema", () => {
  it("accepts valid receipt data", () => {
    const result = receiptAnalysisRequestSchema.safeParse({
      receiptLabel: "Grocery",
      vendor: "Fresh Market",
      amount: 84.6,
      category: "food",
      paymentMethod: "Card",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid category", () => {
    const result = receiptAnalysisRequestSchema.safeParse({
      receiptLabel: "Test",
      vendor: "Test",
      amount: 10,
      category: "invalid",
      paymentMethod: "Cash",
    });
    expect(result.success).toBe(false);
  });
});

/* ------------------------------------------------------------------ */
/*  Forecast                                                          */
/* ------------------------------------------------------------------ */

describe("forecastSchema", () => {
  it("accepts valid forecast data", () => {
    const result = forecastSchema.safeParse({
      horizon: [{ month: "Jul", baseline: 500, optimized: 450 }],
      opportunities: [{ label: "Test", reduction: 10 }],
      signals: ["Signal 1"],
    });
    expect(result.success).toBe(true);
  });
});

/* ------------------------------------------------------------------ */
/*  Challenges                                                        */
/* ------------------------------------------------------------------ */

describe("challengesSchema", () => {
  it("accepts valid challenges data", () => {
    const result = challengesSchema.safeParse({
      streakDays: 13,
      completed: 8,
      active: [{ title: "Test", description: "Desc", progress: 50, reward: "Badge" }],
      achievements: [{ title: "Badge", detail: "Detail" }],
    });
    expect(result.success).toBe(true);
  });
});

/* ------------------------------------------------------------------ */
/*  Impact                                                            */
/* ------------------------------------------------------------------ */

describe("impactSchema", () => {
  it("accepts valid impact data", () => {
    const result = impactSchema.safeParse({
      treesEquivalent: 47,
      waterSavedLitres: 18600,
      energySavedKwh: 520,
      totalReductionKg: 986,
      communityRank: 142,
      totalMembers: 8900,
      reductionHistory: [{ month: "Jan", reduction: 42 }],
      milestones: [{ title: "Test", value: "100 kg", achieved: true }],
    });
    expect(result.success).toBe(true);
  });
});

/* ------------------------------------------------------------------ */
/*  Onboarding                                                        */
/* ------------------------------------------------------------------ */

describe("onboarding schemas", () => {
  it("transport accepts valid data", () => {
    expect(transportSchema.safeParse({
      commuteDistanceKm: 15,
      vehicleType: "car-petrol",
      publicTransportDays: 2,
    }).success).toBe(true);
  });

  it("transport rejects out-of-range distance", () => {
    expect(transportSchema.safeParse({
      commuteDistanceKm: 300,
      vehicleType: "car-petrol",
      publicTransportDays: 2,
    }).success).toBe(false);
  });

  it("home accepts valid data", () => {
    expect(homeSchema.safeParse({
      electricityKwh: 300,
      applianceUsage: "moderate",
    }).success).toBe(true);
  });

  it("food accepts valid data", () => {
    expect(foodSchema.safeParse({
      dietType: "vegan",
      meatMealsPerWeek: 0,
    }).success).toBe(true);
  });

  it("travel rejects negative flights", () => {
    expect(travelSchema.safeParse({
      flightsPerYear: -1,
      trainTripsPerYear: 0,
    }).success).toBe(false);
  });

  it("shopping accepts valid data", () => {
    expect(shoppingSchema.safeParse({
      monthlySpend: 5000,
    }).success).toBe(true);
  });
});
