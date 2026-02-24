import type {
  Attendee,
  Location,
  Course,
  CourseType,
  CourseSession,
  Competence,
} from '@/utils/types/types'; // ändra om din path är annan
import type { FormField } from './DynamicForm';
import type {
  UpdateAttendeeFormValues,
  UpdateLocationFormValues,
  UpdateCourseFormValues,
  CreateCourseFormValues,
  CreateCourseSessionFormValues,
  UpdateCourseSessionFormValues,
  CreateLocationFormValues,
  CreateStudentFormValues,
  EnrollStudentToSessionFormValues,
  AddCompetenceFormValues,
  CreateCompetenceFormValues,
  UpdateCompetenceFormValues,
  CreateInstructorFormValues,
} from '@/utils/types/dto';
import { faker } from '@faker-js/faker';

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

// const buildStudentCreate = (): {
//   fields: Array<FormField<Extract<keyof CreateStudentFormValues, string>>>;
//   initialValues: CreateStudentFormValues;
// } => {
//   const fields: Array<
//     FormField<Extract<keyof CreateStudentFormValues, string>>
//   > = [
//     { name: 'firstName', label: 'Firstname', required: true },
//     { name: 'lastName', label: 'Lastname', required: true },
//     { name: 'email', label: 'Email', required: true },
//     { name: 'phoneNumber', label: 'Phone Number' },
//   ];

//   const initialValues: CreateStudentFormValues = {
//     firstName: '',
//     lastName: '',
//     email: '',
//     phoneNumber: '',
//   };

//   return { fields, initialValues };
// };

const buildStudentCreate = (): {
  fields: Array<FormField<Extract<keyof CreateStudentFormValues, string>>>;
  initialValues: CreateStudentFormValues;
  generateMockValues: () => CreateStudentFormValues;
} => {
  const fields: Array<
    FormField<Extract<keyof CreateStudentFormValues, string>>
  > = [
    { name: 'firstName', label: 'Firstname', required: true },
    { name: 'lastName', label: 'Lastname', required: true },
    { name: 'email', label: 'Email', required: true },
    { name: 'phoneNumber', label: 'Phone Number' },
  ];

  const initialValues: CreateStudentFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  };

  return { fields, initialValues, generateMockValues };
};

const buildInstructorCreate = (): {
  fields: Array<FormField<Extract<keyof CreateInstructorFormValues, string>>>;
  initialValues: CreateInstructorFormValues;

  generateMockValues: () => CreateInstructorFormValues;
} => {
  const fields: Array<
    FormField<Extract<keyof CreateInstructorFormValues, string>>
  > = [
    { name: 'firstName', label: 'Firstname', required: true },
    { name: 'lastName', label: 'Lastname', required: true },
    { name: 'email', label: 'Email', required: true },
    { name: 'phoneNumber', label: 'Phone Number' },
  ];

  const initialValues: CreateInstructorFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  };

  return { fields, initialValues, generateMockValues };
};

const generateMockValues = (): CreateInstructorFormValues => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    phoneNumber: faker.phone.number({ style: 'international' }),
  };
};

const buildCompetenceCreate = (): {
  fields: Array<FormField<Extract<keyof CreateCompetenceFormValues, string>>>;
  initialValues: CreateCompetenceFormValues;
} => {
  const fields: Array<
    FormField<Extract<keyof CreateCompetenceFormValues, string>>
  > = [{ name: 'name', label: 'Competence name', required: true }];

  const initialValues: CreateCompetenceFormValues = {
    name: '',
  };

  return { fields, initialValues };
};

const buildCompetenceEdit = (
  c: Competence,
): {
  fields: Array<FormField<Extract<keyof UpdateCompetenceFormValues, string>>>;
  initialValues: UpdateCompetenceFormValues;
} => {
  const fields: Array<
    FormField<Extract<keyof UpdateCompetenceFormValues, string>>
  > = [
    { name: 'id', kind: 'hidden' },
    { name: 'rowVersion', kind: 'hidden' },
    { name: 'name', label: 'Competence name', required: true },
  ];

  const initialValues: UpdateCompetenceFormValues = {
    id: c.id,
    rowVersion: c.rowVersion,
    name: c.name ?? '',
  };

  return { fields, initialValues };
};

const buildAddCompetenceToInstructor = (
  instructorId: string,
  rowVersion: string,
  competences: Competence[],
): {
  fields: Array<
    FormField<Extract<keyof AddCompetenceFormValues, string>, string>
  >;
  initialValues: AddCompetenceFormValues;
} => {
  const fields: Array<
    FormField<Extract<keyof AddCompetenceFormValues, string>, string>
  > = [
    { name: 'instructorId', kind: 'hidden' },
    { name: 'rowVersion', kind: 'hidden' },

    {
      kind: 'select',
      name: 'competenceName',
      label: 'Competence',
      required: true,
      placeholderOption: 'Select competence...',
      options: competences.map((c) => ({ label: c.name, value: c.name })),
    },
  ];

  const initialValues: AddCompetenceFormValues = {
    instructorId,
    rowVersion,
    competenceName: '',
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

const buildLocationCreate = (): {
  fields: Array<FormField<Extract<keyof CreateLocationFormValues, string>>>;
  initialValues: CreateLocationFormValues;
  generateLocationMockValues: () => CreateLocationFormValues;
} => {
  const fields: Array<
    FormField<Extract<keyof CreateLocationFormValues, string>>
  > = [{ name: 'locationName', label: 'City', required: true }];

  const initialValues: CreateLocationFormValues = {
    locationName: '',
  };

  return { fields, initialValues, generateLocationMockValues };
};

const generateLocationMockValues = (): CreateLocationFormValues => {
  const locationName = faker.location.city();

  return {
    locationName,
  };
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
    { name: 'courseCode', label: 'Course Code', required: true },

    { name: 'courseType', label: 'Course Type', required: true },

    { name: 'courseTypeName', label: 'Course Type Name', readOnly: true },

    { name: 'courseDescription', label: 'Course Description' },
  ];

  const initialValues: UpdateCourseFormValues = {
    id: c.id,
    rowVersion: c.rowVersion,
    courseName: c.courseName,
    courseCode: c.courseCode,
    courseDescription: c.courseDescription,
    courseType: c.courseType as CourseType,
    courseTypeName: c.courseTypeName,
  };

  return { fields, initialValues };
};

const COURSE_TYPE_OPTIONS: Array<{ label: string; value: CourseType }> = [
  { label: 'Basic', value: 'BAS' },
  { label: 'Intermediate', value: 'INT' },
  { label: 'Advanced', value: 'ADV' },
  { label: 'Expert', value: 'EXP' },
];

const buildCourseCreate = (): {
  fields: Array<
    FormField<Extract<keyof CreateCourseFormValues, string>, string>
  >;
  initialValues: CreateCourseFormValues;
} => {
  const fields: Array<
    FormField<Extract<keyof CreateCourseFormValues, string>, string>
  > = [
    { name: 'courseName', label: 'Course Name', required: true },

    {
      kind: 'select',
      name: 'courseType',
      label: 'Course Type',
      required: true,
      placeholderOption: 'Select course type...',
      options: COURSE_TYPE_OPTIONS,
    },

    {
      kind: 'textarea',
      name: 'courseDescription',
      label: 'Course Description',
      rows: 5,
    },
  ];

  const initialValues: CreateCourseFormValues = {
    courseName: '',
    courseType: '',
    courseDescription: '',
  };

  return { fields, initialValues };
};

const buildCourseSessionCreate = (
  courses: Course[],
  locations: Location[],
  instructors: Attendee[],
): {
  fields: Array<
    FormField<Extract<keyof CreateCourseSessionFormValues, string>, string>
  >;
  initialValues: CreateCourseSessionFormValues;
} => {
  const courseOptions = courses.map((c) => ({
    label: `${c.courseName} (${c.courseTypeName}) • ${c.courseCode}`,
    value: c.courseCode,
  }));

  const locationOptions = locations.map((l) => ({
    label: l.locationName,
    value: l.locationName,
  }));

  const instructorOptions = instructors.map((i) => ({
    label: `${i.firstName} ${i.lastName}`,
    value: i.id,
  }));

  const fields: Array<
    FormField<Extract<keyof CreateCourseSessionFormValues, string>, string>
  > = [
    {
      kind: 'select',
      name: 'courseCode',
      label: 'Course',
      required: true,
      placeholderOption: 'Select course...',
      options: courseOptions,
    },
    {
      kind: 'select',
      name: 'locationName',
      label: 'Location',
      required: true,
      placeholderOption: 'Select location...',
      options: locationOptions,
    },
    {
      kind: 'input',
      name: 'startDate',
      label: 'Start date',
      type: 'datetime-local',
      required: true,
    },
    {
      kind: 'input',
      name: 'endDate',
      label: 'End date',
      type: 'datetime-local',
      required: true,
    },
    {
      kind: 'input',
      name: 'capacity',
      label: 'Capacity',
      type: 'number',
      required: true,
    },
    {
      kind: 'checkbox-group',
      name: 'instructorIds',
      label: 'Instructors',
      options: instructorOptions,
    },
  ];

  const initialValues: CreateCourseSessionFormValues = {
    courseCode: '',
    locationName: '',
    startDate: '',
    endDate: '',
    capacity: '0',
    instructorIds: '',
  };

  return { fields, initialValues };
};

const toDateTimeLocal = (iso: string): string => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
};

const buildCourseSessionEdit = (
  session: CourseSession,
  courses: Course[],
  locations: Location[],
  instructors: Attendee[],
): {
  fields: Array<
    FormField<Extract<keyof UpdateCourseSessionFormValues, string>, string>
  >;
  initialValues: UpdateCourseSessionFormValues;
} => {
  const fields = [
    { name: 'id', kind: 'hidden' },
    { name: 'rowVersion', kind: 'hidden' },

    {
      kind: 'select',
      name: 'courseId',
      label: 'Course',
      required: true,
      options: courses.map((c) => ({
        label: `${c.courseName} (${c.courseCode})`,
        value: c.id,
      })),
    },

    {
      kind: 'select',
      name: 'locationId',
      label: 'Location',
      required: true,
      options: locations.map((l) => ({
        label: l.locationName,
        value: l.id,
      })),
    },

    {
      kind: 'input',
      name: 'startDate',
      label: 'Start date',
      type: 'datetime-local',
    },

    {
      kind: 'input',
      name: 'endDate',
      label: 'End date',
      type: 'datetime-local',
    },

    {
      kind: 'input',
      name: 'capacity',
      label: 'Capacity',
      type: 'number',
    },

    {
      kind: 'checkbox-group',
      name: 'instructorIds',
      label: 'Instructors',
      options: instructors.map((i) => ({
        label: `${i.firstName} ${i.lastName}`,
        value: i.id,
      })),
      defaultCheckedValues: session.instructors.map((x) => x.id),
    },
  ] satisfies Array<
    FormField<Extract<keyof UpdateCourseSessionFormValues, string>, string>
  >;

  const initialValues: UpdateCourseSessionFormValues = {
    id: session.id,
    rowVersion: session.rowVersion,

    courseId: session.course.id, // ✅ ID
    locationId: session.location.id, // ✅ ID

    startDate: toDateTimeLocal(session.startDate),
    endDate: toDateTimeLocal(session.endDate),

    capacity: String(session.capacity),

    instructorIds: '',
  };

  return { fields, initialValues };
};

const buildEnrollStudentToSession = (
  studentId: string,
  sessions: CourseSession[],
): {
  fields: Array<
    FormField<Extract<keyof EnrollStudentToSessionFormValues, string>, string>
  >;
  initialValues: EnrollStudentToSessionFormValues;
} => {
  const fields: Array<
    FormField<Extract<keyof EnrollStudentToSessionFormValues, string>, string>
  > = [
    { name: 'studentId', kind: 'hidden' },

    {
      kind: 'select',
      name: 'courseSessionId',
      label: 'Course session',
      required: true,
      placeholderOption: 'Select session...',
      options: sessions.map((s) => ({
        label: `${s.course.courseName} • ${s.courseCode} • ${new Date(s.startDate).toLocaleString('sv-SE')} • ${s.location.locationName}`,
        value: s.id,
      })),
    },

    { name: 'rowVersion', kind: 'hidden' },
  ];

  const initialValues: EnrollStudentToSessionFormValues = {
    studentId,
    courseSessionId: '',
    rowVersion: '',
  };

  return { fields, initialValues };
};

export {
  buildAttendeeEdit,
  buildStudentCreate,
  buildInstructorCreate,
  buildCompetenceCreate,
  buildCompetenceEdit,
  buildAddCompetenceToInstructor,
  buildLocationEdit,
  buildLocationCreate,
  buildCourseEdit,
  buildCourseSessionEdit,
  buildCourseCreate,
  buildCourseSessionCreate,
  buildEnrollStudentToSession,
};
