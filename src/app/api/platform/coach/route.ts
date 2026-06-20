import { jsonResponse, parseJsonRequest } from "@/lib/api/route";
import {
  coachPromptSchema,
  coachResponseSchema,
} from "@/features/coach/schemas";

import { callGeminiText } from "@/lib/gemini";

function buildCoachResponse(prompt: string) {
  const normalized = prompt.toLowerCase();
  const mentionsCommute = normalized.includes("commute") || normalized.includes("travel") || normalized.includes("drive");
  const mentionsFood = normalized.includes("food") || normalized.includes("grocery") || normalized.includes("diet") || normalized.includes("meat");
  const mentionsEnergy = normalized.includes("energy") || normalized.includes("electricity") || normalized.includes("home");

  const recommendations = [];

  if (mentionsCommute) {
    recommendations.push({
      currentBehavior: "Drive 15km daily to work",
      suggestedAction: "Use public transport twice per week",
      co2ReductionKg: 18,
      costSavings: "₹1,200/month",
      difficulty: "Easy" as const,
      timeRequired: "Add 15 min to commute",
    });
  }

  if (mentionsFood) {
    recommendations.push({
      currentBehavior: "5+ meat-based meals per week",
      suggestedAction: "Replace 2 meat meals with plant-based alternatives",
      co2ReductionKg: 12,
      costSavings: "₹800/month",
      difficulty: "Moderate" as const,
      timeRequired: "30 min meal prep",
    });
  }

  if (mentionsEnergy) {
    recommendations.push({
      currentBehavior: "AC running 8+ hours daily",
      suggestedAction: "Set thermostat timer and raise target by 2°C",
      co2ReductionKg: 22,
      costSavings: "₹1,500/month",
      difficulty: "Easy" as const,
      timeRequired: "5 min setup",
    });
  }

  /* Fallback if no keyword match */
  if (recommendations.length === 0) {
    recommendations.push(
      {
        currentBehavior: "Drive to work 5 days/week",
        suggestedAction: "Switch to public transport 2 days/week",
        co2ReductionKg: 18,
        costSavings: "₹1,200/month",
        difficulty: "Easy" as const,
        timeRequired: "Add 15 min to commute",
      },
      {
        currentBehavior: "High meat consumption",
        suggestedAction: "Try 2 plant-based dinners per week",
        co2ReductionKg: 12,
        costSavings: "₹800/month",
        difficulty: "Moderate" as const,
        timeRequired: "30 min meal prep",
      },
      {
        currentBehavior: "Standby power always on",
        suggestedAction: "Use smart plugs to cut standby power at night",
        co2ReductionKg: 8,
        costSavings: "₹400/month",
        difficulty: "Easy" as const,
        timeRequired: "One-time 10 min setup",
      },
    );
  }

  return {
    message:
      "Here is the shortest path to meaningful savings: focus on one high-frequency behavior, one purchasing habit, and one automation that keeps the change easy to repeat.",
    insights: [
      mentionsCommute
        ? "Your transport footprint is high-frequency, so small commuting shifts compound quickly."
        : "Recurring routines create stronger savings than one-off heroic changes.",
      mentionsFood
        ? "Food choices matter most when you swap staples, not occasional meals."
        : "Purchasing rhythms reveal more reduction leverage than isolated transactions.",
      "CarbonTwin favors interventions that reduce friction and preserve lifestyle flexibility.",
    ],
    nextActions: [
      "Choose one habit to test for the next 7 days and measure it against your baseline.",
      "Use the simulator to compare the change before committing to a target.",
      "Log one receipt after the change so the dashboard can register the real impact.",
    ],
    recommendations,
  };
}

export async function POST(request: Request) {
  const payload = await parseJsonRequest(request, coachPromptSchema);
  
  if (process.env.GEMINI_API_KEY) {
    const systemInstruction = `You are CarbonTwin AI Coach, a supportive, data-driven sustainability assistant.
Analyze the user's carbon footprint profile and their query, and generate highly targeted recommendations and insights.
You MUST respond with a raw JSON object matching this structure:
{
  "message": "Enthusiastic, concise summary of the advice. (Markdown formatted, around 2-3 sentences)",
  "insights": [
    "A relevant insight about their carbon habits based on their profile data.",
    "A general recommendation for building sustainable habits."
  ],
  "nextActions": [
    "Immediate action step 1",
    "Immediate action step 2"
  ],
  "recommendations": [
    {
      "currentBehavior": "e.g. Driving 15km daily using petrol car",
      "suggestedAction": "e.g. Swapping 2 days of car driving with electric bus / train",
      "co2ReductionKg": 18,
      "costSavings": "e.g. ₹1,200/month",
      "difficulty": "Easy", // MUST be Easy, Moderate, or Challenging
      "timeRequired": "e.g. 15 mins daily"
    }
  ]
}
Ensure the recommendations are realistic, and reflect their active footprint categories. Keep response strictly formatted as valid JSON. Make sure recommendations difficulty matches the schema.`;

    const userPrompt = `User Query: "${payload.prompt}"
User Onboarding Profile Context: ${payload.profile ? JSON.stringify(payload.profile) : "Not completed yet"}`;

    const geminiResult = await callGeminiText(systemInstruction, userPrompt);
    if (geminiResult && typeof geminiResult === "object") {
      // Validate or map difficulty keys to fit schema requirement (capitalized correctly)
      if (Array.isArray(geminiResult.recommendations)) {
        geminiResult.recommendations = geminiResult.recommendations.map((rec: { difficulty?: string; co2ReductionKg?: number } & Record<string, unknown>) => {
          let difficulty: "Easy" | "Moderate" | "Challenging" = "Easy";
          const diffLower = String(rec.difficulty || "").toLowerCase();
          if (diffLower.startsWith("mod")) difficulty = "Moderate";
          else if (diffLower.startsWith("chal") || diffLower.startsWith("hard")) difficulty = "Challenging";
          return {
            ...rec,
            co2ReductionKg: Number(rec.co2ReductionKg) || 0,
            difficulty,
          };
        });
      }
      return jsonResponse(coachResponseSchema, geminiResult);
    }
  }

  return jsonResponse(coachResponseSchema, buildCoachResponse(payload.prompt));
}
