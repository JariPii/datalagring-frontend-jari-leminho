import { AttendeeRole, CourseType, EnrollmentStatus } from './types';

export type UpdateAttendeeDTO = {
  rowVersion: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
};

export type UpdateAttendeeFormValues = {
  id: string;
  rowVersion: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export type CreateAttendeeDTO = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  role: AttendeeRole;
};

export type CreateStudentFormValues = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export type CreateInstructorFormValues = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export type CreateCompetenceDTO = {
  name: string;
};

export type CreateCompetenceFormValues = {
  name: string;
};

export type UpdateCompetenceDTO = {
  rowVersion: string;
  name?: string | null;
};

export type UpdateCompetenceFormValues = {
  id: string;
  rowVersion: string;
  name: string;
};

export type AddCompetenceDTO = {
  competenceName: string;
  rowVersion: string;
};

export type AddCompetenceFormValues = {
  instructorId: string;
  rowVersion: string;
  competenceName: string;
};

export type UpdateLocationDTO = {
  rowVersion: string;
  locationName?: string | null;
};

export type UpdateLocationFormValues = {
  id: string;
  rowVersion: string;
  locationName: string;
};

export type CreateLocationDTO = {
  locationName: string;
};

export type CreateLocationFormValues = {
  locationName: string;
};

export type UpdateCourseDTO = {
  rowVersion: string;
  courseCode?: string | null;
  courseName?: string | null;
  courseDescription?: string | null;
  courseType?: CourseType | null;
};

export type UpdateCourseFormValues = {
  id: string;
  rowVersion: string;
  courseCode: string;
  courseName: string;
  courseDescription: string;
  courseType: CourseType;
  courseTypeName: string;
};

export type CreateCourseDTO = {
  courseName: string;
  courseDescription: string;
  courseType: CourseType;
};

export type CreateCourseFormValues = {
  courseName: string;
  courseDescription: string;
  courseType: CourseType | '';
};

export type CreateCourseSessionDTO = {
  courseCode: string;
  locationName: string;
  startDate: string;
  endDate: string;
  capacity: number;
  instructorIds: string[];
};

export type CreateCourseSessionFormValues = {
  courseCode: string;
  locationName: string;
  startDate: string;
  endDate: string;
  capacity: string;
  instructorIds: string;
};

export type UpdateCourseSessionDTO = {
  rowVersion: string;

  courseId?: string | null;
  locationId?: string | null;

  instructorIds?: string[] | null;

  startDate?: string | null;
  endDate?: string | null;

  capacity?: number | null;
};

export type UpdateCourseSessionFormValues = {
  id: string;
  rowVersion: string;

  courseId: string;
  locationId: string;

  startDate: string;
  endDate: string;

  capacity: string;

  instructorIds: string;
};

export type EnrollStudentDTO = {
  studentId: string;
  rowVersion: string;
};

export type UpdateEnrollmentStatusDTO = {
  newStatus: EnrollmentStatus;
  rowVersion: string;
};

export type EnrollStudentToSessionFormValues = {
  studentId: string;
  courseSessionId: string;
  rowVersion: string;
};

export type UpdateEnrollmentStatusFormValues = {
  courseSessionId: string;
  studentId: string;
  rowVersion: string;
  newStatus: EnrollmentStatus | '';
};
