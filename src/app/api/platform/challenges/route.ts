import { jsonResponse } from "@/lib/api/route";
import { challengesData } from "@/features/challenges/data";
import { challengesSchema } from "@/features/challenges/schemas";

export async function GET() {
  return jsonResponse(challengesSchema, challengesData);
}
