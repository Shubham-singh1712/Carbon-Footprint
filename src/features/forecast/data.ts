import { forecastSchema } from "@/features/forecast/schemas";

export const forecastData = forecastSchema.parse({
  horizon: [
    { month: "Jul", baseline: 565, optimized: 522 },
    { month: "Aug", baseline: 552, optimized: 494 },
    { month: "Sep", baseline: 540, optimized: 468 },
    { month: "Oct", baseline: 526, optimized: 446 },
    { month: "Nov", baseline: 518, optimized: 429 },
    { month: "Dec", baseline: 506, optimized: 410 },
  ],
  opportunities: [
    { label: "Transit-first commute", reduction: 14 },
    { label: "Meal planning", reduction: 10 },
    { label: "Bulk delivery windows", reduction: 7 },
    { label: "Home efficiency automation", reduction: 12 },
  ],
  signals: [
    "Mobility emissions are declining faster than forecast, enabling a stronger quarterly target.",
    "Home energy volatility spikes on weekends, so thermostat scheduling remains the highest ROI automation.",
    "Food-related emissions flatten if you hold plant-forward meal frequency above 4 meals per week.",
  ],
});
