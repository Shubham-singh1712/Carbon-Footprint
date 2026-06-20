import { impactSchema } from "@/features/impact/schemas";

export const impactData = impactSchema.parse({
  treesEquivalent: 47,
  waterSavedLitres: 18600,
  energySavedKwh: 520,
  totalReductionKg: 986,
  communityRank: 142,
  totalMembers: 8900,
  reductionHistory: [
    { month: "Jan", reduction: 42 },
    { month: "Feb", reduction: 68 },
    { month: "Mar", reduction: 95 },
    { month: "Apr", reduction: 134 },
    { month: "May", reduction: 178 },
    { month: "Jun", reduction: 210 },
    { month: "Jul", reduction: 259 },
  ],
  milestones: [
    { title: "First 100 kg reduced", value: "100 kg CO₂e", achieved: true },
    { title: "Green Starter", value: "Completed onboarding", achieved: true },
    { title: "Eco Explorer", value: "Used all 4 tools", achieved: true },
    { title: "Climate Champion", value: "500 kg reduction", achieved: true },
    { title: "Planet Guardian", value: "1 tonne reduction", achieved: false },
    { title: "30-day streak", value: "30 consecutive days", achieved: false },
  ],
});
