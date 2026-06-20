import { jsonResponse, parseJsonRequest } from "@/lib/api/route";
import {
  receiptAnalysisRequestSchema,
  receiptAnalysisResponseSchema,
} from "@/features/receipts/schemas";

import { callGeminiVision } from "@/lib/gemini";

const multipliers = {
  food: 0.11,
  mobility: 0.22,
  home: 0.16,
  shopping: 0.18,
  digital: 0.08,
} as const;

export async function POST(request: Request) {
  const payload = await parseJsonRequest(request, receiptAnalysisRequestSchema);

  if (payload.image && process.env.GEMINI_API_KEY) {
    const prompt = `Analyze this receipt. Extract:
1. Vendor / Merchant name.
2. Total amount spent (as a number).
3. Category (MUST be exactly one of: "food", "mobility", "home", "shopping", "digital").
4. Payment method (e.g. Card, Cash, UPI, UPI / Online).

Estimate the carbon footprint in kg CO2e based on the amount and category multipliers:
- food: 0.11 kg per unit spend
- mobility: 0.22 kg per unit spend
- home: 0.16 kg per unit spend
- shopping: 0.18 kg per unit spend
- digital: 0.08 kg per unit spend

Return a raw JSON object with this exact structure:
{
  "vendor": "Merchant Name",
  "amount": 123.45,
  "category": "food" | "mobility" | "home" | "shopping" | "digital",
  "paymentMethod": "Card" | "UPI" | "Cash",
  "estimatedKg": 13.5, // estimated kg CO2e as number
  "confidence": 92, // integer percentage confidence
  "insights": [
    "A custom sustainability tip based on the item or vendor.",
    "A general recommendation."
  ]
}`;
    const ocrResult = await callGeminiVision(payload.image, "image/jpeg", prompt);
    if (ocrResult && typeof ocrResult === "object") {
      let category = ocrResult.category || "shopping";
      if (!["food", "mobility", "home", "shopping", "digital"].includes(category)) {
        category = "shopping";
      }
      const estimatedKg = Number(ocrResult.estimatedKg) || Number(((ocrResult.amount || payload.amount) * multipliers[category as keyof typeof multipliers]).toFixed(1));
      
      return jsonResponse(
        receiptAnalysisResponseSchema,
        {
          estimatedKg,
          confidence: Number(ocrResult.confidence) || 85,
          normalized: {
            vendor: String(ocrResult.vendor || payload.vendor),
            category,
            spend: Number(ocrResult.amount || payload.amount),
            impactBand: estimatedKg > 18 ? "High" : estimatedKg > 10 ? "Medium" : "Low",
          },
          insights: Array.isArray(ocrResult.insights) ? ocrResult.insights : [
            "Bundle repeat purchases to reduce delivery and packaging overhead.",
            "Shift one spend-heavy category to a lower-impact alternative this week."
          ],
        }
      );
    }
  }

  // Fallback
  const estimatedKg = Number((payload.amount * multipliers[payload.category]).toFixed(1));

  return jsonResponse(
    receiptAnalysisResponseSchema,
    {
      estimatedKg,
      confidence: 91,
      normalized: {
        vendor: payload.vendor,
        category: payload.category,
        spend: payload.amount,
        impactBand: estimatedKg > 18 ? "High" : estimatedKg > 10 ? "Medium" : "Low",
      },
      insights: [
        "Bundle repeat purchases to reduce delivery and packaging overhead.",
        "Shift one spend-heavy category to a lower-impact alternative this week.",
        "Receipts become more valuable when paired with simulator scenarios and coaching prompts.",
      ],
    },
  );
}
