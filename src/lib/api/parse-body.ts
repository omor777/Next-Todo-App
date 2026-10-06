import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { error, validationError } from "./response";

export async function parseBody<T>(
  request: NextRequest,
  schema: z.ZodType<T>,
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return {
      data: null,
      error: error("Invalid JSON body", 400, "INVALID_JSON"),
    };
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return { data: null, error: validationError(parsed.error) };
  }
  return { data: parsed.data, error: null };
}
