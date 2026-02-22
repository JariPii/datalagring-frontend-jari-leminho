'use client';

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import CDialog from '@/components/dialog/CDialog';
import { buildCourseCreate } from '@/components/forms/fieldBuilders';
import { courseService } from '@/utils/action';

import type {
  CreateCourseDTO,
  CreateCourseFormValues,
} from '@/utils/types/dto';

type Props = {
  trigger: React.ReactNode;
};

const CreateCourseDialog = ({ trigger }: Props) => {
  const queryClient = useQueryClient();
  const { fields, initialValues } = buildCourseCreate();

  const createMutation = useMutation({
    mutationFn: (dto: CreateCourseDTO) => courseService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  return (
    <CDialog<CreateCourseFormValues>
      title='New course'
      description='Fill in the course details and click save.'
      trigger={trigger}
      fields={fields}
      initialValues={initialValues}
      onSave={async (values) => {
        if (!values.courseType) throw new Error('Select a course type');

        const dto: CreateCourseDTO = {
          courseName: values.courseName.trim(),
          courseDescription: values.courseDescription.trim(),
          courseType: values.courseType,
        };

        await createMutation.mutateAsync(dto);
      }}
    />
  );
};

export default CreateCourseDialog;
