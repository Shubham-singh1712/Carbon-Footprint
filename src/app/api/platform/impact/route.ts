import { jsonResponse } from "@/lib/api/route";
import { impactData } from "@/features/impact/data";
import { impactSchema } from "@/features/impact/schemas";

export async function GET() {
  return jsonResponse(impactSchema, impactData);
}
