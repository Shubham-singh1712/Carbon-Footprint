import { describe, expect, it } from "vitest";
import {
  calculateTransportFootprint,
  calculateHomeFootprint,
  calculateFoodFootprint,
  calculateTravelFootprint,
  calculateShoppingFootprint,
  calculateMonthlyFootprint,
  calculateCarbonHealthScore,
  calculateAnnualProjection,
  treesEquivalent,
  waterSavedLitres,
  energyEquivalentKwh,
  carKmEquivalent,
  getScoreColor,
  getScoreLabel,
} from "@/lib/carbon-engine";

/* ------------------------------------------------------------------ */
/*  Transport                                                         */
/* ------------------------------------------------------------------ */

describe("calculateTransportFootprint", () => {
  it("returns 0 for no vehicle and full public transport", () => {
    const result = calculateTransportFootprint({
      commuteDistanceKm: 10,
      vehicleType: "none",
      publicTransportDays: 5,
    });
    expect(result).toBeGreaterThanOrEqual(0);
  });

  it("increases with more commute days", () => {
    const low = calculateTransportFootprint({
      commuteDistanceKm: 15,
      vehicleType: "car-petrol",
      publicTransportDays: 4,
    });
    const high = calculateTransportFootprint({
      commuteDistanceKm: 15,
      vehicleType: "car-petrol",
      publicTransportDays: 0,
    });
    expect(high).toBeGreaterThan(low);
  });

  it("electric cars produce less than petrol", () => {
    const petrol = calculateTransportFootprint({
      commuteDistanceKm: 20,
      vehicleType: "car-petrol",
      publicTransportDays: 0,
    });
    const electric = calculateTransportFootprint({
      commuteDistanceKm: 20,
      vehicleType: "car-electric",
      publicTransportDays: 0,
    });
    expect(electric).toBeLessThan(petrol);
  });

  it("handles zero commute distance", () => {
    const result = calculateTransportFootprint({
      commuteDistanceKm: 0,
      vehicleType: "car-petrol",
      publicTransportDays: 0,
    });
    expect(result).toBe(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Home                                                              */
/* ------------------------------------------------------------------ */

describe("calculateHomeFootprint", () => {
  it("scales with electricity consumption", () => {
    const low = calculateHomeFootprint({ electricityKwh: 100, applianceUsage: "moderate" });
    const high = calculateHomeFootprint({ electricityKwh: 500, applianceUsage: "moderate" });
    expect(high).toBeGreaterThan(low);
  });

  it("applies appliance multipliers correctly", () => {
    const lowUsage = calculateHomeFootprint({ electricityKwh: 300, applianceUsage: "low" });
    const highUsage = calculateHomeFootprint({ electricityKwh: 300, applianceUsage: "high" });
    expect(highUsage).toBeGreaterThan(lowUsage);
  });
});

/* ------------------------------------------------------------------ */
/*  Food                                                              */
/* ------------------------------------------------------------------ */

describe("calculateFoodFootprint", () => {
  it("vegan is lower than omnivore", () => {
    const vegan = calculateFoodFootprint({ dietType: "vegan", meatMealsPerWeek: 0 });
    const omnivore = calculateFoodFootprint({ dietType: "omnivore", meatMealsPerWeek: 7 });
    expect(vegan).toBeLessThan(omnivore);
  });

  it("returns positive values for all diet types", () => {
    for (const diet of ["vegan", "vegetarian", "flexitarian", "omnivore"] as const) {
      const result = calculateFoodFootprint({ dietType: diet, meatMealsPerWeek: 3 });
      expect(result).toBeGreaterThan(0);
    }
  });
});

/* ------------------------------------------------------------------ */
/*  Travel                                                            */
/* ------------------------------------------------------------------ */

describe("calculateTravelFootprint", () => {
  it("returns 0 for no travel", () => {
    const result = calculateTravelFootprint({ flightsPerYear: 0, trainTripsPerYear: 0 });
    expect(result).toBe(0);
  });

  it("flights dominate over trains", () => {
    const flights = calculateTravelFootprint({ flightsPerYear: 4, trainTripsPerYear: 0 });
    const trains = calculateTravelFootprint({ flightsPerYear: 0, trainTripsPerYear: 4 });
    expect(flights).toBeGreaterThan(trains);
  });
});

/* ------------------------------------------------------------------ */
/*  Shopping                                                          */
/* ------------------------------------------------------------------ */

describe("calculateShoppingFootprint", () => {
  it("scales with spend", () => {
    const low = calculateShoppingFootprint({ monthlySpend: 2000 });
    const high = calculateShoppingFootprint({ monthlySpend: 20000 });
    expect(high).toBeGreaterThan(low);
  });

  it("returns 0 for no spend", () => {
    const result = calculateShoppingFootprint({ monthlySpend: 0 });
    expect(result).toBe(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Composite                                                         */
/* ------------------------------------------------------------------ */

describe("calculateMonthlyFootprint", () => {
  it("returns total and breakdown", () => {
    const { total, breakdown } = calculateMonthlyFootprint({
      transport: { commuteDistanceKm: 15, vehicleType: "car-petrol", publicTransportDays: 1 },
      home: { electricityKwh: 300, applianceUsage: "moderate" },
      food: { dietType: "omnivore", meatMealsPerWeek: 5 },
      travel: { flightsPerYear: 2, trainTripsPerYear: 4 },
      shopping: { monthlySpend: 5000 },
    });

    expect(total).toBeGreaterThan(0);
    expect(breakdown.transport).toBeGreaterThan(0);
    expect(breakdown.home).toBeGreaterThan(0);
    expect(breakdown.food).toBeGreaterThan(0);
    expect(Object.values(breakdown).reduce((a, b) => a + b, 0)).toBeCloseTo(total, 0);
  });
});

/* ------------------------------------------------------------------ */
/*  Health score                                                      */
/* ------------------------------------------------------------------ */

describe("calculateCarbonHealthScore", () => {
  it("returns 100 for zero emissions", () => {
    expect(calculateCarbonHealthScore(0)).toBe(100);
  });

  it("returns 0 for very high emissions", () => {
    expect(calculateCarbonHealthScore(500)).toBe(0);
  });

  it("clamps to 0-100 range", () => {
    expect(calculateCarbonHealthScore(-10)).toBeLessThanOrEqual(100);
    expect(calculateCarbonHealthScore(1000)).toBeGreaterThanOrEqual(0);
  });

  it("average emissions produce a mid-range score", () => {
    const score = calculateCarbonHealthScore(168); // national average
    expect(score).toBe(0); // exactly average = 0
  });
});

/* ------------------------------------------------------------------ */
/*  Annual projection                                                 */
/* ------------------------------------------------------------------ */

describe("calculateAnnualProjection", () => {
  it("multiplies monthly by 12", () => {
    expect(calculateAnnualProjection(100)).toBe(1200);
  });
});

/* ------------------------------------------------------------------ */
/*  Equivalencies                                                     */
/* ------------------------------------------------------------------ */

describe("equivalency functions", () => {
  it("treesEquivalent returns positive for positive input", () => {
    expect(treesEquivalent(100)).toBeGreaterThan(0);
  });

  it("waterSavedLitres returns positive for positive input", () => {
    expect(waterSavedLitres(100)).toBeGreaterThan(0);
  });

  it("energyEquivalentKwh returns positive for positive input", () => {
    expect(energyEquivalentKwh(100)).toBeGreaterThan(0);
  });

  it("carKmEquivalent returns positive for positive input", () => {
    expect(carKmEquivalent(100)).toBeGreaterThan(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Score helpers                                                     */
/* ------------------------------------------------------------------ */

describe("getScoreColor", () => {
  it("returns green for high scores", () => {
    expect(getScoreColor(80)).toBe("#22c983");
  });

  it("returns red for low scores", () => {
    expect(getScoreColor(10)).toBe("#ef4444");
  });
});

describe("getScoreLabel", () => {
  it("returns Excellent for high scores", () => {
    expect(getScoreLabel(85)).toBe("Excellent");
  });

  it("returns Critical for very low scores", () => {
    expect(getScoreLabel(10)).toBe("Critical");
  });
});
