import { ApiError, type ProblemDetails } from './types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function clientFetcher<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ProblemDetails | null;
    throw new ApiError(body, res.status);
  }

  if (res.status === 204) return undefined as T;

  return res.json();
}
