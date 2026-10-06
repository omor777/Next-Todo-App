// src/lib/axios.ts
import axios, { AxiosError, type AxiosInstance } from "axios";
import { ApiResponse } from "./api/response";

export type ApiError = {
  message: string;
  code: string;
  details?: Record<string, string[]>;
};

async function unwrap<T>(
  promise: Promise<{ data: ApiResponse<T> }>,
): Promise<T> {
  const { data: body } = await promise;
  if (!body.success) throw body.error as ApiError;
  return body.data;
}

export const api = {
  get: <T>(url: string) => unwrap<T>(apiClient.get<ApiResponse<T>>(url)),
  post: <T>(url: string, body?: unknown) =>
    unwrap<T>(apiClient.post<ApiResponse<T>>(url, body)),
  patch: <T>(url: string, body?: unknown) =>
    unwrap<T>(apiClient.patch<ApiResponse<T>>(url, body)),
  delete: <T>(url: string) => unwrap<T>(apiClient.delete<ApiResponse<T>>(url)),
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // send session cookie
});

// Response interceptor: unwrap { success, data } and normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Network error or no response
    if (!error.response) {
      const networkError: ApiError = {
        message: "Network error. Please check your connection.",
        code: "NETWORK_ERROR",
      };
      return Promise.reject(networkError);
    }

    const body = error.response.data as
      | { success?: false; error?: ApiError }
      | undefined;

    // Our API's standardized error envelope
    if (body?.error) {
      return Promise.reject(body.error);
    }

    // Fallback for unexpected shapes
    const fallback: ApiError = {
      message: error.message || "Something went wrong",
      code: "UNKNOWN_ERROR",
    };
    return Promise.reject(fallback);
  },
);
