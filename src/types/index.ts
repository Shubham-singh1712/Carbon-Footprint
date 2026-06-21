/**
 * CarbonTwin AI Type Definitions
 *
 * This module contains the core domain models and interfaces used across
 * calculation engines, dashboard visualizers, AI recommendation roadmaps,
 * and API layers.
 */

/**
 * Commute parameters for private/public vehicles.
 */
export interface TransportProfile {
  commuteDistanceKm: number;
  vehicleType: "car-petrol" | "car-diesel" | "car-electric" | "motorcycle" | "none";
  publicTransportDays: number;
}

/**
 * Electricity consumption profile.
 */
export interface HomeProfile {
  electricityKwh: number;
  applianceUsage: "low" | "moderate" | "high";
}

/**
 * Diet and eating patterns.
 */
export interface FoodProfile {
  dietType: "vegan" | "vegetarian" | "flexitarian" | "omnivore";
  meatMealsPerWeek: number;
}

/**
 * Annual flight and rail travel frequencies.
 */
export interface TravelProfile {
  flightsPerYear: number;
  trainTripsPerYear: number;
}

/**
 * Consumer purchasing patterns.
 */
export interface ShoppingProfile {
  monthlySpend: number;
}

/**
 * The unified profile capturing onboarding answers.
 */
export interface CarbonProfile {
  transport: TransportProfile;
  home: HomeProfile;
  food: FoodProfile;
  travel: TravelProfile;
  shopping: ShoppingProfile;
}

/**
 * An itemized AI recommendation with explainability metadata.
 */
export interface CarbonRecommendation {
  currentBehavior: string;
  suggestedAction: string;
  co2ReductionKg: number;
  costSavings: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  timeRequired: string;
  whyGenerated?: string;
  dataInfluenced?: string;
  expectedImpact?: string;
  confidenceScore?: number;
}

/**
 * Monthly historical or targeted emission data point.
 */
export interface EmissionRecord {
  period: string;
  actual: number;
  target: number;
}

/**
 * Model forecast trajectory comparing baseline vs optimized paths.
 */
export interface ForecastData {
  month: string;
  baseline: number;
  optimized: number;
}

/**
 * Progress details on gamified sustainability challenges.
 */
export interface ChallengeProgress {
  title: string;
  description: string;
  progress: number;
  reward: string;
}

/**
 * Cumulative environmental offsets and rankings.
 */
export interface CommunityImpact {
  treesEquivalentSaved: number;
  waterSavedLitres: number;
  energySavedKwh: number;
  totalReductionKg: number;
  communityRank: number;
  totalMembers: number;
}

/**
 * Summary indicators displayed on the Carbon operations board.
 */
export interface DashboardMetrics {
  healthScore: number;
  annualProjectionKg: number;
  monthlyFootprintKg: number;
}
