export type AttendeeRole = 'Student' | 'Instructor';

export type Competence = {
  id: string;
  name: string;
  rowVersion: string;
  instructors?: Attendee[];
};

export type Attendee = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  role: AttendeeRole;
  rowVersion: string;
  competences?: Competence[];
};

export type Course = {
  id: string;
  courseName: string;
  courseDescription: string;
};

export type Location = {
  id: string;
  locationName: string;
  rowVersion: string;
};
