import { z } from "zod";

export const forecastSchema = z.object({
  horizon: z.array(
    z.object({
      month: z.string(),
      baseline: z.number(),
      optimized: z.number(),
    }),
  ),
  opportunities: z.array(
    z.object({
      label: z.string(),
      reduction: z.number(),
    }),
  ),
  signals: z.array(z.string()),
});

export type Forecast = z.infer<typeof forecastSchema>;
