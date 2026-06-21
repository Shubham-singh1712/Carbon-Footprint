/**
 * CarbonTwin AI Reusable Hooks
 *
 * Custom React hooks encapsulating react-query data fetching, state management,
 * and profile selectors.
 */

import { useQuery } from "@tanstack/react-query";
import { useUserProfile } from "@/stores/user-profile";
import { typedFetch } from "@/lib/api/client";
import { dashboardOverviewSchema } from "@/features/dashboard/schemas";
import { forecastSchema } from "@/features/forecast/schemas";
import { challengesSchema } from "@/features/challenges/schemas";
import { impactSchema } from "@/features/impact/schemas";
import { coachResponseSchema } from "@/features/coach/schemas";

/**
 * Hook to retrieve user monthly carbon score, trends, and overview metrics.
 */
export function useCarbonScore() {
  const profile = useUserProfile((state) => state.profile);
  const onboardingComplete = useUserProfile((state) => state.onboardingComplete);

  return useQuery({
    queryKey: ["platform-overview", onboardingComplete, profile],
    queryFn: () => {
      let url = "/api/platform/overview";
      if (onboardingComplete && profile) {
        const params = new URLSearchParams({
          hasProfile: "true",
          commuteDistanceKm: String(profile.transport.commuteDistanceKm),
          vehicleType: profile.transport.vehicleType,
          publicTransportDays: String(profile.transport.publicTransportDays),
          electricityKwh: String(profile.home.electricityKwh),
          applianceUsage: profile.home.applianceUsage,
          dietType: profile.food.dietType,
          meatMealsPerWeek: String(profile.food.meatMealsPerWeek),
          flightsPerYear: String(profile.travel.flightsPerYear),
          trainTripsPerYear: String(profile.travel.trainTripsPerYear),
          monthlySpend: String(profile.shopping.monthlySpend),
        });
        url += `?${params.toString()}`;
      }
      return typedFetch(url, { method: "GET", cache: "no-store" }, dashboardOverviewSchema);
    },
  });
}

/**
 * Hook to retrieve monthly predictive carbon forecast curves.
 */
export function useForecast() {
  const profile = useUserProfile((state) => state.profile);
  const onboardingComplete = useUserProfile((state) => state.onboardingComplete);

  return useQuery({
    queryKey: ["forecast-analytics", onboardingComplete, profile],
    queryFn: () => {
      let url = "/api/platform/forecast";
      if (onboardingComplete && profile) {
        const params = new URLSearchParams({
          hasProfile: "true",
          commuteDistanceKm: String(profile.transport.commuteDistanceKm),
          vehicleType: profile.transport.vehicleType,
          publicTransportDays: String(profile.transport.publicTransportDays),
          electricityKwh: String(profile.home.electricityKwh),
          applianceUsage: profile.home.applianceUsage,
          dietType: profile.food.dietType,
          meatMealsPerWeek: String(profile.food.meatMealsPerWeek),
          flightsPerYear: String(profile.travel.flightsPerYear),
          trainTripsPerYear: String(profile.travel.trainTripsPerYear),
          monthlySpend: String(profile.shopping.monthlySpend),
        });
        url += `?${params.toString()}`;
      }
      return typedFetch(url, { method: "GET", cache: "no-store" }, forecastSchema);
    },
  });
}

/**
 * Hook to retrieve user streaks and sustainability mission progress.
 */
export function useChallenges() {
  return useQuery({
    queryKey: ["challenges-board"],
    queryFn: () =>
      typedFetch("/api/platform/challenges", { method: "GET", cache: "no-store" }, challengesSchema),
  });
}

/**
 * Hook to fetch profile-based AI recommendations.
 */
export function useRecommendations() {
  const profile = useUserProfile((state) => state.profile);
  const onboardingComplete = useUserProfile((state) => state.onboardingComplete);

  return useQuery({
    queryKey: ["coach-default-recommendations", onboardingComplete, profile],
    queryFn: () =>
      typedFetch(
        "/api/platform/coach",
        {
          method: "POST",
          body: JSON.stringify({
            prompt: "What is the best way for me to reduce my footprint?",
            profile: onboardingComplete ? profile : undefined,
          }),
        },
        coachResponseSchema,
      ),
  });
}

/**
 * Hook to retrieve environmental equivalents and rankings.
 */
export function useCommunityImpact() {
  return useQuery({
    queryKey: ["impact-center"],
    queryFn: () =>
      typedFetch("/api/platform/impact", { method: "GET", cache: "no-store" }, impactSchema),
  });
}
