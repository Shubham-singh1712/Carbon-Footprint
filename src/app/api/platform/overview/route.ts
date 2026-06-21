import { jsonResponse } from "@/lib/api/route";
import { dashboardOverviewSchema } from "@/features/dashboard/schemas";
import {
  calculateMonthlyFootprint,
  calculateCarbonHealthScore
} from "@/lib/carbon-engine";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hasProfile = searchParams.get("hasProfile") === "true";
  
  if (!hasProfile) {
    // Fallback static dashboard data
    const fallback = {
      healthScore: 68,
      summary: [
        { label: "Monthly footprint", value: 18.4, suffix: "kg/day", delta: -8 },
        { label: "Reduction vs baseline", value: 22, suffix: "%", delta: 6 },
        { label: "Green habit streak", value: 13, suffix: "days", delta: 18 },
      ],
      trend: [
        { period: "Jan", actual: 730, target: 760 },
        { period: "Feb", actual: 690, target: 740 },
        { period: "Mar", actual: 655, target: 720 },
        { period: "Apr", actual: 618, target: 700 },
        { period: "May", actual: 594, target: 680 },
        { period: "Jun", actual: 570, target: 660 },
      ],
      breakdown: [
        { category: "Mobility", value: 36 },
        { category: "Food", value: 24 },
        { category: "Home", value: 20 },
        { category: "Shopping", value: 12 },
        { category: "Digital", value: 8 },
      ],
      milestones: [
        {
          title: "Bike commute cadence",
          detail: "3 of 4 weekly commute windows converted to low-carbon transport.",
          progress: 76,
        },
        {
          title: "Plant-forward meals",
          detail: "5 additional low-emission meals unlock a 14 kg monthly reduction.",
          progress: 62,
        },
        {
          title: "Home efficiency sprint",
          detail: "Smart thermostat automation is 1 setup away from going live.",
          progress: 49,
        },
      ],
      coachBrief:
        "The fastest reduction path this week combines a lighter commuting mix with two lower-impact grocery swaps.",
    };
    return jsonResponse(dashboardOverviewSchema, fallback);
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

  const customTarget = Number(searchParams.get("reductionTargetKg")) || 0;

  const profile = { transport, home, food, travel, shopping };
  const { total, breakdown } = calculateMonthlyFootprint(profile);
  const healthScore = calculateCarbonHealthScore(total);
  
  const dailyFootprint = Number((total / 30.44).toFixed(1));
  const baselineMonthly = 450; 
  const reductionPercent = Math.max(0, Math.round(((baselineMonthly - total) / baselineMonthly) * 100));

  const totalBreakdown = Math.max(1, Object.values(breakdown).reduce((a, b) => a + b, 0));
  const dynamicBreakdown = [
    { category: "Mobility", value: Math.round((breakdown.transport / totalBreakdown) * 100) },
    { category: "Food", value: Math.round((breakdown.food / totalBreakdown) * 100) },
    { category: "Home", value: Math.round((breakdown.home / totalBreakdown) * 100) },
    { category: "Shopping", value: Math.round((breakdown.shopping / totalBreakdown) * 100) },
    { category: "Travel", value: Math.round((breakdown.travel / totalBreakdown) * 100) },
  ];

  const sumBreakdown = dynamicBreakdown.reduce((a, b) => a + b.value, 0);
  if (sumBreakdown !== 100) {
    dynamicBreakdown[0].value += (100 - sumBreakdown);
  }

  const milestones = [
    {
      title: "Bike commute cadence",
      detail: transport.publicTransportDays >= 3 
        ? "Excellent job on low-carbon commuting!" 
        : "Convert commute windows to low-carbon transit.",
      progress: Math.min(100, Math.round((transport.publicTransportDays / 5) * 100)),
    },
    {
      title: "Plant-forward meals",
      detail: food.dietType === "vegan" || food.dietType === "vegetarian"
        ? "Plant-focused diet fully active!"
        : "Swap additional meat meals to unlock more reductions.",
      progress: food.dietType === "vegan" ? 100 : food.dietType === "vegetarian" ? 85 : food.meatMealsPerWeek <= 2 ? 60 : 35,
    },
    {
      title: "Home energy efficiency",
      detail: home.applianceUsage === "low"
        ? "Appliance consumption is optimized."
        : "Opportunity to cut standby consumption and appliance load.",
      progress: home.applianceUsage === "low" ? 90 : home.applianceUsage === "moderate" ? 60 : 30,
    },
  ];

  const getTargetVal = (ratio: number) => {
    if (customTarget > 0) {
      return Math.round(customTarget * ratio);
    }
    return Math.round(total * ratio * 0.95);
  };

  const trend = [
    { period: "Jan", actual: Math.round(total * 1.25), target: getTargetVal(1.3) },
    { period: "Feb", actual: Math.round(total * 1.18), target: getTargetVal(1.22) },
    { period: "Mar", actual: Math.round(total * 1.12), target: getTargetVal(1.15) },
    { period: "Apr", actual: Math.round(total * 1.08), target: getTargetVal(1.1) },
    { period: "May", actual: Math.round(total * 1.04), target: getTargetVal(1.05) },
    { period: "Jun", actual: Math.round(total), target: getTargetVal(1.0) },
  ];

  const responseData = {
    healthScore,
    summary: [
      { label: "Daily average footprint", value: dailyFootprint, suffix: "kg/day", delta: -12 },
      { label: "Reduction vs baseline", value: reductionPercent, suffix: "%", delta: 4 },
      { label: "Green habit streak", value: 14, suffix: "days", delta: 20 },
    ],
    trend,
    breakdown: dynamicBreakdown,
    milestones,
    coachBrief: total > 200 
      ? "Focus on shifting travel and transport choices to unlock a 15% footprint reduction." 
      : "Great work keeping emissions low! Look at optimization tips in the AI Coach.",
  };

  return jsonResponse(dashboardOverviewSchema, responseData);
}
