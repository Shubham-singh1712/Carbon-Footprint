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
  reductionTargetKg?: number;
  streakDays: number;
  completedChallengesCount: number;
  challengesProgress: Record<string, number>;
  achievementsUnlocked: Array<{ title: string; detail: string }>;

  /* Actions */
  updateTransport: (data: TransportProfile) => void;
  updateHome: (data: HomeProfile) => void;
  updateFood: (data: FoodProfile) => void;
  updateTravel: (data: TravelProfile) => void;
  updateShopping: (data: ShoppingProfile) => void;
  completeOnboarding: (score: number, monthly: number, breakdown: CarbonBreakdown) => void;
  resetProfile: () => void;
  setReductionTargetKg: (kg: number) => void;
  incrementChallengeProgress: (title: string, increment: number) => void;
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

const defaultChallengesProgress = {
  "Low-carbon commute week": 75,
  "Kitchen footprint reset": 60,
  "Home efficiency sprint": 42,
};

const defaultAchievements = [
  { title: "Transit Trailblazer", detail: "Saved 24 kg CO2e over the last month." },
  { title: "Climate Cart Curator", detail: "Reduced food basket impact by 18%." },
  { title: "Forecast Finisher", detail: "Completed three scenario simulations." },
];

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
      reductionTargetKg: undefined,
      streakDays: 13,
      completedChallengesCount: 8,
      challengesProgress: defaultChallengesProgress,
      achievementsUnlocked: defaultAchievements,

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
          reductionTargetKg: undefined,
          streakDays: 13,
          completedChallengesCount: 8,
          challengesProgress: defaultChallengesProgress,
          achievementsUnlocked: defaultAchievements,
        }),

      setReductionTargetKg: (kg) =>
        set({
          reductionTargetKg: kg,
        }),

      incrementChallengeProgress: (title, increment) =>
        set((state) => {
          const currentProgress = state.challengesProgress[title] ?? 0;
          const newProgress = Math.min(100, currentProgress + increment);
          
          let completedChallengesCount = state.completedChallengesCount;
          let streakDays = state.streakDays;
          const achievementsUnlocked = [...state.achievementsUnlocked];
          const newChallengesProgress = {
            ...state.challengesProgress,
            [title]: newProgress === 100 ? 0 : newProgress, // reset on completion
          };

          if (newProgress === 100) {
            completedChallengesCount += 1;
            streakDays += 1;
            
            // Add achievement if not already present
            let achTitle = "";
            let achDetail = "";
            if (title === "Low-carbon commute week") {
              achTitle = "Transit Trailblazer II";
              achDetail = "Completed commute sustainability window challenges.";
            } else if (title === "Kitchen footprint reset") {
              achTitle = "Planet Plate Master";
              achDetail = "Successfully logged multiple meat-alternative meal swaps.";
            } else {
              achTitle = "Smart Home Energizer";
              achDetail = "Completed home automation energy-saving sprints.";
            }

            if (!achievementsUnlocked.some((a) => a.title === achTitle)) {
              achievementsUnlocked.push({ title: achTitle, detail: achDetail });
            }
          }

          return {
            challengesProgress: newChallengesProgress,
            completedChallengesCount,
            streakDays,
            achievementsUnlocked,
          };
        }),
    }),
    {
      name: "carbontwin-user-profile",
    },
  ),
);

