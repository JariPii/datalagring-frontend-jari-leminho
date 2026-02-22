import type { Attendee, Location, Course } from '@/utils/types/types'; // ändra om din path är annan
import type { FormField } from './DynamicForm';
import type {
  UpdateAttendeeFormValues,
  UpdateLocationFormValues,
  UpdateCourseFormValues,
} from '@/utils/types/dto';

const buildAttendeeEdit = (
  a: Attendee,
): {
  fields: Array<FormField<Extract<keyof UpdateAttendeeFormValues, string>>>;
  initialValues: UpdateAttendeeFormValues;
} => {
  const fields: Array<
    FormField<Extract<keyof UpdateAttendeeFormValues, string>>
  > = [
    { name: 'id', kind: 'hidden' },
    { name: 'rowVersion', kind: 'hidden' },

    { name: 'firstName', label: 'Firstname', required: true },
    { name: 'lastName', label: 'Lastname', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phoneNumber', label: 'Phone Number', type: 'tel' },
  ];

  const initialValues: UpdateAttendeeFormValues = {
    id: a.id,
    rowVersion: a.rowVersion,
    firstName: a.firstName,
    lastName: a.lastName,
    email: a.email ?? '',
    phoneNumber: a.phoneNumber ?? '',
  };

  return { fields, initialValues };
};

const buildLocationEdit = (
  l: Location,
): {
  fields: Array<FormField<Extract<keyof UpdateLocationFormValues, string>>>;
  initialValues: UpdateLocationFormValues;
} => {
  const fields: Array<
    FormField<Extract<keyof UpdateLocationFormValues, string>>
  > = [
    { name: 'id', kind: 'hidden' },
    { name: 'rowVersion', kind: 'hidden' },
    { name: 'locationName', label: 'City', required: true },
  ];

  const initialValues: UpdateLocationFormValues = {
    id: l.id,
    rowVersion: l.rowVersion,
    locationName: l.locationName,
  };

  return { fields, initialValues };
};

const buildCourseEdit = (
  c: Course,
): {
  fields: Array<FormField<Extract<keyof UpdateCourseFormValues, string>>>;
  initialValues: UpdateCourseFormValues;
} => {
  const fields: Array<
    FormField<Extract<keyof UpdateCourseFormValues, string>>
  > = [
    { name: 'id', kind: 'hidden' },
    { name: 'rowVersion', kind: 'hidden' },

    { name: 'courseName', label: 'Course', required: true },
    { name: 'courseType', label: 'Course Type', required: true },
    { name: 'courseTypeName', label: 'Course Type Name', required: true },
    { name: 'courseCode', label: 'Course Code', required: true },
    { name: 'courseDescription', label: 'Course Description' },
  ];

  const initialValues: UpdateCourseFormValues = {
    id: c.id,
    rowVersion: c.rowVersion,
    courseName: c.courseName ?? '',
    courseType: String(c.courseType ?? ''),
    courseTypeName: String(c.courseTypeName ?? ''),
    courseCode: c.courseCode ?? '',
    courseDescription: c.courseDescription ?? '',
  };

  return { fields, initialValues };
};

export { buildAttendeeEdit, buildLocationEdit, buildCourseEdit };
