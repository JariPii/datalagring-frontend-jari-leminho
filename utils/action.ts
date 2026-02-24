import {
  mockAttendee,
  mockCourse,
  mockLocation,
  mockSessions,
} from './dummy-data';
import { ApiError, type ProblemDetails } from './types/api';
import {
  AddCompetenceDTO,
  CreateCompetenceDTO,
  EnrollStudentDTO,
  UpdateCourseSessionDTO,
  UpdateEnrollmentStatusDTO,
} from './types/dto';
import {
  Attendee,
  Competence,
  Course,
  CourseSession,
  Enrollment,
  Location,
  PagedResultDTO,
} from './types/types';

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

    const text = await res.text();
    if (!text) return undefined as T;

    return JSON.parse(text) as T;
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

  getStudentsPaged: (
    p: { page: number; pageSize: number; q?: string },
    signal?: AbortSignal,
  ) =>
    apiFetch<PagedResultDTO<Attendee>>(
      `/attendees/students/paged/?page=${p.page}&pageSize=${p.pageSize}${
        p.q?.trim() ? `&q=${encodeURIComponent(p.q.trim())}` : ''
      }`,
      { signal },
    ),

  getAllInstructors: (signal?: AbortSignal) =>
    apiFetch<Attendee[]>('/attendees/instructors', { signal }),

  getInstructorsPaged: (
    p: { page: number; pageSize: number; q?: string },
    signal?: AbortSignal,
  ) =>
    apiFetch<PagedResultDTO<Attendee>>(
      `/attendees/instructors/paged/?page=${p.page}&pageSize=${p.pageSize}${
        p.q?.trim() ? `&q=${encodeURIComponent(p.q.trim())}` : ''
      }`,
      { signal },
    ),

  getById: (id: string) => apiFetch<Attendee>(`/attendees/${id}`),

  search: (q: string, signal?: AbortSignal) =>
    apiFetch<Attendee[]>(`/attendees/search?q=${encodeURIComponent(q)}`, {
      signal,
    }),

  getByEmail: (email: string, signal?: AbortSignal) =>
    apiFetch<Attendee>(
      `/attendees/by-email?email=${encodeURIComponent(email)}`,
      { signal },
    ),

  getInstructorsByCompetence: (name: string, signal?: AbortSignal) =>
    apiFetch<Attendee[]>(
      `/attendees/instructors/competence/${encodeURIComponent(name)}`,
      { signal },
    ),

  addCompetenceToInstructor: (id: string, dto: AddCompetenceDTO) =>
    apiFetch<{ message: string }>(`/attendees/${id}/competences`, {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

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

  remove: (id: string) =>
    apiFetch<void>(`/attendees/${id}`, {
      method: 'DELETE',
    }),
};

export const competenceService = {
  getAll: (signal?: AbortSignal) =>
    apiFetch<Competence[]>('/competences', { signal }),

  getPaged: (
    p: { page: number; pageSize: number; q?: string },
    signal?: AbortSignal,
  ) =>
    apiFetch<PagedResultDTO<Competence>>(
      `/competences/paged?page=${p.page}&pageSize=${p.pageSize}${
        p.q?.trim() ? `&q=${encodeURIComponent(p.q.trim())}` : ''
      }`,
      { signal },
    ),

  create: (dto: CreateCompetenceDTO) =>
    apiFetch<Competence>('/competences', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  update: (id: string, dto: unknown) =>
    apiFetch<Competence>(`/competences/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),

  remove: (id: string) =>
    apiFetch<void>(`/competences/${id}`, {
      method: 'DELETE',
    }),
};

export const courseService = {
  getAll: (signal?: AbortSignal) => apiFetch<Course[]>('/courses', { signal }),

  getById: (id: string, signal?: AbortSignal) =>
    apiFetch<Course>(`/courses/${id}`, { signal }),

  getPaged: (
    p: { page: number; pageSize: number; q?: string },
    signal?: AbortSignal,
  ) =>
    apiFetch<PagedResultDTO<Course>>(
      `/courses/paged?page=${p.page}&pageSize=${p.pageSize}${
        p.q?.trim() ? `&q=${encodeURIComponent(p.q.trim())}` : ''
      }`,
      { signal },
    ),

  create: (data: unknown) =>
    apiFetch<Course>('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: unknown) =>
    apiFetch<Course>(`/courses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    apiFetch<void>(`/courses/${id}`, {
      method: 'DELETE',
    }),
};

export const locationService = {
  getAll: (signal?: AbortSignal) =>
    apiFetch<Location[]>('/locations', { signal }),

  getPaged: (
    p: { page: number; pageSize: number; q?: string },
    signal?: AbortSignal,
  ) =>
    apiFetch<PagedResultDTO<Location>>(
      `/locations/paged/?page=${p.page}&pageSize=${p.pageSize}${
        p.q?.trim() ? `&q=${encodeURIComponent(p.q.trim())}` : ''
      }`,
      { signal },
    ),

  create: (data: unknown) =>
    apiFetch<Location>('/locations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: unknown) =>
    apiFetch<Location>(`/locations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    apiFetch<void>(`/locations/${id}`, {
      method: 'DELETE',
    }),
};

export const courseSessionService = {
  getAll: (signal?: AbortSignal) =>
    apiFetch<CourseSession[]>('/courseSessions', { signal }),

  getById: async (id: string, signal?: AbortSignal): Promise<CourseSession> =>
    apiFetch(`/courseSessions/${id}`, { signal }),

  getPaged: (
    p: { page: number; pageSize: number; q?: string },
    signal?: AbortSignal,
  ) =>
    apiFetch<PagedResultDTO<CourseSession>>(
      `/courseSessions/paged/?page=${p.page}&pageSize=${p.pageSize}${
        p.q?.trim() ? `&q=${encodeURIComponent(p.q.trim())}` : ''
      }`,
      { signal },
    ),

  create: (data: unknown) =>
    apiFetch('/courseSessions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateCourseSessionDTO) =>
    apiFetch<CourseSession>(`/courseSessions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    apiFetch<void>(`/courseSessions/${id}`, {
      method: 'DELETE',
    }),

  enrollStudent: (courseSessionId: string, dto: EnrollStudentDTO) =>
    apiFetch<void>(`/courseSessions/${courseSessionId}/enrollments`, {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  getEnrollments: (courseSessionId: string, signal?: AbortSignal) =>
    apiFetch<Enrollment[]>(`/courseSessions/${courseSessionId}/enrollments`, {
      signal,
    }),

  setEnrollmentStatus: (
    courseSessionId: string,
    studentId: string,
    dto: UpdateEnrollmentStatusDTO,
  ) =>
    apiFetch<void>(
      `/courseSessions/${courseSessionId}/enrollment/${studentId}/status`,
      {
        method: 'PUT',
        body: JSON.stringify(dto),
      },
    ),
};
