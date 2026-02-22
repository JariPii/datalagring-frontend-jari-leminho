import { CourseType } from './types';

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

export type UpdateLocationDTO = {
  rowVersion: string;
  locationName?: string | null;
};

export type UpdateLocationFormValues = {
  id: string;
  rowVersion: string;
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
  startDate: string; // ISO string går bra till DateTime i .NET
  endDate: string;
  capacity: number;
  instructorIds: string[]; // GUIDs som strings
};

// FormData ger strings -> vi håller allt som string i form
export type CreateCourseSessionFormValues = {
  courseCode: string;
  locationName: string;
  startDate: string; // från datetime-local
  endDate: string;
  capacity: string; // input number ger string
  instructorIds: string; // comma-separated GUIDs: "id1,id2,id3"
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

  instructorIds: string; // comma-separated
};
