export type AttendeeRole = 'Student' | 'Instructor';

export type Attendee = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: AttendeeRole;
};
