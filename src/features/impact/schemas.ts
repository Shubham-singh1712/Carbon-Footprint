import { z } from "zod";

export const impactSchema = z.object({
  treesEquivalent: z.number(),
  waterSavedLitres: z.number(),
  energySavedKwh: z.number(),
  totalReductionKg: z.number(),
  communityRank: z.number(),
  totalMembers: z.number(),
  reductionHistory: z.array(
    z.object({
      month: z.string(),
      reduction: z.number(),
    }),
  ),
  milestones: z.array(
    z.object({
      title: z.string(),
      value: z.string(),
      achieved: z.boolean(),
    }),
  ),
});

export type ImpactData = z.infer<typeof impactSchema>;
