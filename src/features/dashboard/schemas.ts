import { z } from "zod";

export const dashboardOverviewSchema = z.object({
  healthScore: z.number().min(0).max(100),
  summary: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
      suffix: z.string(),
      delta: z.number(),
    }),
  ),
  trend: z.array(
    z.object({
      period: z.string(),
      actual: z.number(),
      target: z.number(),
    }),
  ),
  breakdown: z.array(
    z.object({
      category: z.string(),
      value: z.number(),
    }),
  ),
  milestones: z.array(
    z.object({
      title: z.string(),
      detail: z.string(),
      progress: z.number(),
    }),
  ),
  coachBrief: z.string(),
});

export type DashboardOverview = z.infer<typeof dashboardOverviewSchema>;
