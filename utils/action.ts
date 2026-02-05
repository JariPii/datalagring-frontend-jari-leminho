import { Attendee } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `API Error: ${response.status}`);
  }

  return await response.json();
}

export const attendeeService = {
  getAll: (ct?: AbortSignal) =>
    fetcher<Attendee[]>('/attendees', { signal: ct }),
};
