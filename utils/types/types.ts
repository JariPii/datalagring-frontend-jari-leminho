export type AttendeeRole = 'Student' | 'Instructor';
export type CourseType = 'BAS' | 'INT' | 'ADV' | 'EXP';
export type CourseTypeName = 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';

export type Competence = {
  id: string;
  name: string;
  rowVersion: string;
  instructors?: Attendee[];
};

export type Attendee = {
  $type: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  role: AttendeeRole;
  rowVersion: string;
  competences?: Competence[];
  createdAt: string;
};

export type Course = {
  id: string;
  courseCode: string;
  courseType: CourseType;
  courseTypeName: CourseTypeName;
  courseName: string;
  courseDescription: string;
  rowVersion: string;
};

export type Location = {
  id: string;
  locationName: string;
  rowVersion: string;
};

export type Instructor = Pick<Attendee, 'id' | 'firstName' | 'lastName'>;

export type CourseSession = {
  id: string;
  course: Course;
  courseCode: string;
  location: Location;
  startDate: string;
  endDate: string;
  capacity: number;
  instructors: Attendee[];
  approvedEnrollmentsCount: number;
  rowVersion: string;
};

export type UpdateAttendeeDTO = {
  rowVersion: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
};
