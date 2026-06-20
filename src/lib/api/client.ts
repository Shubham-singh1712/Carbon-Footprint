import { ZodType } from "zod";

export async function typedFetch<T>(
  input: RequestInfo | URL,
  init: RequestInit,
  schema: ZodType<T>,
) {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return schema.parse(await response.json());
}
