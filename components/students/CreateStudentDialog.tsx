'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import CDialog from '@/components/dialog/CDialog';
import CButton from '@/components/Button/CButton';

import { buildStudentCreate } from '@/components/forms/fieldBuilders';
import { attendeeService } from '@/utils/action';

import type {
  CreateAttendeeDTO,
  CreateStudentFormValues,
} from '@/utils/types/dto';

const CreateStudentDialog = () => {
  const queryClient = useQueryClient();
  const { fields, initialValues, generateMockValues } = buildStudentCreate();

  const defaultValues =
    process.env.NODE_ENV === 'development'
      ? generateMockValues()
      : initialValues;

  const createMutation = useMutation({
    mutationFn: (dto: CreateAttendeeDTO) => attendeeService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendees', 'students'] });
    },
  });

  return (
    <CDialog<CreateStudentFormValues>
      title='New student'
      description='Fill in the student details and click save.'
      trigger={<CButton>New Student</CButton>}
      fields={fields}
      initialValues={defaultValues}
      onSave={async (values) => {
        const dto: CreateAttendeeDTO = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber.trim() ? values.phoneNumber : null,

          role: 'Student',
        };

        await createMutation.mutateAsync(dto);
      }}
    />
  );
};

export default CreateStudentDialog;
