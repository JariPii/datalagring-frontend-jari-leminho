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
  courseType?: string | null;
  courseTypeName?: string | null;
};

export type UpdateCourseFormValues = {
  id: string;
  rowVersion: string;
  courseCode: string;
  courseName: string;
  courseDescription: string;
  courseType: string;
  courseTypeName: string;
};
