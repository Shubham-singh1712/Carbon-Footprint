import { z } from "zod";

export const challengesSchema = z.object({
  streakDays: z.number(),
  completed: z.number(),
  active: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      progress: z.number(),
      reward: z.string(),
    }),
  ),
  achievements: z.array(
    z.object({
      title: z.string(),
      detail: z.string(),
    }),
  ),
});

export type ChallengesState = z.infer<typeof challengesSchema>;
