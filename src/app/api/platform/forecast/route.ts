import { jsonResponse } from "@/lib/api/route";
import { forecastSchema } from "@/features/forecast/schemas";
import { calculateMonthlyFootprint } from "@/lib/carbon-engine";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hasProfile = searchParams.get("hasProfile") === "true";

  if (!hasProfile) {
    // Fallback static forecast data
    const fallback = {
      horizon: [
        { month: "Jul", baseline: 565, optimized: 522 },
        { month: "Aug", baseline: 552, optimized: 494 },
        { month: "Sep", baseline: 540, optimized: 468 },
        { month: "Oct", baseline: 526, optimized: 446 },
        { month: "Nov", baseline: 518, optimized: 429 },
        { month: "Dec", baseline: 506, optimized: 410 },
      ],
      opportunities: [
        { label: "Transit-first commute", reduction: 14 },
        { label: "Meal planning", reduction: 10 },
        { label: "Bulk delivery windows", reduction: 7 },
        { label: "Home efficiency automation", reduction: 12 },
      ],
      signals: [
        "Mobility emissions are declining faster than forecast, enabling a stronger quarterly target.",
        "Home energy volatility spikes on weekends, so thermostat scheduling remains the highest ROI automation.",
        "Food-related emissions flatten if you hold plant-forward meal frequency above 4 meals per week.",
      ],
    };
    return jsonResponse(forecastSchema, fallback);
  }

  // Parse parameters from query string
  const transport = {
    commuteDistanceKm: Number(searchParams.get("commuteDistanceKm")) || 0,
    vehicleType: (searchParams.get("vehicleType") as "car-petrol" | "car-diesel" | "car-electric" | "motorcycle" | "none") || "none",
    publicTransportDays: Number(searchParams.get("publicTransportDays")) || 0,
  };
  const home = {
    electricityKwh: Number(searchParams.get("electricityKwh")) || 0,
    applianceUsage: (searchParams.get("applianceUsage") as "low" | "moderate" | "high") || "moderate",
  };
  const food = {
    dietType: (searchParams.get("dietType") as "vegan" | "vegetarian" | "flexitarian" | "omnivore") || "omnivore",
    meatMealsPerWeek: Number(searchParams.get("meatMealsPerWeek")) || 0,
  };
  const travel = {
    flightsPerYear: Number(searchParams.get("flightsPerYear")) || 0,
    trainTripsPerYear: Number(searchParams.get("trainTripsPerYear")) || 0,
  };
  const shopping = {
    monthlySpend: Number(searchParams.get("monthlySpend")) || 0,
  };

  const profile = { transport, home, food, travel, shopping };
  const { total } = calculateMonthlyFootprint(profile);

  // Forecast dynamic horizon
  // Decline target: month 1 = 5%, month 2 = 10%, month 3 = 15%, month 4 = 20%, month 5 = 25%, month 6 = 30% reduction.
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const horizon = months.map((month, index) => {
    const baselineReduction = 1 - (index * 0.01); 
    const optimizedReduction = 1 - ((index + 1) * 0.05); 
    return {
      month,
      baseline: Math.round(total * baselineReduction),
      optimized: Math.round(total * optimizedReduction),
    };
  });

  const opportunities = [
    { label: "Transit-first commute", reduction: transport.vehicleType !== "none" ? 18 : 5 },
    { label: "Meal planning (plant-focused)", reduction: food.dietType === "omnivore" ? 14 : 6 },
    { label: "Bulk delivery windows", reduction: shopping.monthlySpend > 3000 ? 10 : 4 },
    { label: "Home efficiency automation", reduction: home.applianceUsage === "high" ? 16 : 8 },
  ];

  const signals = [
    transport.vehicleType !== "none" 
      ? "Mobility emissions present your highest short-term savings potential. Commuting swaps will accelerate trends." 
      : "Your transport footprint is highly optimized. Maintain your public transit and pedestrian habit streak.",
    home.applianceUsage !== "low" 
      ? "Home energy consumption patterns suggest high weekend standby usage. Raising thermostat settings will yield immediate ROI."
      : "Home efficiency is in the top decile. Ensure smart device integration to sustain this baseline.",
    food.dietType === "omnivore" 
      ? "Food emissions could be cut by 15% through two simple vegetarian dinner swaps per week."
      : "Your plant-based dietary pattern is highly sustainable. Maintain current ingredients mix to lock in savings."
  ];

  return jsonResponse(forecastSchema, { horizon, opportunities, signals });
}
