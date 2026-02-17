export type AttendeeRole = 'Student' | 'Instructor';
export type CourseType = 'GRD' | 'FDJ';
export type CourseTypeName = 'Grundkurs' | 'Försdjupningskurs';

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

// export type CourseSession = {
//   id: string;
//   course: string;
//   courseCode: string;
//   location: string;
//   startDate: string;
//   endDate: string;
//   capacity: number;
//   instructors: string[];
//   approvedEnrollmentsCount: number;
//   rowVersion: string;
// };

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
