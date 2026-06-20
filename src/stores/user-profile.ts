import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ------------------------------------------------------------------ */
/*  Onboarding data model                                             */
/* ------------------------------------------------------------------ */

export interface TransportProfile {
  commuteDistanceKm: number;
  vehicleType: "car-petrol" | "car-diesel" | "car-electric" | "motorcycle" | "none";
  publicTransportDays: number;
}

export interface HomeProfile {
  electricityKwh: number;
  applianceUsage: "low" | "moderate" | "high";
}

export interface FoodProfile {
  dietType: "vegan" | "vegetarian" | "flexitarian" | "omnivore";
  meatMealsPerWeek: number;
}

export interface TravelProfile {
  flightsPerYear: number;
  trainTripsPerYear: number;
}

export interface ShoppingProfile {
  monthlySpend: number;
}

export interface UserOnboardingData {
  transport: TransportProfile;
  home: HomeProfile;
  food: FoodProfile;
  travel: TravelProfile;
  shopping: ShoppingProfile;
}

export interface CarbonBreakdown {
  transport: number;
  home: number;
  food: number;
  travel: number;
  shopping: number;
}

export interface UserProfileState {
  /* Data */
  onboardingComplete: boolean;
  profile: UserOnboardingData;
  carbonHealthScore: number;
  monthlyFootprintKg: number;
  breakdown: CarbonBreakdown;

  /* Actions */
  updateTransport: (data: TransportProfile) => void;
  updateHome: (data: HomeProfile) => void;
  updateFood: (data: FoodProfile) => void;
  updateTravel: (data: TravelProfile) => void;
  updateShopping: (data: ShoppingProfile) => void;
  completeOnboarding: (score: number, monthly: number, breakdown: CarbonBreakdown) => void;
  resetProfile: () => void;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                          */
/* ------------------------------------------------------------------ */

const defaultProfile: UserOnboardingData = {
  transport: {
    commuteDistanceKm: 15,
    vehicleType: "car-petrol",
    publicTransportDays: 1,
  },
  home: {
    electricityKwh: 300,
    applianceUsage: "moderate",
  },
  food: {
    dietType: "omnivore",
    meatMealsPerWeek: 5,
  },
  travel: {
    flightsPerYear: 2,
    trainTripsPerYear: 4,
  },
  shopping: {
    monthlySpend: 5000,
  },
};

const defaultBreakdown: CarbonBreakdown = {
  transport: 0,
  home: 0,
  food: 0,
  travel: 0,
  shopping: 0,
};

/* ------------------------------------------------------------------ */
/*  Store                                                             */
/* ------------------------------------------------------------------ */

export const useUserProfile = create<UserProfileState>()(
  persist(
    (set) => ({
      onboardingComplete: false,
      profile: defaultProfile,
      carbonHealthScore: 0,
      monthlyFootprintKg: 0,
      breakdown: defaultBreakdown,

      updateTransport: (data) =>
        set((state) => ({
          profile: { ...state.profile, transport: data },
        })),

      updateHome: (data) =>
        set((state) => ({
          profile: { ...state.profile, home: data },
        })),

      updateFood: (data) =>
        set((state) => ({
          profile: { ...state.profile, food: data },
        })),

      updateTravel: (data) =>
        set((state) => ({
          profile: { ...state.profile, travel: data },
        })),

      updateShopping: (data) =>
        set((state) => ({
          profile: { ...state.profile, shopping: data },
        })),

      completeOnboarding: (score, monthly, breakdown) =>
        set({
          onboardingComplete: true,
          carbonHealthScore: score,
          monthlyFootprintKg: monthly,
          breakdown,
        }),

      resetProfile: () =>
        set({
          onboardingComplete: false,
          profile: defaultProfile,
          carbonHealthScore: 0,
          monthlyFootprintKg: 0,
          breakdown: defaultBreakdown,
        }),
    }),
    {
      name: "carbontwin-user-profile",
    },
  ),
);
