/**
 * Carbon Calculation Engine
 *
 * Core computation module that converts lifestyle parameters into CO2e estimates.
 * All emission factors use conservative averages from published sources:
 * - UK DEFRA conversion factors (2023)
 * - EPA GHG equivalencies
 * - IPCC AR6 guidelines
 *
 * Units: kg CO2e per month unless otherwise noted.
 */

import {
  VEHICLE_EMISSION_FACTORS,
  PUBLIC_TRANSPORT_PER_KM,
  ELECTRICITY_FACTOR,
  APPLIANCE_MULTIPLIERS,
  DIET_DAILY_BASELINE,
  EXTRA_MEAT_MEAL_FACTOR,
  FLIGHT_FACTOR,
  TRAIN_FACTOR,
  SHOPPING_FACTOR,
  WORK_DAYS_PER_MONTH,
  DAYS_PER_MONTH,
  NATIONAL_MONTHLY_AVERAGE_KG,
} from "@/constants";
import type {
  TransportProfile,
  HomeProfile,
  FoodProfile,
  TravelProfile,
  ShoppingProfile,
  UserOnboardingData,
  CarbonBreakdown,
} from "@/stores/user-profile";

/* ------------------------------------------------------------------ */
/*  Category calculators                                              */
/* ------------------------------------------------------------------ */

/**
 * Calculate monthly transport emissions in kg CO2e.
 *
 * Covers private vehicle commute and public transport.
 */
export function calculateTransportFootprint(transport: TransportProfile): number {
  const vehicleFactor = VEHICLE_EMISSION_FACTORS[transport.vehicleType];
  const drivingDays = Math.max(0, WORK_DAYS_PER_MONTH - transport.publicTransportDays * 4.33);
  const ptDays = transport.publicTransportDays * 4.33;

  const vehicleEmissions = drivingDays * transport.commuteDistanceKm * 2 * vehicleFactor;
  const ptEmissions = ptDays * transport.commuteDistanceKm * 2 * PUBLIC_TRANSPORT_PER_KM;

  return Math.round((vehicleEmissions + ptEmissions) * 10) / 10;
}

/**
 * Calculate monthly home energy emissions in kg CO2e.
 */
export function calculateHomeFootprint(home: HomeProfile): number {
  const adjustedKwh = home.electricityKwh * APPLIANCE_MULTIPLIERS[home.applianceUsage];
  return Math.round(adjustedKwh * ELECTRICITY_FACTOR * 10) / 10;
}

/**
 * Calculate monthly food emissions in kg CO2e.
 */
export function calculateFoodFootprint(food: FoodProfile): number {
  const baseDaily = DIET_DAILY_BASELINE[food.dietType];
  const extraMeat = Math.max(0, food.meatMealsPerWeek - 3) * EXTRA_MEAT_MEAL_FACTOR * (DAYS_PER_MONTH / 7);
  const monthly = baseDaily * DAYS_PER_MONTH + extraMeat;
  return Math.round(monthly * 10) / 10;
}

/**
 * Calculate monthly travel emissions in kg CO2e.
 */
export function calculateTravelFootprint(travel: TravelProfile): number {
  const monthlyFlights = (travel.flightsPerYear / 12) * FLIGHT_FACTOR * 2; // round trip
  const monthlyTrains = (travel.trainTripsPerYear / 12) * TRAIN_FACTOR * 2;
  return Math.round((monthlyFlights + monthlyTrains) * 10) / 10;
}

/**
 * Calculate monthly shopping emissions in kg CO2e.
 */
export function calculateShoppingFootprint(shopping: ShoppingProfile): number {
  return Math.round((shopping.monthlySpend / 1000) * SHOPPING_FACTOR * 10) / 10;
}

/* ------------------------------------------------------------------ */
/*  Composite calculations                                            */
/* ------------------------------------------------------------------ */

/**
 * Calculate total monthly footprint and per-category breakdown.
 */
export function calculateMonthlyFootprint(data: UserOnboardingData): {
  total: number;
  breakdown: CarbonBreakdown;
} {
  const breakdown: CarbonBreakdown = {
    transport: calculateTransportFootprint(data.transport),
    home: calculateHomeFootprint(data.home),
    food: calculateFoodFootprint(data.food),
    travel: calculateTravelFootprint(data.travel),
    shopping: calculateShoppingFootprint(data.shopping),
  };

  const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  return {
    total: Math.round(total * 10) / 10,
    breakdown,
  };
}

/**
 * Carbon Health Score (0-100).
 *
 * Higher = healthier (lower emissions relative to the national average).
 * Uses India's per-capita average (~168 kg CO2e/month = 2 tonnes/year) as baseline.
 * Score formula: 100 × (1 - user_monthly / baseline_monthly)
 * Clamped to [0, 100].
 */
export function calculateCarbonHealthScore(monthlyKg: number): number {
  const ratio = monthlyKg / NATIONAL_MONTHLY_AVERAGE_KG;
  const raw = Math.round((1 - ratio) * 100);
  return Math.max(0, Math.min(100, raw));
}

/**
 * Annual projection based on current monthly emissions.
 */
export function calculateAnnualProjection(monthlyKg: number): number {
  return Math.round(monthlyKg * 12 * 10) / 10;
}

/* ------------------------------------------------------------------ */
/*  Equivalencies (for Impact Center)                                 */
/* ------------------------------------------------------------------ */

/** Number of trees needed to absorb `kgCO2e` in a year */
export function treesEquivalent(kgCO2e: number): number {
  return Math.round(kgCO2e / 21); // 1 tree ≈ 21 kg CO2/year
}

/** Litres of water saved equivalent */
export function waterSavedLitres(kgCO2e: number): number {
  return Math.round(kgCO2e * 8.3); // approximate industrial water per kg CO2
}

/** kWh of energy equivalent */
export function energyEquivalentKwh(kgCO2e: number): number {
  return Math.round(kgCO2e / ELECTRICITY_FACTOR);
}

/** Car kilometres equivalent */
export function carKmEquivalent(kgCO2e: number): number {
  return Math.round(kgCO2e / 0.192);
}

/**
 * Smartphone charges avoided equivalent.
 * 1 full smartphone charge ≈ 0.0083 kg CO2e
 */
export function smartphoneChargesEquivalent(kgCO2e: number): number {
  return Math.round(kgCO2e / 0.0083);
}

/* ------------------------------------------------------------------ */
/*  Score color helpers                                                */
/* ------------------------------------------------------------------ */

export function getScoreColor(score: number): string {
  if (score >= 75) return "#22c983";
  if (score >= 50) return "#0f9f6f";
  if (score >= 25) return "#f59e0b";
  return "#ef4444";
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  if (score >= 20) return "Needs Work";
  return "Critical";
}
