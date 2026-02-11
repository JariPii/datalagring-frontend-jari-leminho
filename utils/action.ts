import { mockAttendee, mockCourse } from './dummy-data';
import { ApiError } from './types/api';
import { Attendee, Course } from './types/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorBody: ApiError = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    const isNetworkError = error instanceof TypeError;

    if (isNetworkError || USE_MOCK_DATA) {
      console.warn(
        `API is not available (${endpoint}). Using MOCK-DATA instead.`,
      );

      if (endpoint.includes('/attendees')) {
        return mockAttendee as T;
      }

      if (endpoint.includes('/courses')) {
        return mockCourse as T;
      }

      throw new Error(`No mock-data available on ${endpoint}`);
    }

    throw error;
  }
}

export const attendeeService = {
  getAll: (ct?: AbortSignal) =>
    fetcher<Attendee[]>('/attendees', { signal: ct }),

  getById: (id: string) => fetcher<Attendee>(`/attendees/${id}`),

  search: (searchTerm: string, ct?: AbortSignal) =>
    fetcher<Attendee[]>(`/attendees/search?searchTerm=${searchTerm}`, {
      signal: ct,
    }),

  create: (data: unknown) =>
    fetcher<Attendee>('/attendees', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const courseService = {
  getAll: (ct?: AbortSignal) => fetcher<Course[]>('/courses', { signal: ct }),
};
