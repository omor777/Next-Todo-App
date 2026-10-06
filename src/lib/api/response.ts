// src/lib/api/response.ts
import { isAPIError } from "better-auth/api";
import { NextResponse } from "next/server";
import z, { ZodError } from "zod";
import { toHttpStatus } from "./http-status";

export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiFailure = {
  success: false;
  error: {
    message: string;
    code: string;
    details?: Record<string, string[]> | unknown;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export function success<T>(
  data: T,
  message?: string,
  status: number = 200,
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json(
    { success: true, data, ...(message && { message }) },
    { status },
  );
}

export function created<T>(
  data: T,
  message = "Resource created",
): NextResponse<ApiSuccess<T>> {
  return success(data, message, 201);
}

// src/lib/api/response.ts
export function error(
  message: string,
  status: number = 400,
  code: string = "BAD_REQUEST",
  details?: unknown,
): NextResponse<ApiFailure> {
  const payload: ApiFailure = {
    success: false,
    error: { message, code },
  };

  if (details !== undefined) {
    payload.error.details = details;
  }

  return NextResponse.json(payload, { status });
}

export function validationError(zodError: ZodError): NextResponse<ApiFailure> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: z.treeifyError(zodError),
      },
    },
    { status: 422 },
  );
}

export function unauthorized(
  message = "Unauthorized",
): NextResponse<ApiFailure> {
  return error(message, 401, "UNAUTHORIZED");
}

export function forbidden(message = "Forbidden"): NextResponse<ApiFailure> {
  return error(message, 403, "FORBIDDEN");
}

export function notFound(
  message = "Resource not found",
): NextResponse<ApiFailure> {
  return error(message, 404, "NOT_FOUND");
}

export function conflict(message: string): NextResponse<ApiFailure> {
  return error(message, 409, "CONFLICT");
}

export function internalError(error?: unknown): NextResponse<ApiFailure> {
  if (error) {
    console.error("[INTERNAL_ERROR]", error);
  }
  return NextResponse.json(
    {
      success: false,
      error: {
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      },
    },
    { status: 500 },
  );
}

export function handleApiError(err: unknown): NextResponse {
  if (isAPIError(err)) {
    return error(err.message, toHttpStatus(err.status), "AUTH_ERROR");
  }
  return internalError(err);
}