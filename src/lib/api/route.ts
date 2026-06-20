import { NextResponse } from "next/server";
import { ZodType } from "zod";

export async function parseJsonRequest<T>(
  request: Request,
  schema: ZodType<T>,
) {
  return schema.parse(await request.json());
}

export function jsonResponse<T>(schema: ZodType<T>, data: T) {
  return NextResponse.json(schema.parse(data));
}
