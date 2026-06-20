import { z } from "zod";

export const coachPromptSchema = z.object({
  prompt: z.string().min(8, "Tell the coach a little more about your situation."),
  profile: z.any().optional(),
});

export const recommendationSchema = z.object({
  currentBehavior: z.string(),
  suggestedAction: z.string(),
  co2ReductionKg: z.number(),
  costSavings: z.string(),
  difficulty: z.enum(["Easy", "Moderate", "Challenging"]),
  timeRequired: z.string(),
});

export const coachResponseSchema = z.object({
  message: z.string(),
  insights: z.array(z.string()),
  nextActions: z.array(z.string()),
  recommendations: z.array(recommendationSchema).optional(),
});

export type CoachPrompt = z.infer<typeof coachPromptSchema>;
export type CoachResponse = z.infer<typeof coachResponseSchema>;
export type Recommendation = z.infer<typeof recommendationSchema>;
