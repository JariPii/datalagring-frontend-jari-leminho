import { error } from 'console';
import {
  mockAttendee,
  mockCourse,
  mockLocation,
  mockSessions,
} from './dummy-data';
import { ApiError } from './types/api';
import { Attendee, Course, CourseSession, Location } from './types/types';

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
    const isAbortError =
      error instanceof DOMException && error.name === 'AbortError';

    if (isAbortError) {
      throw error;
    }

    const isNetworkError = error instanceof TypeError;

    // if (USE_MOCK_DATA) {
    //   console.warn(
    //     `API is not available (${endpoint}). Using MOCK-DATA instead.`,
    //   );

    //   if (endpoint.includes('/attendees/students')) {
    //     return mockAttendee.filter((a) => a.role === 'Student') as T;
    //   }

    //   if (endpoint.includes('/attendees/instructors')) {
    //     return mockAttendee.filter((a) => a.role === 'Instructor') as T;
    //   }

    //   if (endpoint.includes('/attendees')) {
    //     return mockAttendee as T;
    //   }

    //   if (endpoint.includes('/courses')) {
    //     return mockCourse as T;
    //   }

    //   if (endpoint.includes('/locations')) {
    //     return mockLocation as T;
    //   }

    //   if (endpoint.includes('/courseSessions')) {
    //     return mockSessions as T;
    //   }

    //   throw new Error(`No mock-data available on ${endpoint}`);
    // }

    if (isNetworkError || USE_MOCK_DATA) {
      console.warn(
        `API is not available (${endpoint}). Using MOCK-DATA instead.`,
      );

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

      throw new Error(`No mock-data available on ${endpoint}`);
    }

    throw error;
  }
}

export const attendeeService = {
  getAll: (ct?: AbortSignal) =>
    fetcher<Attendee[]>('/attendees', { signal: ct }),

  getAllStudents: (ct?: AbortSignal) =>
    fetcher<Attendee[]>('/attendees/students', { signal: ct }),

  getAllInstructors: (ct?: AbortSignal) =>
    fetcher<Attendee[]>('/attendees/instructors', { signal: ct }),

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

export const locationService = {
  getAll: (ct?: AbortSignal) =>
    fetcher<Location[]>('/locations', { signal: ct }),
};

export const courseSessionsService = {
  getAll: (ct?: AbortSignal) =>
    fetcher<CourseSession[]>('/courseSessions', { signal: ct }),
};
