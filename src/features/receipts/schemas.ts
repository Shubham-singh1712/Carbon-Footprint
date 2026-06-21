import { z } from "zod";

export const receiptAnalysisRequestSchema = z.object({
  receiptLabel: z.string().min(2),
  vendor: z.string().min(2),
  amount: z.number().positive(),
  category: z.enum(["food", "mobility", "home", "shopping", "digital"]),
  paymentMethod: z.string().min(2),
  image: z.string().optional(),
});

export const receiptAnalysisResponseSchema = z.object({
  estimatedKg: z.number(),
  confidence: z.number(),
  normalized: z.object({
    vendor: z.string(),
    category: z.string(),
    spend: z.number(),
    impactBand: z.string(),
  }),
  insights: z.array(z.string()),
  metadata: z.object({
    source: z.string(),
    reason: z.string(),
  }).optional(),
});

export type ReceiptAnalysisRequest = z.infer<typeof receiptAnalysisRequestSchema>;
