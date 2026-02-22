import {
  mockAttendee,
  mockCourse,
  mockLocation,
  mockSessions,
} from './dummy-data';
import { ApiError, type ProblemDetails } from './types/api';
import { Attendee, Course, CourseSession, Location } from './types/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

function mockResponse<T>(endpoint: string): T {
  if (endpoint.includes('/attendees/students')) {
    return mockAttendee.filter((a) => a.role === 'Student') as T;
  }

  if (endpoint.includes('/attendees/instructors')) {
    return mockAttendee.filter((a) => a.role === 'Instructor') as T;
  }

  if (endpoint.includes('/attendees')) {
    return mockAttendee as T;
  }

  if (endpoint.includes('/courses')) {
    return mockCourse as T;
  }

  if (endpoint.includes('/locations')) {
    return mockLocation as T;
  }

  if (endpoint.includes('/courseSessions')) {
    return mockSessions as T;
  }

  throw new Error(`No mock-data available for endpoint: ${endpoint}`);
}

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
        ...options?.headers,
      },
      signal: options?.signal,
    });

    if (!res.ok) {
      const body = (await res
        .json()
        .catch(() => null)) as ProblemDetails | null;
      throw new ApiError(body, res.status);
    }

    if (res.status === 204) return undefined as T;

    return (await res.json()) as T;
  } catch (err) {
    const isAbort = err instanceof DOMException && err.name === 'AbortError';
    if (isAbort) throw err;

    const isNetworkError = err instanceof TypeError;

    if (USE_MOCK_DATA || isNetworkError) {
      console.warn(`API not available (${endpoint}). Using MOCK-DATA.`);
      return mockResponse<T>(endpoint);
    }

    throw err;
  }
}

// ---------------- Services ----------------

export const attendeeService = {
  getAll: (signal?: AbortSignal) =>
    apiFetch<Attendee[]>('/attendees', { signal }),

  getAllStudents: (signal?: AbortSignal) =>
    apiFetch<Attendee[]>('/attendees/students', { signal }),

  getAllInstructors: (signal?: AbortSignal) =>
    apiFetch<Attendee[]>('/attendees/instructors', { signal }),

  getById: (id: string) => apiFetch<Attendee>(`/attendees/${id}`),

  search: (searchTerm: string, signal?: AbortSignal) =>
    apiFetch<Attendee[]>(
      `/attendees/search?searchTerm=${encodeURIComponent(searchTerm)}`,
      { signal },
    ),

  create: (data: unknown) =>
    apiFetch<Attendee>('/attendees', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: unknown) =>
    apiFetch<Attendee>(`/attendees/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export const courseService = {
  getAll: (signal?: AbortSignal) => apiFetch<Course[]>('/courses', { signal }),

  update: (id: string, data: unknown) =>
    apiFetch<Course>(`/courses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export const locationService = {
  getAll: (signal?: AbortSignal) =>
    apiFetch<Location[]>('/locations', { signal }),

  update: (id: string, data: unknown) =>
    apiFetch<Location>(`/locations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export const courseSessionsService = {
  getAll: (signal?: AbortSignal) =>
    apiFetch<CourseSession[]>('/courseSessions', { signal }),
};
