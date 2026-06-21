/**
 * CarbonTwin AI Global Constants
 *
 * This module stores all centralized, static multipliers, baseline averages,
 * emission factors, and threshold rules used across the platform.
 */

import type { TransportProfile, HomeProfile, FoodProfile } from "@/stores/user-profile";

/**
 * Commute emission factors (kg CO2e per km) based on vehicle fuel types.
 * References: UK DEFRA (2023)
 */
export const VEHICLE_EMISSION_FACTORS: Record<TransportProfile["vehicleType"], number> = {
  "car-petrol": 0.192,
  "car-diesel": 0.171,
  "car-electric": 0.053,
  motorcycle: 0.103,
  none: 0,
};

/**
 * Public transport emission factor per km (weighted bus + rail average).
 */
export const PUBLIC_TRANSPORT_PER_KM = 0.089;

/**
 * Grid electricity emission factor (kg CO2e per kWh). Global average.
 */
export const ELECTRICITY_FACTOR = 0.42;

/**
 * Multipliers adjusting baseline electricity based on home appliance load.
 */
export const APPLIANCE_MULTIPLIERS: Record<HomeProfile["applianceUsage"], number> = {
  low: 0.8,
  moderate: 1.0,
  high: 1.25,
};

/**
 * Daily diet emission baselines (kg CO2e per day).
 * References: IPCC guidelines and lifestyle food studies.
 */
export const DIET_DAILY_BASELINE: Record<FoodProfile["dietType"], number> = {
  vegan: 2.9,
  vegetarian: 3.8,
  flexitarian: 4.7,
  omnivore: 5.6,
};

/**
 * Extra emission multiplier per additional meat meal.
 */
export const EXTRA_MEAT_MEAL_FACTOR = 1.4;

/**
 * Average emissions for a single domestic short-haul flight (kg CO2e).
 */
export const FLIGHT_FACTOR = 255;

/**
 * Average emissions for a standard domestic train journey (kg CO2e).
 */
export const TRAIN_FACTOR = 12.6;

/**
 * Emission factor per unit spend (kg CO2e per ₹1000).
 */
export const SHOPPING_FACTOR = 0.38;

/**
 * Standard working days in a calendar month.
 */
export const WORK_DAYS_PER_MONTH = 22;

/**
 * Average calendar days in a month.
 */
export const DAYS_PER_MONTH = 30.44;

/**
 * Monthly average carbon footprint per capita (kg CO2e).
 * Indian national average baseline (~2 tonnes/year).
 */
export const NATIONAL_MONTHLY_AVERAGE_KG = 168;

/**
 * Carbon emission thresholds for categorizing impact levels (kg CO2e).
 */
export const CARBON_THRESHOLDS = {
  HIGH: 18,
  MEDIUM: 10,
  LOW: 0,
} as const;

/**
 * Milestone requirements for active challenges.
 */
export const BADGE_REQUIREMENTS = {
  COMMUTE_TARGET_KG: 1.5,
  COMMUTE_WINDOWS: 4,
  KITCHEN_SWAP_ITEMS: 5,
  MINIMUM_STREAK_DAYS: 7,
} as const;

/**
 * Unified UI theme colors for carbon charts
 */
export const CHART_COLORS = {
  PRIMARY: "#0f9f6f",
  PRIMARY_LIGHT: "#45c48a",
  ACCENT_MUTED: "#8fbca5",
  PIE_PALETTE: ["#0f9f6f", "#45c48a", "#92ddb1", "#c7f0d6", "#d8efe1"],
} as const;
