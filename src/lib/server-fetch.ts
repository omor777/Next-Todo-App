// src/lib/server-fetch.ts
import type { ApiResponse } from "@/lib/api/response";
import { headers } from "next/headers";

/**
 * Server-side fetch that forwards the incoming request's cookies
 * to internal API routes. Use ONLY in Server Components, Server
 * Actions, and Route Handlers.
 *
 * Returns unwrapped data (throws on failure), mirroring the client
 * `api` helper's contract so call sites look identical.
 */
export async function serverFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  // Derive the base URL from the incoming request headers.
  // Works in dev, preview, and production without hardcoding.
  const h = await headers();
  const host = h.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const cookie = h.get("cookie") ?? "";

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      cookie,
      ...init?.headers,
    },
    // Always bypass Next.js's fetch cache — TanStack Query
    // owns client caching; the server should always see fresh data.
    cache: "no-store",
  });

  const body = (await response.json()) as ApiResponse<T>;

  if (!body.success) {
    // Mirror the client ApiError shape so error handling is uniform
    throw {
      message: body.error.message,
      code: body.error.code,
      details: body.error.details,
    };
  }

  return body.data;
}
