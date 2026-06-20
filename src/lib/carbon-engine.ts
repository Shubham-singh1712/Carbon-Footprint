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
/*  Emission factors                                                  */
/* ------------------------------------------------------------------ */

/** kg CO2e per km for various vehicle types */
const VEHICLE_EMISSION_FACTORS: Record<TransportProfile["vehicleType"], number> = {
  "car-petrol": 0.192,
  "car-diesel": 0.171,
  "car-electric": 0.053,
  motorcycle: 0.103,
  none: 0,
};

/** kg CO2e per km for public transport (weighted average bus + rail) */
const PUBLIC_TRANSPORT_PER_KM = 0.089;

/** kg CO2e per kWh of grid electricity (global average) */
const ELECTRICITY_FACTOR = 0.42;

/** Appliance usage multiplier on baseline electricity */
const APPLIANCE_MULTIPLIERS: Record<HomeProfile["applianceUsage"], number> = {
  low: 0.8,
  moderate: 1.0,
  high: 1.25,
};

/** kg CO2e per day for various diet types */
const DIET_DAILY_BASELINE: Record<FoodProfile["dietType"], number> = {
  vegan: 2.9,
  vegetarian: 3.8,
  flexitarian: 4.7,
  omnivore: 5.6,
};

/** Additional kg CO2e per meat meal beyond diet baseline */
const EXTRA_MEAT_MEAL_FACTOR = 1.4;

/** kg CO2e per one-way domestic/short-haul flight */
const FLIGHT_FACTOR = 255;

/** kg CO2e per one-way train trip (avg 300 km) */
const TRAIN_FACTOR = 12.6;

/** kg CO2e per ₹1000 of shopping spend */
const SHOPPING_FACTOR = 0.38;

/** Working days per month */
const WORK_DAYS_PER_MONTH = 22;

/** Days per month */
const DAYS_PER_MONTH = 30.44;

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
  return Math.round((shopping.monthlySpend / 1000) * SHOPPING_FACTOR * 1000) / 1000 * 10 / 10;
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
const NATIONAL_MONTHLY_AVERAGE_KG = 168;

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
