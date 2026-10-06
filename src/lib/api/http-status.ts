// src/lib/api/http-status.ts

/**
 * HTTP status codes supported by Better Auth's APIError.
 * Used as string keys returned by `err.status`.
 */
export type HttpStatusText =
  | "OK"
  | "CREATED"
  | "ACCEPTED"
  | "NO_CONTENT"
  | "MULTIPLE_CHOICES"
  | "MOVED_PERMANENTLY"
  | "FOUND"
  | "SEE_OTHER"
  | "NOT_MODIFIED"
  | "TEMPORARY_REDIRECT"
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "PAYMENT_REQUIRED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "METHOD_NOT_ALLOWED"
  | "NOT_ACCEPTABLE"
  | "PROXY_AUTHENTICATION_REQUIRED"
  | "REQUEST_TIMEOUT"
  | "CONFLICT"
  | "GONE"
  | "LENGTH_REQUIRED"
  | "PRECONDITION_FAILED"
  | "PAYLOAD_TOO_LARGE"
  | "URI_TOO_LONG"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "RANGE_NOT_SATISFIABLE"
  | "EXPECTATION_FAILED"
  | "I_AM_A_TEAPOT"
  | "MISDIRECTED_REQUEST"
  | "UNPROCESSABLE_ENTITY"
  | "LOCKED"
  | "FAILED_DEPENDENCY"
  | "TOO_MANY_REQUESTS"
  | "INTERNAL_SERVER_ERROR"
  | "NOT_IMPLEMENTED"
  | "BAD_GATEWAY"
  | "SERVICE_UNAVAILABLE"
  | "GATEWAY_TIMEOUT"
  | "HTTP_VERSION_NOT_SUPPORTED"
  | "NETWORK_AUTHENTICATION_REQUIRED";
/**
 * Converts a Better Auth HTTP status (string name OR numeric code)
 * into a validated numeric HTTP status code.
 *
 * - "NOT_FOUND"  → 404
 * - 404          → 404 (passes through, validated)
 * - "SOMETHING"  → 500 (safe fallback)
 */
export function toHttpStatus(status: string | number): number {
  // If it's already a number, validate that it's a legal HTTP status.
  if (typeof status === "number") {
    return isValidHttpStatus(status) ? status : 500
  }

  // Otherwise it's a string name — map it explicitly.
  switch (status) {
    // 2xx
    case "OK": return 200
    case "CREATED": return 201
    case "ACCEPTED": return 202
    case "NO_CONTENT": return 204

    // 3xx
    case "MULTIPLE_CHOICES": return 300
    case "MOVED_PERMANENTLY": return 301
    case "FOUND": return 302
    case "SEE_OTHER": return 303
    case "NOT_MODIFIED": return 304
    case "TEMPORARY_REDIRECT": return 307

    // 4xx
    case "BAD_REQUEST": return 400
    case "UNAUTHORIZED": return 401
    case "PAYMENT_REQUIRED": return 402
    case "FORBIDDEN": return 403
    case "NOT_FOUND": return 404
    case "METHOD_NOT_ALLOWED": return 405
    case "NOT_ACCEPTABLE": return 406
    case "PROXY_AUTHENTICATION_REQUIRED": return 407
    case "REQUEST_TIMEOUT": return 408
    case "CONFLICT": return 409
    case "GONE": return 410
    case "LENGTH_REQUIRED": return 411
    case "PRECONDITION_FAILED": return 412
    case "PAYLOAD_TOO_LARGE": return 413
    case "URI_TOO_LONG": return 414
    case "UNSUPPORTED_MEDIA_TYPE": return 415
    case "RANGE_NOT_SATISFIABLE": return 416
    case "EXPECTATION_FAILED": return 417
    case "I_AM_A_TEAPOT": return 418
    case "MISDIRECTED_REQUEST": return 421
    case "UNPROCESSABLE_ENTITY": return 422
    case "LOCKED": return 423
    case "FAILED_DEPENDENCY": return 424
    case "TOO_MANY_REQUESTS": return 429

    // 5xx
    case "INTERNAL_SERVER_ERROR": return 500
    case "NOT_IMPLEMENTED": return 501
    case "BAD_GATEWAY": return 502
    case "SERVICE_UNAVAILABLE": return 503
    case "GATEWAY_TIMEOUT": return 504
    case "HTTP_VERSION_NOT_SUPPORTED": return 505
    case "NETWORK_AUTHENTICATION_REQUIRED": return 511

    default:
      return 500
  }
}

/**
 * Guards against numbers like 0, 99, 9999, or NaN being sent to NextResponse.
 * HTTP status codes are always in the 100–599 range.
 */
function isValidHttpStatus(status: number): boolean {
  return Number.isInteger(status) && status >= 100 && status <= 599
}