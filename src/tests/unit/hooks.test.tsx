import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { typedFetch } from "@/lib/api/client";
import { useCarbonScore, useForecast, useCommunityImpact } from "@/hooks/use-sustainability";

// Mock typedFetch
vi.mock("@/lib/api/client", () => ({
  typedFetch: vi.fn(),
}));

// Mock user profile store
vi.mock("@/stores/user-profile", () => ({
  useUserProfile: (selector: (state: { profile: Record<string, unknown>; onboardingComplete: boolean }) => unknown) => selector({
    profile: {
      transport: { commuteDistanceKm: 15, vehicleType: "car-petrol", publicTransportDays: 1 },
      home: { electricityKwh: 300, applianceUsage: "moderate" },
      food: { dietType: "omnivore", meatMealsPerWeek: 5 },
      travel: { flightsPerYear: 2, trainTripsPerYear: 4 },
      shopping: { monthlySpend: 5000 },
    },
    onboardingComplete: true,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
  const QueryWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  QueryWrapper.displayName = "QueryWrapper";
  return QueryWrapper;
};

describe("Custom Sustainability Query Hooks", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("useCarbonScore", () => {
    it("returns overview data successfully", async () => {
      vi.mocked(typedFetch).mockResolvedValueOnce({
        healthScore: 82,
        summary: [{ label: "Transport", value: 120, suffix: "kg", delta: -10 }],
        trend: [],
        breakdown: [],
        milestones: [],
        coachBrief: "Switch to train commutes",
      });

      const { result } = renderHook(() => useCarbonScore(), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.healthScore).toBe(82);
      expect(result.current.data?.coachBrief).toBe("Switch to train commutes");
    });

    it("handles request failures gracefully", async () => {
      vi.mocked(typedFetch).mockRejectedValueOnce(new Error("API failure"));

      const { result } = renderHook(() => useCarbonScore(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBeDefined();
    });
  });

  describe("useForecast", () => {
    it("returns predictive carbon forecasting charts successfully", async () => {
      vi.mocked(typedFetch).mockResolvedValueOnce({
        horizon: [{ month: "Jan", baseline: 600, optimized: 500 }],
        opportunities: [{ label: "Food shifts", reduction: 25 }],
        signals: ["high-intensity"],
      });

      const { result } = renderHook(() => useForecast(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.horizon).toHaveLength(1);
      expect(result.current.data?.horizon?.[0]?.baseline).toBe(600);
      expect(result.current.data?.horizon?.[0]?.optimized).toBe(500);
    });
  });

  describe("useCommunityImpact", () => {
    it("returns equivalencies metrics successfully", async () => {
      vi.mocked(typedFetch).mockResolvedValueOnce({
        treesEquivalent: 47,
        waterSavedLitres: 18600,
        energySavedKwh: 520,
        totalReductionKg: 986,
        communityRank: 142,
        totalMembers: 8900,
        reductionHistory: [],
        milestones: [],
      });

      const { result } = renderHook(() => useCommunityImpact(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.totalReductionKg).toBe(986);
      expect(result.current.data?.treesEquivalent).toBe(47);
      expect(result.current.data?.waterSavedLitres).toBe(18600);
    });
  });
});
