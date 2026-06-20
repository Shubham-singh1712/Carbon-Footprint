import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Step schemas                                                      */
/* ------------------------------------------------------------------ */

export const transportSchema = z.object({
  commuteDistanceKm: z.number().min(0).max(200),
  vehicleType: z.enum(["car-petrol", "car-diesel", "car-electric", "motorcycle", "none"]),
  publicTransportDays: z.number().min(0).max(7),
});

export const homeSchema = z.object({
  electricityKwh: z.number().min(0).max(2000),
  applianceUsage: z.enum(["low", "moderate", "high"]),
});

export const foodSchema = z.object({
  dietType: z.enum(["vegan", "vegetarian", "flexitarian", "omnivore"]),
  meatMealsPerWeek: z.number().min(0).max(21),
});

export const travelSchema = z.object({
  flightsPerYear: z.number().min(0).max(50),
  trainTripsPerYear: z.number().min(0).max(100),
});

export const shoppingSchema = z.object({
  monthlySpend: z.number().min(0).max(500000),
});

/* ------------------------------------------------------------------ */
/*  Combined onboarding schema                                        */
/* ------------------------------------------------------------------ */

export const onboardingSchema = z.object({
  transport: transportSchema,
  home: homeSchema,
  food: foodSchema,
  travel: travelSchema,
  shopping: shoppingSchema,
});

export type OnboardingData = z.infer<typeof onboardingSchema>;

/* ------------------------------------------------------------------ */
/*  Onboarding result                                                 */
/* ------------------------------------------------------------------ */

export const onboardingResultSchema = z.object({
  carbonHealthScore: z.number(),
  monthlyFootprintKg: z.number(),
  breakdown: z.object({
    transport: z.number(),
    home: z.number(),
    food: z.number(),
    travel: z.number(),
    shopping: z.number(),
  }),
});

export type OnboardingResult = z.infer<typeof onboardingResultSchema>;
