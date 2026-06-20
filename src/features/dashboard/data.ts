import { dashboardOverviewSchema } from "@/features/dashboard/schemas";

export const dashboardOverview = dashboardOverviewSchema.parse({
  healthScore: 68,
  summary: [
    { label: "Monthly footprint", value: 18.4, suffix: "kg/day", delta: -8 },
    { label: "Reduction vs baseline", value: 22, suffix: "%", delta: 6 },
    { label: "Green habit streak", value: 13, suffix: "days", delta: 18 },
  ],
  trend: [
    { period: "Jan", actual: 730, target: 760 },
    { period: "Feb", actual: 690, target: 740 },
    { period: "Mar", actual: 655, target: 720 },
    { period: "Apr", actual: 618, target: 700 },
    { period: "May", actual: 594, target: 680 },
    { period: "Jun", actual: 570, target: 660 },
  ],
  breakdown: [
    { category: "Mobility", value: 36 },
    { category: "Food", value: 24 },
    { category: "Home", value: 20 },
    { category: "Shopping", value: 12 },
    { category: "Digital", value: 8 },
  ],
  milestones: [
    {
      title: "Bike commute cadence",
      detail: "3 of 4 weekly commute windows converted to low-carbon transport.",
      progress: 76,
    },
    {
      title: "Plant-forward meals",
      detail: "5 additional low-emission meals unlock a 14 kg monthly reduction.",
      progress: 62,
    },
    {
      title: "Home efficiency sprint",
      detail: "Smart thermostat automation is 1 setup away from going live.",
      progress: 49,
    },
  ],
  coachBrief:
    "The fastest reduction path this week combines a lighter commuting mix with two lower-impact grocery swaps.",
});
