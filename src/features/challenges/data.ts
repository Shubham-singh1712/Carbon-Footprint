import { challengesSchema } from "@/features/challenges/schemas";

export const challengesData = challengesSchema.parse({
  streakDays: 13,
  completed: 8,
  active: [
    {
      title: "Low-carbon commute week",
      description: "Complete 4 commute windows under 1.5 kg CO2e.",
      progress: 75,
      reward: "Transit Trailblazer badge",
    },
    {
      title: "Kitchen footprint reset",
      description: "Swap 5 high-impact items for lower-emission alternatives.",
      progress: 60,
      reward: "Planet Plate streak boost",
    },
    {
      title: "Home efficiency sprint",
      description: "Automate lighting, standby power, and climate timings.",
      progress: 42,
      reward: "Smart Home Saver badge",
    },
  ],
  achievements: [
    { title: "Transit Trailblazer", detail: "Saved 24 kg CO2e over the last month." },
    { title: "Climate Cart Curator", detail: "Reduced food basket impact by 18%." },
    { title: "Forecast Finisher", detail: "Completed three scenario simulations." },
  ],
});
